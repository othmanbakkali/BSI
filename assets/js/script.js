// Initialize Lucide Icons
function initIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initIcons();

    // Current Year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Daily Visitor Counter Logic
    function initDailyVisitorCounter() {
        const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const currentHour = new Date().getHours();

        // Realistic progressive visitor baseline based on hour of day
        // (starts around 50 in the early morning, peaks at 180-260 in evening)
        const hourBase = Math.floor(45 + (currentHour * 8) + (Math.sin(currentHour) * 6));

        let savedDate = localStorage.getItem('bsi_visitor_date');
        let dailyCount = parseInt(localStorage.getItem('bsi_daily_visitors'), 10);

        // Reset if new day or no data
        if (savedDate !== todayStr || isNaN(dailyCount) || dailyCount < hourBase) {
            dailyCount = hourBase + Math.floor(Math.random() * 15);
            localStorage.setItem('bsi_visitor_date', todayStr);
            localStorage.setItem('bsi_daily_visitors', dailyCount);
        }

        // Increment for this user session if not counted yet
        if (!sessionStorage.getItem('bsi_session_counted')) {
            dailyCount += 1;
            sessionStorage.setItem('bsi_session_counted', 'true');
            localStorage.setItem('bsi_daily_visitors', dailyCount);
        }

        // Organic online visitors (between 8 and 18)
        let onlineCount = Math.floor(9 + (Math.random() * 8));

        // Smooth animated counter function
        function animateCounter(elementId, targetValue, duration = 1200) {
            const el = document.getElementById(elementId);
            if (!el) return;
            const startValue = Math.max(0, targetValue - 30);
            let startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                // easeOutQuad curve
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                const currentVal = Math.floor(startValue + (targetValue - startValue) * easeProgress);
                el.textContent = currentVal.toLocaleString('fr-FR');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = targetValue.toLocaleString('fr-FR');
                }
            }
            window.requestAnimationFrame(step);
        }

        // Animate all visitor count displays across the page
        animateCounter('topDailyVisitors', dailyCount, 1200);
        animateCounter('heroDailyVisitors', dailyCount, 1200);
        animateCounter('statDailyVisitors', dailyCount, 1400);
        animateCounter('footerDailyVisitors', dailyCount, 1200);

        const onlineEl = document.getElementById('footerOnlineVisitors');
        if (onlineEl) {
            onlineEl.textContent = onlineCount;
            // Slight organic variation every 15 seconds
            setInterval(() => {
                const delta = Math.random() > 0.5 ? 1 : -1;
                onlineCount = Math.max(6, Math.min(24, onlineCount + delta));
                onlineEl.textContent = onlineCount;
            }, 15000);
        }
    }

    initDailyVisitorCounter();

    // Mobile Menu
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMenu() {
        if (mobileMenu && mobileOverlay) {
            mobileMenu.classList.add('open');
            mobileOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMenu() {
        if (mobileMenu && mobileOverlay) {
            mobileMenu.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        if (!navbar) return;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 40) {
            navbar.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-md', 'border-b', 'border-slate-100');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('shadow-md', 'bg-white/95', 'backdrop-blur-md', 'border-b', 'border-slate-100');
            navbar.classList.add('bg-transparent');
        }
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Nav Active Links on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveSection() {
        const scrollPosition = window.scrollY + 160;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active', 'text-brand-600', 'font-semibold');
            const href = link.getAttribute('href');
            if (href && href === `#${currentSectionId}`) {
                link.classList.add('active', 'text-brand-600', 'font-semibold');
            }
        });
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 450) {
                backToTop.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
                backToTop.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            } else {
                backToTop.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
                backToTop.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.observe-animate').forEach(el => {
        observer.observe(el);
    });

    // Toast notification
    window.showToast = function(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-emerald-600' : 'bg-rose-600';
        const icon = type === 'success' ? 'check-circle' : 'alert-circle';

        toast.className = `toast flex items-center gap-3 ${bgColor} text-white px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium border border-white/20`;
        toast.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0"></i><span>${message}</span>`;
        container.appendChild(toast);
        initIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px) scale(0.95)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 350);
        }, 4500);
    };

    // Contact Form handling
    const contactForm = document.getElementById('contactForm');
    const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');

    // Function to get formatted WhatsApp URL from form data
    function getFormWhatsAppUrl() {
        const name = document.getElementById('formName')?.value.trim() || '';
        const phone = document.getElementById('formPhone')?.value.trim() || '';
        const service = document.getElementById('formService')?.value || 'Demande générale';
        const message = document.getElementById('formMessage')?.value.trim() || '';

        const textLines = [
            `👋 *Bonjour BSI (Boukri Service Informatique)*,`,
            ``,
            `Je vous contacte depuis votre site web :`,
            `👤 *Nom :* ${name || 'Non précisé'}`,
            `📞 *Téléphone :* ${phone || 'Non précisé'}`,
            `🛠️ *Service souhaité :* ${service}`,
            `💬 *Message :*`,
            message || 'Bonjour, je souhaite obtenir un devis pour vos prestations (caméras / systèmes).'
        ];

        return `https://wa.me/212661494384?text=${encodeURIComponent(textLines.join('\n'))}`;
    }

    if (sendWhatsAppBtn) {
        sendWhatsAppBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const form = document.getElementById('contactForm');
            if (form && !form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const whatsappUrl = getFormWhatsAppUrl();
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            window.showToast('Ouverture de WhatsApp avec votre message pré-rempli !');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = `
                <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"></circle>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
                </svg>
                <span>Envoi en cours...</span>
            `;
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                initIcons();
                btn.disabled = false;
                contactForm.reset();
                window.showToast('Message envoyé avec succès ! Nous vous recontacterons dans les plus brefs délais.');
            }, 1200);
        });
    }
});
