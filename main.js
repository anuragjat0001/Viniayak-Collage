/* ═══════════════════════════════════════════════════════════
   VINAYAK PG COLLEGE – MAIN.JS
   Loader · Nav · 2D Particle Canvas · Form · Utilities
════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ──────────────────────────────────────
  // LOADING SCREEN CONTROLLER
  // ──────────────────────────────────────
  const LOADER_MESSAGES = [
    'Initialising 3D Experience…',
    'Loading Campus Assets…',
    'Rendering Architecture…',
    'Preparing Environment…',
    'Welcome to Vinayak PG College'
  ];

  let loaderProgress = 0;
  let loaderInterval;
  const loaderBar  = document.getElementById('loaderBar');
  const loaderText = document.getElementById('loaderText');
  const loader     = document.getElementById('loader');

  function advanceLoader() {
    loaderProgress += Math.random() * 18 + 10;
    if (loaderProgress > 100) loaderProgress = 100;

    if (loaderBar)  loaderBar.style.width = loaderProgress + '%';
    if (loaderText) {
      const idx = Math.min(
        Math.floor((loaderProgress / 100) * LOADER_MESSAGES.length),
        LOADER_MESSAGES.length - 1
      );
      loaderText.textContent = LOADER_MESSAGES[idx];
    }

    if (loaderProgress >= 100) {
      clearInterval(loaderInterval);
      finishLoader();
    }
  }

  function finishLoader() {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden-loader');
        // Play hero entrance
        if (typeof window.playHeroEntrance === 'function') {
          setTimeout(window.playHeroEntrance, 300);
        }
      }
    }, 600);
  }

  function startLoader() {
    loaderInterval = setInterval(advanceLoader, 220);
    // Ensure it completes even if JS is slow
    setTimeout(() => {
      clearInterval(loaderInterval);
      loaderProgress = 100;
      if (loaderBar) loaderBar.style.width = '100%';
      finishLoader();
    }, 4500);
  }

  // ──────────────────────────────────────
  // MOBILE NAVIGATION
  // ──────────────────────────────────────
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu    = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (mobileMenu)    mobileMenu.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
  }
  window.closeMobileMenu = closeMobileMenu;

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ──────────────────────────────────────
  // 2D PARTICLE CANVAS (Background dust)
  // ──────────────────────────────────────
  function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
      W = canvas.width  = canvas.clientWidth;
      H = canvas.height = canvas.clientHeight;
      createParticles();
    }

    function createParticles() {
      const COUNT = Math.floor((W * H) / 12000);
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x:    Math.random() * W,
          y:    Math.random() * H,
          r:    Math.random() * 1.2 + 0.3,
          vx:   (Math.random() - 0.5) * 0.18,
          vy:   (Math.random() - 0.5) * 0.12 - 0.05,
          a:    Math.random() * 0.5 + 0.1,
          color: Math.random() < 0.6
            ? `rgba(212,175,119,`
            : Math.random() < 0.7
            ? `rgba(16,185,129,`
            : `rgba(255,255,255,`
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.a})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // ──────────────────────────────────────
  // HERO CANVAS RESIZE
  // ──────────────────────────────────────
  function syncHeroCanvas() {
    const heroSection = document.getElementById('home');
    const heroCanvas  = document.getElementById('heroCanvas');
    if (!heroSection || !heroCanvas) return;

    function setSize() {
      const w = heroSection.clientWidth;
      const h = heroSection.clientHeight;
      heroCanvas.style.width  = w + 'px';
      heroCanvas.style.height = h + 'px';
    }
    window.addEventListener('resize', setSize);
    setSize();
  }

  // ──────────────────────────────────────
  // CONTACT FORM HANDLER
  // ──────────────────────────────────────
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const btn     = e.target.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');

    if (btn) {
      btn.textContent = 'Sending…';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    }

    // Simulate async submission
    setTimeout(() => {
      if (btn) {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      }
      if (success) {
        success.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(success,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }
      }
      e.target.reset();
      setTimeout(() => {
        if (btn) {
          btn.textContent = 'Send Message';
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.background = '';
        }
        if (success) success.classList.add('hidden');
      }, 5000);
    }, 1800);
  };

  // ──────────────────────────────────────
  // CURSOR GLOW EFFECT (Desktop)
  // ──────────────────────────────────────
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch

    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(circle, rgba(212,175,119,0.04) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      top: 0; left: 0;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.top  = e.clientY + 'px';
      glow.style.left = e.clientX + 'px';
    });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

  // ──────────────────────────────────────
  // INTERACTIVE HOVER LIFT ON CARDS
  // ──────────────────────────────────────
  function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.course-card, .facility-card, .message-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ──────────────────────────────────────
  // NAV ACTIVE STATE ON SCROLL
  // ──────────────────────────────────────
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link, .mobile-nav-link');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.style.color = 'var(--gold-bright, #f5c469)';
              } else {
                link.style.color = '';
              }
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(s => observer.observe(s));
  }

  // ──────────────────────────────────────
  // SECTION HEADER TYPING EFFECT
  // (decorative class label)
  // ──────────────────────────────────────
  function initSectionLabels() {
    const labels = document.querySelectorAll('.section-label');
    labels.forEach(label => {
      const text = label.textContent;
      label.setAttribute('data-text', text);
    });
  }

  // ──────────────────────────────────────
  // INIT ALL
  // ──────────────────────────────────────
  function init() {
    startLoader();
    syncHeroCanvas();
    initParticleCanvas();
    initCursorGlow();
    initCardTilt();
    initScrollSpy();
    initSectionLabels();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
