document.addEventListener('DOMContentLoaded', () => {
    
    // --- CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only enable custom cursor if not on a touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Use Web Animations API for smooth delayed following
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect for interactive elements
        const hoverElements = document.querySelectorAll('a, .btn, .social-btn, .project-card, .card, .service-card, .theme-toggle');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });
    } else {
        // Hide cursor elements on touch devices
        if(cursorDot) cursorDot.style.display = 'none';
        if(cursorOutline) cursorOutline.style.display = 'none';
    }

    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('portfolio-theme', targetTheme);
    });

    // --- MOBILE NAVIGATION ---
    const hamburger = document.getElementById('hamburger-menu');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileDrawer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileDrawer.classList.toggle('active');
            
            // Prevent body scroll when drawer is open
            if (mobileDrawer.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close drawer when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileDrawer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 1. VANILLA TILT 3D EFFECTS ---
    // Initialize 3D tilt on cards and buttons. Gyroscope enables tilt on mobile.
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".card, .service-card, .project-card, .social-btn"), {
            max: 12,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            scale: 1.02,
            gyroscope: true,       // Enable for mobile device orientation tilt
            gyroscopeMinAngleX: -45,
            gyroscopeMaxAngleX: 45,
            gyroscopeMinAngleY: -45,
            gyroscopeMaxAngleY: 45,
        });
    }

    // --- 2. GSAP SCROLL ANIMATIONS ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Parallax effect on mousemove (desktop only)
        if (window.matchMedia("(pointer: fine)").matches) {
            const heroSection = document.querySelector('.hero');
            const profileImg = document.querySelector('.profile-img-container');
            const heroText = document.querySelector('.hero-text');

            if(heroSection && profileImg && heroText) {
                heroSection.addEventListener('mousemove', (e) => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 20;
                    const y = (e.clientY / window.innerHeight - 0.5) * 20;

                    gsap.to(profileImg, {
                        x: x * 2,
                        y: y * 2,
                        rotationY: x,
                        rotationX: -y,
                        duration: 1,
                        ease: "power2.out"
                    });

                    gsap.to(heroText, {
                        x: -x * 1.5,
                        y: -y * 1.5,
                        duration: 1,
                        ease: "power2.out"
                    });
                });
                
                // Reset on mouse leave
                heroSection.addEventListener('mouseleave', () => {
                    gsap.to([profileImg, heroText], {
                        x: 0,
                        y: 0,
                        rotationY: 0,
                        rotationX: 0,
                        duration: 1,
                        ease: "power2.out"
                    });
                });
            }
        }

        // Initial Load Animations (Hero & Nav)
        const tl = gsap.timeline();
        
        // Navbar drops down
        tl.fromTo(".navbar", 
            { y: -50, autoAlpha: 0 }, 
            { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
        )
        // Text elements fade up and stagger
        .fromTo(".intro-fade-up", 
            { y: 40, autoAlpha: 0 }, 
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" }, 
            "-=0.5"
        )
        // Image scales and rotates in 3D
        .fromTo(".hero-image", 
            { scale: 0.8, rotationY: 30, autoAlpha: 0 }, 
            { scale: 1, rotationY: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out" }, 
            "-=1"
        );

        // Scroll Animations for sections titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.fromTo(title, 
                { autoAlpha: 0, y: 50, rotationX: -45 },
                {
                    scrollTrigger: {
                        trigger: title,
                        start: "top 85%",
                    },
                    autoAlpha: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1,
                    ease: "back.out(1.5)"
                }
            );
        });

        // Scroll Animations for grids with 3D pop effect
        gsap.utils.toArray('.stagger-children').forEach(container => {
            const children = container.querySelectorAll('.scroll-elem, .card, .service-card, .project-card, .social-btn');
            if (children.length > 0) {
                gsap.fromTo(children,
                    { autoAlpha: 0, y: 100, rotationX: 45, scale: 0.9 },
                    {
                        scrollTrigger: {
                            trigger: container,
                            start: "top 85%",
                        },
                        autoAlpha: 1,
                        y: 0,
                        rotationX: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out"
                    }
                );
            }
        });
        
        // Footer animation
        gsap.fromTo("footer", 
            { autoAlpha: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: "footer",
                    start: "top 95%",
                },
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }
        );
    }
});
