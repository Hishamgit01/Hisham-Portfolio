document.addEventListener('DOMContentLoaded', () => {
    
    // --- CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
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

    // --- 1. INITIAL LOAD ANIMATIONS (Intro) ---
    // Trigger animations for elements that should appear on load immediately
    const introElements = document.querySelectorAll('.intro-elem');
    // Add loaded class to trigger CSS keyframes
    introElements.forEach(el => {
        el.classList.add('loaded');
    });

    // --- 2. SCROLL TRIGGERED ANIMATIONS (Organic Feel) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before the element hits the bottom
        threshold: 0.1 // 10% of the element must be visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine if this element is part of a staggered group
                const parent = entry.target.closest('.stagger-children');
                if (parent) {
                    // Find all animating children in this group
                    const siblings = Array.from(parent.querySelectorAll('.scroll-elem'));
                    const index = siblings.indexOf(entry.target);
                    // Apply a delay based on its index
                    entry.target.style.transitionDelay = `${index * 0.15}s`;
                }

                entry.target.classList.add('show');
                // Optional: Unobserve after showing so it only animates once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Grab all elements intended to animate on scroll
    const scrollElements = document.querySelectorAll('.scroll-elem');
    scrollElements.forEach(el => {
        scrollObserver.observe(el);
    });
});
