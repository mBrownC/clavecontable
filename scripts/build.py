#!/usr/bin/env python3
"""
Build del sitio ClaveContable.

1. Arma index.html a partir de components/layout.html, reemplazando cada
   marca <!-- @include components/archivo.html --> por el contenido de ese
   componente. Así el home llega completo desde el servidor (sin fetch).
2. Une los CSS del bloque <!-- @bundle destino.css --> ... <!-- @endbundle -->
   en un solo archivo, para que el navegador descargue 1 hoja en vez de 14.
3. Versiona los CSS y JS locales de index.html y de pages/**/*.html con
   ?v=<hash del archivo>, y también los import de los módulos JS
   (main-modular.js → ./modules/*.js). Cuando un archivo cambia, cambia su URL y el
   navegador y Cloudflare descargan la versión nueva sin purgar caché.

Uso:  python3 scripts/build.py
Se ejecuta solo en cada commit (ver .githooks/pre-commit).
"""

import hashlib
import os
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LAYOUT = RAIZ / "components" / "layout.html"
SALIDA = RAIZ / "index.html"
PAGINAS = sorted((RAIZ / "pages").rglob("*.html"))

AVISO = (
    "<!-- ARCHIVO GENERADO por scripts/build.py: no editar a mano.\n"
    "     Edita components/layout.html y components/*.html, y se regenera en cada commit. -->\n"
)

BUNDLE = re.compile(
    r"^([ \t]*)<!-- @bundle (\S+) -->\n(.*?)^[ \t]*<!-- @endbundle -->\n", re.MULTILINE | re.DOTALL
)
HOJA = re.compile(r'<link rel="stylesheet" href="([^"]+)">')
URL_CSS = re.compile(r"""url\((['"]?)(?!data:|https?:|//|#|/)([^'")]+)\1\)""")
IMPORT_JS = re.compile(r'((?:from|import)\s+")(\.{1,2}/[^"?]+\.js)(?:\?v=[0-9a-f]+)?(")')
INCLUDE = re.compile(r"^([ \t]*)<!-- @include (\S+) -->[ \t]*$", re.MULTILINE)
# href/src a archivos .css o .js locales (no http/https ni //), con o sin ?v= previo
ASSET = re.compile(r'((?:href|src)=")(?!https?:|//)([^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")')


def incluir(match):
    sangria, ruta = match.group(1), match.group(2)
    archivo = RAIZ / ruta
    if not archivo.is_file():
        sys.exit(f"❌ build: no existe el componente {ruta}")
    contenido = archivo.read_text(encoding="utf-8").rstrip("\n")
    return "\n".join(sangria + linea if linea.strip() else "" for linea in contenido.split("\n"))


def empaquetar(match):
    sangria, destino, bloque = match.group(1), RAIZ / match.group(2), match.group(3)
    partes = []
    for href in HOJA.findall(bloque):
        origen = RAIZ / href
        if not origen.is_file():
            sys.exit(f"❌ build: no existe {href} (bloque @bundle)")
        css = origen.read_text(encoding="utf-8")

        # Las rutas url() relativas se recalculan desde la carpeta del archivo combinado
        def reubicar(m, carpeta=origen.parent):
            nueva = os.path.relpath((carpeta / m.group(2)).resolve(), destino.parent).replace(os.sep, "/")
            return f"url({m.group(1)}{nueva}{m.group(1)})"

        partes.append(f"/* ---- {href} ---- */\n{URL_CSS.sub(reubicar, css).strip()}\n")
    encabezado = "/* ARCHIVO GENERADO por scripts/build.py: no editar a mano (une los CSS del home). */\n\n"
    if escribir_si_cambia(destino, encabezado + "\n".join(partes)):
        print(f"✔ build: {destino.relative_to(RAIZ)}")
    return f'{sangria}<link rel="stylesheet" href="{match.group(2)}">\n'


def versionar(html, carpeta):
    def poner_version(match):
        ruta = (carpeta / match.group(2)).resolve()
        if not ruta.is_file():
            sys.exit(f"❌ build: no existe {match.group(2)} (referenciado desde {carpeta.relative_to(RAIZ) or '.'})")
        version = hashlib.md5(ruta.read_bytes()).hexdigest()[:10]
        return f"{match.group(1)}{match.group(2)}?v={version}{match.group(3)}"

    return ASSET.sub(poner_version, html)


def versionar_imports():
    """Pone ?v=<hash> a los import entre módulos JS. Se repite hasta que no cambie nada,
    porque la versión de un módulo depende de las versiones de lo que importa."""
    cambiados = set()
    for _ in range(5):
        hubo_cambios = False
        for archivo in sorted((RAIZ / "assets" / "js").rglob("*.js")):
            js = archivo.read_text(encoding="utf-8")

            def poner_version(m, carpeta=archivo.parent):
                destino = (carpeta / m.group(2)).resolve()
                if not destino.is_file():
                    sys.exit(f"❌ build: {archivo.relative_to(RAIZ)} importa {m.group(2)}, que no existe")
                version = hashlib.md5(destino.read_bytes()).hexdigest()[:10]
                return f"{m.group(1)}{m.group(2)}?v={version}{m.group(3)}"

            if escribir_si_cambia(archivo, IMPORT_JS.sub(poner_version, js)):
                cambiados.add(archivo)
                hubo_cambios = True
        if not hubo_cambios:
            break
    return sorted(cambiados)


def escribir_si_cambia(archivo, contenido):
    anterior = archivo.read_text(encoding="utf-8") if archivo.exists() else None
    if contenido != anterior:
        archivo.write_text(contenido, encoding="utf-8")
        return True
    return False


def revisar_iconos():
    """Avisa si se usa un ícono fa-* que no está en assets/css/icons.css."""
    definidos = set(re.findall(r"^\.(fa-[a-z0-9-]+) \{", (RAIZ / "assets/css/icons.css").read_text(encoding="utf-8"), re.M))
    definidos |= {"fa-2x", "fa-3x", "fa-4x"}
    usados = set()
    for carpeta in ("components", "pages", "assets/js"):
        for archivo in (RAIZ / carpeta).rglob("*"):
            if archivo.suffix in (".html", ".js"):
                usados |= set(re.findall(r"\bfa-[a-z0-9-]+", archivo.read_text(encoding="utf-8")))
    faltan = sorted(usados - definidos)
    if faltan:
        print(f"⚠ build: íconos sin definir ({', '.join(faltan)}). Corre: python3 scripts/icons.py")


def main():
    cambiados = versionar_imports()

    layout = LAYOUT.read_text(encoding="utf-8")
    home = INCLUDE.sub(incluir, layout)
    home = BUNDLE.sub(empaquetar, home)
    if "@include" in home:
        sys.exit("❌ build: quedó una marca @include sin resolver")
    home = home.replace("<!DOCTYPE html>\n", "<!DOCTYPE html>\n" + AVISO, 1)
    home = versionar(home, RAIZ)

    if escribir_si_cambia(SALIDA, home):
        cambiados.append(SALIDA)
    for pagina in PAGINAS:
        html = pagina.read_text(encoding="utf-8")
        if escribir_si_cambia(pagina, versionar(html, pagina.parent)):
            cambiados.append(pagina)

    revisar_iconos()

    for archivo in cambiados:
        print(f"✔ build: {archivo.relative_to(RAIZ)}")
    if not cambiados:
        print("✔ build: todo al día")


if __name__ == "__main__":
    main()
