/* ==========================================
   Service Filters Module
   ========================================== */

function initServiceFilters() {
  const serviceCards = document.querySelectorAll(".card-clickable");
  const filterButtons = document.querySelectorAll(".btn-filter");
  const serviciosDetallados = document.getElementById("servicios-detallados");
  const servicioItems = document.querySelectorAll(".servicio-item");

  if (!serviciosDetallados) return;

  // Click en tarjetas principales
  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      serviciosDetallados.style.display = "block";

      serviciosDetallados.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      filterServices(filter);

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

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      filterServices(filter);
    });
  });

  function filterServices(filter) {
    servicioItems.forEach((item) => {
      const categoria = item.getAttribute("data-categoria");

      if (filter === "todos") {
        item.classList.remove("hidden");
        if (typeof gsap !== "undefined") {
          gsap.from(item, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      } else if (categoria === filter) {
        item.classList.remove("hidden");
        if (typeof gsap !== "undefined") {
          gsap.from(item, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      } else {
        item.classList.add("hidden");
      }
    });
  }
}

export { initServiceFilters };
