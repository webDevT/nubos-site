// Toggle active class on menu-burger click
document.addEventListener('DOMContentLoaded', function() {
    const menuBurger = document.querySelector('.menu-burger');
    const menu = document.querySelector('.header');
    const buttonContact = document.querySelector('.button--contact');
    const logoText = document.querySelector('.logo-text');
    
    if (menuBurger) {
        menuBurger.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Toggle active class on menu
            if (menu) {
                menu.classList.toggle('active');
            }
            
            // Toggle visibility of contact button
            if (buttonContact) {
                buttonContact.classList.toggle('active');
            }
            
            // Toggle active class on logo-text
            if (logoText) {
                logoText.classList.toggle('active');
            }
        });
    }

    // Toggle submenu on click for mobile devices
    const menuItemsWithSubmenu = document.querySelectorAll('.menu__item--has-submenu');
    
    menuItemsWithSubmenu.forEach(function(item) {
        const menuLink = item.querySelector('.menu__link');
        
        if (menuLink) {
            menuLink.addEventListener('click', function(e) {
                // Перевіряємо, чи екран менше 992px
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    
                    // Закриваємо інші відкриті підменю
                    menuItemsWithSubmenu.forEach(function(otherItem) {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Перемикаємо поточне підменю
                    item.classList.toggle('active');
                }
            });
        }
    });

    // Simple carousel slider (vanilla JS, no jQuery)
    const slider = document.querySelector('.slider');
    const sliderViewport = slider ? slider.querySelector('.slider__viewport') : null;
    const sliderTrack = sliderViewport ? sliderViewport.querySelector('.slider__track') : null;
    let slides = sliderTrack ? sliderTrack.querySelectorAll('.slider__item') : [];
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && sliderViewport && sliderTrack && slides.length > 0 && prevBtn && nextBtn) {
        const originalSlides = Array.from(slides);
        const totalOriginal = originalSlides.length;

        if (totalOriginal === 0) {
            return;
        }

        // Створюємо клон першого і останнього слайдів для безшовного циклу
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[totalOriginal - 1].cloneNode(true);

        sliderTrack.insertBefore(lastClone, originalSlides[0]);
        sliderTrack.appendChild(firstClone);

        // Оновлюємо список слайдів (включно з клонами)
        slides = sliderTrack.querySelectorAll('.slider__item');

        let currentIndex = 1; // починаємо з першого “справжнього” слайда
        let isAnimating = false;

        function updateSlider() {
            if (!slides[0]) return;

            const slideWidth = slides[0].offsetWidth;
            const styles = window.getComputedStyle(sliderTrack);
            const gap = parseFloat(styles.columnGap || styles.gap || '0');
            const totalWidth = slideWidth + gap;

            const viewportWidth = sliderViewport.offsetWidth;
            const centerOffset = (viewportWidth - slideWidth) / 2;

            const offset = currentIndex * totalWidth - centerOffset;
            sliderTrack.style.transform = 'translateX(' + (-offset) + 'px)';

            slides.forEach(function (slide, index) {
                if (index === currentIndex) {
                    slide.classList.add('is-active');
                } else {
                    slide.classList.remove('is-active');
                }
            });
        }

        function showNext() {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex += 1;
            updateSlider();
        }

        function showPrev() {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex -= 1;
            updateSlider();
        }

        nextBtn.addEventListener('click', function () {
            showNext();
        });

        prevBtn.addEventListener('click', function () {
            showPrev();
        });

        // Безшовний перехід з клонів на справжні слайди
        sliderTrack.addEventListener('transitionend', function () {
            if (!isAnimating) return;

            if (currentIndex === slides.length - 1) {
                // були на клоні першого — стрибаємо на справжній перший
                sliderTrack.style.transition = 'none';
                currentIndex = 1;
                updateSlider();
                // форсуємо перерахунок, потім повертаємо transition
                void sliderTrack.offsetWidth;
                sliderTrack.style.transition = '';
            } else if (currentIndex === 0) {
                // були на клоні останнього — стрибаємо на справжній останній
                sliderTrack.style.transition = 'none';
                currentIndex = slides.length - 2;
                updateSlider();
                void sliderTrack.offsetWidth;
                sliderTrack.style.transition = '';
            }

            isAnimating = false;
        });

        // Swipe / drag support
        let startX = null;
        let isDragging = false;
        const swipeThreshold = 40; // мінімальна відстань свайпу/драгa

        // touch-свайп
        sliderViewport.addEventListener('touchstart', function (e) {
            if (e.touches && e.touches.length === 1) {
                startX = e.touches[0].clientX;
                isDragging = true;
            }
        }, { passive: true });

        sliderViewport.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            // дозволяємо скрол, але запобігаємо стандартній поведінці
        }, { passive: true });

        sliderViewport.addEventListener('touchend', function (e) {
            if (!isDragging || startX === null) return;

            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;

            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > swipeThreshold) {
                    showPrev();
                } else if (diffX < -swipeThreshold) {
                    showNext();
                }
            }

            isDragging = false;
            startX = null;
        });

        // drag мишкою
        sliderViewport.addEventListener('mousedown', function (e) {
            // лише ліва кнопка миші
            if (e.button !== 0) return;
            e.preventDefault(); // запобігаємо виділенню тексту/зображень
            isDragging = true;
            startX = e.clientX;
            sliderViewport.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', function (e) {
            if (!isDragging || startX === null) return;
            e.preventDefault();
        });

        window.addEventListener('mouseup', function (e) {
            if (!isDragging || startX === null) return;

            const endX = e.clientX;
            const diffX = endX - startX;

            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > swipeThreshold) {
                    showPrev();
                } else if (diffX < -swipeThreshold) {
                    showNext();
                }
            }

            isDragging = false;
            startX = null;
            sliderViewport.style.cursor = '';
        });

        // Змінюємо курсор при наведенні
        sliderViewport.addEventListener('mouseenter', function() {
            if (!isDragging) {
                this.style.cursor = 'grab';
            }
        });

        sliderViewport.addEventListener('mouseleave', function() {
            if (!isDragging) {
                this.style.cursor = '';
            }
        });

        // Оновлюємо позицію при завантаженні та ресайзі
        updateSlider();
        window.addEventListener('resize', updateSlider);
    }
});

