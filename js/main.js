/* ==========================================================================
   Sameer Baskota — Portfolio
   Vanilla JS. No frameworks, no external dependencies.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * Loading screen
   *
   * The radar-scan loader only plays once per browsing session. A small
   * blocking script in <head> (see loader-init.js, inlined at the top of
   * every page) checks sessionStorage before first paint and adds a
   * `no-loader` class to <html> if this session has already seen it — the
   * matching CSS rule (`.no-loader #loader`) hides the loader instantly,
   * with no flash. Here we just finish cleaning up the DOM node and, on a
   * genuine first visit, run the full scan animation and record the flag.
   * ------------------------------------------------------------------ */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    var alreadySeen = document.documentElement.classList.contains('no-loader');

    if (alreadySeen) {
      // Repeat page view within the same session — remove immediately,
      // no animation, no delay.
      document.body.classList.remove('is-loading');
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      return;
    }

    var minDisplay = reduceMotion ? 150 : 900;
    var start = Date.now();

    function hide() {
      var elapsed = Date.now() - start;
      var wait = Math.max(minDisplay - elapsed, 0);
      window.setTimeout(function () {
        loader.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
        window.setTimeout(function () {
          if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 600);
      }, wait);
    }

    try {
      sessionStorage.setItem('sbLoaderShown', '1');
    } catch (e) {
      /* sessionStorage unavailable (e.g. private mode) — loader will
         simply replay on every page, which is a safe fallback. */
    }

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide);
      // Safety net in case 'load' is delayed by slow third-party-free assets
      window.setTimeout(hide, 3500);
    }
  }

  /* ------------------------------------------------------------------ *
   * Scroll progress bar
   * ------------------------------------------------------------------ */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }

    update();
    window.addEventListener('scroll', throttle(update, 16), { passive: true });
    window.addEventListener('resize', update);
  }

  /* ------------------------------------------------------------------ *
   * Header: scrolled state + mobile nav toggle
   * ------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (header) {
      function onScroll() {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
      }
      onScroll();
      window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
    }

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var isOpen = mobileNav.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileNav.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * Back to top button
   * ------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    function onScroll() {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }
    onScroll();
    window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ *
   * Scroll-triggered reveal animations
   * ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Typewriter effect (hero subtitle)
   * ------------------------------------------------------------------ */
  function initTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;

    var phrases = [
      'Aerospace Engineering Enthusiast.',
      'UAV & Drone Technology.',
      'AI & Machine Learning.',
      'Computer Vision Research.',
      'Aerial Mapping & Remote Sensing.'
    ];

    if (reduceMotion) {
      el.textContent = phrases[0];
      return;
    }

    var textSpan = document.createElement('span');
    el.appendChild(textSpan);

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var typeSpeed = 55;
    var deleteSpeed = 30;
    var holdTime = 1600;

    function tick() {
      var current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          window.setTimeout(tick, holdTime);
          return;
        }
        window.setTimeout(tick, typeSpeed);
      } else {
        charIndex--;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(tick, 300);
          return;
        }
        window.setTimeout(tick, deleteSpeed);
      }
    }

    tick();
  }

  /* ------------------------------------------------------------------ *
   * Mouse-follow spotlight
   * ------------------------------------------------------------------ */
  function initSpotlight() {
    var spot = document.getElementById('spotlight');
    if (!spot || reduceMotion || window.matchMedia('(max-width: 860px)').matches) return;

    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var currentX = targetX;
    var currentY = targetY;

    window.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animate() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      spot.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px) translate(-50%, -50%)';
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ------------------------------------------------------------------ *
   * Parallax on hero decorative layers
   * ------------------------------------------------------------------ */
  function initParallax() {
    if (reduceMotion) return;
    var layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length) return;

    function update() {
      var y = window.scrollY;
      layers.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        el.style.transform = 'translateY(' + y * speed + 'px)';
      });
    }
    update();
    window.addEventListener('scroll', throttle(update, 10), { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Contact form validation (client-side only demo — no backend)
   * ------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = document.getElementById('form-status');

    function setError(field, message) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('has-error');
      var err = wrap.querySelector('.field-error');
      if (err) err.textContent = message;
    }

    function clearError(field) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.remove('has-error');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var message = form.querySelector('#message');

      [name, email, message].forEach(clearError);

      if (!name.value.trim()) {
        setError(name, 'Please enter your name.');
        valid = false;
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        setError(email, 'Please enter a valid email address.');
        valid = false;
      }
      if (!message.value.trim() || message.value.trim().length < 10) {
        setError(message, 'Message should be at least 10 characters.');
        valid = false;
      }

      if (!valid) {
        if (status) {
          status.textContent = '';
          status.classList.remove('is-visible');
        }
        return;
      }

            var data = new URLSearchParams(new FormData(form));
      if (status) {
        status.textContent = 'Sending...';
        status.classList.add('is-visible');
      }
      fetch('https://script.google.com/macros/s/AKfycbz6CBVnOOkA_vzrRZkVAP869dCgDf4cnYHFz7XK3gsSeVwcpB-eMSC6sBdZAYKTQhMY/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: data
      })
        .then(function () {
          if (status) {
            status.textContent = 'Thank you! Your message has been sent.';
          }
          form.reset();
        })
        .catch(function () {
          if (status) {
            status.textContent = 'Something went wrong. Please email me directly.';
          }
        });
    });
  }

  /* ------------------------------------------------------------------ *
   * Project detail modal ("Read More" on Featured Project cards)
   *
   * Full project content lives in hidden <template> elements so it never
   * renders (or gets picked up by scroll-reveal/SEO parsing) until a
   * matching "Read More" button clones it into the shared modal. Closes on
   * the close button, a backdrop click, or Escape; restores focus to the
   * button that opened it and locks page scroll while open.
   * ------------------------------------------------------------------ */
  function initProjectModal() {
    var overlay = document.getElementById('project-modal');
    var body = document.getElementById('project-modal-body');
    var closeBtn = document.getElementById('project-modal-close');
    var backBtn = document.getElementById('project-modal-back');
    var openButtons = document.querySelectorAll('.read-more-btn[data-modal-target]');
    if (!overlay || !body || !openButtons.length) return;

    var lastTrigger = null;

    function openModal(templateId, trigger) {
      var template = document.getElementById(templateId);
      if (!template) return;

      body.innerHTML = '';
      body.appendChild(template.content.cloneNode(true));
      body.scrollTop = 0;

      lastTrigger = trigger || null;
      overlay.classList.add('is-open');
      document.body.classList.add('modal-open');
      closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      if (lastTrigger) {
        lastTrigger.focus();
      }
    }

    openButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-modal-target'), btn);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    if (backBtn) backBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Light / dark theme toggle
   *
   * The actual theme is already applied before first paint by the inline
   * script in <head> (reads localStorage, sets data-theme on <html>).
   * This just wires up the toggle button(s) — desktop header + mobile
   * menu — to flip that attribute, persist the choice, and keep both
   * buttons' pressed-state in sync if more than one is present.
   * ------------------------------------------------------------------ */
  function initThemeToggle() {
    var toggles = document.querySelectorAll('.theme-toggle');
    if (!toggles.length) return;

    function currentTheme() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function updateLabels() {
      var theme = currentTheme();
      var isLight = theme === 'light';
      toggles.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(isLight));
        btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        var label = btn.querySelector('.theme-toggle-label');
        if (label) label.textContent = isLight ? 'Switch to dark mode' : 'Switch to light mode';
      });
    }

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('sbTheme', theme);
      } catch (e) {
        /* localStorage unavailable — theme just won't persist across visits */
      }
      updateLabels();
    }

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(currentTheme() === 'light' ? 'dark' : 'light');
      });
    });

    updateLabels();

    // Enable smooth color transitions only after the first paint, so the
    // page never appears to "animate in" its initial (correct) theme.
    window.requestAnimationFrame(function () {
      document.documentElement.classList.add('theme-transition');
    });
  }

  /* ------------------------------------------------------------------ *
   * Gallery — scroll-reveal with stagger + idle float
   *
   * Layer 2 of the gallery's transform architecture (see gallery.css).
   * IntersectionObserver reveals each tile once, with a small stagger so
   * tiles arrive in a wave rather than all at once. Once a tile's reveal
   * transition finishes, it switches from `transition` to a gentle
   * infinite `animation` (the float) — listening for transitionend avoids
   * ever having both control the same property at once.
   * ------------------------------------------------------------------ */
  function initGalleryReveal() {
    var reveals = document.querySelectorAll('.gallery-item-reveal');
    if (!reveals.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var index = Array.prototype.indexOf.call(reveals, el);
          var delay = (index % 4) * 90;

          window.setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);

          el.addEventListener('transitionend', function onEnd(e) {
            if (e.propertyName === 'transform') {
              el.classList.add('is-floating');
              el.removeEventListener('transitionend', onEnd);
            }
          });

          observer.unobserve(el);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------ *
   * Gallery — depth parallax
   *
   * Layer 1 (outermost). Each tile drifts by a different amount based on
   * its own distance from the viewport's vertical center, scaled by a
   * per-tile speed (data-parallax-speed) — nearby "rows" drift at
   * different rates for a sense of depth, not just a uniform scroll skew.
   * rAF-throttled so it never runs more than once per frame.
   * ------------------------------------------------------------------ */
  function initGalleryParallax() {
    if (reduceMotion) return;
    var items = document.querySelectorAll('.gallery-item[data-parallax-speed]');
    if (!items.length) return;

    var ticking = false;

    function update() {
      var viewportCenter = window.innerHeight / 2;
      items.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.04;
        var rect = el.getBoundingClientRect();
        var elCenter = rect.top + rect.height / 2;
        var offset = (viewportCenter - elCenter) * speed;
        el.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
      });
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  }

  /* ------------------------------------------------------------------ *
   * Gallery — 3D tilt on hover, tap-to-reveal on touch
   *
   * Layer 3 (innermost). Desktop: tilt follows the cursor via CSS custom
   * properties, so the smooth return-to-rest on mouseleave is entirely a
   * CSS transition (no per-frame JS, no snapping). Touch devices skip the
   * tilt math entirely and get a simple tap-to-reveal toggle instead,
   * closing when the visitor taps elsewhere.
   * ------------------------------------------------------------------ */
  function initGalleryTilt() {
    var cards = document.querySelectorAll('.gallery-item-card');
    if (!cards.length) return;

    var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (isTouch) {
      cards.forEach(function (card) {
        card.addEventListener('click', function () {
          var wasActive = card.classList.contains('is-active');
          cards.forEach(function (c) {
            c.classList.remove('is-active');
          });
          if (!wasActive) card.classList.add('is-active');
        });
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.gallery-item-card')) {
          cards.forEach(function (c) {
            c.classList.remove('is-active');
          });
        }
      });
      return;
    }

    if (reduceMotion) return;

    var maxTilt = 8;

    cards.forEach(function (card) {
      function onMove(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltY = (x - 0.5) * maxTilt * 2;
        var tiltX = (0.5 - y) * maxTilt * 2;
        card.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-scale', '1.045');
      }

      function onLeave() {
        card.classList.remove('is-active');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--tilt-scale', '1');
      }

      card.addEventListener('mouseenter', function () {
        card.classList.add('is-active');
      });
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }


  /* ------------------------------------------------------------------ *
   * Site drone — the site's signature interactive moment. A small
   * top-down quadcopter escorts the cursor across the whole page (every
   * page except Contact) with an eased follow, a continuous idle
   * hover-bob, spinning rotors, and basic flight-dynamics tilt: roll
   * (bank) toward whichever way it moves left/right, pitch (nose
   * up/down) toward whichever way it moves forward/back (up/down on
   * screen). Desktop/mouse only (see the pointer:fine check below) — on
   * touch devices there is no persistent cursor for it to escort, so it
   * simply doesn't mount.
   * ------------------------------------------------------------------ */
  function initSiteDrone() {
    if (reduceMotion) return;
    if (/contact\.html$/.test(window.location.pathname)) return;
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var drone = document.createElement('div');
    drone.className = 'site-drone';
    drone.setAttribute('aria-hidden', 'true');
    drone.innerHTML =
      '<div class="site-drone-shutter"></div>' +
      '<div class="site-drone-bank">' +
        '<div class="site-drone-bob">' +
          '<svg class="site-drone-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="24" y1="24" x2="10" y2="10"/>' +
            '<line x1="24" y1="24" x2="38" y2="10"/>' +
            '<line x1="24" y1="24" x2="10" y2="38"/>' +
            '<line x1="24" y1="24" x2="38" y2="38"/>' +
            '<rect x="19" y="19" width="10" height="10" rx="2.5" fill="currentColor" stroke="none" opacity="0.16"/>' +
            '<rect x="19" y="19" width="10" height="10" rx="2.5"/>' +
            '<g class="site-drone-rotor" style="transform-origin:10px 10px;"><circle cx="10" cy="10" r="5.4" opacity="0.5"/><line x1="4.6" y1="10" x2="15.4" y2="10" opacity="0.85"/><line x1="10" y1="4.6" x2="10" y2="15.4" opacity="0.4"/></g>' +
            '<g class="site-drone-rotor" style="transform-origin:38px 10px;"><circle cx="38" cy="10" r="5.4" opacity="0.5"/><line x1="32.6" y1="10" x2="43.4" y2="10" opacity="0.85"/><line x1="38" y1="4.6" x2="38" y2="15.4" opacity="0.4"/></g>' +
            '<g class="site-drone-rotor" style="transform-origin:10px 38px;"><circle cx="10" cy="38" r="5.4" opacity="0.5"/><line x1="4.6" y1="38" x2="15.4" y2="38" opacity="0.85"/><line x1="10" y1="32.6" x2="10" y2="43.4" opacity="0.4"/></g>' +
            '<g class="site-drone-rotor" style="transform-origin:38px 38px;"><circle cx="38" cy="38" r="5.4" opacity="0.5"/><line x1="32.6" y1="38" x2="43.4" y2="38" opacity="0.85"/><line x1="38" y1="32.6" x2="38" y2="43.4" opacity="0.4"/></g>' +
            '<circle cx="24" cy="24" r="1.4" fill="var(--cyan)" stroke="none"/>' +
          '</svg>' +
        '</div>' +
      '</div>';
    document.body.appendChild(drone);

    var bank = drone.querySelector('.site-drone-bank');
    var targetX = 0, targetY = 0, curX = 0, curY = 0, prevX = 0, prevY = 0;
    var raf = null;
    var active = false;
    var tiltResetTimer = null;
    var shootTimer = null;

    function tick() {
      var dx = targetX - curX;
      var dy = targetY - curY;
      curX += dx * 0.14;
      curY += dy * 0.14;
      drone.style.transform = 'translate(' + curX + 'px, ' + curY + 'px)';

      // Basic quadcopter flight principle: roll (bank) left/right toward
      // horizontal travel, pitch nose down/up toward forward/back travel.
      var stepDx = curX - prevX;
      var stepDy = curY - prevY;
      prevX = curX;
      prevY = curY;
      if (Math.abs(stepDx) > 0.12 || Math.abs(stepDy) > 0.12) {
        var roll = Math.max(-16, Math.min(16, stepDx * 3.2));
        var pitch = Math.max(-14, Math.min(14, stepDy * -3.0));
        bank.style.transform = 'perspective(420px) rotateX(' + pitch + 'deg) rotate(' + roll + 'deg)';
        window.clearTimeout(tiltResetTimer);
        tiltResetTimer = window.setTimeout(function () {
          bank.style.transform = 'perspective(420px) rotateX(0deg) rotate(0deg)';
        }, 240);
      }

      if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    function onMove(e) {
      var x = e.clientX;
      var y = e.clientY;

      targetX = x;
      targetY = y;

      if (!active) {
        active = true;
        curX = x;
        curY = y;
        prevX = x;
        prevY = y;
        drone.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        drone.classList.add('is-active');
      }
      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    function onLeave() {
      active = false;
      drone.classList.remove('is-active');
    }

    function onDown() {
      drone.classList.add('is-shooting');
      window.clearTimeout(shootTimer);
      shootTimer = window.setTimeout(function () {
        drone.classList.remove('is-shooting');
      }, 550);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onDown);
  }


  /* ------------------------------------------------------------------ *
   * Click-to-copy buttons (Contact page email). Tries the Clipboard API
   * first; falls back to a hidden-textarea + execCommand approach for
   * contexts where that API is unavailable (e.g. a page opened directly
   * from disk via file://, without a local server).
   * ------------------------------------------------------------------ */
  function initCopyButtons() {
    var buttons = document.querySelectorAll('.copy-btn[data-copy-value]');
    if (!buttons.length) return;

    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }

    buttons.forEach(function (btn) {
      var value = btn.getAttribute('data-copy-value');
      var label = btn.querySelector('.copy-btn-label');
      var resetTimer = null;

      btn.addEventListener('click', function () {
        var done = function (success) {
          if (!success) return;
          btn.classList.add('is-copied');
          if (label) label.textContent = 'Copied!';
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(function () {
            btn.classList.remove('is-copied');
            if (label) label.textContent = 'Copy';
          }, 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(function () {
            done(true);
          }, function () {
            done(fallbackCopy(value));
          });
        } else {
          done(fallbackCopy(value));
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Active nav link (in case a page is opened without the pre-set class)
   * ------------------------------------------------------------------ */
  function markActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Utility: throttle
   * ------------------------------------------------------------------ */
  function throttle(fn, wait) {
    var lastTime = 0;
    var scheduled = false;
    return function () {
      var now = Date.now();
      var args = arguments;
      var context = this;
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(context, args);
      } else if (!scheduled) {
        scheduled = true;
        window.setTimeout(function () {
          lastTime = Date.now();
          scheduled = false;
          fn.apply(context, args);
        }, wait - (now - lastTime));
      }
    };
  }

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('is-loading');
    initLoader();
    initScrollProgress();
    initHeader();
    initBackToTop();
    initReveal();
    initTypewriter();
    initSpotlight();
    initParallax();
    initContactForm();
    initProjectModal();
    initThemeToggle();
    initGalleryReveal();
    initGalleryParallax();
    initGalleryTilt();
    initSiteDrone();
    initCopyButtons();
    markActiveNav();
  });
})();
