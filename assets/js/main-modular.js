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

// Component Loader
async function loadComponent(containerId, componentPath) {
  try {
    console.log(`📦 Cargando: ${componentPath}`);
    const response = await fetch(componentPath);
    if (!response.ok)
      throw new Error(`Error loading ${componentPath}: ${response.status}`);
    const html = await response.text();
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
      console.log(`✅ Cargado: ${componentPath}`);
    } else {
      console.error(`❌ Container no encontrado: ${containerId}`);
    }
  } catch (error) {
    console.error(`❌ Error cargando ${componentPath}:`, error);
  }
}

// Load all components
async function loadAllComponents() {
  console.log("🔄 Iniciando carga de componentes...");
  await Promise.all([
    loadComponent("navbar-container", "components/navbar.html"),
    loadComponent("hero-container", "components/hero-section.html"),
    loadComponent("nosotros-container", "components/nosotros-section.html"),
    loadComponent("noticias-container", "components/noticias-section.html"),
    loadComponent("servicios-container", "components/servicios-section.html"),
    loadComponent(
      "servicios-detallados-container",
      "components/servicios-detallados.html"
    ),
    loadComponent("planes-container", "components/planes-section.html"),
    loadComponent("contacto-container", "components/contact-section.html"),
    loadComponent("footer-container", "components/footer.html"),
  ]);
  console.log("✅ Todos los componentes cargados");
}

// Document Ready
document.addEventListener("DOMContentLoaded", async function () {
  console.log("🚀 ClaveContable iniciando...");

  // Load components first
  await loadAllComponents();

  console.log("🔧 Inicializando módulos...");

  // Then initialize modules
  initNavbar();
  console.log("✅ Navbar inicializado");

  initAnimations();
  console.log("✅ Animaciones inicializadas");

  initSwiper();
  console.log("✅ Swiper inicializado");

  initFormValidation();
  console.log("✅ Validación de formularios inicializada");

  initSmoothScroll();
  console.log("✅ Smooth scroll inicializado");

  initServiceFilters();
  console.log("✅ Filtros de servicios inicializados");

  console.log("🎉 ClaveContable initialized successfully");
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

// Console Warning
console.log("%c¡Detente!", "color: red; font-size: 50px; font-weight: bold;");
console.log(
  "%cEsta función del navegador está destinada para desarrolladores.",
  "font-size: 16px;"
);
console.log(
  "%cSi alguien te dijo que copiaras y pegaras algo aquí, es un fraude.",
  "font-size: 16px;"
);
