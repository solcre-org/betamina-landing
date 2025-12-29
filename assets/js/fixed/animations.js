// function scrollAnimationsInit() {
//   gsap.set(".js-animate-in", {
//     opacity: 0,
//     y: 40
//   });

//   ScrollTrigger.batch(".js-animate-in", {
//     start: "top 80%",

//     onEnter: batch => {
//       gsap.to(batch, {
//         y: 0,
//         opacity: 1,
//         duration: 0.8,
//         ease: "power2.out",
//         stagger: 0.15
//       });
//     },

//     onLeaveBack: batch => {
//       gsap.to(batch, {
//         y: 40,
//         opacity: 0,
//         duration: 0.5,
//         stagger: 0.1
//       });
//     }
//   });
// }

// window.addEventListener("load", scrollAnimationsInit);


function scrollAnimationsInit() {
  gsap.set(".js-animate-in", {
    opacity: 0,
    y: 40
  });

  function animateIn(batch) {
    gsap.to(batch, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15
    });
  }

  function animateOut(batch) {
    gsap.to(batch, {
      y: 40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1
    });
  }

  ScrollTrigger.batch(".js-animate-in", {
    start: "top 80%",
    onEnter: animateIn,
    onEnterBack: animateIn, 
    onLeaveBack: animateOut
  });

  ScrollTrigger.refresh();

  ScrollTrigger.getAll().forEach(st => {
    if (st.isActive) {
      gsap.set(st.trigger, { opacity: 1, y: 0 });
    }
  });
}

window.addEventListener("load", scrollAnimationsInit);
