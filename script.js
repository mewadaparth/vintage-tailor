/**
 * ============================================
 * PRINCE TAILOR & CLOTH - MAIN JAVASCRIPT
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {

    'use strict';

    // ==========================================
    // 1. PRELOADER
    // ==========================================

    const preloader = document.getElementById('preloader');

    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 800);
        }
    }

    window.addEventListener('load', function() {
        hidePreloader();
    });

    setTimeout(function() {
        if (preloader && !preloader.classList.contains('hidden')) {
            hidePreloader();
        }
    }, 3000);

    // ==========================================
    // 2. NAVIGATION
    // ==========================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (navOverlay) {
            navOverlay.classList.toggle('active');
        }
        document.body.classList.toggle('menu-open');
    }

    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.classList.remove('menu-open');
    }

    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', function() {
            closeMenu();
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
            navLinks.forEach(function(l) { l.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    navLinks.forEach(function(link) {
        link.addEventListener('touchstart', function() {
            navLinks.forEach(function(l) { l.classList.remove('active'); });
            this.classList.add('active');
        }, { passive: true });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ==========================================
    // 3. BACK TO TOP
    // ==========================================

    const backTopBtn = document.getElementById('backTop');

    if (backTopBtn) {
        window.addEventListener('scroll', function() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollY > 500) {
                backTopBtn.style.opacity = '1';
                backTopBtn.style.visibility = 'visible';
                backTopBtn.style.transform = 'scale(1)';
            } else {
                backTopBtn.style.opacity = '0';
                backTopBtn.style.visibility = 'hidden';
                backTopBtn.style.transform = 'scale(0.8)';
            }
        });

        backTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 4. ANIMATED COUNTERS
    // ==========================================

    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounters() {
        statNumbers.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = Math.max(1, Math.floor(target / 60));
            let current = 0;

            if (counter.dataset.animated === 'true') return;

            const interval = setInterval(function() {
                current += step;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(interval);
                } else {
                    counter.textContent = current + '+';
                }
            }, duration / 60);

            counter.dataset.animated = 'true';
        });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            observer.observe(aboutSection);
        }
    } else {
        let counterAnimated = false;
        window.addEventListener('scroll', function() {
            if (!counterAnimated) {
                const aboutSection = document.querySelector('.about');
                if (aboutSection) {
                    const rect = aboutSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.7) {
                        animateCounters();
                        counterAnimated = true;
                    }
                }
            }
        });
    }

    // ==========================================
    // 5. SMOOTH SCROLL
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 6. ACTIVE NAV LINK ON SCROLL
    // ==========================================

    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - (navbar ? navbar.offsetHeight : 80) - 50;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 7. CONTACT FORM
    // ==========================================

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name')?.value?.trim();
            const phone = document.getElementById('phone')?.value?.trim();
            const message = document.getElementById('message')?.value?.trim();

            if (!name || !phone || !message) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone.replace(/[\s\-+()]/g, ''))) {
                showToast('Please enter a valid 10-digit phone number.', 'error');
                return;
            }

            const whatsappNumber = '917023134520';
            const whatsappMessage = encodeURIComponent(
                'Name: ' + name + '\n' +
                'Phone: ' + phone + '\n' +
                'Message: ' + message
            );

            const whatsappURL = 'https://wa.me/' + whatsappNumber + '?text=' + whatsappMessage;

            showToast('Redirecting to WhatsApp...', 'success');

            setTimeout(function() {
                window.open(whatsappURL, '_blank');
                contactForm.reset();
            }, 800);
        });
    }

    // ==========================================
    // 8. TOAST NOTIFICATION
    // ==========================================

    function showToast(message, type) {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast-notification toast-' + type;
        toast.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i> ' + message;

        Object.assign(toast.style, {
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '16px 32px',
            borderRadius: '12px',
            background: type === 'success' ? 'rgba(37, 211, 102, 0.95)' : 'rgba(220, 53, 69, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.95rem',
            fontWeight: '500',
            zIndex: '99999',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: '90%',
            textAlign: 'center',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            opacity: '0',
            transform: 'translateX(-50%) translateY(-20px)'
        });

        document.body.appendChild(toast);

        requestAnimationFrame(function() {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(function() {
                toast.remove();
            }, 400);
        }, 4000);
    }

    // ==========================================
    // 9. AOS INIT
    // ==========================================

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            offset: 80,
            disable: window.innerWidth < 480
        });
    }

    // ==========================================
    // 10. ARCH CARDS - MOBILE TOUCH
    // ==========================================

    const archCards = document.querySelectorAll('.arch-card');
    let activeArchCard = null;

    archCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.classList.contains('touch-active')) {
                this.classList.remove('touch-active');
                activeArchCard = null;
                return;
            }
            
            if (activeArchCard) {
                activeArchCard.classList.remove('touch-active');
            }
            
            this.classList.add('touch-active');
            activeArchCard = this;
        });
    });

    document.addEventListener('click', function(e) {
        if (activeArchCard && !activeArchCard.contains(e.target)) {
            activeArchCard.classList.remove('touch-active');
            activeArchCard = null;
        }
    });

    window.addEventListener('scroll', function() {
        if (activeArchCard) {
            activeArchCard.classList.remove('touch-active');
            activeArchCard = null;
        }
    });

    // ==========================================
    // 11. SERVICES - VIEW ALL
    // ==========================================

    const viewAllBtn = document.getElementById('viewAllBtn');
    const servicesGrid = document.getElementById('servicesGrid');

    if (viewAllBtn && servicesGrid) {
        viewAllBtn.addEventListener('click', function() {
            servicesGrid.classList.toggle('show-all');
            
            if (servicesGrid.classList.contains('show-all')) {
                this.innerHTML = 'Show Less <i class="fas fa-arrow-up"></i>';
                this.classList.add('active');
            } else {
                this.innerHTML = 'View All Services <i class="fas fa-arrow-down"></i>';
                this.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 12. SCROLL INDICATOR
    // ==========================================

    const scrollIndicator = document.getElementById('scrollIndicator');

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollIndicator) {
            if (scrollY > 300) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
    });

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const nextSection = heroSection.nextElementSibling;
                if (nextSection) {
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
                    const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // ==========================================
    // 13. RIPPLE EFFECT
    // ==========================================

    const buttons = document.querySelectorAll('.btn, .quick-action-btn');

    buttons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            this.appendChild(ripple);

            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(6, 214, 160, 0.25);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out forwards;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }

        .btn, .quick-action-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyle);

    console.log('✅ Prince Tailor & Cloth - Website Loaded Successfully');
});