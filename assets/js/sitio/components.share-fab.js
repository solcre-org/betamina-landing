/**
 * Share FAB - Floating Action Button that expands to show social links
 */
(function () {
    const fab = document.querySelector('.js-share-fab');
    const toggle = document.querySelector('.js-share-fab-toggle');

    if (!fab || !toggle) return;

    toggle.addEventListener('click', function () {
        const isExpanded = fab.classList.toggle('is-expanded');
        toggle.setAttribute('aria-expanded', isExpanded);
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (fab.classList.contains('is-expanded') && !fab.contains(e.target)) {
            fab.classList.remove('is-expanded');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
})();
