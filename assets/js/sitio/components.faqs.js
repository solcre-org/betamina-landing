function faqsInit() {
  document.querySelectorAll('.js-faqs > li').forEach(item => {
    const question = item.children[0];
    const answer = item.children[1];

    if (!question || !answer) return;

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

document.addEventListener('DOMContentLoaded', faqsInit);
