#!/usr/bin/env python3
"""
Genera assets/css/icons.css con SOLO los íconos de Font Awesome Free que usa el sitio.

Reemplaza a la hoja completa de Font Awesome (19 KB de CSS + 260 KB de fuentes) por
íconos SVG embebidos. El HTML no cambia: se sigue escribiendo <i class="fas fa-check">.

Cuándo correrlo: al usar un ícono nuevo (el build avisa si falta alguno).
Uso:  python3 scripts/icons.py
Requiere internet: descarga los SVG de Font Awesome Free 6.4.0 desde jsDelivr.
Licencia de los íconos: Font Awesome Free, CC BY 4.0 (https://fontawesome.com/license/free).
"""

import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "assets" / "css" / "icons.css"
VERSION_FA = "6.4.0"
CDN = f"https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@{VERSION_FA}/svgs"

# Clases que no son íconos
NO_ICONOS = {"fa-2x", "fa-3x", "fa-4x", "fa-fw", "fa-solid", "fa-brands", "fa-regular"}
# Íconos de marcas (estilo "fab")
MARCAS = {"facebook", "instagram", "linkedin", "whatsapp"}
# Nombres antiguos de Font Awesome 5 que siguen funcionando en la 6
ALIAS = {
    "check-circle": "circle-check",
    "shield-alt": "shield-halved",
    "home": "house",
    "exclamation-triangle": "triangle-exclamation",
    "exclamation-circle": "circle-exclamation",
}


def iconos_usados():
    archivos = [RAIZ / "components", RAIZ / "pages", RAIZ / "assets" / "js"]
    nombres = set()
    for carpeta in archivos:
        for archivo in carpeta.rglob("*"):
            if archivo.suffix in (".html", ".js"):
                nombres |= set(re.findall(r"\bfa-[a-z0-9-]+", archivo.read_text(encoding="utf-8")))
    return sorted(nombres - NO_ICONOS)


def descargar_svg(nombre):
    archivo = ALIAS.get(nombre, nombre)
    estilo = "brands" if archivo in MARCAS else "solid"
    url = f"{CDN}/{estilo}/{archivo}.svg"
    try:
        svg = urllib.request.urlopen(url, timeout=20).read().decode("utf-8")
    except Exception:
        sys.exit(f"❌ icons: '{nombre}' no existe en Font Awesome Free {VERSION_FA} ({url})")
    ancho, alto = map(float, re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg).groups())
    trazo = re.search(r'<path d="([^"]+)"', svg).group(1)
    return ancho / alto, ancho, alto, trazo


def main():
    reglas = []
    for clase in iconos_usados():
        proporcion, ancho, alto, trazo = descargar_svg(clase[3:])
        svg = f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {ancho:g} {alto:g}'><path d='{trazo}'/></svg>"
        datos = "data:image/svg+xml," + urllib.parse.quote(svg, safe=" /:='")
        reglas.append(f'.{clase} {{ --fa-w: {proporcion:.4f}; --fa-svg: url("{datos}"); }}')

    css = f"""/* ==========================================
   Íconos del sitio (GENERADO por scripts/icons.py: no editar a mano)
   Font Awesome Free {VERSION_FA} · Licencia CC BY 4.0 · https://fontawesome.com/license/free
   Uso: <i class="fas fa-check"></i>  ·  tamaños: fa-2x, fa-3x, fa-4x
   ========================================== */

.fas,
.fab {{
    display: inline-block;
    font-style: normal;
    line-height: 1;
    vertical-align: -0.125em;
}}

.fas::before,
.fab::before {{
    content: "";
    display: block;
    width: calc(var(--fa-w, 1) * 1em);
    height: 1em;
    background-color: currentColor;
    -webkit-mask: var(--fa-svg) no-repeat center / contain;
    mask: var(--fa-svg) no-repeat center / contain;
}}

.fa-2x {{ font-size: 2em; }}
.fa-3x {{ font-size: 3em; }}
.fa-4x {{ font-size: 4em; }}

{chr(10).join(reglas)}
"""
    SALIDA.write_text(css, encoding="utf-8")
    print(f"✔ icons: {len(reglas)} íconos → {SALIDA.relative_to(RAIZ)} ({len(css) // 1024} KB)")


if __name__ == "__main__":
    main()
