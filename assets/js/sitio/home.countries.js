function addOddItemsClass() {
    const list = document.querySelector('.js-countries');
    if (!list) return;
    const items = list.querySelectorAll('li');

    if (items.length % 2 !== 0) {
      list.classList.add('has-odd-items');
    }
  }

  addOddItemsClass();