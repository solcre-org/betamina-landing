function popupInit() {
  const $openPopupLinks = document.querySelectorAll(".js-showPopup");

  if ($openPopupLinks.length > 0) {
    $openPopupLinks.forEach((link) => {
      const popupId = link.getAttribute("href").substring(1);
      const $popup = document.getElementById(popupId);
      const $closePopup = $popup.querySelectorAll(".js-hidePopup");
      const $popupOverlay = $popup.querySelector(".js-popupOverlay");

      link.addEventListener("click", function (e) {
        e.preventDefault();
        $popup.classList.add("is-visible");
      });

      $closePopup.forEach((closedBtn) => {
        closedBtn.addEventListener("click", function () {
          if ($popup.classList.contains("is-visible")) {
            $popup.classList.add("is-closing");
          }

          $popupOverlay.addEventListener(
            "animationend",
            (e) => {
              if (
                e.target === $popupOverlay &&
                $popup.classList.contains("is-closing")
              ) {
                $popup.classList.remove("is-visible", "is-closing");
              }
            },
            { once: true },
          );
        });
      });
    });
  }
}

popupInit();
