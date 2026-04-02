/* ═══════════════════════════════════════════════════════════
   VINAYAK PG COLLEGE – GSAP ANIMATIONS
   Hero reveal · Scroll triggers · Counter · Parallax
════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initAnimations, 80);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ──────────────────────────────────────
    // HERO ENTRANCE (triggered after loader)
    // ──────────────────────────────────────
    window.playHeroEntrance = function () {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl
        .to('#heroBadge', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2
        })
        .to('.hero-line-1', {
          opacity: 1,
          y: 0,
          duration: 0.9,
          clipPath: 'inset(0% 0% 0% 0%)'
        }, '-=0.4')
        .to('.hero-line-2', {
          opacity: 1,
          y: 0,
          duration: 0.9,
        }, '-=0.6')
        .to('.hero-line-3', {
          opacity: 1,
          y: 0,
          duration: 0.7,
        }, '-=0.5')
        .to('#heroTagline', {
          opacity: 1,
          y: 0,
          duration: 0.7,
        }, '-=0.4')
        .to('#heroDesc', {
          opacity: 1,
          y: 0,
          duration: 0.7,
        }, '-=0.4')
        .to('#heroBtns', {
          opacity: 1,
          y: 0,
          duration: 0.6,
        }, '-=0.3')
        .to('#heroStats', {
          opacity: 1,
          y: 0,
          duration: 0.7,
          onComplete: animateHeroStats
        }, '-=0.2');

      return tl;
    };

    // ── Stat counter animation ──
    function animateHeroStats() {
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = el.dataset.target;
        if (!target) return;

        const isYear = target === '2005';
        const isAlumni = target.includes('+');
        const numericTarget = parseInt(target.replace(/\D/g, ''));
        const start = isYear ? 1990 : 0;

        const obj = { val: start };
        gsap.to(obj, {
          val: numericTarget,
          duration: 2,
          ease: 'power2.out',
          onUpdate() {
            const v = Math.floor(obj.val);
            el.textContent = isAlumni ? v.toLocaleString() + '+' : v.toLocaleString();
          },
          onComplete() {
            el.textContent = isAlumni ? numericTarget.toLocaleString() + '+' : numericTarget.toLocaleString();
          }
        });
      });
    }

    // ──────────────────────────────────────
    // NAVBAR SCROLL EFFECT
    // ──────────────────────────────────────
    ScrollTrigger.create({
      start: 'top -60',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: '#navbar' }
    });

    // ──────────────────────────────────────
    // SCROLL REVEAL – Intersection Observer
    // ──────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseFloat(el.style.transitionDelay || '0');
            setTimeout(() => {
              el.classList.add('revealed');
            }, delay * 1000);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));

    // ──────────────────────────────────────
    // GSAP SCROLLTRIGGER – SECTION PINNING
    // (subtle background colour shift)
    // ──────────────────────────────────────
    gsap.utils.toArray('section').forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(sec, { '--section-opacity': 1, duration: 0.5, ease: 'power2.out' });
        }
      });
    });

    // ──────────────────────────────────────
    // COURSE CARDS STAGGER
    // ──────────────────────────────────────
    ScrollTrigger.batch('.course-card', {
      start: 'top 85%',
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out'
          }
        );
      },
      once: true
    });

    // ──────────────────────────────────────
    // FACILITY CARDS STAGGER
    // ──────────────────────────────────────
    ScrollTrigger.batch('.facility-card', {
      start: 'top 85%',
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, y: 40, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'back.out(1.2)'
          }
        );
      },
      once: true
    });

    // ──────────────────────────────────────
    // ADMISSION STEPS STAGGER
    // ──────────────────────────────────────
    ScrollTrigger.batch('.admission-step', {
      start: 'top 88%',
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out'
          }
        );
      },
      once: true
    });

    // ──────────────────────────────────────
    // ABOUT FACTS COUNTER-LIKE REVEAL
    // ──────────────────────────────────────
    ScrollTrigger.batch('.about-fact', {
      start: 'top 85%',
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'back.out(1.5)'
          }
        );
      },
      once: true
    });

    // ──────────────────────────────────────
    // SECTION TITLE UNDERLINE ANIMATE
    // ──────────────────────────────────────
    document.querySelectorAll('.section-divider').forEach(div => {
      gsap.fromTo(div,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: div,
            start: 'top 88%',
            once: true
          }
        }
      );
    });

    // ──────────────────────────────────────
    // MESSAGE CARDS ENTRANCE
    // ──────────────────────────────────────
    ScrollTrigger.batch('.message-card', {
      start: 'top 85%',
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, y: 35, rotateY: 3 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
          }
        );
      },
      once: true
    });

    // ──────────────────────────────────────
    // PARALLAX ON SECTION GLOW ELEMENTS
    // ──────────────────────────────────────
    gsap.utils.toArray('.message-glow, .admission-glow').forEach(el => {
      gsap.to(el, {
        y: '-20%',
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });

    // ──────────────────────────────────────
    // CONTACT ITEMS STAGGER
    // ──────────────────────────────────────
    ScrollTrigger.batch('.contact-item', {
      start: 'top 88%',
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, x: -25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
          }
        );
      },
      once: true
    });

    // ──────────────────────────────────────
    // ELIGIBILITY CARDS STAGGER
    // ──────────────────────────────────────
    ScrollTrigger.batch('.eligibility-card', {
      start: 'top 87%',
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: 'power2.out'
          }
        );
      },
      once: true
    });

    // ──────────────────────────────────────
    // FOOTER LOGO GLOW PULSE
    // ──────────────────────────────────────
    gsap.to('footer .logo-badge', {
      boxShadow: '0 0 25px rgba(212,175,119,0.35)',
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // ──────────────────────────────────────
    // ACTIVE NAV LINK HIGHLIGHT
    // ──────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    function setActiveLink(id) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--gold-bright)';
        }
      });
    }

    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter:      () => setActiveLink(sec.id),
        onEnterBack:  () => setActiveLink(sec.id),
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
