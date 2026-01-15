document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".c-registration-form .c-form");
  if (!form) return;

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const phoneInput = form.querySelector("#phone-num");
  const phoneHiddenInput = form.querySelector('input[name="phone-num-final"]');
  const contactMethodInput = form.querySelector("#primary-contact-method");
  const contactMethodHiddenInput = form.querySelector('input[name="primary-contact-method-final"]');
  const messageInput = form.querySelector('textarea[name="mensaje"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!nameInput || !emailInput || !submitBtn) return;

  let isSubmitting = false;

  // Crear mensajes de éxito y error si no existen
  let successMessage = form.querySelector(".c-form__success-message");
  let errorMessage = form.querySelector(".c-form__error-message");

  if (!successMessage) {
    successMessage = document.createElement("div");
    successMessage.className = "c-form__success-message";
    successMessage.style.display = "none";
    successMessage.style.padding = "15px";
    successMessage.style.marginTop = "20px";
    successMessage.style.backgroundColor = "#d4edda";
    successMessage.style.color = "#155724";
    successMessage.style.border = "1px solid #c3e6cb";
    successMessage.style.borderRadius = "4px";
    successMessage.textContent = "¡Gracias! Tu solicitud ha sido enviada exitosamente. Te contactaremos pronto.";
    form.appendChild(successMessage);
  }

  if (!errorMessage) {
    errorMessage = document.createElement("div");
    errorMessage.className = "c-form__error-message";
    errorMessage.style.display = "none";
    errorMessage.style.padding = "15px";
    errorMessage.style.marginTop = "20px";
    errorMessage.style.backgroundColor = "#f8d7da";
    errorMessage.style.color = "#721c24";
    errorMessage.style.border = "1px solid #f5c6cb";
    errorMessage.style.borderRadius = "4px";
    form.appendChild(errorMessage);
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }

  function showSuccess() {
    if (successMessage) {
      successMessage.style.display = "block";
    }
    if (errorMessage) {
      errorMessage.style.display = "none";
    }

    // Limpiar formulario
    nameInput.value = "";
    emailInput.value = "";
    if (phoneInput) phoneInput.value = "";
    if (phoneHiddenInput) phoneHiddenInput.value = "";
    if (contactMethodInput) contactMethodInput.value = "";
    if (contactMethodHiddenInput) contactMethodHiddenInput.value = "";
    if (messageInput) messageInput.value = "";

    // Scroll suave al mensaje de éxito
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      if (successMessage) {
        successMessage.style.display = "none";
      }
    }, 8000);
  }

  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
    }
    if (successMessage) {
      successMessage.style.display = "none";
    }

    // Scroll suave al mensaje de error
    errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Obtener el template de email desde el servidor
  async function getEmailTemplate() {
    try {
      const response = await fetch("assets/email-templates/registro.html");
      if (!response.ok) {
        throw new Error("No se pudo cargar el template");
      }
      return await response.text();
    } catch (error) {
      console.error("Error cargando template:", error);
      // Template de respaldo si no se puede cargar el archivo
      return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<h1>¡Gracias por Registrarte, {{name}}!</h1>
<p>Bienvenido al Programa de Afiliados de Betamina.</p>
<h2>Datos de tu Solicitud:</h2>
<ul>
  <li><strong>Nombre:</strong> {{name}}</li>
  <li><strong>Email:</strong> {{email}}</li>
  <li><strong>Teléfono:</strong> {{phone}}</li>
  <li><strong>Contacto preferido:</strong> {{contact_method}}</li>
</ul>
<p>Nuestro equipo te contactará pronto.</p>
<p>Saludos,<br>Equipo Betamina</p>
</body>
</html>`;
    }
  }

  async function submitForm(data) {
    const url = "https://l5j6mnkgyvi3pvrcqzhenb5fc40rwipi.lambda-url.us-east-1.on.aws/";

    // Obtener el template
    const htmlTemplate = await getEmailTemplate();

    const payload = {
      from: "Betamina",
      to: ["juan.larrosa@solcre.com"],
      subject: "¡Bienvenido al Programa de Afiliados de Betamina!",
      html_body: htmlTemplate,
      variables: {
        name: data.name,
        email: data.email,
        phone: data.phone || "No proporcionado",
        contact_method: data.contact_method || "Email",
        message: data.message || ""
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

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Validaciones
    if (!name) {
      nameInput.focus();
      showError("Por favor, ingresá tu nombre completo");
      return;
    }

    if (!validateEmail(email)) {
      emailInput.focus();
      showError("Por favor, ingresá un email válido");
      return;
    }

    // Obtener valores de teléfono y método de contacto
    const phone = phoneHiddenInput ? phoneHiddenInput.value : (phoneInput ? phoneInput.value : "");
    const contactMethod = contactMethodHiddenInput ? contactMethodHiddenInput.value : (contactMethodInput ? contactMethodInput.value : "");
    const message = messageInput ? messageInput.value.trim() : "";

    const formData = {
      name,
      email,
      phone,
      contact_method: contactMethod || "Email",
      message
    };

    try {
      isSubmitting = true;
      submitBtn.textContent = "Enviando...";
      submitBtn.disabled = true;

      await submitForm(formData);
      showSuccess();
    } catch (error) {
      console.error(error);
      showError(
        "Error al enviar el formulario. Por favor, intentalo de nuevo más tarde."
      );
    } finally {
      isSubmitting = false;
      submitBtn.textContent = "Enviar Solicitud";
      submitBtn.disabled = false;
    }
  }

  form.addEventListener("submit", handleSubmit);

  // Limpiar errores cuando el usuario empiece a escribir
  [nameInput, emailInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        if (errorMessage && errorMessage.style.display !== "none") {
          errorMessage.style.display = "none";
        }
      });
    }
  });
});
