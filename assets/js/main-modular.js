/* ==========================================
   ClaveContable - Main JavaScript (Modular)
   ========================================== */

"use strict";

import { initNavbar } from "./modules/navigation.js";
import { initAnimations } from "./modules/animations.js";
import { initSwiper } from "./modules/swiperConfig.js";
import { initFormValidation } from "./modules/formValidation.js";
import { initSmoothScroll } from "./modules/smoothScroll.js";
import { initServiceFilters } from "./modules/serviceFilters.js";
import { initNoticiasToggle } from "./modules/noticiasToggle.js";
import { initContactForm } from "./modules/contactForm.js";
import { initializeSocialLinks } from "./config.js";

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

  // Llegadas desde otras páginas (ej. /#cotizar-tienda-online)
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

// El servicio va en el ancla (#cotizar-<servicio>) y no en "?servicio=", porque Google
// ignora lo que va después del # y así no indexa URLs duplicadas del home.
// Se mantiene ?servicio= por compatibilidad con links antiguos.
function handleIncomingLink() {
  let hash = window.location.hash;
  let servicio = new URLSearchParams(window.location.search).get("servicio");

  if (hash.startsWith("#cotizar-")) {
    servicio = hash.slice("#cotizar-".length);
    hash = "#contacto";
  }
  selectServicio(servicio);

  const target = hash && document.querySelector(hash);
  if (!target) return;

  // Se espera al evento load: si se hace antes, el navegador cancela el scroll al terminar de cargar
  const ir = () => {
    const navbar = document.querySelector(".navbar");
    const offset = navbar ? navbar.offsetHeight : 0;
    window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
  };
  if (document.readyState === "complete") ir();
  else window.addEventListener("load", ir, { once: true });
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
