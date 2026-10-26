#!/usr/bin/env node
/**
 * Genera assets/css/icons.css con SOLO los íconos de Font Awesome Free que usa el sitio.
 *
 * Reemplaza a la hoja completa de Font Awesome (19 KB de CSS + 260 KB de fuentes) por
 * íconos SVG embebidos. El HTML no cambia: se sigue escribiendo <i class="fas fa-check">.
 *
 * Cuándo correrlo: al usar un ícono nuevo (el build avisa si falta alguno).
 * Uso:  npm run icons
 * Requiere internet: descarga los SVG de Font Awesome Free 6.4.0 desde jsDelivr.
 * Licencia de los íconos: Font Awesome Free, CC BY 4.0 (https://fontawesome.com/license/free).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = path.join(RAIZ, "assets/css/icons.css");
const VERSION_FA = "6.4.0";
const CDN = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${VERSION_FA}/svgs`;

// Clases que no son íconos
const NO_ICONOS = new Set(["fa-2x", "fa-3x", "fa-4x", "fa-fw", "fa-solid", "fa-brands", "fa-regular"]);
// Íconos de marcas (estilo "fab")
const MARCAS = new Set(["facebook", "instagram", "linkedin", "whatsapp"]);
// Nombres antiguos de Font Awesome 5 que siguen funcionando en la 6
const ALIAS = {
  "check-circle": "circle-check",
  "shield-alt": "shield-halved",
  home: "house",
  "exclamation-triangle": "triangle-exclamation",
  "exclamation-circle": "circle-exclamation",
};

function listar(carpeta) {
  return fs.readdirSync(carpeta, { withFileTypes: true }).flatMap((e) => {
    const ruta = path.join(carpeta, e.name);
    if (e.isDirectory()) return listar(ruta);
    return /\.(html|js)$/.test(e.name) ? [ruta] : [];
  });
}

function iconosUsados() {
  const nombres = new Set();
  for (const carpeta of ["components", "pages", "assets/js"]) {
    for (const archivo of listar(path.join(RAIZ, carpeta))) {
      for (const [m] of fs.readFileSync(archivo, "utf8").matchAll(/\bfa-[a-z0-9-]+/g)) nombres.add(m);
    }
  }
  return [...nombres].filter((n) => !NO_ICONOS.has(n)).sort();
}

async function descargarSvg(nombre) {
  const archivo = ALIAS[nombre] || nombre;
  const estilo = MARCAS.has(archivo) ? "brands" : "solid";
  const url = `${CDN}/${estilo}/${archivo}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`❌ icons: '${nombre}' no existe en Font Awesome Free ${VERSION_FA} (${url})`);
  const svg = await res.text();
  const [, ancho, alto] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const trazo = svg.match(/<path d="([^"]+)"/)[1];
  return { ancho, alto, trazo };
}

// Igual que urllib.parse.quote(svg, safe=" /:='") de la versión anterior
const codificar = (texto) => encodeURIComponent(texto).replace(/%20/g, " ").replace(/%2F/g, "/").replace(/%3A/g, ":").replace(/%3D/g, "=");

async function main() {
  const reglas = [];
  for (const clase of iconosUsados()) {
    const { ancho, alto, trazo } = await descargarSvg(clase.slice(3));
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${ancho} ${alto}'><path d='${trazo}'/></svg>`;
    reglas.push(`.${clase} { --fa-w: ${(ancho / alto).toFixed(4)}; --fa-svg: url("data:image/svg+xml,${codificar(svg)}"); }`);
  }

  const css = `/* ==========================================
   Íconos del sitio (GENERADO por scripts/icons.js: no editar a mano)
   Font Awesome Free ${VERSION_FA} · Licencia CC BY 4.0 · https://fontawesome.com/license/free
   Uso: <i class="fas fa-check"></i>  ·  tamaños: fa-2x, fa-3x, fa-4x
   ========================================== */

.fas,
.fab {
    display: inline-block;
    font-style: normal;
    line-height: 1;
    vertical-align: -0.125em;
}

.fas::before,
.fab::before {
    content: "";
    display: block;
    width: calc(var(--fa-w, 1) * 1em);
    height: 1em;
    background-color: currentColor;
    -webkit-mask: var(--fa-svg) no-repeat center / contain;
    mask: var(--fa-svg) no-repeat center / contain;
}

.fa-2x { font-size: 2em; }
.fa-3x { font-size: 3em; }
.fa-4x { font-size: 4em; }

${reglas.join("\n")}
`;
  fs.writeFileSync(SALIDA, css);
  console.log(`✔ icons: ${reglas.length} íconos → assets/css/icons.css (${Math.round(css.length / 1024)} KB)`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
