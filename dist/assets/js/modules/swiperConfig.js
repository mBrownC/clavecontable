/* ==========================================
   Swiper Configuration Module
   ========================================== */

function initSwiper() {
  if (typeof Swiper === "undefined") {
    console.warn("Swiper no está cargado");
    return;
  }

  // News Slider in Hero
  const newsSlider = new Swiper(".news-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });

  // Testimonials Swiper (if needed)
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

  // Services Swiper (if needed)
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

export { initSwiper };
