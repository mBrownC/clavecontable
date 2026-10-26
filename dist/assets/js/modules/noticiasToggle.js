/* ==========================================
   Noticias Toggle Module - Ver más noticias
   ========================================== */

function initNoticiasToggle() {
  const btnVerMas = document.getElementById("btn-ver-mas-noticias");
  const noticiasOcultas = document.querySelectorAll(".news-item-hidden");

  if (!btnVerMas) return;

  let expanded = false;

  btnVerMas.addEventListener("click", function () {
    expanded = !expanded;

    noticiasOcultas.forEach((noticia) => {
      if (expanded) {
        noticia.classList.add("show");
      } else {
        noticia.classList.remove("show");
      }
    });

    // Cambiar texto del botón
    if (expanded) {
      btnVerMas.innerHTML = 'Ver menos <i class="fas fa-chevron-up ms-2"></i>';
      btnVerMas.classList.add("active");
    } else {
      btnVerMas.innerHTML =
        'Ver más noticias <i class="fas fa-chevron-down ms-2"></i>';
      btnVerMas.classList.remove("active");

      // Scroll suave a la sección de noticias
      document.getElementById("noticias").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

export { initNoticiasToggle };
