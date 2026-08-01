/* ==========================================
   Animations Module - GSAP Animations
   ========================================== */

function initAnimations() {
  if (typeof gsap === "undefined") {
    console.warn("GSAP no está cargado");
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Animate cards on scroll - MÁS RÁPIDO
  if (typeof ScrollTrigger !== "undefined") {
    const cards = document.querySelectorAll(
      ".card, .pricing-card, .news-card-full, .stats-box",
    );

    cards.forEach((card) => {
      // Delay pequeño y acotado según la posición dentro de su propia fila,
      // no según la posición en toda la página (eso hacía que las secciones
      // más abajo, como Planes o Clientes, tardaran mucho en aparecer).
      const siblings = card.parentElement
        ? Array.from(card.parentElement.children)
        : [card];
      const localIndex = siblings.indexOf(card);

      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.3,
        delay: Math.min(localIndex, 4) * 0.06,
        ease: "power2.out",
      });
    });
  } else {
    // Fallback si no hay ScrollTrigger
    const cards = document.querySelectorAll(
      ".card, .pricing-card, .news-card-full, .stats-box",
    );
    cards.forEach((card) => {
      card.style.opacity = "1";
    });
  }

  // Animación de contadores numéricos en stats-box
  if (typeof ScrollTrigger !== "undefined") {
    const counters = document.querySelectorAll(".stats-box h3");

    counters.forEach((el) => {
      // Extraer número final y sufijo ("500+" → target=500, suffix="+")
      const rawText = el.innerText.trim();
      const suffix = rawText.replace(/[0-9]/g, "");
      const target = parseInt(rawText.replace(/\D/g, ""), 10);

      if (isNaN(target)) return;

      el.innerText = "0" + suffix;

      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: function () {
          el.innerText = Math.ceil(obj.val) + suffix;
        },
      });
    });
  }
}

export { initAnimations };
