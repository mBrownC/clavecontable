/* ==========================================
   EmailJS Contact Form Handler + Cloudflare Turnstile
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

// ============================================
// 🔐 VARIABLE GLOBAL PARA TOKEN DE TURNSTILE
// ============================================
let turnstileToken = null;

function log(mensaje, data = null) {
  if (EMAILJS_CONFIG.DEBUG) {
    console.log(`[EmailJS] ${mensaje}`, data || "");
  }
}

// ============================================
// 🔐 CALLBACKS DE CLOUDFLARE TURNSTILE
// ============================================
window.onTurnstileSuccess = function (token) {
  turnstileToken = token;
  const submitBtn = document.getElementById("submitBtn");
  const statusDiv = document.getElementById("turnstileStatus");

  if (submitBtn) {
    submitBtn.disabled = false;
  }

  if (statusDiv) {
    statusDiv.className = "turnstile-status verified";
    statusDiv.innerHTML =
      '<i class="fas fa-check-circle"></i>Verificación exitosa';
  }

  console.log("✅ Turnstile verificado exitosamente");
};

window.onTurnstileError = function () {
  turnstileToken = null;
  const submitBtn = document.getElementById("submitBtn");
  const statusDiv = document.getElementById("turnstileStatus");

  if (submitBtn) {
    submitBtn.disabled = true;
  }

  if (statusDiv) {
    statusDiv.className = "turnstile-status error";
    statusDiv.innerHTML =
      '<i class="fas fa-exclamation-circle"></i>Error en la verificación. Por favor recarga la página.';
  }

  console.error("❌ Error en Turnstile");
};

window.onTurnstileExpired = function () {
  turnstileToken = null;
  const submitBtn = document.getElementById("submitBtn");
  const statusDiv = document.getElementById("turnstileStatus");

  if (submitBtn) {
    submitBtn.disabled = true;
  }

  if (statusDiv) {
    statusDiv.className = "turnstile-status error";
    statusDiv.innerHTML =
      '<i class="fas fa-clock"></i>Verificación expirada. Por favor complete nuevamente.';
  }

  console.warn("⏰ Token de Turnstile expirado");

  // Resetear el widget automáticamente
  if (typeof turnstile !== "undefined") {
    turnstile.reset();
  }
};

// ============================================
// 🔐 CARGAR SCRIPT DE TURNSTILE
// ============================================
function loadTurnstileScript() {
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  console.log("🔐 Script de Turnstile cargado");
}

function initContactForm() {
  // 🔐 Cargar Turnstile primero
  loadTurnstileScript();

  // Cargar EmailJS
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

  // 🔐 Deshabilitar botón por defecto hasta que se complete Turnstile
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 🔐 VALIDAR QUE TURNSTILE ESTÉ COMPLETADO
    if (!turnstileToken) {
      const statusDiv = document.getElementById("turnstileStatus");
      if (statusDiv) {
        statusDiv.className = "turnstile-status error";
        statusDiv.innerHTML =
          '<i class="fas fa-exclamation-triangle"></i>Por favor complete la verificación de seguridad.';
      }

      mostrarMensaje(
        "⚠️ Por favor complete la verificación de seguridad antes de enviar.",
        "error",
      );
      return;
    }

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

    // 🔐 AGREGAR TOKEN DE TURNSTILE AL FORMULARIO (opcional para logging)
    let turnstileInput = form.querySelector('input[name="turnstile_token"]');
    if (!turnstileInput) {
      turnstileInput = document.createElement("input");
      turnstileInput.type = "hidden";
      turnstileInput.name = "turnstile_token";
      form.appendChild(turnstileInput);
    }
    turnstileInput.value = turnstileToken.substring(0, 20) + "..."; // Solo los primeros caracteres para el log

    emailjs
      .sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form)
      .then(
        function (response) {
          console.log("✅ Email enviado exitosamente:", response);

          // Resetear Turnstile después del envío exitoso
          if (typeof turnstile !== "undefined") {
            turnstile.reset();
          }
          turnstileToken = null;

          setTimeout(() => {
            window.location.href = "/components/gracias.html";
          }, 1000);
        },
        function (error) {
          console.error("[EmailJS] ❌ Error al enviar:", error);

          // Mostrar mensaje de error
          mostrarMensaje(
            "❌ Error al enviar. Por favor intenta de nuevo.",
            "error",
          );

          submitBtn.textContent = originalText;
          submitBtn.disabled = false;

          // Resetear Turnstile en caso de error
          if (typeof turnstile !== "undefined") {
            turnstile.reset();
          }
          turnstileToken = null;

          const statusDiv = document.getElementById("turnstileStatus");
          if (statusDiv) {
            statusDiv.className = "turnstile-status";
            statusDiv.innerHTML = "";
          }
        },
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
