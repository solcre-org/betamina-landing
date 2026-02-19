/**
 * Language selector - updates displayed value when option is clicked
 */
document.addEventListener('DOMContentLoaded', () => {
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
});
