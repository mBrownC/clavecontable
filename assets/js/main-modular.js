/* ==========================================
   ClaveContable - Main JavaScript (Modular)
   ========================================== */

"use strict";

import { initNavbar } from "./modules/navigation.js?v=0d7f5730dc";
import { initAnimations } from "./modules/animations.js?v=9a1a3d846e";
import { initSwiper } from "./modules/swiperConfig.js?v=d52498db60";
import { initFormValidation } from "./modules/formValidation.js?v=0b34dd4f83";
import { initSmoothScroll } from "./modules/smoothScroll.js?v=0627cacb44";
import { initServiceFilters } from "./modules/serviceFilters.js?v=0e667809d6";
import { initNoticiasToggle } from "./modules/noticiasToggle.js?v=85f98932a1";
import { initContactForm } from "./modules/contactForm.js?v=e15d21d980";
import { initializeSocialLinks } from "./config.js?v=2061172969";

// Document Ready
// El contenido del home ya viene completo en index.html (lo arma scripts/build.py),
// así que los módulos se inicializan apenas el documento está listo.
document.addEventListener("DOMContentLoaded", function () {
  // Initialize modules
  initNavbar();
  initAnimations();
  initSwiper();
  initFormValidation();
  initSmoothScroll();
  initServiceFilters();
  initNoticiasToggle();
  initContactForm();

  // Inicializar enlaces de redes sociales desde config.js
  initializeSocialLinks();

  // Llegadas desde otras páginas (ej. /index.html?servicio=tienda-online#contacto)
  handleIncomingLink();

  // Botones que llevan al formulario con un servicio ya elegido (data-servicio="plan-crea")
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-servicio]");
    if (link) selectServicio(link.dataset.servicio);
  });
});

// Preselecciona el servicio del formulario (?servicio=) y ajusta el scroll al ancla (#seccion)
// descontando la altura del navbar fijo.
function selectServicio(servicio) {
  const select = document.getElementById("servicio");
  if (servicio && select && select.querySelector(`option[value="${CSS.escape(servicio)}"]`)) {
    select.value = servicio;
  }
}

function handleIncomingLink() {
  selectServicio(new URLSearchParams(window.location.search).get("servicio"));

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      const navbar = document.querySelector(".navbar");
      const offset = navbar ? navbar.offsetHeight : 0;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    }
  }
}

// Performance Optimizations
const optimizedScroll = throttle(function () {
  // Scroll logic here
}, 100);

window.addEventListener("scroll", optimizedScroll);

const optimizedResize = debounce(function () {
  // Resize logic here
}, 250);

window.addEventListener("resize", optimizedResize);

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
