document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".c-suscription .c-form");
  if (!form) return;

  const emailInput = form.querySelector("#email");
  const submitBtn = form.querySelector('button[type="submit"]');
  const emailLabel = emailInput ? emailInput.closest(".c-form__label") : null;

  if (!emailInput || !submitBtn) return;

  let isSubmitting = false;

  // Mensajes de éxito y error ya presentes en el HTML
  const successMessage = form.querySelector(".c-form__success-message");
  const errorMessage = form.querySelector(".c-form__error-message");

  // Crear elemento de validación de error si no existe
  let validationError = form.querySelector(".c-form__validation-error");
  if (!validationError && emailLabel) {
    validationError = document.createElement("span");
    validationError.className = "c-form__validation-error";
    validationError.setAttribute("role", "alert");
    validationError.setAttribute("aria-live", "polite");
    emailLabel.parentNode.insertBefore(validationError, emailLabel.nextSibling);
  }

  function setErrorState(hasError, message = "") {
    if (!emailLabel) return;
    emailLabel.classList.toggle("c-form__label--error", hasError);

    if (validationError) {
      validationError.textContent = message;
      validationError.classList.toggle(
        "c-form__validation-error--visible",
        hasError && message
      );
    }
  }

  function showSuccess() {
    if (successMessage) {
      successMessage.style.display = "block";
    }
    if (errorMessage) {
      errorMessage.style.display = "none";
    }
    emailInput.value = "";

    setTimeout(() => {
      if (successMessage) {
        successMessage.style.display = "none";
      }
    }, 5000);
  }

  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
    }
    if (successMessage) {
      successMessage.style.display = "none";
    }
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }

  async function submitForm(email) {
    const url = ""; //agregar link marcos

    const payload = { email: email.trim() };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorData = await response.json();
        errorDetails =
          errorData.message || errorData.error || "Error del servidor";
      } catch (e) {
        const errorText = await response.text();
        errorDetails = errorText || "Error desconocido";
      }
      throw new Error(`Error ${response.status}: ${errorDetails}`);
    }

    return response.json();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const emailValue = emailInput.value.trim();

    if (!validateEmail(emailValue)) {
      emailInput.focus();
      setErrorState(true, "Ingresá un email válido");
      return;
    } else {
      setErrorState(false);
    }

    try {
      isSubmitting = true;
      await submitForm(emailValue);
      showSuccess();
    } catch (error) {
      console.error(error);
      showError("Error al enviar el formulario. Intentalo de nuevo más tarde.");
    } finally {
      isSubmitting = false;
    }
  }

  form.addEventListener("submit", handleSubmit);

  // Limpiar error cuando el email se vuelve válido
  emailInput.addEventListener("input", () => {
    if (validateEmail(emailInput.value)) {
      setErrorState(false);
      if (errorMessage) {
        errorMessage.style.display = "none";
      }
    }
  });
});
