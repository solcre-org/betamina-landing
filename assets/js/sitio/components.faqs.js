function faqsInit() {
  document.querySelectorAll('.js-faqs > li').forEach(item => {
    const question = item.children[0];
    const answer = item.children[1];

    if (!question || !answer) return;

    if (item.classList.contains('is-open')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      if (isOpen) {
        answer.style.maxHeight = null;
        item.classList.remove('is-open');
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        item.classList.add('is-open');
      }
    });
  });
}

window.addEventListener('load', faqsInit);
