/* ==========================================
   Navigation Module - Navbar functionality
   ========================================== */

function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  // Scroll: agrega clase scrolled + maneja aria
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Cierra menú mobile al hacer click en un link
  const navLinks = document.querySelectorAll(".nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const toggler = document.querySelector(".navbar-toggler");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navbarCollapse?.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
        toggler?.setAttribute("aria-expanded", "false");
        toggler?.setAttribute("aria-label", "Abrir menú de navegación");
      }
    });
  });

  // Sincroniza aria-expanded del toggler con Bootstrap
  if (navbarCollapse) {
    navbarCollapse.addEventListener("show.bs.collapse", () => {
      toggler?.setAttribute("aria-expanded", "true");
      toggler?.setAttribute("aria-label", "Cerrar menú de navegación");
    });

    navbarCollapse.addEventListener("hide.bs.collapse", () => {
      toggler?.setAttribute("aria-expanded", "false");
      toggler?.setAttribute("aria-label", "Abrir menú de navegación");
    });
  }

  // aria-current dinámico según sección visible en viewport
  const sections = document.querySelectorAll("main section[id]");

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove("active");
              link.removeAttribute("aria-current");

              if (link.getAttribute("href") === `#${entry.target.id}`) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
              }
            });
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
  }
}

export { initNavbar };
