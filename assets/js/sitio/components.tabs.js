function tabsInit() {

    const tabsBlocks = document.querySelectorAll(".js-tabs");

    tabsBlocks.forEach(tabsBlock => {
        const tabsLinks = tabsBlock.querySelectorAll(".js-tabs-link");
        const contents = tabsBlock.querySelectorAll(".js-tabs-content");
        const pics = tabsBlock.querySelectorAll(".js-tabs-pic");
        let currentPic = tabsBlock.querySelector(".js-tabs-pic.is-active");

        tabsLinks.forEach((link, index) => {
            link.dataset.tab = index;
        });

        contents.forEach((content, index) => {
            content.dataset.tab = index;
        });

        pics.forEach((pic, index) => {
            pic.dataset.tab = index;
        });


        // igualar altura de los content
        function setContentsHeight() {
            let maxHeight = 0;

            contents.forEach(content => {
                content.style.minHeight = "auto";
            });

            contents.forEach(content => {
                const height = content.offsetHeight;
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });

            contents.forEach(content => {
                content.style.minHeight = `${maxHeight}px`;
            });
        }

        setContentsHeight();

        // recalcular en resize
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(setContentsHeight, 150);
        });


        // tab click

        tabsLinks.forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();

                // links
                const tabIndex = link.dataset.tab;

                tabsLinks.forEach(link => link.classList.remove("is-active"));
                link.classList.add("is-active");

                // contents
                contents.forEach(content => content.classList.remove("is-active"));
                const activeContent = tabsBlock.querySelector(`.js-tabs-content[data-tab="${tabIndex}"]`);
                
                if (activeContent) {
                    activeContent.classList.add("is-active");
                }

                // pics
                const activePic = tabsBlock.querySelector(`.js-tabs-pic[data-tab="${tabIndex}"]`);
                if (!activePic || activePic === currentPic) return;

                pics.forEach(pic => pic.classList.remove("is-active"));

                activePic.classList.add("is-visible");
                activePic.classList.add("is-active");

                const prevPic = currentPic;
                currentPic = activePic;

                activePic.addEventListener(
                    "animationend",
                    () => {
                        if (prevPic && prevPic !== activePic) {
                            prevPic.classList.remove("is-visible");
                        }
                    },
                    { once: true }
                );
            });
        });
    });

}

document.addEventListener('DOMContentLoaded', tabsInit);
