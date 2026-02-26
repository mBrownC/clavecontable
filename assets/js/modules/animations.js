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

    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%", // Empieza antes (era 85%)
          toggleActions: "play none none none",
        },
        y: 30, // Menos movimiento (era 50)
        opacity: 0,
        duration: 0.4, // Más rápido (era 0.6)
        delay: index * 0.05, // Menos delay entre tarjetas (era 0.1)
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
