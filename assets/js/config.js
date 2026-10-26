// Configuración centralizada de redes sociales y contacto - ClaveContable
// Es la ÚNICA fuente de estos datos: el build (scripts/build.js) los escribe en el HTML
// de dist/ y, en el navegador, applyContactData() los vuelve a aplicar.
export const CONFIG = {
  // Redes Sociales
  social: {
    facebook: "https://www.facebook.com/share/1A8UKXC39C/",
    instagram: "https://www.instagram.com/clavecontablechile/",
    linkedin: "https://www.linkedin.com/company/clavecontable",
    whatsapp: "https://wa.me/56956746853",
    whatsappMessage:
      "Hola%20ClaveContable%20quisiera%20cotizar%20un%20servicio",
  },

  // Información de contacto
  contact: {
    email: "contacto@clavecontable.cl",
    phone: "+56956746853",
    phoneDisplay: "+56 9 5674 6853",
    address: {
      street: "Pasaje 15 Oriente 6400",
      commune: "La Granja",
      city: "Santiago",
      region: "Región Metropolitana",
      regionCode: "CL-RM",
      country: "CL",
    },
    // Coordenadas de la calle (OpenStreetMap, precisión ~100 m)
    geo: { lat: -33.5224, lng: -70.6246 },
  },

  // Horarios
  schedule: {
    weekdays: "Lunes a Viernes: 9:00 - 18:00",
    // Formato para datos estructurados (JSON-LD)
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },

  // Información de la empresa
  company: {
    name: "ClaveContable Ltda",
    slogan: "La Clave de Tus Cuentas",
    description: "Servicios contables profesionales para tu empresa en Chile.",
    year: new Date().getFullYear(),
    designer: "MBrownC, Exoweb_chile®",
  },
};

// Link de WhatsApp con mensaje (texto plano; si no se indica, usa el mensaje por defecto)
export function whatsappUrl(mensaje) {
  const texto = mensaje
    ? encodeURIComponent(mensaje)
    : CONFIG.social.whatsappMessage;
  return `${CONFIG.social.whatsapp}?text=${texto}`;
}

// Dirección en una línea: "Pasaje 15 Oriente 6400, La Granja, Santiago"
export function direccion() {
  const a = CONFIG.contact.address;
  return `${a.street}, ${a.commune}, ${a.city}`;
}

// Valores para los marcadores {{clave}} que el build reemplaza (meta tags y llms.txt)
export function marcadores() {
  const { contact, schedule, social } = CONFIG;
  return {
    telefono: contact.phoneDisplay,
    email: contact.email,
    horario: schedule.weekdays,
    direccion: direccion(),
    comuna: contact.address.commune,
    ciudad: contact.address.city,
    region: contact.address.regionCode,
    lat: contact.geo.lat,
    lng: contact.geo.lng,
    whatsapp: social.whatsapp,
    facebook: social.facebook,
    instagram: social.instagram,
    linkedin: social.linkedin,
  };
}

// Texto y link de cada marca data-contact="…"
export function datoContacto(tipo) {
  switch (tipo) {
    case "address":
      return {
        texto: direccion(),
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion() + ", Chile")}`,
      };
    case "email":
      return { texto: CONFIG.contact.email, href: `mailto:${CONFIG.contact.email}` };
    case "phone":
      return { texto: CONFIG.contact.phoneDisplay, href: `tel:${CONFIG.contact.phone}` };
    case "schedule":
      return { texto: CONFIG.schedule.weekdays };
    case "copyright":
      return {
        texto: `© ${CONFIG.company.year} ${CONFIG.company.name}. Todos los derechos reservados | Diseñado por ${CONFIG.company.designer}`,
      };
    default:
      return null;
  }
}

// Link de cada marca data-social="facebook | instagram | linkedin | whatsapp"
export function urlSocial(red) {
  return red === "whatsapp" ? whatsappUrl() : CONFIG.social[red] || null;
}

// Completa teléfono, correo, horario y redes en un objeto JSON-LD (lo usa también el build)
export function completarJsonLd(nodo) {
  if (!nodo || typeof nodo !== "object") return nodo;
  if (Array.isArray(nodo)) {
    nodo.forEach(completarJsonLd);
    return nodo;
  }

  if (nodo["@type"] === "AccountingService") {
    nodo.telephone = CONFIG.contact.phone;
    nodo.email = CONFIG.contact.email;
    // Ficha principal de la empresa (la que tiene dirección): datos completos
    if (nodo.address) {
      const a = CONFIG.contact.address;
      nodo.address = {
        "@type": "PostalAddress",
        streetAddress: a.street,
        addressLocality: a.commune,
        addressRegion: a.region,
        addressCountry: a.country,
      };
      nodo.geo = {
        "@type": "GeoCoordinates",
        latitude: CONFIG.contact.geo.lat,
        longitude: CONFIG.contact.geo.lng,
      };
      nodo.hasMap = datoContacto("address").href;
      const horario = {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: CONFIG.schedule.days,
        opens: CONFIG.schedule.opens,
        closes: CONFIG.schedule.closes,
      };
      nodo.openingHoursSpecification = horario;
      nodo.sameAs = [
        CONFIG.social.facebook,
        CONFIG.social.instagram,
        CONFIG.social.linkedin,
      ];
      if (nodo.contactPoint) {
        nodo.contactPoint.telephone = CONFIG.contact.phone;
        nodo.contactPoint.email = CONFIG.contact.email;
        nodo.contactPoint.hoursAvailable = horario;
      }
    }
  }
  Object.values(nodo).forEach(completarJsonLd);
  return nodo;
}

// Rellena los elementos marcados en el HTML. Así ningún dato de contacto queda escrito en duro:
//   data-contact="email | phone | address | schedule | copyright" → texto (y href si es un <a>)
//   data-whatsapp="Mensaje opcional"                    → href de WhatsApp con ese mensaje
//   data-social="facebook | instagram | linkedin | whatsapp" → href de la red social
//   data-copy-contact="email | phone"                   → valor que copia un botón "Copiar"
export function applyContactData(root = document) {
  root.querySelectorAll("[data-contact]").forEach((el) => {
    const dato = datoContacto(el.dataset.contact);
    if (!dato) return;
    el.textContent = dato.texto;
    if (el.tagName === "A" && dato.href) el.href = dato.href;
  });

  const enlazar = (el, url) => {
    if (!url) return;
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  };
  root.querySelectorAll("[data-whatsapp]").forEach((el) => enlazar(el, whatsappUrl(el.dataset.whatsapp)));
  root.querySelectorAll("[data-social]").forEach((el) => enlazar(el, urlSocial(el.dataset.social)));

  root.querySelectorAll("[data-copy-contact]").forEach((el) => {
    el.dataset.copy =
      el.dataset.copyContact === "email"
        ? CONFIG.contact.email
        : CONFIG.contact.phone;
  });
}

// Completa los JSON-LD de la página (por si se abre el HTML sin pasar por el build)
export function applyStructuredData() {
  document
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((script) => {
      try {
        const datos = completarJsonLd(JSON.parse(script.textContent));
        script.textContent = JSON.stringify(datos);
      } catch (error) {
        console.error("❌ JSON-LD inválido:", error);
      }
    });
}

// Nombre histórico: lo llama main-modular.js
export function initializeSocialLinks() {
  applyContactData();
}

// Ejecutar cuando el DOM esté listo (solo en el navegador; el build importa este archivo en Node)
if (typeof document !== "undefined") {
  const init = () => {
    applyContactData();
    applyStructuredData();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
