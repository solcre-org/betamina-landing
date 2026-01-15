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

  // Template embebido
  function getEmailTemplate() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Gracias por Suscribirte!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #0022ff; font-size: 24px; margin: 0 0 20px 0;">¡Gracias por Suscribirte!</h2>
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hola <strong>{{email}}</strong>,</p>
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Estás <strong>cada vez más cerca</strong> de formar parte del programa de afiliados de iGaming con mayor crecimiento en LATAM.</p>
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Te mantendremos informado sobre nuestro lanzamiento oficial y las novedades del programa.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9ff; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">© 2026 Betamina - Programa de Afiliados</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  async function submitForm(email) {
    const url = "https://l5j6mnkgyvi3pvrcqzhenb5fc40rwipi.lambda-url.us-east-1.on.aws/";

    // Obtener el template
    const htmlTemplate = getEmailTemplate();

    const payload = {
      from: "Betamina",
      to: ["juan.larrosa@solcre.com"],
      subject: "¡Bienvenido a Betamina! - Gracias por Suscribirte",
      html_body: htmlTemplate,
      variables: {
        email: email.trim()
      }
    };

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
