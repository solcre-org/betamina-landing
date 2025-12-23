function dialcodeInit() {

    document.addEventListener("DOMContentLoaded", () => {

        const $phoneInputs = document.querySelectorAll('.js-phone-input');
        if ($phoneInputs.length > 0) {

            $phoneInputs.forEach(phoneInput => {

                const $dialcode = phoneInput.querySelector(".js-dialcode");
                const $input = phoneInput.querySelector(".js-form__input");
                const $hiddenPrefix = phoneInput.querySelector(".js-phone-input-prefix");

                if ($dialcode) {
                    const $dialcodeShow = $dialcode.querySelector(".js-showDialcode");
                    const $dialcodeFlag = $dialcodeShow.querySelector(".c-dialcode__flag");
                    const $dialcodeOptions = $dialcode.querySelectorAll('.js-dialcodeOption');

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

                                if ($hiddenPrefix) {
                                    $hiddenPrefix.value = prefix;
                                }

                                const optionImg = this.querySelector("img");
                                if (optionImg && $dialcodeFlag) {
                                    $dialcodeFlag.src = optionImg.src;
                                    $dialcodeFlag.alt = optionImg.alt;
                                }

                                $input.value = $input.value.replace(/^\+\d+\s*/, '');
                                
                                $dialcodeOptions.forEach(opt => opt.hidden = false);
                                this.hidden = true;

                                setTimeout(() => {
                                    $dialcode.classList.remove("is-open");
                                }, 200);

                            });
                        });
                    }

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
