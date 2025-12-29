/* ==========================================
   Form Validation Module
   ========================================== */

function initFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateForm(this)) {
        submitForm(this);
      }
    });
  });
}

function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    const existingError = input.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }
    input.classList.remove("is-invalid");

    if (!input.value.trim()) {
      showError(input, "Este campo es requerido");
      isValid = false;
    } else if (input.type === "email" && !isValidEmail(input.value)) {
      showError(input, "Por favor ingrese un email válido");
      isValid = false;
    } else if (input.type === "tel" && !isValidPhone(input.value)) {
      showError(input, "Por favor ingrese un teléfono válido");
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

function submitForm(form) {
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  setTimeout(() => {
    showSuccessMessage(form);
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }, 1500);
}

function showSuccessMessage(form) {
  const alert = document.createElement("div");
  alert.className = "alert alert-success alert-dismissible fade show mt-3";
  alert.innerHTML = `
        <strong>Mensaje enviado!</strong> Nos contactaremos contigo pronto.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  form.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}

export { initFormValidation };
