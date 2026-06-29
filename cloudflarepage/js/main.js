// === CYBERSECURITY PORTFOLIO INTERACTIVITY ===

// === MATRIX RAIN EFFECT ===
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let columns;
const fontSize = 14;
const drops = [];

// Characters for matrix rain (mix of Latin and Katakana-like characters)
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    columns = Math.floor(width / fontSize);
    
    // Reset drops
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Start above viewport
    }
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px JetBrains Mono';
    
    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Vary color for some characters
        if (Math.random() > 0.95) {
            ctx.fillStyle = '#00d4ff';
        } else if (Math.random() > 0.98) {
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = '#00ff41';
        }
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
}

resizeCanvas();
setInterval(drawMatrix, 50);

window.addEventListener('resize', resizeCanvas);

// === NAVBAR SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
});

// === MOBILE HAMBURGER MENU ===
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// === SMOOTH SCROLLING FOR NAV LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// === INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ===
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to all major elements and observe them
document.querySelectorAll('.about-card, .about-image, .skill-category, .timeline-item, .project-card, .achievement-card, .edu-card, .contact-item, .contact-terminal').forEach(el => {
    el.classList.add('fade-in');
    fadeInObserver.observe(el);
});

// === CONTACT FORM HANDLING ===
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', function(e) {
        // Don't prevent default — let formsubmit.co handle it
        // Just update UI to show sending state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="prompt">$</span> transmitting...';
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'wait';
        
        // The form will naturally redirect to formsubmit.co
        // If submission succeeds, user lands on thanks page
        // If it fails, browser back button works normally
        
        // Fallback: restore button after 10s in case of network issues
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.cursor = 'pointer';
        }, 10000);
    });
}

// === TYPING EFFECT FOR HERO TERMINAL ===
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// === GLITCH EFFECT ON NAME (Optional enhancement) ===
function glitchEffect(element) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let iterations = 0;
    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');
        
        if (iterations >= originalText.length) {
            clearInterval(interval);
        }
        
        iterations += 1/3;
    }, 30);
}

// Apply glitch effect on page load for the hero title
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero .terminal-line:first-child .response');
    if (heroTitle) {
        setTimeout(() => {
            glitchEffect(heroTitle);
        }, 500);
    }
});

// === SKILL TAG COUNTER ANIMATION ===
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = stat.textContent;
        const isPercent = target.includes('%');
        const numericValue = parseInt(target.replace(/\D/g, ''));
        
        let current = 0;
        const increment = Math.ceil(numericValue / 50);
        const duration = 1500;
        const stepTime = duration / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                stat.textContent = target;
            } else {
                stat.textContent = current + (isPercent ? '%' : '+');
                setTimeout(updateCounter, stepTime);
            }
        };
        
        // Use intersection observer to trigger counter animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(stat);
    });
}

animateCounters();

// === PARALLAX EFFECT FOR MATRIX CANVAS ===
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    canvas.style.transform = `translateY(${scrollY * 0.3}px)`;
});

// === CONSOLE EASTER EGG ===
console.log('%c[SECURITY PORTFOLIO]', 'color: #00ff41; font-size: 16px; font-weight: bold;');
console.log('%c> Aditya Kumar Singh - Security Analyst', 'color: #00d4ff; font-size: 12px;');
console.log('%c> VAPT | Web | API | Mobile | Cloud | Network', 'color: #8888a0; font-size: 11px;');
console.log('%c> 100+ vulnerabilities found and counting...', 'color: #ffd700; font-size: 11px;');
