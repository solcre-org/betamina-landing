// ! GSAP SETUP
gsap.registerPlugin(ScrollTrigger);


// ! HEADER WAYPOINTS

function headerFixedInit() {
    const header = document.querySelector('.js-header');
    const limit  = document.querySelector('.js-header-limit');

    if (!header || !limit) return;

    const limitOffset = limit.getBoundingClientRect().top + window.scrollY;

    ScrollTrigger.create({
        trigger: document.body,
        start: () => limitOffset + ' top',
        end: 'bottom bottom',
        onUpdate: self => {
            header.classList.toggle('is-fixed', self.scroll() > limitOffset);
        },
        invalidateOnRefresh: true
    });
}

window.addEventListener('load', () => {
    headerFixedInit();
    ScrollTrigger.refresh();
});

