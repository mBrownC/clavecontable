/* ==========================================
   EmailJS Contact Form Handler
   ========================================== */

// ============================================
// 🔥 CONFIGURACIÓN EMAILJS - CAMBIAR AQUÍ 🔥
// ============================================
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_y8ca8tb",
  TEMPLATE_ID: "template_cyt7pw7",
  PUBLIC_KEY: "ZAMDfEcte5Y4ld38a",
  DEBUG: false,
};

function log(mensaje, data = null) {
  if (EMAILJS_CONFIG.DEBUG) {
    console.log(`[EmailJS] ${mensaje}`, data || "");
  }
}

function initContactForm() {
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
  script.onload = function () {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    setupForm();
  };
  document.head.appendChild(script);
}

function setupForm() {
  const form = document.getElementById("contactForm");

  if (!form) {
    console.error("[EmailJS] ❌ Formulario NO encontrado!");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;

    const now = new Date();
    const fechaHora = now.toLocaleString("es-CL", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Santiago",
    });

    let timeInput = form.querySelector('input[name="time"]');
    if (!timeInput) {
      timeInput = document.createElement("input");
      timeInput.type = "hidden";
      timeInput.name = "time";
      form.appendChild(timeInput);
    }
    timeInput.value = fechaHora;

    emailjs
      .sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form)
      .then(
        function (response) {
          setTimeout(() => {
            window.location.href = "/components/gracias.html";
          }, 1000);
        },
        function (error) {
          console.error("[EmailJS] ❌ Error al enviar:", error);

          // Mostrar mensaje de error
          mostrarMensaje(
            "Error al enviar. Por favor intenta de nuevo.",
            "error"
          );

          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      );
  });
}

function mostrarMensaje(texto, tipo) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${tipo}`;
  alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 20px 30px;
        background: ${tipo === "success" ? "#00CED1" : "#ff4444"};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-size: 16px;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
  alert.textContent = texto;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.style.animation = "slideOut 0.3s ease";
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}

const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

export { initContactForm };
