// ====================
// INTERACTIVE WEBSITE SYSTEM
// ====================

// Disable browser shortcuts and overlays
document.addEventListener('DOMContentLoaded', () => {
    // Add js-loaded class to enable animations
    document.body.classList.add('js-loaded');
    
    // Allow right-click context menu (removed prevention)
    
    // Prevent common browser shortcuts that might cause overlays
    document.addEventListener('keydown', (e) => {
        // Prevent F1 (help), F12 (dev tools), etc.
        if (e.key === 'F1' || e.key === 'F12' || 
            (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I'))) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    
    // Remove any potential overlay elements
    const removeOverlays = () => {
        const overlaySelectors = [
            '[role="tooltip"]',
            '[data-tooltip]',
            '.tooltip',
            '.shortcut-overlay',
            '.accessibility-overlay',
            '.browser-shortcut',
            '*[title]'
        ];
        
        overlaySelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (selector === '*[title]') {
                    el.removeAttribute('title');
                } else {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                }
            });
        });
    };
    
    // Run overlay removal on load and periodically
    removeOverlays();
    setInterval(removeOverlays, 1000);
    
    // Observer to remove dynamically added overlays
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                setTimeout(removeOverlays, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====================
// SCROLL EFFECTS
// ====================

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.borderBottom = '2px solid var(--primary-neon)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.borderBottom = '1px solid var(--border-glow)';
    }
});

// Cyber glitch effect for title
const title = document.querySelector('.hero-content h1');
if (title) {
    setInterval(() => {
        title.style.textShadow = `
            ${Math.random() * 10}px ${Math.random() * 10}px 0 var(--primary-neon),
            ${Math.random() * -10}px ${Math.random() * 10}px 0 var(--secondary-neon)
        `;
        setTimeout(() => {
            title.style.textShadow = '0 0 30px var(--primary-neon)';
        }, 100);
    }, 3000);
}

// ====================
// SCROLL ANIMATIONS
// ====================

// Scroll Animation Observer with anti-glitch measures
const observeElements = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    let animationTimeout = {};
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const elementId = entry.target.getAttribute('id') || entry.target.className;
            
            // Clear any pending animations for this element
            if (animationTimeout[elementId]) {
                clearTimeout(animationTimeout[elementId]);
            }
            
            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                // Element is sufficiently visible - show it
                animationTimeout[elementId] = setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 50);
            } else if (!entry.isIntersecting || entry.intersectionRatio < 0.05) {
                // Element is clearly out of view - hide it
                animationTimeout[elementId] = setTimeout(() => {
                    entry.target.classList.remove('visible');
                }, 100);
            }
        });
    }, {
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5],
        rootMargin: '100px 0px 100px 0px'
    });

    elements.forEach(element => {
        observer.observe(element);
    });
};

// Certificate cards animation observer
const observeCertCards = () => {
    const certCards = document.querySelectorAll('.cert-card');
    let cardTimeout = {};
    
    const certObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            const cardId = `cert-${index}`;
            
            // Clear any pending animations for this card
            if (cardTimeout[cardId]) {
                clearTimeout(cardTimeout[cardId]);
            }
            
            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                // Card is sufficiently visible - show with stagger
                cardTimeout[cardId] = setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150 + 100);
            } else if (!entry.isIntersecting || entry.intersectionRatio < 0.05) {
                // Card is clearly out of view - hide it
                cardTimeout[cardId] = setTimeout(() => {
                    entry.target.classList.remove('visible');
                }, 150);
            }
        });
    }, {
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5],
        rootMargin: '80px 0px 80px 0px'
    });

    certCards.forEach(card => {
        certObserver.observe(card);
    });
};

// Scroll direction tracking
let lastScrollTop = 0;
let scrollDirection = 'down';
let scrollTimeout;

window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Clear previous timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Debounce scroll direction changes
    scrollTimeout = setTimeout(() => {
        if (currentScrollTop > lastScrollTop) {
            scrollDirection = 'down';
        } else {
            scrollDirection = 'up';
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        document.body.setAttribute('data-scroll-direction', scrollDirection);
    }, 10);
}, false);

// ====================
// POINT-BASED HOVER LIFT ANIMATIONS SYSTEM
// ====================

// Calculate hover position as percentage within element
function getHoverPosition(element, event) {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    return { x, y };
}

// Calculate rotation based on hover position (fixed direction)
function calculateRotation(hoverX, hoverY) {
    // Convert percentage to rotation values (positive for outward lift)
    const rotateY = ((hoverX - 50) / 50) * -8; // Max 8 degrees (negative for correct direction)
    const rotateX = ((hoverY - 50) / 50) * 6; // Max 6 degrees (positive for outward)
    return { rotateX, rotateY };
}

// Apply point-based hover lift effect
function addPointHoverEffect(element, event) {
    // Get hover position
    const { x, y } = getHoverPosition(element, event);
    const { rotateX, rotateY } = calculateRotation(x, y);
    
    // Set CSS custom properties for the lift effect
    element.style.setProperty('--hover-x', `${x}%`);
    element.style.setProperty('--hover-y', `${y}%`);
    element.style.setProperty('--rotate-x', `${rotateX}deg`);
    element.style.setProperty('--rotate-y', `${rotateY}deg`);
    
    // Add lift effect class
    element.classList.add('point-lift');
}

// Remove hover lift effect
function removePointHoverEffect(element) {
    element.classList.remove('point-lift');
    element.classList.add('point-lift-return');
    
    setTimeout(() => {
        element.classList.remove('point-lift-return');
        element.style.removeProperty('--hover-x');
        element.style.removeProperty('--hover-y');
        element.style.removeProperty('--rotate-x');
        element.style.removeProperty('--rotate-y');
    }, 400);
}

// ====================
// HOVER EVENT LISTENERS - DISABLED
// ====================

// All hover effects have been removed as requested

// ====================
// SCROLL PROGRESS BAR
// ====================

// Update scroll progress bar
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercentage + '%';
    }
}

// Listen for scroll events
window.addEventListener('scroll', updateScrollProgress);

// Initialize progress bar on page load
document.addEventListener('DOMContentLoaded', updateScrollProgress);

// ====================
// FLOATING SHAPES PARALLAX
// ====================

// Parallax effect for floating shapes
document.addEventListener('mousemove', (event) => {
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    const { clientX, clientY } = event;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.01;
        const x = (clientX - centerX) * speed;
        const y = (clientY - centerY) * speed;
        
        shape.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
    });
});

// ====================
// INITIALIZATION
// ====================

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    observeCertCards();
    
    // Add cyber startup effect
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('🚀 CYBER PORTFOLIO SYSTEM ONLINE');
    console.log('🎯 Lift animations active - Click sections to lift them!');
    console.log('🌟 Scroll animations initialized');
    console.log('⚡ Interactive system ready');
});