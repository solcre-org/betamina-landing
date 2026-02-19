document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".c-registration-form .c-form");
  if (!form) return;

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const countryInput = form.querySelector("#country");
  const phoneInput = form.querySelector("#phone-num");
  const phoneHiddenInput = form.querySelector('input[name="phone-num-final"]');
  const contactMethodInput = form.querySelector("#primary-contact-method");
  const contactMethodHiddenInput = form.querySelector('input[name="primary-contact-method-final"]');
  const messageInput = form.querySelector('textarea[name="mensaje"]');
  const trafficSourceCheckboxes = form.querySelectorAll('input[name="traffic-source"]');
  const trafficSourceOtherCheckbox = form.querySelector('.js-traffic-other-checkbox');
  const trafficSourceOtherLabel = form.querySelector('.c-form__label--other');
  const trafficSourceOtherInput = form.querySelector('textarea[name="traffic-source-other"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!nameInput || !emailInput || !submitBtn) return;

  let isSubmitting = false;

  // Traffic Source Dropdown functionality
  const trafficDropdown = form.querySelector('.js-traffic-dropdown');
  const trafficToggle = form.querySelector('.js-traffic-toggle');
  const trafficDisplay = form.querySelector('.js-traffic-display');

  if (trafficDropdown && trafficToggle) {
    // Toggle dropdown
    trafficToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      trafficDropdown.classList.toggle('is-open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!trafficDropdown.contains(e.target)) {
        trafficDropdown.classList.remove('is-open');
      }
    });

    // Update display text when checkboxes change
    function updateTrafficDisplay() {
      const selectedLabels = [];
      trafficSourceCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const label = checkbox.nextElementSibling;
          if (label) {
            selectedLabels.push(label.textContent);
          }
        }
      });

      if (selectedLabels.length > 0) {
        trafficDisplay.textContent = selectedLabels.join(', ');
        trafficDisplay.classList.add('has-selection');
      } else {
        trafficDisplay.textContent = '¿Cómo supiste de Betamina?';
        trafficDisplay.classList.remove('has-selection');
      }
    }

    // Listen to checkbox changes
    trafficSourceCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateTrafficDisplay);
    });
  }

  // Manejar visibilidad del textarea "Otro" en traffic source
  if (trafficSourceOtherCheckbox && trafficSourceOtherLabel) {
    trafficSourceOtherCheckbox.addEventListener('change', function() {
      if (this.checked) {
        trafficSourceOtherLabel.style.display = 'block';
      } else {
        trafficSourceOtherLabel.style.display = 'none';
        if (trafficSourceOtherInput) {
          trafficSourceOtherInput.value = '';
        }
      }
    });
  }

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
    if (countryInput) countryInput.value = "";
    if (phoneInput) phoneInput.value = "";
    if (phoneHiddenInput) phoneHiddenInput.value = "";
    if (contactMethodInput) contactMethodInput.value = "";
    if (contactMethodHiddenInput) contactMethodHiddenInput.value = "";
    if (messageInput) messageInput.value = "";
    if (trafficSourceCheckboxes) {
      trafficSourceCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      if (trafficDisplay) {
        trafficDisplay.textContent = '¿Cómo supiste de Betamina?';
        trafficDisplay.classList.remove('has-selection');
      }
    }
    if (trafficSourceOtherInput) trafficSourceOtherInput.value = "";
    if (trafficSourceOtherLabel) trafficSourceOtherLabel.style.display = "none";

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

  // Template embebido
  function getEmailTemplate() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Gracias por Registrarte!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px;">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0022ff 0%, #0033cc 100%); padding: 40px 20px; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">¡Bienvenido al Programa de Afiliados!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 35px 30px;">
                            <h2 style="color: #0022ff; font-size: 22px; margin: 0 0 20px 0;">Gracias por Registrarte, {{name}}</h2>
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Tu solicitud al <strong>Programa de Afiliados de Betamina</strong> ha sido recibida exitosamente. Nuestro equipo la revisará y te contactaremos pronto.</p>
                            <div style="background-color: #f8f9ff; border-left: 4px solid #0022ff; border-radius: 4px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #0022ff; font-size: 16px; margin: 0 0 12px 0;">Datos Registrados</h3>
                                <p style="color: #333333; font-size: 14px; margin: 5px 0;"><strong>Nombre:</strong> {{name}}</p>
                                <p style="color: #333333; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> {{email}}</p>
                                <p style="color: #333333; font-size: 14px; margin: 5px 0;"><strong>País:</strong> {{country}}</p>
                                <p style="color: #333333; font-size: 14px; margin: 5px 0;"><strong>Teléfono:</strong> {{phone}}</p>
                                <p style="color: #333333; font-size: 14px; margin: 5px 0;"><strong>Cómo nos conoció:</strong> {{traffic_source}}</p>
                                <p style="color: #333333; font-size: 14px; margin: 5px 0;"><strong>Mensaje:</strong> {{message}}</p>
                            </div>
                            <div style="margin: 25px 0;">
                                <h3 style="color: #0022ff; font-size: 18px; margin: 0 0 15px 0;">Próximos Pasos</h3>
                                <ol style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
                                    <li style="margin-bottom: 10px;">Revisaremos tu solicitud en 24-48 horas</li>
                                    <li style="margin-bottom: 10px;">Te contactaremos para conocer tu estrategia</li>
                                    <li>Recibirás acceso al panel de NetRefer</li>
                                </ol>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 25px; background-color: #f8f9ff; text-align: center;">
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

  async function submitForm(data) {
    const url = "https://l5j6mnkgyvi3pvrcqzhenb5fc40rwipi.lambda-url.us-east-1.on.aws/";

    // Obtener el template
    const htmlTemplate = getEmailTemplate();

    const payload = {
      from: "Betamina",
      to: ["bruna.ceppa@solcre.com"],
      subject: "¡Bienvenido al Programa de Afiliados de Betamina!",
      html_body: htmlTemplate,
      variables: {
        name: data.name,
        email: data.email,
        country: data.country || "No especificado",
        phone: data.phone || "No proporcionado",
        contact_method: data.contact_method || "Email",
        message: data.message || "",
        traffic_source: data.traffic_source || "No especificado",
        traffic_source_other: data.traffic_source_other || ""
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

    if (countryInput && !countryInput.value.trim()) {
      countryInput.focus();
      showError("Por favor, seleccioná tu país");
      return;
    }

    // Obtener valores de país, teléfono y método de contacto
    const country = countryInput ? countryInput.value.trim() : "";
    let phone = "";
    const phoneGroup = form.querySelector(".js-phone-input");
    if (phoneGroup) {
      const prefixEl = phoneGroup.querySelector(".js-phone-prefix");
      const inputEl = phoneGroup.querySelector("#phone-num") || phoneGroup.querySelector('input[name="phone-num"]');
      const prefix = prefixEl ? prefixEl.textContent.trim().replace(/\s/g, "") : "";
      const digits = inputEl ? (inputEl.value || "").replace(/\D/g, "") : "";
      if (prefix && digits) {
        phone = `${prefix}${digits}`;
      } else if (phoneHiddenInput && phoneHiddenInput.value.trim()) {
        phone = phoneHiddenInput.value.trim();
      } else if (inputEl && inputEl.value.trim()) {
        phone = inputEl.value.trim();
      }
    }
    const contactMethod = contactMethodHiddenInput ? contactMethodHiddenInput.value : (contactMethodInput ? contactMethodInput.value : "");
    const message = messageInput ? messageInput.value.trim() : "";
    
    // Obtener todos los checkboxes seleccionados de traffic source
    const trafficSourceValues = [];
    if (trafficSourceCheckboxes) {
      trafficSourceCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          trafficSourceValues.push(checkbox.value);
        }
      });
    }
    const trafficSource = trafficSourceValues.length > 0 ? trafficSourceValues.join(", ") : "";
    const trafficSourceOther = trafficSourceOtherInput ? trafficSourceOtherInput.value.trim() : "";

    const formData = {
      name,
      email,
      country: country || "No especificado",
      phone,
      contact_method: contactMethod || "Email",
      message,
      traffic_source: trafficSource,
      traffic_source_other: trafficSourceOther
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
  [nameInput, emailInput, countryInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        if (errorMessage && errorMessage.style.display !== "none") {
          errorMessage.style.display = "none";
        }
      });
    }
  });
});
