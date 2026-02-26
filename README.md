# ClaveContable Ltda. - Sitio Web Oficial

## Descripción
Sitio web profesional para ClaveContable Ltda., empresa de servicios contables, tecnológicos y de recursos humanos en Chile. Especialistas en asesoría tributaria, remuneraciones, declaración de impuestos, desarrollo web y software a medida para PyMEs.

## Stack Tecnológico
- **HTML5** - Estructura semántica optimizada para SEO
- **Bootstrap 5.3** - Framework CSS responsive
- **GSAP 3.x** - Animaciones profesionales y contadores numéricos
- **Swiper.js** - Carruseles y sliders
- **JavaScript Vanilla (ES Modules)** - Funcionalidad modular
- **Font Awesome 6.4** - Iconos

## Estructura del Proyecto
```
ClaveContable/
├── index.html
├── sitemap.xml
├── robots.txt
├── README.md
├── assets/
│   ├── css/
│   │   ├── custom.css
│   │   ├── hero-section.css
│   │   ├── nosotros-section.css
│   │   ├── vision-mision-section.css
│   │   ├── noticias-section.css
│   │   ├── servicios-section.css
│   │   ├── planes-section.css
│   │   ├── tecnologia-section.css
│   │   └── contact-section.css
│   ├── js/
│   │   ├── config.js
│   │   ├── main-modular.js
│   │   └── modules/
│   │       ├── animations.js
│   │       ├── contactForm.js
│   │       ├── formValidation.js
│   │       ├── navigation.js
│   │       ├── noticiasToggle.js
│   │       ├── serviceFilters.js
│   │       ├── smoothScroll.js
│   │       └── swiperConfig.js
│   └── img/
│       ├── logo/
│       ├── favicon/
│       ├── hero/
│       ├── institucionales/
│       └── servicios/
└── components/
    ├── navbar.html
    ├── hero-section.html
    ├── nosotros-section.html
    ├── vision-mision-section.html
    ├── noticias-section.html
    ├── servicios-section.html
    ├── servicios-detallados.html
    ├── planes-section.html
    ├── tecnologia-section.html
    ├── contact-section.html
    ├── footer.html
    └── gracias.html
```

## Características
- Diseño responsive (mobile-first)
- Arquitectura modular con componentes HTML
- Animaciones suaves con GSAP y ScrollTrigger
- Contadores numéricos animados (stats 500+, 10+)
- SEO técnico completo (Schema markup, Open Graph, Geo tags)
- Formulario de contacto funcional con servicios tecnológicos
- Integración con WhatsApp
- Google Search Console verificado
- Sitemap.xml y robots.txt configurados

## Instalación
1. Clonar el repositorio
2. Abrir con Live Server (VS Code) o servidor local
3. No requiere instalación de dependencias (usa CDN)

> ⚠️ Abrir directamente con `file://` no funciona por el fetch de componentes. Requiere servidor HTTP.

## Desarrollo

### Componentes
Los componentes HTML se cargan dinámicamente via `fetch()` en `main-modular.js`. Para agregar un nuevo componente:
1. Crear el archivo HTML en `/components/`
2. Agregar el contenedor en `index.html`
3. Registrar la carga en `loadAllComponents()` en `main-modular.js`

### Configuración centralizada
Editar `assets/js/config.js` para actualizar:
- URLs de redes sociales
- Datos de contacto (email, teléfono)
- Horarios de atención
- Información de la empresa

### CSS
Cada sección tiene su propio archivo CSS en `assets/css/`. Variables globales en `custom.css`:
```css
--primary-color: #00CED1
--secondary-color: #0a1f1f
--dark-color: #000000
--light-color: #ffffff
```

## SEO Implementado
- Meta tags completos (description, robots, author)
- Schema markup JSON-LD (AccountingService + servicios tecnológicos)
- Open Graph y Twitter Cards
- Canonical URL
- Geo tags (Santiago, Chile)
- Google Site Verification
- Sitemap.xml
- Robots.txt
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

### Recursos Humanos
- Contratos laborales
- Liquidaciones de sueldo
- Carga Previred
- Finiquitos

### Tecnología
- Creación de Páginas Web
- Administración de Servidores (Linux, Docker)
- Desarrollo de Software a Medida (APIs, automatización, facturación electrónica SII)

## Planes Contables
- **Plan Inicia** - 1 UF/mes
- **Plan Crea** - 2.5 UF/mes
- **Pyme Pro** - 3.5 UF/mes

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