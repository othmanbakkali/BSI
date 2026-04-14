// Initialize Lucide Icons
        lucide.createIcons();

        // Current Year
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // Mobile Menu
        const menuBtn = document.getElementById('menuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        function openMenu() {
            mobileMenu.classList.add('open');
            mobileOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            mobileMenu.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        menuBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        mobileOverlay.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                navbar.style.backgroundColor = 'rgba(255,255,255,0.95)';
                navbar.style.backdropFilter = 'blur(12px)';
                navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            } else {
                navbar.style.backgroundColor = 'transparent';
                navbar.style.backdropFilter = 'none';
                navbar.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
        // Nav Items Js

        // Wait for the DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Get all the sections
            const sections = document.querySelectorAll('#accueil, #apropos, #services, #contact');
            
            // Get all the nav links (only the ones pointing to sections, excluding the button)
            const navLinks = document.querySelectorAll('.nav-link');
            
            // Function to update which link has the underline
            function updateActiveSection() {
                let current = '';
                
                // Check which section is currently in view
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    const scrollPosition = window.scrollY + 150; // 150px offset for fixed header
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });
                
                // Remove underline from all links
                navLinks.forEach(link => {
                    link.style.textDecoration = 'none';
                    // Also remove any custom underline effect
                    link.classList.remove('active');
                });
        
        if (current) {
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveSection);
    
    // Also run when page loads
    updateActiveSection();
    
    // Optional: Smooth scroll when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 

        // Back to Top
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'translateY(16px)';
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for sibling elements
                    const parent = entry.target.parentElement;
                    const siblings = parent ? parent.querySelectorAll('.observe-animate') : [];
                    let delay = 0;
                    siblings.forEach((sib, i) => {
                        if (sib === entry.target) {
                            delay = i * 100;
                        }
                    });

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.observe-animate').forEach(el => {
            observer.observe(el);
        });

        // Toast notification
        function showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
            const icon = type === 'success' ? 'check-circle' : 'alert-circle';

            toast.className = `toast flex items-center gap-3 ${bgColor} text-white px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium`;
            toast.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0"></i><span>${message}</span>`;
            container.appendChild(toast);
            lucide.createIcons();

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px) translateX(20px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }

        // Contact Form
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = `<svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"></circle><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg><span>Envoi en cours...</span>`;
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                lucide.createIcons();
                btn.disabled = false;
                this.reset();
                showToast('Message envoyé avec succès ! Nous vous répondrons rapidement.');
            }, 2000);
        });
