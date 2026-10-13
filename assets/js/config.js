// Configuración centralizada de redes sociales y contacto - ClaveContable
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
  },

  // Horarios
  schedule: {
    weekdays: "Lunes a Viernes: 9:00 - 18:00",
    // saturday: "Sábados: 10:00 - 14:00",
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

// Rellena los elementos marcados en el HTML. Así ningún dato de contacto queda escrito en duro:
//   data-contact="email | phone | schedule"  → texto (y href mailto:/tel: si es un <a>)
//   data-whatsapp="Mensaje opcional"        → href de WhatsApp con ese mensaje
//   data-copy-contact="email | phone"        → valor que copia un botón "Copiar"
export function applyContactData(root = document) {
  root.querySelectorAll("[data-contact]").forEach((el) => {
    const tipo = el.dataset.contact;
    if (tipo === "email") {
      el.textContent = CONFIG.contact.email;
      if (el.tagName === "A") el.href = `mailto:${CONFIG.contact.email}`;
    } else if (tipo === "phone") {
      el.textContent = CONFIG.contact.phoneDisplay;
      if (el.tagName === "A") el.href = `tel:${CONFIG.contact.phone}`;
    } else if (tipo === "schedule") {
      el.textContent = CONFIG.schedule.weekdays;
    }
  });

  root.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.href = whatsappUrl(el.dataset.whatsapp);
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  root.querySelectorAll("[data-copy-contact]").forEach((el) => {
    el.dataset.copy =
      el.dataset.copyContact === "email"
        ? CONFIG.contact.email
        : CONFIG.contact.phone;
  });
}

// Completa teléfono, correo, horario y redes en los JSON-LD de la página
export function applyStructuredData() {
  const horario = {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: CONFIG.schedule.days,
    opens: CONFIG.schedule.opens,
    closes: CONFIG.schedule.closes,
  };

  const completar = (nodo) => {
    if (!nodo || typeof nodo !== "object") return;
    if (Array.isArray(nodo)) return nodo.forEach(completar);

    if (nodo["@type"] === "AccountingService") {
      nodo.telephone = CONFIG.contact.phone;
      nodo.email = CONFIG.contact.email;
      // Ficha principal de la empresa (la que tiene dirección): datos completos
      if (nodo.address) {
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
    Object.values(nodo).forEach(completar);
  };

  document
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((script) => {
      try {
        const datos = JSON.parse(script.textContent);
        completar(datos);
        script.textContent = JSON.stringify(datos);
      } catch (error) {
        console.error("❌ JSON-LD inválido:", error);
      }
    });
}

// Función para inicializar los enlaces de redes sociales
export function initializeSocialLinks() {
  applyContactData();

  // Header - Redes sociales
  const headerSocialLinks = document.querySelectorAll(".social-links-top a");
  headerSocialLinks.forEach((link) => {
    const icon = link.querySelector("i");
    if (icon) {
      if (icon.classList.contains("fa-facebook")) {
        link.href = CONFIG.social.facebook;
        link.setAttribute("rel", "noopener noreferrer");
      } else if (icon.classList.contains("fa-instagram")) {
        link.href = CONFIG.social.instagram;
        link.setAttribute("rel", "noopener noreferrer");
      } else if (icon.classList.contains("fa-linkedin")) {
        link.href = CONFIG.social.linkedin;
        link.setAttribute("rel", "noopener noreferrer");
      } else if (icon.classList.contains("fa-envelope")) {
        link.href = `mailto:${CONFIG.contact.email}`;
      }
    }
  });

  // Footer - Redes sociales
  const footerSocialLinks = document.querySelectorAll(
    "footer .social-links a.social-link",
  );
  footerSocialLinks.forEach((link) => {
    const icon = link.querySelector("i");
    if (icon) {
      if (icon.classList.contains("fa-facebook")) {
        link.href = CONFIG.social.facebook;
        link.setAttribute("rel", "noopener noreferrer");
      } else if (icon.classList.contains("fa-instagram")) {
        link.href = CONFIG.social.instagram;
        link.setAttribute("rel", "noopener noreferrer");
      } else if (icon.classList.contains("fa-whatsapp")) {
        link.href = `${CONFIG.social.whatsapp}?text=${CONFIG.social.whatsappMessage}`;
        link.setAttribute("rel", "noopener noreferrer");
      }
    }
  });

  // Sección Contacto - Social Header
  const contactSocialHeader = document.querySelectorAll(
    ".social-header .social-links a.social-link",
  );
  contactSocialHeader.forEach((link) => {
    const icon = link.querySelector("i");
    if (icon) {
      if (icon.classList.contains("fa-facebook")) {
        link.href = CONFIG.social.facebook;
        link.setAttribute("rel", "noopener noreferrer");
      } else if (icon.classList.contains("fa-instagram")) {
        link.href = CONFIG.social.instagram;
        link.setAttribute("rel", "noopener noreferrer");
      } else if (icon.classList.contains("fa-whatsapp")) {
        link.href = `${CONFIG.social.whatsapp}?text=${CONFIG.social.whatsappMessage}`;
        link.setAttribute("rel", "noopener noreferrer");
      }
    }
  });

  // Sección Contacto - Info Items (email y teléfono)
  const infoItems = document.querySelectorAll(".info-item");
  infoItems.forEach((item) => {
    const icon = item.querySelector("i");
    const link = item.querySelector("a");

    if (icon && link) {
      if (icon.classList.contains("fa-envelope")) {
        link.href = `mailto:${CONFIG.contact.email}`;
        link.textContent = CONFIG.contact.email;
      }

      if (icon.classList.contains("fa-phone")) {
        link.href = `tel:${CONFIG.contact.phone}`;
        link.textContent = CONFIG.contact.phoneDisplay;
      }
    }
  });

  // Sección Contacto - Horarios
  const scheduleWeekdays = document.querySelector(".schedule-weekdays");
  if (scheduleWeekdays) {
    scheduleWeekdays.textContent = CONFIG.schedule.weekdays;
  }

  const scheduleSaturday = document.querySelector(".schedule-saturday");
  if (scheduleSaturday) {
    scheduleSaturday.textContent = CONFIG.schedule.saturday;
  }

  // Botón flotante de WhatsApp
  const whatsappFloat = document.querySelector(".whatsapp-float");
  if (whatsappFloat) {
    whatsappFloat.href = `${CONFIG.social.whatsapp}?text=${CONFIG.social.whatsappMessage}`;
    whatsappFloat.setAttribute("rel", "noopener noreferrer");
  }

  // Actualizar emails genéricos
  const emailLinks = document.querySelectorAll('a[href*="mailto"]');
  emailLinks.forEach((link) => {
    if (
      link.textContent.includes("contacto") ||
      link.href.includes("contacto")
    ) {
      link.href = `mailto:${CONFIG.contact.email}`;
      if (link.textContent.includes("@")) {
        link.textContent = CONFIG.contact.email;
      }
    }
  });

  // Actualizar teléfonos genéricos
  const phoneLinks = document.querySelectorAll('a[href*="tel"]');
  phoneLinks.forEach((link) => {
    link.href = `tel:${CONFIG.contact.phone}`;
    if (link.textContent.includes("+56")) {
      link.textContent = CONFIG.contact.phoneDisplay;
    }
  });

  // Copyright en footer
  const copyright = document.querySelector("footer .text-center p.mb-0");
  if (copyright) {
    copyright.innerHTML = `&copy; ${CONFIG.company.year} ${CONFIG.company.name}. Todos los derechos reservados | Diseñado por ${CONFIG.company.designer}`;
  }
}

// Ejecutar cuando el DOM esté listo
// (en el home se vuelve a llamar desde main-modular.js después de cargar los componentes)
function init() {
  initializeSocialLinks();
  applyStructuredData();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
