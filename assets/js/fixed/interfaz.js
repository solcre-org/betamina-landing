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

function navInit() {
  const $body = document.querySelector('body');
  const $navToggle = document.getElementById('nav-toggle');
  const $nav = document.getElementById('main-nav');
  const $overlay = document.querySelector(".js-nav-overlay");
  const mediaq = window.matchMedia("(max-width: 1199px)");
  const $navItems = document.querySelectorAll(".js-nav-item");


  function applyDelays() {

    if (!mediaq.matches) {
      $navItems.forEach(el => el.style.transitionDelay = "");
      return;
    }

    if ($body.classList.contains("nav-open") || $navToggle.checked) {
      $navItems.forEach((el, i) => {
        const delay = 0.10 + i * 0.05;
        el.style.transitionDelay = `${delay}s`;
      });
    } else {
      $navItems.forEach(el => el.style.transitionDelay = "0s");
    }
  }

  function hideNav() {
    if ($navToggle.checked) $navToggle.checked = false;

    $nav.classList.add('is-closing');
    $nav.classList.remove('is-visible');
    $body.classList.remove('nav-open');

    applyDelays();
  }

  $navToggle.onchange = () => {
    if ($navToggle.checked) {
      $nav.classList.add('is-visible');
      $body.classList.add('nav-open');
    } else {
      hideNav();
    }

    applyDelays();
  };

  if ($overlay) {
    $overlay.addEventListener("click", () => {
      hideNav();
      $navToggle.checked = false;
    });
  }

  $nav.addEventListener('animationend', (event) => {
    if (event.target === $nav && $nav.classList.contains('is-closing')) {
      $nav.classList.remove('is-closing');
      $nav.classList.remove('is-visible');
    }
  });

  mediaq.addEventListener("change", applyDelays);

  applyDelays();
}


window.addEventListener('load', () => {
    headerFixedInit();
    ScrollTrigger.refresh();
    navInit();
});
