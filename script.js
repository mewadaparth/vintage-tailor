/**
 * ============================================
 * VINTAGE THE MENS TAILOR - MAIN JAVASCRIPT
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {

    'use strict';

    // ==========================================
    // 1. PRELOADER
    // ==========================================

    var preloader = document.getElementById('preloader');

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

    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var navOverlay = document.getElementById('navOverlay');
    var navLinks = document.querySelectorAll('.nav-link');

    if (navbar) {
        window.addEventListener('scroll', function() {
            var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    function toggleMenu() {
        if (navToggle) navToggle.classList.toggle('active');
        if (navMenu) navMenu.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    function closeMenu() {
        if (navToggle) navToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
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

    if (navLinks.length > 0) {
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
    }

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

    var backTopBtn = document.getElementById('backTop');

    if (backTopBtn) {
        window.addEventListener('scroll', function() {
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
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

    var statNumbers = document.querySelectorAll('.stat-number');

    function animateCounters() {
        statNumbers.forEach(function(counter) {
            var target = parseInt(counter.getAttribute('data-count'));
            var duration = 2000;
            var step = Math.max(1, Math.floor(target / 60));
            var current = 0;

            if (counter.dataset.animated === 'true') return;

            var interval = setInterval(function() {
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

    if (statNumbers.length > 0) {
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        animateCounters();
                    }
                });
            }, { threshold: 0.5 });

            var aboutSection = document.querySelector('.about');
            if (aboutSection) {
                observer.observe(aboutSection);
            }
        } else {
            var counterAnimated = false;
            window.addEventListener('scroll', function() {
                if (!counterAnimated) {
                    var aboutSection = document.querySelector('.about');
                    if (aboutSection) {
                        var rect = aboutSection.getBoundingClientRect();
                        if (rect.top < window.innerHeight * 0.7) {
                            animateCounters();
                            counterAnimated = true;
                        }
                    }
                }
            });
        }
    }

    // ==========================================
    // 5. SMOOTH SCROLL
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                var navbarHeight = navbar ? navbar.offsetHeight : 80;
                var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

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

    var sections = document.querySelectorAll('section[id]');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            var current = '';

            sections.forEach(function(section) {
                var sectionTop = section.offsetTop - (navbar ? navbar.offsetHeight : 80) - 50;
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
    }

    // ==========================================
    // 7. CONTACT FORM
    // ==========================================

    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var nameInput = document.getElementById('name');
            var phoneInput = document.getElementById('phone');
            var messageInput = document.getElementById('message');

            var name = nameInput ? nameInput.value.trim() : '';
            var phone = phoneInput ? phoneInput.value.trim() : '';
            var message = messageInput ? messageInput.value.trim() : '';

            if (!name || !phone || !message) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            var phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone.replace(/[\s\-+()]/g, ''))) {
                showToast('Please enter a valid 10-digit phone number.', 'error');
                return;
            }

            var whatsappNumber = '919558022630';
            var whatsappMessage = encodeURIComponent(
                'Name: ' + name + '\n' +
                'Phone: ' + phone + '\n' +
                'Message: ' + message
            );

            var whatsappURL = 'https://wa.me/' + whatsappNumber + '?text=' + whatsappMessage;

            showToast('Redirecting to WhatsApp...', 'success');

            setTimeout(function() {
                window.open(whatsappURL, '_blank');
                if (contactForm) contactForm.reset();
            }, 800);
        });
    }

    // ==========================================
    // 8. TOAST NOTIFICATION
    // ==========================================

    function showToast(message, type) {
        var existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        var toast = document.createElement('div');
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

    var archCards = document.querySelectorAll('.arch-card');
    var activeArchCard = null;

    if (archCards.length > 0) {
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
    }

    // ==========================================
    // 11. SERVICES - VIEW ALL
    // ==========================================

    var viewAllBtn = document.getElementById('viewAllBtn');
    var servicesGrid = document.getElementById('servicesGrid');

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

    var scrollIndicator = document.getElementById('scrollIndicator');

    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollY > 300) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });

        scrollIndicator.addEventListener('click', function() {
            var heroSection = document.querySelector('.hero');
            if (heroSection) {
                var nextSection = heroSection.nextElementSibling;
                if (nextSection) {
                    var navbarHeight = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 80;
                    var targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

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

    var buttons = document.querySelectorAll('.btn, .quick-action-btn');

    if (buttons.length > 0) {
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');

                var rect = this.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);

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

        var rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(201, 168, 124, 0.25);
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
    }

    console.log('✅ Vintage The Mens Tailor - Website Loaded Successfully');

});
// ==========================================
// 14. GALLERY LIGHTBOX (Optional Feature)
// ==========================================

var galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length > 0) {
    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var overlay = this.querySelector('.gallery-overlay');
            if (overlay) {
                // Toggle a class for expanded view
                this.classList.toggle('expanded');
            }
        });
    });
}

// ==========================================
// 15. GALLERY IMAGE LOADING ANIMATION
// ==========================================

var galleryImages = document.querySelectorAll('.gallery-image');

if (galleryImages.length > 0) {
    var galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, { threshold: 0.2 });

    galleryImages.forEach(function(img) {
        img.style.opacity = '0.6';
        img.style.transform = 'scale(0.98)';
        img.style.transition = 'all 0.6s ease';
        galleryObserver.observe(img);
    });
}
// ==========================================
// 14. GALLERY - SMOOTH ANIMATIONS
// ==========================================

var galleryItems = document.querySelectorAll('.gallery-item');

// Gallery Scroll Reveal Animation
if (galleryItems.length > 0 && 'IntersectionObserver' in window) {
    var galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                // Add a small delay for each item for staggered effect
                var delay = index * 80;
                setTimeout(function() {
                    entry.target.classList.add('reveal');
                }, delay);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    galleryItems.forEach(function(item) {
        // Set initial state for smooth entrance
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px) scale(0.92)';
        item.style.transition = 'none';
        galleryObserver.observe(item);
    });
}

// Gallery Item Click - Expanded View (Optional Feature)
if (galleryItems.length > 0) {
    galleryItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            // Prevent if clicking on a link inside
            if (e.target.closest('a')) return;
            
            // Toggle expanded state
            this.classList.toggle('expanded');
            
            // Create/remove backdrop
            var backdrop = document.querySelector('.gallery-expanded-backdrop');
            if (this.classList.contains('expanded')) {
                if (!backdrop) {
                    backdrop = document.createElement('div');
                    backdrop.className = 'gallery-expanded-backdrop';
                    document.body.appendChild(backdrop);
                }
                backdrop.classList.add('active');
                document.body.style.overflow = 'hidden';
                backdrop.addEventListener('click', function() {
                    document.querySelector('.gallery-item.expanded')?.classList.remove('expanded');
                    this.classList.remove('active');
                    document.body.style.overflow = '';
                });
            } else {
                if (backdrop) {
                    backdrop.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Close expanded gallery on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var expanded = document.querySelector('.gallery-item.expanded');
        if (expanded) {
            expanded.classList.remove('expanded');
            var backdrop = document.querySelector('.gallery-expanded-backdrop');
            if (backdrop) {
                backdrop.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }
});

// ==========================================
// 15. GALLERY - PARALLAX ON SCROLL
// ==========================================

if (galleryItems.length > 0) {
    window.addEventListener('scroll', function() {
        var gallerySection = document.querySelector('.gallery');
        if (!gallerySection) return;
        
        var rect = gallerySection.getBoundingClientRect();
        var scrollProgress = 1 - (rect.top / window.innerHeight);
        
        if (scrollProgress > 0 && scrollProgress < 1) {
            var items = document.querySelectorAll('.gallery-item');
            items.forEach(function(item, index) {
                var speed = 0.05 + (index * 0.01);
                var yOffset = scrollProgress * 20 * speed;
                if (!item.classList.contains('expanded')) {
                    item.style.transform = 'translateY(' + (yOffset) + 'px)';
                }
            });
        }
    }, { passive: true });
}

console.log('✅ Gallery Smooth Animations Loaded');
