// KoInfo - Unified main.js
// Language management - uses SITE from site-config.js

let currentLang = localStorage.getItem('lang_' + SITE.id) || SITE.lang;

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang_' + SITE.id, lang);
  document.documentElement.lang = (lang === 'ko') ? 'ko' : SITE.htmlLang;
  applyTranslations();
  updateLangButton();
}

function toggleLanguage() {
  setLanguage(currentLang === 'ko' ? SITE.lang : 'ko');
}

function applyTranslations() {
  const t = translations[currentLang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key]) el.innerHTML = t[key];
  });
}

function updateLangButton() {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = translations[currentLang]['nav.lang'];
}

// Mobile menu
function toggleMenu() {
  const nav = document.getElementById('nav-links');
  nav.classList.toggle('active');
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const hero = document.querySelector('.hero');
  if (!hero) {
    navbar.classList.add('scrolled');
    return;
  }

  function checkScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

// Accordion
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasActive = item.classList.contains('active');

      item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
      });

      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

// Animated counter for stats
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const isRank = el.classList.contains('stat-rank');
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);

          const suffixRank = currentLang === 'ko' ? SITE.suffixRank.ko : SITE.suffixRank.native;
          const suffixCount = currentLang === 'ko' ? SITE.suffixCount.ko : SITE.suffixCount.native;

          if (isRank) {
            el.textContent = current + (progress >= 1 ? suffixRank : '');
          } else {
            el.textContent = current.toLocaleString();
            if (progress >= 1) {
              el.textContent = target.toLocaleString() + (target > 1000 ? suffixCount : '');
            }
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// Hero Slideshow
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startTimer() {
    timer = setInterval(nextSlide, 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goToSlide(parseInt(dot.dataset.slide));
      startTimer();
    });
  });

  startTimer();
}

// Init - run immediately if DOM already ready, otherwise wait
function initApp() {
  applySiteBranding();
  applyTranslations();
  updateLangButton();
  initAccordions();
  animateCounters();
  initNavbarScroll();
  initHeroSlideshow();

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('nav-links').classList.remove('active');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
