(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';

    /* Animations
     * -------------------------------------------------- */
    const isMotionDisabled = () => window.__citronDisableAnimations === true;

    let tl = null;



    const applyMotionDisabledState = function () {

        window.__citronDisableAnimations = true;



        if ( html.classList.contains('no-webgpu') === false ) {

            html.classList.add('no-webgpu');

        }



        const body = document.body;



        if ( body && body.classList.contains('no-webgpu') === false ) {

            body.classList.add('no-webgpu');

        }



        const preloader = document.querySelector('#preloader');



        if ( preloader ) {

            preloader.style.visibility = 'hidden';

            preloader.style.display = 'none';

            preloader.style.opacity = 0;

        }



        const loader = document.querySelector('#loader');



        if ( loader ) {

            loader.style.opacity = 0;

            loader.style.visibility = 'hidden';

        }



        if ( tl && typeof tl.pause === 'function' ) {

            tl.pause();

            tl = null;

        }

    };



    if ( isMotionDisabled() ) {



        applyMotionDisabledState();



    } else {



        tl = anime.timeline({

            easing: 'easeInOutCubic',

            duration: 800,

            autoplay: false

        })

        .add({

            targets: '#loader',

            opacity: 0,

            duration: 1000,

            begin: function(anim) {

                window.scrollTo(0, 0);

            }

        })

        .add({

            targets: '#preloader',

            opacity: 0,

            complete: function(anim) {

                document.querySelector("#preloader").style.visibility = "hidden";

                document.querySelector("#preloader").style.display = "none";

            }

        })

        .add({

            targets: '.s-header',

            translateY: [-100, 0],

            opacity: [0, 1]

        }, '-=200')

        .add({

            targets: [ '.s-intro .text-pretitle', '.s-intro .text-huge-title'],

            translateX: [100, 0],

            opacity: [0, 1],

            delay: anime.stagger(400)

        })

        .add({

            targets: '.circles span',

            keyframes: [

                {opacity: [0, .3]},

                {opacity: [.3, .1], delay: anime.stagger(100, {direction: 'reverse'})}

            ],

            delay: anime.stagger(100, {direction: 'reverse'})

        })

        .add({

            targets: '.intro-social li',

            translateX: [-50, 0],

            opacity: [0, 1],

            delay: anime.stagger(100, {direction: 'reverse'})

        })

        .add({

            targets: '.intro-scrolldown',

            translateY: [100, 0],

            opacity: [0, 1]

        }, '-=800');



    }



    window.addEventListener( 'citron:webgpu-disabled', function () {



        applyMotionDisabledState();



    }, { once: true } );

    /* Preloader
     * -------------------------------------------------- */
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item){
                item.classList.remove('ss-animated');
            });

            if ( isMotionDisabled() ) {
                applyMotionDisabledState();
                return;
            }

            if ( tl ) {
                tl.play();
            }
        });
    };




    /* Mobile Menu
     * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        // If your .main-nav a elements are static (present at load), this is fine.
        // If they were generated dynamically, you would use delegation instead.
        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {
                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {
            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    };


    /* Highlight active menu link on page scroll
     * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);
        window.addEventListener('citron:webgpu-disabled', function () {
            window.removeEventListener("scroll", navHighlight);
        }, { once: true });
        navHighlight();

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height, top and ID
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }
    };


    /* Animate elements if in viewport
     * ------------------------------------------------------ */
    const ssViewAnimate = function() {

        const blocks = document.querySelectorAll("[data-animate-block]");

        const markAnimated = function() {
            blocks.forEach(function(current) {
                current.classList.add("ss-animated");
                current.querySelectorAll("[data-animate-el]").forEach(function(target) {
                    target.style.opacity = 1;
                    target.style.transform = 'none';
                });
            });
        };

        const handleDisable = function() {
            markAnimated();
            window.removeEventListener("scroll", viewportAnimation);
        };

        if ( isMotionDisabled() ) {
            handleDisable();
            return;
        }

        window.addEventListener('citron:webgpu-disabled', handleDisable, { once: true });
        window.addEventListener("scroll", viewportAnimation);
        viewportAnimation();

        function viewportAnimation() {

            if ( isMotionDisabled() ) {
                window.removeEventListener("scroll", viewportAnimation);
                markAnimated();
                return;
            }

            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;

                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, {start: 200}),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }
    };




    /* Swiper
     * ------------------------------------------------------ */ 
    const ssSwiper = function() {
        const mySwiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                801: {
                    slidesPerView: 2,
                    spaceBetween: 32
                },
                1201: {
                    slidesPerView: 2,
                    spaceBetween: 80
                }
            }
        });
    };


    /* Lightbox
     * ------------------------------------------------------ */
    // Removed the old forEach code from here; 
    // (We moved a dynamic approach into `initLightbox()` in portfolio.js)

    /* Alert boxes (event delegation)
     * ------------------------------------------------------ */
    const ssAlertBoxes = function() {
        // If alert boxes might appear dynamically, do event delegation:
        document.addEventListener('click', function(e) {
            if (e.target.matches('.alert-box__close')) {
                // locate closest .alert-box
                const box = e.target.closest('.alert-box');
                if (!box) return;

                e.stopPropagation();
                box.classList.add("hideit");

                setTimeout(function(){
                    box.style.display = "none";
                }, 500);
            }
        });
    };


    /* Smoothscroll
     * ------------------------------------------------------ */
    const ssMoveTo = function() {

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        };

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });
    };


    /* Initialize
     * ------------------------------------------------------ */
    (function ssInit() {
        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssSwiper();
        // We do not call the old ssLightbox here because 
        // it's now handled inside portfolio.js -> initLightbox().
        ssAlertBoxes();
        ssMoveTo();
    })();

})(document.documentElement);
