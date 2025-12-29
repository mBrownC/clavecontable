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
      ".card, .pricing-card, .news-card-full, .stats-box"
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
      ".card, .pricing-card, .news-card-full, .stats-box"
    );
    cards.forEach((card) => {
      card.style.opacity = "1";
    });
  }
}

export { initAnimations };
