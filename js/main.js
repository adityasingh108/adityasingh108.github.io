/**
 * Cyber Nebula Theme - Main JavaScript
 * Features: Matrix rain, navbar scroll, mobile menu, smooth scroll,
 * fade-in animations, skill bars, counters, form handling, glitch effect, typing
 */

(function() {
    'use strict';

    /* ============================================
       MATRIX RAIN CANVAS BACKGROUND
       ============================================ */
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animationId;
        let isActive = true;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        function drawMatrix() {
            if (!isActive) return;

            ctx.fillStyle = 'rgba(10, 10, 18, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#06b6d4';
            ctx.font = fontSize + 'px JetBrains Mono';

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationId = requestAnimationFrame(drawMatrix);
        }

        drawMatrix();

        // Pause when tab is hidden to save resources
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isActive = false;
                cancelAnimationFrame(animationId);
            } else {
                isActive = true;
                drawMatrix();
            }
        });
    }

    /* ============================================
       NAVBAR SCROLL EFFECT
       ============================================ */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /* ============================================
       MOBILE HAMBURGER MENU
       ============================================ */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ============================================
       SMOOTH SCROLL NAVIGATION
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================
       INTERSECTION OBSERVER - FADE IN ANIMATIONS
       ============================================ */
    const fadeElements = document.querySelectorAll(
        '.section-header, .about-grid, .skills-grid, .timeline-item, ' +
        '.project-card, .writeup-card, .achievement-card, .education-card, ' +
        '.contact-grid, .hub-card, .ctf-card, .progress-wrapper'
    );

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    /* ============================================
       SKILL BAR ANIMATION ON SCROLL
       ============================================ */
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                if (width) {
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                }
                skillObserver.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    /* ============================================
       COUNTER ANIMATION FOR STATS
       ============================================ */
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const duration = 2000;
                const start = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeOut * target);
                    el.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(num => {
        counterObserver.observe(num);
    });

    /* ============================================
       CONTACT FORM HANDLING
       ============================================ */
    const contactForm = document.querySelector('.terminal-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            // FormSubmit.co handles the actual submission
            // This is just for visual feedback before redirect
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 3000);
        });
    }

    /* ============================================
       GLITCH EFFECT ON HERO TITLE
       ============================================ */
    const glitchTitle = document.querySelector('.glitch-text');
    if (glitchTitle) {
        let glitchInterval;

        function triggerGlitch() {
            glitchTitle.style.animation = 'none';
            void glitchTitle.offsetWidth; // Force reflow
            glitchTitle.style.animation = '';
        }

        // Random glitch every 5-10 seconds
        function scheduleGlitch() {
            const delay = 5000 + Math.random() * 5000;
            glitchInterval = setTimeout(() => {
                triggerGlitch();
                scheduleGlitch();
            }, delay);
        }

        scheduleGlitch();

        // Glitch on hover
        glitchTitle.addEventListener('mouseenter', triggerGlitch);
    }

    /* ============================================
       TYPING EFFECT FOR TERMINAL
       ============================================ */
    const terminalCommands = document.querySelectorAll('.terminal-command.blink');
    terminalCommands.forEach(cmd => {
        const text = cmd.textContent;
        let index = 0;
        cmd.textContent = '';

        function typeChar() {
            if (index < text.length) {
                cmd.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 100 + Math.random() * 100);
            } else {
                cmd.classList.add('blink');
            }
        }

        // Start typing after a short delay
        setTimeout(typeChar, 1000);
    });

    /* ============================================
       ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
       ============================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function highlightNavLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Initial call

    /* ============================================
       NEON GLOW EFFECT ON INTERACTIVE ELEMENTS
       ============================================ */
    const interactiveElements = document.querySelectorAll(
        '.btn-primary, .project-card, .writeup-card, .hub-card, .ctf-card'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'all 0.3s ease';
        });
    });

    /* ============================================
       PARALLAX EFFECT FOR HERO
       ============================================ */
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }

    /* ============================================
       PROGRESS BAR ANIMATION FOR eJPT PAGE
       ============================================ */
    const progressBarFill = document.querySelector('.progress-bar-fill');
    if (progressBarFill) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetWidth = progressBarFill.style.width;
                    progressBarFill.style.width = '0%';
                    setTimeout(() => {
                        progressBarFill.style.width = targetWidth;
                    }, 300);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressObserver.observe(progressBarFill.parentElement);
    }

    /* ============================================
       UTILITY: DEBOUNCE FUNCTION
       ============================================ */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Debounced resize handler for canvas
    window.addEventListener('resize', debounce(() => {
        if (canvas) {
            resizeCanvas();
        }
    }, 250));

    /* ============================================
       CONSOLE EASTER EGG
       ============================================ */
    console.log('%c Welcome to Aditya\'s Cybersecurity Portfolio ',
        'background: linear-gradient(135deg, #7c3aed, #06b6d4); color: #f8fafc; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c If you\'re reading this, you might be a developer too! ',
        'color: #06b6d4; font-size: 12px;');
    console.log('%c GitHub: https://github.com/adityasingh108 ',
        'color: #94a3b8; font-size: 11px;');

})();
