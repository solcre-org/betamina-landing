function addOddItemsClass() {
  const lists = document.querySelectorAll('.js-calculate-items');

  lists.forEach(list => {
    const items = list.querySelectorAll('li');

    if (items.length % 2 !== 0) {
      list.classList.add('has-odd-items');
    }
  });
}

addOddItemsClass();
