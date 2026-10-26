#!/usr/bin/env node
/**
 * Build del sitio ClaveContable → genera el sitio publicable completo en dist/.
 *
 *   npm run build      genera dist/ (lo corre solo el hook pre-commit)
 *   npm run dev        genera dist/, lo regenera al guardar y lo sirve en http://localhost:8080
 *
 * Qué hace:
 *  1. Copia assets/, robots.txt y site.webmanifest a dist/.
 *  2. Arma dist/index.html desde components/layout.html, reemplazando cada
 *     <!-- @include components/x.html --> por ese componente.
 *  3. Une los CSS del bloque <!-- @bundle destino.css --> … <!-- @endbundle --> en un archivo.
 *  4. Escribe los datos de contacto de assets/js/config.js en el HTML (marcas data-contact,
 *     data-whatsapp, data-social, data-copy-contact) y en los JSON-LD. Así los ven también
 *     los robots que no ejecutan JavaScript (ChatGPT, Claude, Perplexity…).
 *  5. Versiona los CSS/JS locales con ?v=<hash> (también los import entre módulos JS).
 *     Genera el JSON-LD FAQPage a partir de las preguntas <details data-faq>.
 *  6. Genera sitemap.xml (con lastmod desde git) y llms.txt.
 *  7. Verifica que todo archivo local referenciado exista en dist/.
 *
 * Sin dependencias: solo Node 20+.
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST_FINAL = path.join(RAIZ, "dist");
// Carpeta donde se arma el build en curso. Se arma en una carpeta temporal y al final se cambia
// por dist/ de una sola vez: así dos builds a la vez (npm run dev + el hook del commit) no se pisan.
let DIST = DIST_FINAL;
const SITIO = "https://www.clavecontable.cl";

const AVISO =
  "<!-- ARCHIVO GENERADO por scripts/build.js: no editar a mano.\n" +
  "     Edita components/layout.html y components/*.html. -->\n";

// Lo que no se copia a dist/ porque va unido en home.bundle.css
const NO_COPIAR = ["assets/css/sections", "assets/css/custom.css"];
// Archivos de la raíz que forman parte del sitio
const ARCHIVOS_RAIZ = ["robots.txt", "site.webmanifest"];

const RE = {
  include: /^([ \t]*)<!-- @include (\S+) -->[ \t]*$/gm,
  bundle: /^([ \t]*)<!-- @bundle (\S+) -->\n([\s\S]*?)^[ \t]*<!-- @endbundle -->\n/gm,
  hoja: /<link rel="stylesheet" href="([^"]+)">/g,
  urlCss: /url\((['"]?)(?!data:|https?:|\/\/|#|\/)([^'")]+)\1\)/g,
  asset: /((?:href|src)=")(?!https?:|\/\/)([^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")/g,
  importJs: /((?:from|import)\s+")(\.{1,2}\/[^"?]+\.js)(?:\?v=[0-9a-f]+)?(")/g,
  jsonLd: /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
  refLocal: /(?:href|src)="(?!https?:|\/\/|mailto:|tel:|#|data:|javascript:)([^"#?]+)[^"]*"/g,
};

const rel = (p) => path.relative(RAIZ, p).split(path.sep).join("/");
const hash = (archivo) => createHash("md5").update(fs.readFileSync(archivo)).digest("hex").slice(0, 10);
const escapar = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function fallar(mensaje) {
  throw new Error(`❌ build: ${mensaje}`);
}

// ---------------------------------------------------------------- copia de archivos
function copiar(origen, destino) {
  if (NO_COPIAR.includes(rel(origen))) return;
  if (fs.statSync(origen).isDirectory()) {
    fs.mkdirSync(destino, { recursive: true });
    for (const nombre of fs.readdirSync(origen)) copiar(path.join(origen, nombre), path.join(destino, nombre));
  } else {
    fs.copyFileSync(origen, destino);
  }
}

function listar(carpeta, extension) {
  if (!fs.existsSync(carpeta)) return [];
  return fs.readdirSync(carpeta, { withFileTypes: true }).flatMap((e) => {
    const ruta = path.join(carpeta, e.name);
    if (e.isDirectory()) return listar(ruta, extension);
    return ruta.endsWith(extension) ? [ruta] : [];
  });
}

// ---------------------------------------------------------------- datos de contacto
async function cargarConfig() {
  // Se importa con un parámetro distinto en cada build para leer siempre la versión actual
  const url = pathToFileURL(path.join(RAIZ, "assets/js/config.js")).href + `?t=${Date.now()}`;
  return import(url);
}

// {{clave}} → valor de config.js (marcadores() en config.js define las claves disponibles)
function reemplazarMarcadores(texto, cfg, origen) {
  const valores = cfg.marcadores();
  return texto.replace(/\{\{(\w+)\}\}/g, (m, clave) => {
    if (!(clave in valores)) fallar(`${origen} usa {{${clave}}}, que no existe en marcadores() de config.js`);
    return escapar(valores[clave]);
  });
}

function rellenarContacto(html, cfg) {
  // <tag … data-contact="tipo" …>…</tag>  → texto (y href si es <a>)
  html = html.replace(
    /<([a-z0-9]+)(\s[^>]*?)?\sdata-contact="([a-z]+)"([^>]*)>[\s\S]*?<\/\1>/g,
    (todo, tag, antes = "", tipo, despues) => {
      const dato = cfg.datoContacto(tipo);
      if (!dato) fallar(`data-contact="${tipo}" no existe en config.js`);
      let attrs = `${antes} data-contact="${tipo}"${despues}`.replace(/\shref="[^"]*"/, "");
      if (tag === "a" && dato.href) attrs += ` href="${escapar(dato.href)}"`;
      return `<${tag}${attrs}>${escapar(dato.texto)}</${tag}>`;
    },
  );

  // <a … data-whatsapp="mensaje" / data-social="red" …>  → href, target y rel
  html = html.replace(/<a\b([^>]*?)\sdata-(whatsapp|social)="([^"]*)"([^>]*)>/g, (todo, antes, tipo, valor, despues) => {
    const url = tipo === "whatsapp" ? cfg.whatsappUrl(valor) : cfg.urlSocial(valor);
    if (!url) fallar(`data-social="${valor}" no existe en config.js`);
    const limpio = `${antes} data-${tipo}="${valor}"${despues}`.replace(/\s(href|target|rel)="[^"]*"/g, "");
    return `<a${limpio} href="${escapar(url)}" target="_blank" rel="noopener noreferrer">`;
  });

  // <button data-copy-contact="phone|email">  → data-copy con el valor
  html = html.replace(/\sdata-copy-contact="(email|phone)"(\s+data-copy="[^"]*")?/g, (todo, tipo) => {
    const valor = tipo === "email" ? cfg.CONFIG.contact.email : cfg.CONFIG.contact.phone;
    return ` data-copy-contact="${tipo}" data-copy="${escapar(valor)}"`;
  });

  // JSON-LD: teléfono, correo, horario y redes
  html = html.replace(RE.jsonLd, (todo, abre, cuerpo, cierra) => {
    let datos;
    try {
      datos = JSON.parse(cuerpo);
    } catch (e) {
      fallar(`JSON-LD inválido: ${e.message}`);
    }
    const sangria = cuerpo.match(/\n([ \t]*)\S/)?.[1] ?? "";
    const json = JSON.stringify(cfg.completarJsonLd(datos), null, 4)
      .split("\n")
      .map((l) => sangria + l)
      .join("\n");
    const cierreSangria = sangria.replace(/ {4}$/, "");
    return `${abre}\n${json}\n${cierreSangria}${cierra}`;
  });

  return html;
}

// ---------------------------------------------------------------- FAQPage (JSON-LD)
// Toma cada <details data-faq><summary>Pregunta</summary><div class="faq-answer">…</div></details>
// y agrega antes de </head> el JSON-LD FAQPage para Google. Así las preguntas se escriben una sola vez.
function textoPlano(html) {
  return html
    .replace(/<li[^>]*>/g, " • ")
    .replace(/<\/(p|li|ul)>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function agregarFaqJsonLd(html, origen) {
  const fuente = html.replace(/<!--[\s\S]*?-->/g, ""); // las marcas dentro de comentarios no cuentan
  const preguntas = [
    ...fuente.matchAll(/<details\b[^>]*\bdata-faq\b[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>\s*<\/details>/g),
  ];
  const total = (fuente.match(/<details\b[^>]*\bdata-faq\b/g) || []).length;
  if (preguntas.length !== total) fallar(`${origen}: ${total - preguntas.length} pregunta(s) data-faq con un formato que el build no reconoce`);
  if (!preguntas.length) return html;

  const datos = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map(([, pregunta, respuesta]) => ({
      "@type": "Question",
      name: textoPlano(pregunta),
      acceptedAnswer: { "@type": "Answer", text: textoPlano(respuesta) },
    })),
  };
  const json = JSON.stringify(datos, null, 4).replace(/</g, "\\u003c");
  return html.replace("</head>", `<script type="application/ld+json">\n${json}\n</script>\n</head>`);
}

// ---------------------------------------------------------------- versionado ?v=
function versionarHtml(html, carpetaDist) {
  return html.replace(RE.asset, (todo, antes, ruta, despues) => {
    const archivo = path.resolve(carpetaDist, ruta);
    if (!fs.existsSync(archivo)) fallar(`no existe ${ruta} (referenciado desde ${rel(carpetaDist) || "raíz"})`);
    return `${antes}${ruta}?v=${hash(archivo)}${despues}`;
  });
}

function versionarImports() {
  // Se repite porque la versión de un módulo depende de las versiones de lo que importa
  const modulos = listar(path.join(DIST, "assets/js"), ".js");
  for (let vuelta = 0; vuelta < 5; vuelta++) {
    let cambios = false;
    for (const archivo of modulos) {
      const js = fs.readFileSync(archivo, "utf8");
      const nuevo = js.replace(RE.importJs, (todo, antes, ruta, despues) => {
        const destino = path.resolve(path.dirname(archivo), ruta);
        if (!fs.existsSync(destino)) fallar(`${rel(archivo)} importa ${ruta}, que no existe`);
        return `${antes}${ruta}?v=${hash(destino)}${despues}`;
      });
      if (nuevo !== js) {
        fs.writeFileSync(archivo, nuevo);
        cambios = true;
      }
    }
    if (!cambios) return;
  }
}

// ---------------------------------------------------------------- home
function armarHome() {
  let html = fs.readFileSync(path.join(RAIZ, "components/layout.html"), "utf8");

  html = html.replace(RE.include, (todo, sangria, ruta) => {
    const archivo = path.join(RAIZ, ruta);
    if (!fs.existsSync(archivo)) fallar(`no existe el componente ${ruta}`);
    return fs
      .readFileSync(archivo, "utf8")
      .replace(/\n+$/, "")
      .split("\n")
      .map((linea) => (linea.trim() ? sangria + linea : ""))
      .join("\n");
  });
  if (html.includes("@include")) fallar("quedó una marca @include sin resolver");

  html = html.replace(RE.bundle, (todo, sangria, destinoRel, bloque) => {
    const destino = path.join(DIST, destinoRel);
    const partes = [...bloque.matchAll(RE.hoja)].map(([, href]) => {
      const origen = path.join(RAIZ, href);
      if (!fs.existsSync(origen)) fallar(`no existe ${href} (bloque @bundle)`);
      // Las rutas url() se recalculan desde la carpeta del archivo combinado
      const css = fs.readFileSync(origen, "utf8").replace(RE.urlCss, (m, comilla, ruta) => {
        const absoluta = path.resolve(path.dirname(origen), ruta);
        const nueva = path.relative(path.dirname(path.join(RAIZ, destinoRel)), absoluta).split(path.sep).join("/");
        return `url(${comilla}${nueva}${comilla})`;
      });
      return `/* ---- ${href} ---- */\n${css.trim()}\n`;
    });
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, "/* ARCHIVO GENERADO por scripts/build.js (une los CSS del home). */\n\n" + partes.join("\n"));
    return `${sangria}<link rel="stylesheet" href="${destinoRel}">\n`;
  });

  return html.replace("<!DOCTYPE html>\n", "<!DOCTYPE html>\n" + AVISO);
}

// ---------------------------------------------------------------- sitemap y llms.txt
function fechaGit(archivos) {
  // Si algún archivo tiene cambios sin commitear, la página cambia hoy
  const hoy = new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD en hora local
  try {
    const pendientes = execFileSync("git", ["status", "--porcelain", "--", ...archivos], { cwd: RAIZ, encoding: "utf8" });
    if (pendientes.trim()) return hoy;
    const fecha = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...archivos], { cwd: RAIZ, encoding: "utf8" }).trim();
    return fecha || hoy;
  } catch {
    return hoy;
  }
}

function generarSitemap(paginas) {
  const urls = [
    { loc: `${SITIO}/`, fuentes: ["components"], freq: "weekly", prioridad: "1.0" },
    ...paginas
      .filter((p) => !/name="robots" content="noindex/.test(fs.readFileSync(p, "utf8")))
      .map((p) => ({ loc: `${SITIO}/${rel(p)}`, fuentes: [rel(p)], freq: "monthly", prioridad: "0.8" })),
  ];
  const cuerpo = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${fechaGit(u.fuentes)}</lastmod>\n` +
        `    <changefreq>${u.freq}</changefreq>\n    <priority>${u.prioridad}</priority>\n  </url>`,
    )
    .join("\n");
  fs.writeFileSync(
    path.join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${cuerpo}\n</urlset>\n`,
  );
}

function generarLlms(cfg) {
  const plantilla = path.join(RAIZ, "llms.txt");
  if (!fs.existsSync(plantilla)) return;
  const texto = fs.readFileSync(plantilla, "utf8").replace(/\{\{(\w+)\}\}/g, (m, clave) => {
    const valores = cfg.marcadores();
    if (!(clave in valores)) fallar(`llms.txt usa {{${clave}}}, que no existe en marcadores() de config.js`);
    return valores[clave];
  });
  fs.writeFileSync(path.join(DIST, "llms.txt"), texto);
}

// ---------------------------------------------------------------- verificaciones
function verificar(htmls) {
  const rotos = [];
  for (const archivo of htmls) {
    const html = fs.readFileSync(archivo, "utf8");
    for (const [, ruta] of html.matchAll(RE.refLocal)) {
      let destino = path.resolve(path.dirname(archivo), decodeURI(ruta));
      if (ruta.startsWith("/")) destino = path.join(DIST, ruta);
      if (fs.existsSync(destino) && fs.statSync(destino).isDirectory()) destino = path.join(destino, "index.html");
      if (!fs.existsSync(destino)) rotos.push(`${rel(archivo)} → ${ruta}`);
    }
    if (/Cargando\.\.\.|javascript:void|\{\{\w+\}\}/.test(html)) rotos.push(`${rel(archivo)} → quedó "Cargando...", javascript:void o un {{marcador}}`);
  }
  if (rotos.length) fallar(`referencias rotas:\n   ${rotos.join("\n   ")}`);
}

function revisarIconos() {
  const definidos = new Set(
    [...fs.readFileSync(path.join(RAIZ, "assets/css/icons.css"), "utf8").matchAll(/^\.(fa-[a-z0-9-]+) \{/gm)].map((m) => m[1]),
  );
  ["fa-2x", "fa-3x", "fa-4x"].forEach((c) => definidos.add(c));
  const usados = new Set();
  for (const carpeta of ["components", "pages", "assets/js"]) {
    for (const archivo of [...listar(path.join(RAIZ, carpeta), ".html"), ...listar(path.join(RAIZ, carpeta), ".js")]) {
      for (const [m] of fs.readFileSync(archivo, "utf8").matchAll(/\bfa-[a-z0-9-]+/g)) usados.add(m);
    }
  }
  const faltan = [...usados].filter((c) => !definidos.has(c)).sort();
  if (faltan.length) console.warn(`⚠ build: íconos sin definir (${faltan.join(", ")}). Corre: npm run icons`);
}

// ---------------------------------------------------------------- build completo
export async function build() {
  const inicio = Date.now();
  const cfg = await cargarConfig();
  const marca = `${process.pid}-${Date.now()}`;
  DIST = path.join(RAIZ, `.dist-tmp-${marca}`);
  try {
    await armarSitio(cfg);
    // Cambio atómico: dist/ queda completo con la versión anterior o con la nueva, nunca a medias
    const anterior = path.join(RAIZ, `.dist-old-${marca}`);
    if (fs.existsSync(DIST_FINAL)) fs.renameSync(DIST_FINAL, anterior);
    fs.renameSync(DIST, DIST_FINAL);
    fs.rmSync(anterior, { recursive: true, force: true });
  } catch (error) {
    fs.rmSync(DIST, { recursive: true, force: true });
    throw error;
  } finally {
    DIST = DIST_FINAL;
  }
  console.log(`✔ build: dist/ generado en ${Date.now() - inicio} ms`);
}

async function armarSitio(cfg) {
  fs.mkdirSync(DIST);
  copiar(path.join(RAIZ, "assets"), path.join(DIST, "assets"));
  for (const archivo of ARCHIVOS_RAIZ) fs.copyFileSync(path.join(RAIZ, archivo), path.join(DIST, archivo));
  versionarImports();

  const salida = [];
  const home = path.join(DIST, "index.html");
  const htmlHome = rellenarContacto(reemplazarMarcadores(armarHome(), cfg, "layout.html"), cfg);
  fs.writeFileSync(home, versionarHtml(agregarFaqJsonLd(htmlHome, "layout.html"), DIST));
  salida.push(home);

  const paginas = listar(path.join(RAIZ, "pages"), ".html");
  for (const origen of paginas) {
    const destino = path.join(DIST, rel(origen));
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    const html = agregarFaqJsonLd(rellenarContacto(reemplazarMarcadores(fs.readFileSync(origen, "utf8"), cfg, rel(origen)), cfg), rel(origen));
    fs.writeFileSync(destino, versionarHtml(html, path.dirname(destino)));
    salida.push(destino);
  }

  generarSitemap(paginas);
  generarLlms(cfg);
  verificar(salida);
  revisarIconos();
  console.log(`  ${salida.length} páginas`);
}

// ---------------------------------------------------------------- modo desarrollo
function servir(puerto) {
  const tipos = {
    ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
    ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
    ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json",
  };
  http
    .createServer((req, res) => {
      let ruta = path.join(DIST_FINAL, decodeURIComponent(new URL(req.url, "http://x").pathname));
      if (!ruta.startsWith(DIST_FINAL)) return res.writeHead(403).end();
      if (fs.existsSync(ruta) && fs.statSync(ruta).isDirectory()) ruta = path.join(ruta, "index.html");
      if (!fs.existsSync(ruta)) return res.writeHead(404).end("404");
      res.writeHead(200, { "Content-Type": tipos[path.extname(ruta)] || "application/octet-stream", "Cache-Control": "no-store" });
      fs.createReadStream(ruta).pipe(res);
    })
    .listen(puerto, () => console.log(`▶ dev: http://localhost:${puerto}  (Ctrl+C para salir)`));
}

async function desarrollo() {
  await build();
  servir(Number(process.env.PORT) || 8080);
  let espera;
  const vigilar = ["components", "pages", "assets", ...ARCHIVOS_RAIZ, "llms.txt"];
  for (const objetivo of vigilar) {
    const ruta = path.join(RAIZ, objetivo);
    if (!fs.existsSync(ruta)) continue;
    fs.watch(ruta, { recursive: true }, () => {
      clearTimeout(espera);
      espera = setTimeout(() => build().catch((e) => console.error(e.message)), 150);
    });
  }
  console.log("👀 dev: regenera dist/ al guardar cambios");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  (process.argv.includes("--dev") ? desarrollo() : build()).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
