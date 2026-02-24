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

// Función para inicializar los enlaces de redes sociales
export function initializeSocialLinks() {
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSocialLinks);
} else {
  initializeSocialLinks();
}
