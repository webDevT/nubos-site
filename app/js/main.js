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

    // Toggle FAQ items
    const faqHeaders = document.querySelectorAll('.faq__item-header');

    faqHeaders.forEach(function(header) {
        header.addEventListener('click', function() {
            const parentItem = header.closest('.faq__item');
            if (parentItem) {
                parentItem.classList.toggle('active');
            }
        });
    });

    // Toggle submenu on click for mobile devices
    const menuItemsWithSubmenu = document.querySelectorAll('.menu__item--has-submenu');
    
    menuItemsWithSubmenu.forEach(function(item) {
        const menuLink = item.querySelector('.menu__link');
        
        if (menuLink) {
            menuLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    
                    menuItemsWithSubmenu.forEach(function(otherItem) {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    item.classList.toggle('active');
                }
            });
        }
    });

    // Swiper slider initialization
    function initSwiperSlider() {
        const sliderViewport = document.querySelector('.slider .swiper');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (!sliderViewport || !prevBtn || !nextBtn) {
            return;
        }

        if (typeof Swiper === 'undefined') {
            setTimeout(initSwiperSlider, 100);
            return;
        }
        
        function updateActiveSlide(swiperInstance) {
            const slides = sliderViewport.querySelectorAll('.slider__item');
            slides.forEach(function(slide, index) {
                if (index === swiperInstance.realIndex) {
                    slide.classList.add('is-active');
                } else {
                    slide.classList.remove('is-active');
                }
            });
        }
        
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;
        
        const swiper = new Swiper(sliderViewport, {
            loop: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 5,
            speed: 400,
            watchOverflow: true,
            noSwipingClass: 'swiper-no-swiping',
            breakpoints: {
                650: {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 5,
                },
                320: {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 5,
                }
            },
            navigation: {
                nextEl: nextBtn,
                prevEl: prevBtn,
            },
            on: {
                init: function() {
                    updateActiveSlide(this);
                },
                slideChange: function() {
                    updateActiveSlide(this);
                },
                touchStart: function(swiper, event) {
                    touchStartX = event.touches[0].clientX;
                    touchStartY = event.touches[0].clientY;
                    isSwiping = false;
                },
                touchMove: function(swiper, event) {
                    const touchEndX = event.touches[0].clientX;
                    const touchEndY = event.touches[0].clientY;
                    const diffX = Math.abs(touchEndX - touchStartX);
                    const diffY = Math.abs(touchEndY - touchStartY);
                    
                    if (diffX > diffY && diffX > 10) {
                        isSwiping = true;
                    }
                }
            }
        });
        
        const sliderLinks = sliderViewport.querySelectorAll('.slider__item');
        sliderLinks.forEach(function(link) {
            link.classList.add('swiper-no-swiping');
            
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#' && href !== '') {
                    window.location.href = href;
                } else if (href === '#') {
                    e.preventDefault();
                }
            });
            
            link.addEventListener('touchend', function(e) {
                if (!isSwiping) {
                    const href = this.getAttribute('href');
                    if (href && href !== '#' && href !== '') {
                        window.location.href = href;
                    }
                    e.preventDefault();
                }
                setTimeout(function() {
                    isSwiping = false;
                }, 100);
            });
        });
    }
    
    initSwiperSlider();

    // Logos Swiper initialization
    function initLogosSwiper() {
        const logosSwiper = document.querySelector('.logos-swiper');

        if (!logosSwiper) {
            return;
        }

        if (logosSwiper.swiper) {
            return;
        }
        if (typeof Swiper === 'undefined') {
            setTimeout(initLogosSwiper, 100);
            return;
        }

        try {
            const swiperInstance = new Swiper(logosSwiper, {
                loop: true,
                slidesPerView: 'auto',
                spaceBetween: 30,
                autoplay: {
                    delay: 1000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                },
                speed: 500,
                allowTouchMove: true,
                breakpoints: {
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    }
                }
            });

            if (swiperInstance.autoplay && swiperInstance.autoplay.running) {
                console.log('Logos Swiper autoplay initialized and running');
            } else if (swiperInstance.autoplay) {
                swiperInstance.autoplay.start();
                console.log('Logos Swiper autoplay started manually');
            } else {
                console.warn('Logos Swiper autoplay not available');
            }
        } catch (error) {
            console.error('Error initializing Logos Swiper:', error);
        }
    }

    window.initLogosSwiper = initLogosSwiper;

    initLogosSwiper();
    
    window.addEventListener('load', function() {
        setTimeout(initLogosSwiper, 200);
    });

    // Modal window functionality
    const modalWindow = document.querySelector('.modal-window');
    const closeModalBtn = document.querySelector('.close-modal-window');
    const formSection = document.querySelector('.form-section');
    const openModalButtons = document.querySelectorAll('.open-modal');

    function openModal() {
        if (modalWindow) {
            modalWindow.classList.remove('hidden');
        }
    }

    function closeModal() {
        if (modalWindow) {
            modalWindow.classList.add('hidden');
        }
    }

    // Open modal on click on elements with open-modal class
    openModalButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal on close button click
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
        });
    }

    // Close modal on click outside form-section
    if (modalWindow) {
        modalWindow.addEventListener('click', function(e) {
            const clickedOnCloseBtn = closeModalBtn && (e.target === closeModalBtn || closeModalBtn.contains(e.target));
            const clickedOnFormSection = formSection && formSection.contains(e.target);
            
            if (!clickedOnCloseBtn && !clickedOnFormSection) {
                closeModal();
            }
        });
    }
});

