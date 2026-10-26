# ClaveContable Ltda. - Sitio Web Oficial

## Descripción
Sitio web profesional para ClaveContable Ltda., empresa de servicios contables, tecnológicos y de recursos humanos en Chile. Especialistas en asesoría tributaria, remuneraciones, auditoría, declaración de impuestos, tiendas online, desarrollo web y software a medida para PyMEs.

## Stack Tecnológico
- **HTML5** - Estructura semántica optimizada para SEO
- **Bootstrap 5.3.0** - Framework CSS responsive (servido desde `assets/vendor/`)
- **GSAP 3.12.2** - Animaciones y contadores numéricos (`assets/vendor/`)
- **Swiper 10.3.1** - Slider de noticias del hero (`assets/vendor/`)
- **JavaScript Vanilla (ES Modules)** - Funcionalidad modular
- **Íconos Font Awesome Free 6.4** - Como SVG en `assets/css/icons.css` (solo los que se usan)
- **Fuentes Inter Tight, Lato y Cinzel** - Servidas localmente desde `assets/fonts/`
- **EmailJS + Cloudflare Turnstile** - Formulario de contacto con protección anti-bots (se cargan al acercarse al formulario)
- **Node.js 20+** - Build y servidor de desarrollo (`scripts/build.js`), sin dependencias externas

## Estructura del Proyecto
```
ClaveContable/
├── dist/                           # ⚙ SITIO PUBLICABLE, GENERADO por scripts/build.js (lo sirve nginx)
├── pages/                          # Páginas completas e independientes
│   ├── tienda-online.html          # Landing del ecommerce
│   ├── preguntas-frecuentes.html   # Preguntas frecuentes de contabilidad (se abre desde el home)
│   ├── preguntas-frecuentes-tienda.html  # Preguntas frecuentes de la tienda (se abre desde la landing)
│   ├── gracias.html                # Confirmación del formulario de contacto (noindex)
│   └── calculadoras/
│       ├── iva.html
│       └── boleta-honorarios.html
├── components/                     # Fuente del home: layout + fragmentos (no son páginas)
│   ├── layout.html                 # Estructura del home: <head>, SEO y orden de secciones (@include)
│   ├── navbar.html
│   ├── hero-section.html
│   ├── nosotros-section.html
│   ├── vision-mision-section.html
│   ├── ecommerce-section.html
│   ├── noticias-section.html
│   ├── servicios-section.html
│   ├── auditoria-section.html
│   ├── servicios-detallados.html
│   ├── tecnologia-section.html
│   ├── planes-section.html
│   ├── clientes-section.html
│   ├── faq-section.html            # Franja con botón a la página de preguntas frecuentes
│   ├── contact-section.html
│   └── footer.html
├── assets/
│   ├── css/
│   │   ├── custom.css              # Variables, navbar, botones y estilos globales
│   │   ├── fonts.css               # @font-face de las fuentes locales
│   │   ├── icons.css               # Íconos SVG (GENERADO por scripts/icons.js)
│   │   ├── sections/               # Un CSS por sección del home (*-section.css)
│   │   └── pages/                  # base.css (común a las páginas) + un CSS por página de /pages
│   │       ├── tienda-online.css
│   │       ├── calculadoras.css
│   │       └── gracias.css
│   ├── js/
│   │   ├── config.js               # Datos de contacto y redes centralizados
│   │   ├── main-modular.js         # Inicialización del home
│   │   ├── modules/                # Módulos JS del home
│   │   └── pages/                  # Un JS por página de /pages
│   │       ├── tienda-online.js
│   │       ├── calculadoras.js     # Lógica y TASAS (IVA y retención de honorarios)
│   │       └── gracias.js
│   ├── vendor/                     # Librerías de terceros con versión fija (Bootstrap, GSAP, Swiper)
│   ├── fonts/                      # Fuentes woff2 (solo set latino)
│   └── img/                        # Imágenes en WebP, del tamaño en que se muestran
│       ├── clientes/               # Logos de la marquesina de clientes
│       ├── ecommerce/              # Capturas reales de la tienda online
│       ├── favicon/                # favicon, apple-touch-icon, android-chrome 192/512
│       ├── hero/
│       ├── institucionales/
│       ├── logo/
│       └── social/                 # Imágenes Open Graph 1200x630
├── scripts/
│   ├── build.js                    # Genera dist/ (npm run build) y modo desarrollo (npm run dev)
│   └── icons.js                    # Regenera assets/css/icons.css con los íconos usados (npm run icons)
├── .githooks/
│   └── pre-commit                  # Corre el build en cada commit y agrega dist/ al commit
├── llms.txt                        # Plantilla del resumen para buscadores con IA ({{telefono}}, etc.)
├── site.webmanifest
├── robots.txt
├── package.json                    # Scripts npm (sin dependencias)
└── README.md
```

### Convenciones
- **Código fuente y sitio publicado separados**: se edita fuera de `dist/`; `dist/` lo genera el build y es lo único que se publica.
- **Un solo `index.html`** (el home, `dist/index.html`). Toda página adicional va en `pages/` con nombre propio.
- **`components/`** contiene solo el layout y los fragmentos del home; nunca páginas completas.
- **No editar a mano los archivos generados**: todo `dist/` y `assets/css/icons.css`.
- **Sin `<style>` ni `<script>` embebidos** en las páginas: cada página tiene su CSS en `assets/css/pages/` y su JS en `assets/js/pages/` (la única excepción es el snippet oficial de Google Analytics y los bloques JSON-LD).
- Nombres de archivos y carpetas en minúsculas y con guiones (`boleta-honorarios.html`).
- **Datos de contacto nunca en duro en el HTML**: teléfono, correo, WhatsApp, horario y redes salen solo de `assets/js/config.js` (ver "Configuración centralizada"); el build los escribe en `dist/`.

## Orden de secciones del Home
Hero (slider de noticias) → Nosotros → Visión y Misión ("Nuestro Compromiso") → **Tienda Online** → Noticias → Servicios → Auditoría → Servicios detallados → Tecnología → Planes → Clientes → **Preguntas frecuentes** (franja con botón) → Contacto → Footer

## Características
- Diseño responsive (mobile-first), sin scroll horizontal desde 360px (verificado en Redmi 15C)
- Arquitectura modular con componentes HTML, armados en un HTML estático por el build (sin `fetch`)
- Visible para buscadores con IA (GEO): datos de contacto y JSON-LD completos en el HTML sin necesidad de JavaScript, y `llms.txt`
- Rendimiento: CSS del home en un archivo, librerías y fuentes propias, imágenes WebP con `srcset`, versionado de caché `?v=`, carga diferida de Analytics, Turnstile y EmailJS
- Animaciones suaves con GSAP y ScrollTrigger
- Contadores numéricos animados (stats 500+, 10+)
- Sección **Tienda Online** con maqueta navegador + celular y CTA a la landing (pestaña nueva)
- Landing comercial del ecommerce en `/pages/tienda-online.html`
- **Calculadoras gratuitas** en `/pages/calculadoras/iva.html` y `/pages/calculadoras/boleta-honorarios.html`
- Marquesina infinita de logos de clientes (2 filas, color al pasar el mouse)
- Menú con ítem "Tienda Online" (indicador de nuevo) y desplegable "Calculadoras"
- SEO técnico completo (Schema markup, Open Graph con imagen, Geo tags)
- Formulario de contacto con EmailJS y Cloudflare Turnstile
- Integración con WhatsApp
- Google Analytics GA4 en todas las páginas
- Respeta `prefers-reduced-motion`

## Instalación
1. Clonar el repositorio (requiere **Node.js 20+**; no hay `npm install`, no hay dependencias)
2. **Activar el hook de build (una sola vez por clon):**
   ```bash
   git config core.hooksPath .githooks
   ```
3. Levantar el sitio en local:
   ```bash
   npm run dev      # genera dist/, lo sirve en http://localhost:8080 y lo regenera al guardar
   ```

## Despliegue
El sitio corre en un **servidor propio con nginx**, detrás de **Cloudflare** (proxy, caché y certificado de origen).

- El server tiene un clon de este repo en `~/apps/clavecontable`, y nginx sirve **solo la carpeta `dist/`** (`root /home/sonnex/apps/clavecontable/dist;`).
- **Para publicar:** hacer commit (el hook genera `dist/` y lo incluye), push a `main` y luego, en el server:
  ```bash
  cd ~/apps/clavecontable && git pull --ff-only
  ```
  El server no necesita Node ni ningún paso extra: `dist/` ya va armado en el repo.
- **Caché:** los CSS y JS llevan `?v=<hash>`, así que al cambiar un archivo cambia su URL y todos reciben la versión nueva sin purgar. Las **imágenes no llevan versión**: si se reemplaza una imagen, conviene usar un **nombre de archivo nuevo** (o purgar: Cloudflare → Caching → Configuration → **Purge Everything**).

### Configuración de nginx
El bloque `server` (443) sirve `dist/`, así que el código fuente, `.git` y el README nunca quedan públicos. Igual se mantienen los bloqueos como segunda barrera:
```nginx
root /home/sonnex/apps/clavecontable/dist;

location ~ /\.(?!well-known) { return 404; }          # archivos ocultos
location ~* ^/(README\.md|LICENSE)$ { return 404; }

add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "SAMEORIGIN" always;
```
Para aplicar cambios: `sudo nginx -t && sudo systemctl reload nginx`.

### URLs y nombres de archivo
- Solo existe un `index.html` (el home). Las demás páginas tienen nombre propio y se publican con `.html`
  (ej. `/pages/tienda-online.html`, `/pages/calculadoras/iva.html`), lo que funciona sin configuración extra.
- Si se quisieran URLs sin `.html`, cambiar en nginx `try_files $uri $uri/ =404;` por `try_files $uri $uri.html $uri/ =404;`
  y actualizar canonical, `og:url`, JSON-LD, sitemap, menú y footer.

## Desarrollo

### Build (`scripts/build.js`)
| Comando | Qué hace |
|---|---|
| `npm run dev` | Genera `dist/`, lo sirve en http://localhost:8080 y lo regenera al guardar cualquier cambio |
| `npm run build` | Genera `dist/` una vez (lo corre solo el hook en cada `git commit`) |
| `npm run icons` | Regenera `assets/css/icons.css` cuando se usa un ícono nuevo |

El build genera en `dist/` el sitio completo:
- **`index.html`** a partir de `components/layout.html`, reemplazando cada `<!-- @include components/x.html -->` por ese componente (el home llega completo desde el servidor, sin `fetch`);
- **`assets/css/home.bundle.css`**: une los CSS del bloque `<!-- @bundle … --> … <!-- @endbundle -->` del layout;
- **las páginas de `pages/`**;
- **datos de contacto** de `config.js` escritos en el HTML y en los JSON-LD (los robots de IA no ejecutan JavaScript);
- **`?v=<hash>`** en todos los CSS/JS y en los `import` de los módulos JS;
- **`sitemap.xml`** (fecha `lastmod` tomada de git; excluye páginas `noindex`) y **`llms.txt`** (desde la plantilla `llms.txt` de la raíz);
- copia `assets/`, `robots.txt` y `site.webmanifest`.

Al terminar, **verifica** que todo archivo local referenciado exista en `dist/` y que no quede ningún "Cargando..." ni `javascript:void`; si algo falla, el build (y por lo tanto el commit) se detiene con el detalle del error. También avisa si falta algún ícono.

### Agregar una sección al home
1. Crear el HTML en `components/` y su CSS en `assets/css/sections/`
2. En `components/layout.html`: agregar `<!-- @include components/nueva-section.html -->` en el orden deseado y su `<link>` dentro del bloque `@bundle`
3. Con `npm run dev` corriendo, se ve al guardar

### Agregar una página
1. Crearla en `pages/` (su CSS en `assets/css/pages/` y su JS en `assets/js/pages/`)
2. El build la copia a `dist/` y la agrega sola al `sitemap.xml` (salvo que tenga `<meta name="robots" content="noindex">`)

### Preguntas frecuentes
Están en `pages/preguntas-frecuentes.html` (contabilidad) y `pages/preguntas-frecuentes-tienda.html` (tienda online). El home y la landing de la tienda solo tienen una franja con un botón que abre su página en pestaña nueva. En esas páginas las secciones se alternan oscuras y blancas (`class="claro"`), como en el home. Cada pregunta se escribe **una sola vez** en el HTML:
```html
<details class="faq-item" data-faq>
    <summary>¿Pregunta?</summary>
    <div class="faq-answer"><p>Respuesta (solo p, ul, li, a, strong).</p></div>
</details>
```
El build arma con ellas el JSON-LD `FAQPage` de la página, así Google y los buscadores con IA las leen sin que haya que duplicarlas. Si una pregunta `data-faq` no sigue ese formato, el build se detiene y avisa. Las calculadoras tienen su propio `FAQPage` escrito a mano (no usan `data-faq`).

### Íconos
Se escriben igual que con Font Awesome: `<i class="fas fa-check"></i>` (tamaños `fa-2x`, `fa-3x`, `fa-4x`). Solo existen los íconos usados en el sitio; al usar uno nuevo de [Font Awesome Free 6.4](https://fontawesome.com/v6/search?o=r&m=free), correr:
```bash
npm run icons
```

### Páginas independientes (`pages/`)
No usan componentes (son HTML autónomos; el build les escribe los datos de contacto y les pone `?v=` a sus CSS/JS) con la misma línea visual (fondo `#061414`, acento `#00CED1`, fuentes Inter Tight + Lato). Cada una tiene su GA4, canonical, Open Graph, Twitter Card y botón "Volver a ClaveContable".

### Calculadoras: actualizar tasas
Todas las tasas están al inicio de `assets/js/pages/calculadoras.js`:
```js
const RETENCION_HONORARIOS = { 2025: 1450, 2026: 1525, 2027: 1600, 2028: 1700 }; // 1525 = 15,25 %
const IVA = 1900; // 19 %
```
- La calculadora elige sola la tasa del año en curso (y permite elegir otro año).
- Los cálculos se hacen con enteros y se redondean al peso.
- **Cada enero** revisar también los textos fijos con el año/tasa: `<title>`, meta description, FAQ y JSON-LD de `pages/calculadoras/boleta-honorarios.html`, y la imagen `assets/img/social/og-calculadora-honorarios.jpg`.

Fórmulas usadas:

| Calculadora | Caso | Fórmula |
|---|---|---|
| IVA | Desde neto | IVA = neto × 0,19 · Total = neto + IVA |
| IVA | Desde total | Neto = total ÷ 1,19 · IVA = total − neto |
| Honorarios | Desde bruto | Retención = bruto × 0,1525 · Líquido = bruto − retención |
| Honorarios | Desde líquido | Bruto = líquido ÷ 0,8475 · Retención = bruto − líquido |

### Tienda online
La landing `pages/tienda-online.html` viene del catálogo comercial del equipo de ecommerce (`ecommerce/docs/catalogo-comercial/`). Si el dev la actualiza:
1. Copiar el HTML como `pages/tienda-online.html` y las imágenes a `assets/img/ecommerce/`
2. Cambiar las rutas `img/` por `../assets/img/ecommerce/`, mover su `<style>` a `assets/css/pages/tienda-online.css` y su `<script>` a `assets/js/pages/tienda-online.js`
3. Volver a aplicar el bloque de `<head>` (GA4, canonical, OG, Twitter, favicons, JSON-LD) y el botón "Volver a ClaveContable"

### Configuración centralizada
`assets/js/config.js` es la **única fuente** de los datos de contacto. Editarlo para actualizar:
- URLs de redes sociales y número de WhatsApp
- Datos de contacto (email, teléfono, dirección y coordenadas)
- Horarios de atención (texto y formato para JSON-LD)
- Información de la empresa

Lo cargan todas las páginas (`<script type="module" src=".../assets/js/config.js">`). En el HTML solo se marca **dónde** va cada dato:

| Marca en el HTML | Qué hace |
|---|---|
| `<a data-contact="email"></a>` | Muestra el correo y crea el `mailto:` |
| `<a data-contact="phone"></a>` | Muestra el teléfono y crea el `tel:` |
| `<a data-contact="address"></a>` | Muestra la dirección y enlaza a Google Maps |
| `<span data-contact="schedule"></span>` | Muestra el horario |
| `<a data-whatsapp="Mensaje">…</a>` | Link a WhatsApp con ese mensaje (vacío = mensaje por defecto) |
| `<p data-contact="copyright"></p>` | Texto de copyright con el año actual |
| `<a data-social="facebook">…</a>` | Link a la red social (`facebook`, `instagram`, `linkedin`, `whatsapp`) |
| `<button data-copy-contact="phone">` | Botón "Copiar" con el teléfono o el correo |

Los bloques JSON-LD tampoco llevan teléfono, correo, horario ni redes en el código fuente. **El build escribe todos estos datos en el HTML de `dist/`**, así los ven Google y también los buscadores con IA (ChatGPT, Claude, Perplexity), que no ejecutan JavaScript. En el navegador, `config.js` los vuelve a aplicar. Donde no se puede usar una marca (meta tags del `<head>` y `llms.txt`) se usan **marcadores** `{{clave}}` que el build reemplaza: `{{telefono}}`, `{{email}}`, `{{horario}}`, `{{direccion}}`, `{{comuna}}`, `{{ciudad}}`, `{{region}}`, `{{lat}}`, `{{lng}}`, `{{whatsapp}}`, `{{facebook}}`, `{{instagram}}`, `{{linkedin}}` (definidos en `marcadores()` de `config.js`). La dirección y las coordenadas también completan el JSON-LD (`address`, `geo`, `hasMap`).

### CSS
Cada sección del home tiene su propio archivo CSS en `assets/css/sections/`. Variables globales en `custom.css`:
```css
--primary-color: #00CED1
--secondary-color: #0a1f1f
--dark-color: #000000
--light-color: #ffffff
```

## SEO Implementado
- Meta tags completos (title, description, robots, author, theme-color)
- Schema markup JSON-LD:
  - Home: `AccountingService` (servicios contables, tecnológicos y tienda online) + `WebSite` con sus páginas
  - Tienda online: `Service`
  - Calculadoras: `WebApplication` + `FAQPage`
  - Páginas de preguntas frecuentes (contabilidad y tienda): `FAQPage` generado por el build desde las preguntas `data-faq`
- Open Graph y Twitter Cards con imágenes 1200x630 en `assets/img/social/`
- Canonical URL en todas las páginas
- Geo tags (Santiago, Chile)
- Google Site Verification
- Favicons completos + `site.webmanifest`
- `sitemap.xml` generado por el build (fechas desde git) y `robots.txt` (bloquea `/pages/gracias.html`)
- `llms.txt`: resumen del sitio para buscadores con IA
- H1-H6 semánticos con keywords
- Alt descriptivos en imágenes
- Aria labels en elementos interactivos

## Servicios

### Contables y Tributarios
- Inicio de Actividades SII
- Declaración mensual F29
- Libros Electrónicos
- Balance Anual
- Asesoría Tributaria
- Auditoría Contable para Empresas

### Recursos Humanos
- Contratos laborales
- Liquidaciones de sueldo
- Carga Previred
- Finiquitos

### Tecnología
- **Tienda Online para PyMEs** (Webpay, Getnet, Mercado Pago, Starken, Chilexpress, boletas y facturas)
- Creación de Páginas Web
- Administración de Servidores (Linux, Docker)
- Desarrollo de Software a Medida (APIs, automatización, facturación electrónica SII)

### Herramientas gratuitas
- Calculadora de IVA (19 %)
- Calculadora de Boleta de Honorarios (retención 2026: 15,25 %)

## Planes Contables
- **Plan Inicia** - 1.5 UF/mes
- **Plan Crea** - 3 UF/mes
- **Pyme Pro** - 4 UF/mes

## Información de Contacto
- **Email:** contacto@clavecontable.cl
- **Teléfono:** +56 9 5674 6853
- **Dirección:** Pasaje 15 Oriente 6400, La Granja, Santiago (fuente: `assets/js/config.js`)
- **Horario:** Lunes a Viernes 9:00 - 18:00

## Redes Sociales
- **Facebook:** https://www.facebook.com/share/1A8UKXC39C/
- **Instagram:** https://www.instagram.com/clavecontablechile/
- **LinkedIn:** https://www.linkedin.com/company/clavecontable
- **WhatsApp:** https://wa.me/56956746853

## Licencia
Copyright © 2026 ClaveContable Ltda. Todos los derechos reservados.
Diseñado por MBrownC, Exoweb_chile®
