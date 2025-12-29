function carouselInit() {
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const track = carousel.querySelector('.c-carousel__track');
        const items = Array.from(track.children);
        const prevBtn = carousel.querySelector('[data-prev]');
        const nextBtn = carousel.querySelector('[data-next]');
        const dotsWrapper = carousel.querySelector('[data-dots]');

        let index = 0;
        let startX = 0;
        let deltaX = 0;
        let isDragging = false;
        let startTranslate = 0;

        /* HELPERS */
        const getItemsPerView = () =>
            parseInt(getComputedStyle(carousel).getPropertyValue('--items'), 10);

        const getGap = () => {
            const cs = getComputedStyle(carousel);
            return parseFloat(cs.getPropertyValue('--items-gap')) || 0;
        };

        const getItemWidth = () => items[0]?.offsetWidth || 0;

        const getMaxIndex = () => {
            const itemsPerView = getItemsPerView();
            return Math.max(0, items.length - itemsPerView);
        };

        const getMaxTranslate = () => {
            const itemWidth = getItemWidth();
            const gap = getGap();
            return (itemWidth + gap) * getMaxIndex();
        };

        const getTranslateForIndex = (i) => {
            const itemWidth = getItemWidth();
            const gap = getGap();
            return -((itemWidth + gap) * i);
        };

        const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

        const isStatic = () => items.length <= getItemsPerView();

        const updateArrowsDisabled = () => {
            if (!prevBtn || !nextBtn) return;

            if (isStatic()) {
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                return;
            }

            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === getMaxIndex();
        };

        /* CONTROLS VISIBILITY */
        const updateControlsVisibility = () => {
            const hide = isStatic();
            if (prevBtn) prevBtn.style.display = hide ? 'none' : '';
            if (nextBtn) nextBtn.style.display = hide ? 'none' : '';
            if (dotsWrapper) dotsWrapper.style.display = hide ? 'none' : '';
        };

        /* DOTS */
        const buildDots = () => {
            if (!dotsWrapper) return;

            if (isStatic()) {
                dotsWrapper.innerHTML = '';
                return;
            }

            dotsWrapper.innerHTML = '';

            const itemsPerView = getItemsPerView();
            const dotsCount = Math.ceil(items.length / itemsPerView);

            for (let p = 0; p < dotsCount; p++) {
                const dot = document.createElement('button');
                dot.className = 'c-carousel__dot';
                dot.type = 'button';

                dot.addEventListener('click', () => {
                    const targetIndex = p * itemsPerView;
                    index = clamp(targetIndex, 0, getMaxIndex());
                    update();
                });

                dotsWrapper.appendChild(dot);
            }

            setActiveDot();
        };

        const setActiveDot = () => {
            if (!dotsWrapper || isStatic()) return;

            const dots = Array.from(dotsWrapper.querySelectorAll('.c-carousel__dot'));
            if (!dots.length) return;

            const maxIndex = getMaxIndex();
            let activeDot = 0;

            if (maxIndex > 0) {
                activeDot = Math.round((index / maxIndex) * (dots.length - 1));
            }

            dots.forEach((dot, i) =>
                dot.classList.toggle('is-active', i === activeDot)
            );
        };

        /* UPDATE */
        const update = (animate = true) => {
            if (isStatic()) {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0px)';
                updateArrowsDisabled();
                return;
            }

            index = clamp(index, 0, getMaxIndex());
            track.style.transition = animate ? 'transform 0.4s ease' : 'none';
            track.style.transform = `translateX(${getTranslateForIndex(index)}px)`;
            setActiveDot();
            updateArrowsDisabled();
        };

        /* BUTTONS */
        nextBtn?.addEventListener('click', () => {
            if (isStatic()) return;

            const itemsPerView = getItemsPerView();
            const nextIndex =
                (Math.floor(index / itemsPerView) + 1) * itemsPerView;

            index = clamp(nextIndex, 0, getMaxIndex());
            update();
        });

        prevBtn?.addEventListener('click', () => {
            if (isStatic()) return;

            const itemsPerView = getItemsPerView();
            const prevIndex =
                (Math.floor(index / itemsPerView) - 1) * itemsPerView;

            index = clamp(prevIndex, 0, getMaxIndex());
            update();
        });

        /* DRAG */
        track.addEventListener('pointerdown', e => {
            if (isStatic()) return;

            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            deltaX = 0;
            startTranslate = getTranslateForIndex(index);

            track.setPointerCapture(e.pointerId);
            track.style.cursor = 'grabbing';
            update(false);
        });

        track.addEventListener('pointermove', e => {
            if (!isDragging) return;

            deltaX = e.clientX - startX;

            const maxTranslate = getMaxTranslate();
            let nextTranslate = startTranslate + deltaX;
            nextTranslate = clamp(nextTranslate, -maxTranslate, 0);

            track.style.transform = `translateX(${nextTranslate}px)`;
        });

        track.addEventListener('pointerup', e => {
            if (!isDragging) return;

            const itemsPerView = getItemsPerView();
            const itemWidth = getItemWidth();
            const threshold = itemWidth * 0.25;

            if (deltaX > threshold) {
                const prevIndex =
                    (Math.floor(index / itemsPerView) - 1) * itemsPerView;
                index = clamp(prevIndex, 0, getMaxIndex());
            } else if (deltaX < -threshold) {
                const nextIndex =
                    (Math.floor(index / itemsPerView) + 1) * itemsPerView;
                index = clamp(nextIndex, 0, getMaxIndex());
            }

            isDragging = false;
            deltaX = 0;

            track.releasePointerCapture(e.pointerId);
            track.style.cursor = 'grab';
            update(true);
        });

        track.addEventListener('pointerleave', () => {
            if (!isDragging) return;
            isDragging = false;
            deltaX = 0;
            update(true);
        });

        /* RESIZE */
        window.addEventListener('resize', () => {
            updateControlsVisibility();
            buildDots();
            update(false);
        });

        /* INIT */
        track.style.cursor = 'grab';
        updateControlsVisibility();
        buildDots();
        update(false);
        updateArrowsDisabled();
    });
}

document.addEventListener('DOMContentLoaded', carouselInit);
