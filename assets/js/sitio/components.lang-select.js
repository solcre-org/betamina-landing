/**
 * Language selector - updates displayed value when option is clicked
 * Runs on 'load' to ensure header/nav are initialized first
 */
function langSelectInit() {
  const langSelect = document.querySelector('.c-lang-select');
  if (!langSelect) return;

  const valueEl = langSelect.querySelector('.c-lang-select__value');
  const details = langSelect.querySelector('.c-lang-select__details');
  const options = langSelect.querySelectorAll('.c-lang-select__option');

  options.forEach((option) => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const newValue = option.dataset.value;
      if (newValue && valueEl) {
        valueEl.textContent = newValue;
      }
      if (details) {
        details.removeAttribute('open');
      }
    });
  });
}

window.addEventListener('load', langSelectInit);
