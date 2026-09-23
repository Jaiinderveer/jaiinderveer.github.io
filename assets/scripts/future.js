/**
 * FUTURISTIC PORTFOLIO - INTERACTIVE SYSTEM
 *
 * Progressive enhancement only: every effect here is additive.
 * If this file fails to load, or the visitor has asked for reduced
 * motion, or IntersectionObserver is missing, the page still renders
 * completely and every link still works.
 */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      history.pushState(null, '', href);
    });
  });

  /* ============================================
     NAVBAR SCROLL STATE
     ============================================ */

  var nav = document.querySelector('.nav');

  if (nav) {
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(function () {
        nav.classList.toggle('is-scrolled', window.pageYOffset > 100);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ============================================
     SCROLL REVEAL
     ============================================ */

  var revealTargets = document.querySelectorAll(
    '.project-card, .skill-card, .secondary-project, .cert-card, .timeline-item'
  );

  if ('IntersectionObserver' in window && !reduceMotion && revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      // Stagger within a row, then reset so long grids don't wait forever.
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ============================================
     CURSOR-FOLLOWING GLOW ON PROJECT CARDS
     ============================================ */

  if (!reduceMotion) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      var glow = card.querySelector('.card-glow');
      if (!glow) return;

      card.addEventListener('mousemove', function (e) {
        var rect = this.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;

        glow.style.background =
          'radial-gradient(circle at ' + x.toFixed(1) + '% ' + y.toFixed(1) +
          '%, rgba(0, 217, 255, 0.14) 0%, transparent 65%)';
      });
    });
  }

  /* ============================================
     SUBTLE 3D TILT ON PROFILE FRAME
     ============================================ */

  var profile = document.querySelector('.profile-container');

  if (profile && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    profile.addEventListener('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      var rotateX = (((e.clientY - rect.top) / rect.height) - 0.5) * -6;
      var rotateY = (((e.clientX - rect.left) / rect.width) - 0.5) * 6;

      this.style.transform =
        'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' +
        rotateY.toFixed(2) + 'deg)';
    });

    profile.addEventListener('mouseleave', function () {
      this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ============================================
     ACTIVE SECTION IN NAV
     ============================================ */

  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    var navTicking = false;

    var syncActiveLink = function () {
      var current = '';

      sections.forEach(function (section) {
        if (window.pageYOffset >= section.offsetTop - 120) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.toggle(
          'is-active',
          link.getAttribute('href') === '#' + current
        );
      });
    };

    window.addEventListener('scroll', function () {
      if (navTicking) return;
      navTicking = true;

      window.requestAnimationFrame(function () {
        syncActiveLink();
        navTicking = false;
      });
    }, { passive: true });

    syncActiveLink();
  }
})();
