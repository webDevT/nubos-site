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
        
        const swiper = new Swiper(sliderViewport, {
            loop: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 5,
            speed: 400,
            watchOverflow: true,
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
                }
            }
        });
    }
    
    initSwiperSlider();
});

