function dialcodeInit() {

    document.addEventListener("DOMContentLoaded", () => {

        const $phoneInputs = document.querySelectorAll('.js-phone-input');
        if ($phoneInputs.length > 0) {

            $phoneInputs.forEach(phoneInput => {

                const $dialcode = phoneInput.querySelector(".js-dialcode");
                const $input = phoneInput.querySelector(".js-form__input");
                const $prefixEl = phoneInput.querySelector(".js-phone-prefix");
                const $hiddenInput = phoneInput.querySelector(".js-phone-value");

                if ($dialcode) {
                    const $dialcodeShow = $dialcode.querySelector(".js-showDialcode");
                    const $dialcodeFlag = $dialcodeShow.querySelector(".c-dialcode__flag");
                    const $dialcodeOptions = $dialcode.querySelectorAll('.js-dialcodeOption');

                    let currentPrefix = $prefixEl.textContent;

                    if ($dialcodeShow) {
                        $dialcodeShow.addEventListener("click", (e) => {
                            e.stopPropagation();
                            $dialcode.classList.toggle("is-open");
                        });
                    }

                    if ($dialcodeOptions.length > 0) {

                        $dialcodeOptions.forEach(option => {
                            option.addEventListener('click', function () {
                                const prefix = this.getAttribute('data-prefix');

                                currentPrefix = prefix;
                                $prefixEl.textContent = prefix;

                                const optionImg = this.querySelector("img");
                                if (optionImg && $dialcodeFlag) {
                                    $dialcodeFlag.src = optionImg.src;
                                    $dialcodeFlag.alt = optionImg.alt;
                                }

                                $dialcodeOptions.forEach(opt => opt.hidden = false);
                                this.hidden = true;

                                setTimeout(() => {
                                    $dialcode.classList.remove("is-open");
                                }, 200);
                            });
                        });
                    }

                    $input.addEventListener("input", () => {
                        const cleanNumber = $input.value.replace(/\D/g, '');
                        $hiddenInput.value = `${currentPrefix}${cleanNumber}`;
                    });

                    document.addEventListener("click", (e) => {
                        if (!$dialcode.contains(e.target)) {
                            $dialcode.classList.remove("is-open");
                        }
                    });
                }
            });
        }
    });

}

dialcodeInit();
