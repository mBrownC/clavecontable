/* ==========================================
   ClaveContable - Main JavaScript
   ========================================== */

"use strict";

/* === Document Ready === */
document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initAnimations();
  initSwiper();
  initFormValidation();
  initSmoothScroll();
  initServiceFilters();
});

/* === Navbar Scroll Effect === */
function initNavbar() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Close mobile menu on link click
  const navLinks = document.querySelectorAll(".nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    });
  });
}

/* === GSAP Animations === */
function initAnimations() {
  // Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error("GSAP no está cargado");
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // SIN ANIMACIONES EN EL HERO - Todo visible desde el inicio

  // Animate cards on scroll
  if (typeof ScrollTrigger !== "undefined") {
    const cards = document.querySelectorAll(".card, .pricing-card");

    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out",
      });
    });
  } else {
    const cards = document.querySelectorAll(".card, .pricing-card");
    cards.forEach((card) => {
      card.style.opacity = "1";
    });
  }
}

/* === Swiper Configuration === */
function initSwiper() {
  // Swiper for testimonials (if needed)
  const testimonialsSwiper = new Swiper(".testimonials-swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });

  // Swiper for services (if needed)
  const servicesSwiper = new Swiper(".services-swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
}

/* === Form Validation === */
function initFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateForm(this)) {
        submitForm(this);
      }
    });
  });
}

function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    // Remove previous error messages
    const existingError = input.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }
    input.classList.remove("is-invalid");

    // Validate
    if (!input.value.trim()) {
      showError(input, "Este campo es requerido");
      isValid = false;
    } else if (input.type === "email" && !isValidEmail(input.value)) {
      showError(input, "Por favor ingrese un email válido");
      isValid = false;
    } else if (input.type === "tel" && !isValidPhone(input.value)) {
      showError(input, "Por favor ingrese un teléfono válido");
      isValid = false;
    }
  });

  return isValid;
}

function showError(input, message) {
  input.classList.add("is-invalid");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message text-danger small mt-1";
  errorDiv.textContent = message;
  input.parentElement.appendChild(errorDiv);
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  const regex = /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/;
  return regex.test(phone.replace(/\s/g, ""));
}

function submitForm(form) {
  // Get form data
  const formData = new FormData(form);

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  // Simulate form submission (replace with actual endpoint)
  setTimeout(() => {
    // Success
    showSuccessMessage(form);
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    // In production, use:
    // fetch('your-endpoint.php', {
    //     method: 'POST',
    //     body: formData
    // })
    // .then(response => response.json())
    // .then(data => {
    //     showSuccessMessage(form);
    //     form.reset();
    // })
    // .catch(error => {
    //     showErrorMessage(form, 'Error al enviar el formulario');
    // })
    // .finally(() => {
    //     submitBtn.disabled = false;
    //     submitBtn.textContent = originalText;
    // });
  }, 1500);
}

function showSuccessMessage(form) {
  const alert = document.createElement("div");
  alert.className = "alert alert-success alert-dismissible fade show mt-3";
  alert.innerHTML = `
        <strong>Mensaje enviado!</strong> Nos contactaremos contigo pronto.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  form.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}

function showErrorMessage(form, message) {
  const alert = document.createElement("div");
  alert.className = "alert alert-danger alert-dismissible fade show mt-3";
  alert.innerHTML = `
        <strong>Error!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  form.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}

/* === Smooth Scroll === */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#") return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/* === Lazy Loading Images === */
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

/* === Counter Animation === */
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

/* === Utility Functions === */

// Detect mobile device
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Debounce function
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

// Throttle function
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

/* === Performance Optimizations === */

// Optimize scroll events
const optimizedScroll = throttle(function () {
  // Your scroll logic here
}, 100);

window.addEventListener("scroll", optimizedScroll);

// Optimize resize events
const optimizedResize = debounce(function () {
  // Your resize logic here
}, 250);

window.addEventListener("resize", optimizedResize);

/* === Console Warning === */
console.log("%c¡Detente!", "color: red; font-size: 50px; font-weight: bold;");
console.log(
  "%cEsta función del navegador está destinada para desarrolladores.",
  "font-size: 16px;"
);
console.log(
  "%cSi alguien te dijo que copiaras y pegaras algo aquí, es un fraude.",
  "font-size: 16px;"
);

/* === Service Filters === */
function initServiceFilters() {
  const serviceCards = document.querySelectorAll(".card-clickable");
  const filterButtons = document.querySelectorAll(".btn-filter");
  const serviciosDetallados = document.getElementById("servicios-detallados");
  const servicioItems = document.querySelectorAll(".servicio-item");

  // Click en tarjetas principales para mostrar servicios filtrados
  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      serviciosDetallados.style.display = "block";

      // Scroll suave a la sección de servicios detallados
      serviciosDetallados.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Aplicar filtro
      filterServices(filter);

      // Activar botón correspondiente
      filterButtons.forEach((btn) => {
        if (btn.getAttribute("data-filter") === filter) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    });
  });

  // Click en botones de filtro
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Remover clase active de todos
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Agregar clase active al botón clickeado
      this.classList.add("active");

      // Filtrar servicios
      filterServices(filter);
    });
  });

  function filterServices(filter) {
    servicioItems.forEach((item) => {
      const categoria = item.getAttribute("data-categoria");

      if (filter === "todos") {
        item.classList.remove("hidden");
        // Animación de entrada
        gsap.from(item, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
        });
      } else if (categoria === filter) {
        item.classList.remove("hidden");
        // Animación de entrada
        gsap.from(item, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        item.classList.add("hidden");
      }
    });
  }
}
