let countdownInterval = null;

const countdownSelector = '.js-countdown';
const countdownDaysSelector = '.js-countdown-days';
const countdownHoursSelector = '.js-countdown-hours';
const countdownMinutesSelector = '.js-countdown-minutes';
const countdownSecondsSelector = '.js-countdown-seconds';

function initCountdown(targetDateStr) {
  const countdownElement = document.querySelector(countdownSelector);
  const daysElement = document.querySelector(countdownDaysSelector);
  const hoursElement = document.querySelector(countdownHoursSelector);
  const minutesElement = document.querySelector(countdownMinutesSelector);
  const secondsElement = document.querySelector(countdownSecondsSelector);

  if (!countdownElement || !daysElement || !hoursElement || !minutesElement || !secondsElement) {
    console.warn('Countdown elements not found');
    return;
  }

  const setZeros = () => {
    daysElement.innerText = '00';
    hoursElement.innerText = '00';
    minutesElement.innerText = '00';
    secondsElement.innerText = '00';
  };

  // Si no se proporciona una fecha, intentar obtenerla del atributo datetime
  if (!targetDateStr) {
    targetDateStr = countdownElement.getAttribute('datetime');
    if (!targetDateStr) {
      // Sin fecha, dejamos el contador en 00 y no inicializamos nada
      setZeros();
      return;
    }
  }

  const targetDate = new Date(targetDateStr);
  const targetTime = targetDate.getTime();

  if (Number.isNaN(targetTime)) {
    // Fecha inválida: dejamos el contador en 00 y no inicializamos nada
    setZeros();
    return;
  }

  // Actualizar el atributo datetime del elemento
  countdownElement.setAttribute('datetime', targetDateStr);

  // Limpiar intervalo anterior si existe
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  const update = () => {
    const now = Date.now();
    const dist = targetTime - now;

    if (dist <= 0) {
      // Si la fecha ya pasó, detener el contador y mostrar ceros
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      setZeros();
      return;
    }

    const d = Math.floor(dist / (1000 * 60 * 60 * 24));
    const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((dist % (1000 * 60)) / 1000);

    daysElement.innerText = String(d).padStart(2, '0');
    hoursElement.innerText = String(h).padStart(2, '0');
    minutesElement.innerText = String(m).padStart(2, '0');
    secondsElement.innerText = String(s).padStart(2, '0');
  };

  countdownInterval = setInterval(update, 1000);
  update();
}

// Inicialización automática al cargar la página. La fecha se toma del atributo
// datetime del elemento .js-countdown en el HTML.
function countdownInit() {
  initCountdown();
}

window.addEventListener('load', countdownInit);
