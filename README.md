# ClaveContable Ltda. - Sitio Web Oficial

## Descripción
Sitio web profesional para ClaveContable Ltda., empresa de servicios contables, tecnológicos y de recursos humanos en Chile. Especialistas en asesoría tributaria, remuneraciones, auditoría, declaración de impuestos, tiendas online, desarrollo web y software a medida para PyMEs.

## Stack Tecnológico
- **HTML5** - Estructura semántica optimizada para SEO
- **Bootstrap 5.3** - Framework CSS responsive
- **GSAP 3.x** - Animaciones profesionales y contadores numéricos
- **Swiper.js** - Slider de noticias del hero
- **JavaScript Vanilla (ES Modules)** - Funcionalidad modular
- **Font Awesome 6.4** - Iconos
- **EmailJS + Cloudflare Turnstile** - Formulario de contacto con protección anti-bots

## Estructura del Proyecto
```
ClaveContable/
├── index.html                      # Home: único index del sitio (carga los componentes por fetch)
├── pages/                          # Páginas completas e independientes
│   ├── tienda-online.html          # Landing del ecommerce
│   ├── gracias.html                # Confirmación del formulario de contacto (noindex)
│   └── calculadoras/
│       ├── iva.html
│       └── boleta-honorarios.html
├── components/                     # Solo fragmentos HTML del home (no son páginas)
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
│   ├── contact-section.html
│   └── footer.html
├── assets/
│   ├── css/
│   │   ├── custom.css              # Variables, navbar, botones y estilos globales
│   │   ├── sections/               # Un CSS por sección del home (*-section.css)
│   │   └── pages/                  # Un CSS por página de /pages
│   │       ├── tienda-online.css
│   │       ├── calculadoras.css
│   │       └── gracias.css
│   ├── js/
│   │   ├── config.js               # Datos de contacto y redes centralizados
│   │   ├── main-modular.js         # Carga de componentes e inicialización del home
│   │   ├── modules/                # Módulos JS del home
│   │   └── pages/                  # Un JS por página de /pages
│   │       ├── tienda-online.js
│   │       ├── calculadoras.js     # Lógica y TASAS (IVA y retención de honorarios)
│   │       └── gracias.js
│   └── img/
│       ├── clientes/               # Logos de la marquesina de clientes
│       ├── ecommerce/              # Capturas reales de la tienda online
│       ├── favicon/                # favicon, apple-touch-icon, android-chrome 192/512
│       ├── hero/
│       ├── institucionales/
│       ├── logo/
│       └── social/                 # Imágenes Open Graph 1200x630
├── site.webmanifest
├── sitemap.xml
├── robots.txt
└── README.md
```

### Convenciones
- **Un solo `index.html`** (el home). Toda página adicional va en `pages/` con nombre propio.
- **`components/`** contiene solo fragmentos que se insertan en el home; nunca páginas completas.
- **Sin `<style>` ni `<script>` embebidos** en las páginas: cada página tiene su CSS en `assets/css/pages/` y su JS en `assets/js/pages/` (la única excepción es el snippet oficial de Google Analytics y los bloques JSON-LD).
- Nombres de archivos y carpetas en minúsculas y con guiones (`boleta-honorarios.html`).
- **Datos de contacto nunca en duro en el HTML**: teléfono, correo, WhatsApp, horario y redes salen solo de `assets/js/config.js` (ver "Configuración centralizada").

## Orden de secciones del Home
Hero (slider de noticias) → Nosotros → Visión y Misión ("Nuestro Compromiso") → **Tienda Online** → Noticias → Servicios → Auditoría → Servicios detallados → Tecnología → Planes → Clientes → Contacto → Footer

## Características
- Diseño responsive (mobile-first), sin scroll horizontal desde 360px (verificado en Redmi 15C)
- Arquitectura modular con componentes HTML
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
1. Clonar el repositorio
2. Abrir con Live Server (VS Code) o servidor local (`python3 -m http.server`)
3. No requiere instalación de dependencias (usa CDN)

> ⚠️ Abrir directamente con `file://` no funciona por el fetch de componentes. Requiere servidor HTTP.

## Despliegue
El sitio está en un **servidor propio** detrás de Cloudflare (ya no en Webuzo).

> ⚠️ `.github/workflows/deploy.yml`, `.deploy.json` y `.htaccess` corresponden al hosting anterior (Webuzo/Apache) y deben revisarse según el nuevo servidor.

### URLs y nombres de archivo
- Solo existe un `index.html` (el home). Las demás páginas tienen nombre propio y se publican con `.html`
  (ej. `/pages/tienda-online.html`, `/pages/calculadoras/iva.html`), lo que funciona en cualquier servidor sin configuración extra.
- Si se quisieran URLs sin `.html`, configurarlo en el servidor (en nginx: `try_files $uri $uri.html $uri/ =404;`)
  y actualizar canonical, `og:url`, JSON-LD, sitemap, menú y footer.

## Desarrollo

### Componentes del Home
Los componentes HTML se cargan dinámicamente vía `fetch()` en `main-modular.js`. Para agregar un nuevo componente:
1. Crear el archivo HTML en `/components/`
2. Crear su CSS en `/assets/css/sections/` y enlazarlo en `index.html`
3. Agregar el contenedor en `index.html` (en el orden deseado)
4. Registrar la carga en `loadAllComponents()` en `main-modular.js`

### Páginas independientes (`pages/`)
No usan Bootstrap ni el loader de componentes: son HTML autónomos con la misma línea visual (fondo `#061414`, acento `#00CED1`, fuentes Inter Tight + Lato). Cada una tiene su GA4, canonical, Open Graph, Twitter Card y botón "Volver a ClaveContable".

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
- Datos de contacto (email, teléfono)
- Horarios de atención (texto y formato para JSON-LD)
- Información de la empresa

Lo cargan todas las páginas (`<script type="module" src=".../assets/js/config.js">`). En el HTML solo se marca **dónde** va cada dato:

| Marca en el HTML | Qué hace |
|---|---|
| `<a data-contact="email"></a>` | Muestra el correo y crea el `mailto:` |
| `<a data-contact="phone"></a>` | Muestra el teléfono y crea el `tel:` |
| `<span data-contact="schedule"></span>` | Muestra el horario |
| `<a data-whatsapp="Mensaje">…</a>` | Link a WhatsApp con ese mensaje (vacío = mensaje por defecto) |
| `<button data-copy-contact="phone">` | Botón "Copiar" con el teléfono o el correo |

Los bloques JSON-LD tampoco llevan teléfono, correo, horario ni redes: `config.js` los completa al cargar la página (Google ejecuta JavaScript al indexar).

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
- Open Graph y Twitter Cards con imágenes 1200x630 en `assets/img/social/`
- Canonical URL en todas las páginas
- Geo tags (Santiago, Chile)
- Google Site Verification
- Favicons completos + `site.webmanifest`
- Sitemap.xml (home, tienda online y calculadoras) y robots.txt (bloquea `/pages/gracias.html`)
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
- **Dirección:** Pasaje Quince Oriente 6400, La Granja, Santiago
- **Horario:** Lunes a Viernes 9:00 - 18:00

## Redes Sociales
- **Facebook:** https://www.facebook.com/share/1A8UKXC39C/
- **Instagram:** https://www.instagram.com/clavecontablechile/
- **LinkedIn:** https://www.linkedin.com/company/clavecontable
- **WhatsApp:** https://wa.me/56956746853

## Licencia
Copyright © 2026 ClaveContable Ltda. Todos los derechos reservados.
Diseñado por MBrownC, Exoweb_chile®
