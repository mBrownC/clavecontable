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

// Component Loader
async function loadComponent(containerId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok)
      throw new Error(`Error loading ${componentPath}: ${response.status}`);
    const html = await response.text();
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    } else {
      console.error(`❌ Container no encontrado: ${containerId}`);
    }
  } catch (error) {
    console.error(`❌ Error cargando ${componentPath}:`, error);
  }
}

// Load all components
async function loadAllComponents() {
  await Promise.all([
    loadComponent("navbar-container", "components/navbar.html"),
    loadComponent("hero-container", "components/hero-section.html"),
    loadComponent("nosotros-container", "components/nosotros-section.html"),
    loadComponent(
      "vision-mision-container",
      "components/vision-mision-section.html",
    ),
    loadComponent("noticias-container", "components/noticias-section.html"),
    loadComponent("servicios-container", "components/servicios-section.html"),
    loadComponent("auditoria-container", "components/auditoria-section.html"),
    loadComponent(
      "servicios-detallados-container",
      "components/servicios-detallados.html",
    ),
    loadComponent("planes-container", "components/planes-section.html"),
    loadComponent("clientes-container", "components/clientes-section.html"),
    loadComponent("tecnologia-container", "components/tecnologia-section.html"),
    loadComponent("contacto-container", "components/contact-section.html"),
    loadComponent("footer-container", "components/footer.html"),
  ]);
}

// Document Ready
document.addEventListener("DOMContentLoaded", async function () {
  // Load components first
  await loadAllComponents();

  // Esperar a que los componentes se renderizen completamente
  setTimeout(() => {
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
  }, 300);
});

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
