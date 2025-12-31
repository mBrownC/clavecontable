/* ==========================================
   Form Validation Module - Mejorado
   ========================================== */

function initFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    const requiredInputs = form.querySelectorAll(
      "input[required], textarea[required], select[required]"
    );

    // Deshabilitar botón inicialmente
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    // Validar en tiempo real
    function checkFormValidity() {
      let isValid = true;

      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
        } else if (input.type === "email" && !isValidEmail(input.value)) {
          isValid = false;
        } else if (
          input.type === "tel" &&
          input.value &&
          !isValidPhone(input.value)
        ) {
          isValid = false;
        }
      });

      if (submitBtn) {
        submitBtn.disabled = !isValid;
      }
    }

    // Validar en cada cambio
    requiredInputs.forEach((input) => {
      input.addEventListener("input", checkFormValidity);
      input.addEventListener("blur", function () {
        validateInput(this);
      });
    });

    // NO interferir con EmailJS - solo validar
    form.addEventListener("submit", function (event) {
      if (!validateForm(this)) {
        event.preventDefault();
      }
      // Si es válido, dejar que EmailJS lo maneje
    });
  });
}

function validateInput(input) {
  const existingError = input.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
  input.classList.remove("is-invalid");

  if (!input.value.trim()) {
    showError(input, "Este campo es requerido");
    return false;
  } else if (input.type === "email" && !isValidEmail(input.value)) {
    showError(input, "Email inválido");
    return false;
  } else if (
    input.type === "tel" &&
    input.value &&
    !isValidPhone(input.value)
  ) {
    showError(input, "Teléfono inválido (ej: +56 9 1234 5678)");
    return false;
  }

  return true;
}

function validateForm(form) {
  const inputs = form.querySelectorAll(
    "input[required], textarea[required], select[required]"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!validateInput(input)) {
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

export { initFormValidation };
