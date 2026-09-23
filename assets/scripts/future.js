/**
 * FUTURISTIC AI ENGINEER PORTFOLIO — INTERACTIVE RUNTIME
 * Progressive enhancement with smooth animations and premium interactions
 */

(function() {
  'use strict';

  // ============================================
  // GLOBAL STATE & UTILITIES
  // ============================================

  const state = {
    mobileNavOpen: false,
    certLightboxOpen: false,
    activeHudTab: 'profile-hud',
    terminalHistory: []
  };

  const $$ = (sel) => document.querySelectorAll(sel);
  const $ = (sel) => document.querySelector(sel);

  function showToast(message, duration = 3000) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  function smoothScrollTo(target) {
    const element = typeof target === 'string' ? $(target) : target;
    if (!element) return;

    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // ============================================
  // AMBIENT CANVAS BACKGROUND
  // ============================================

  const canvas = $('#bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity * 0.4})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.08 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      animationId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // ============================================
  // CURSOR SPOTLIGHT TRACKING
  // ============================================

  const spotlight = $('#spotlight');
  if (spotlight) {
    let spotlightX = window.innerWidth / 2;
    let spotlightY = window.innerHeight / 2;
    let currentX = spotlightX;
    let currentY = spotlightY;

    document.addEventListener('mousemove', (e) => {
      spotlightX = e.clientX;
      spotlightY = e.clientY;
    });

    function updateSpotlight() {
      currentX += (spotlightX - currentX) * 0.08;
      currentY += (spotlightY - currentY) * 0.08;

      spotlight.style.left = currentX + 'px';
      spotlight.style.top = currentY + 'px';

      requestAnimationFrame(updateSpotlight);
    }

    updateSpotlight();
  }

  // ============================================
  // NAVIGATION ACTIVE STATE & SCROLL SPY
  // ============================================

  const navItems = $$('.nav-item');
  const sections = $$('section[id]');

  function updateActiveNav() {
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('is-active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      smoothScrollTo(targetId);
      history.pushState(null, '', targetId);
    }
  });

  // ============================================
  // MOBILE NAVIGATION DRAWER
  // ============================================

  const hamburgerBtn = $('#hamburger-btn');
  const mobileDrawer = $('#mobile-nav-drawer');
  const mobileOverlay = $('#mobile-nav-overlay');
  const mobileCloseBtn = $('#mobile-nav-close');
  const mobileNavItems = $$('.mobile-nav-item');

  function openMobileNav() {
    if (!mobileDrawer || !mobileOverlay) return;
    state.mobileNavOpen = true;
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    if (hamburgerBtn) hamburgerBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileDrawer || !mobileOverlay) return;
    state.mobileNavOpen = false;
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileNav);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Close on mobile nav item click
  mobileNavItems.forEach(item => {
    item.addEventListener('click', closeMobileNav);
  });

  // ESC key to close mobile nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.mobileNavOpen) {
      closeMobileNav();
    }
  });

  // ============================================
  // CERTIFICATE LIGHTBOX MODAL
  // ============================================

  const certLightbox = $('#cert-lightbox');
  const lightboxImg = $('#lightbox-img');
  const lightboxTitle = $('#lightbox-title');
  const lightboxIssuer = $('#lightbox-issuer');
  const certCloseBtn = $('#cert-lightbox-close');

  function openCertLightbox(imgSrc, title, issuer) {
    if (!certLightbox || !lightboxImg) return;

    state.certLightboxOpen = true;
    lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxIssuer) lightboxIssuer.textContent = issuer || '';

    certLightbox.classList.add('open');
    certLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCertLightbox() {
    if (!certLightbox) return;
    state.certLightboxOpen = false;
    certLightbox.classList.remove('open');
    certLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Certificate click handlers
  $$('[data-img]').forEach(element => {
    element.addEventListener('click', () => {
      const imgSrc = element.dataset.img;
      const title = element.dataset.title || '';
      const issuer = element.dataset.issuer || '';
      openCertLightbox(imgSrc, title, issuer);
    });
  });

  if (certCloseBtn) {
    certCloseBtn.addEventListener('click', closeCertLightbox);
  }

  if (certLightbox) {
    certLightbox.addEventListener('click', (e) => {
      if (e.target === certLightbox) closeCertLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.certLightboxOpen) {
      closeCertLightbox();
    }
  });

  // ============================================
  // HUD CONSOLE TAB SWITCHING
  // ============================================

  const hudTabs = $$('.hud-tab');
  const hudBodyTabs = $$('.hud-body-tab');

  hudTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Update tab buttons
      hudTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update tab content
      hudBodyTabs.forEach(body => {
        body.classList.remove('active');
        if (body.id === `tab-${targetTab}`) {
          body.classList.add('active');
        }
      });

      state.activeHudTab = targetTab;
    });
  });

  // ============================================
  // INTERACTIVE TERMINAL REPL
  // ============================================

  const terminalInput = $('#terminal-input');
  const terminalOutput = $('#terminal-output');

  const terminalCommands = {
    whoami: () => {
      return 'Jaiinderveer Singh — AI Engineer & Full-Stack Developer. GNDEC Ludhiana CSE \'28.';
    },
    projects: () => {
      return `<div class="term-line out"><strong>PRODUCTION SYSTEMS:</strong></div>
<div class="term-line out">  [01] Relay AI — Autonomous agent + voice calling platform</div>
<div class="term-line out">  [02] BookHive — Smart library management with AI assistant</div>
<div class="term-line out">  [03] Delegate AI — Agent workflow prototype</div>
<div class="term-line out">  [04] Training Diary — Public learning documentation</div>
<div class="term-line out">→ Scroll down to <a href="#projects" style="color: #22d3ee;">Projects Section</a> for detailed specs.</div>`;
    },
    skills: () => {
      return `<div class="term-line out"><strong>CORE CAPABILITIES:</strong></div>
<div class="term-line out">  • Agentic AI: LLM orchestration, tool calling, multi-agent systems</div>
<div class="term-line out">  • Backend: FastAPI, Python asyncio, JWT auth, RESTful design</div>
<div class="term-line out">  • Frontend: React.js, modern JavaScript (ES6+), responsive CSS</div>
<div class="term-line out">  • Data: MySQL (relational), MongoDB (NoSQL), schema design</div>
<div class="term-line out">  • CS Fundamentals: C++, DSA (165+ solved), algorithm analysis</div>`;
    },
    contact: () => {
      return `<div class="term-line out"><strong>COMMUNICATION CHANNELS:</strong></div>
<div class="term-line out">  EMAIL: jaiinderveersingh@gmail.com</div>
<div class="term-line out">  GITHUB: github.com/Jaiinderveer</div>
<div class="term-line out">  LINKEDIN: linkedin.com/in/jaiinderveer-singh-282a1130b</div>`;
    },
    'run relay': () => {
      return `<div class="term-line out"><span style="color: #28c840;">[RELAY AI AGENT RUNTIME]</span></div>
<div class="term-line out">→ Initializing autonomous task delegation engine...</div>
<div class="term-line out">→ Loading ElevenLabs voice synthesis module...</div>
<div class="term-line out">→ Connecting Twilio telephony interface...</div>
<div class="term-line out">→ Mounting React dashboard at localhost:3000...</div>
<div class="term-line out">→ FastAPI backend ready on :8000 (async workers: 4)</div>
<div class="term-line out"><span style="color: #22d3ee;">✓ SYSTEM OPERATIONAL</span> — Ready for agent workflows.</div>`;
    },
    clear: () => {
      if (terminalOutput) {
        terminalOutput.innerHTML = `<div class="term-line banner">⚡ JAIINDERVEER AI AGENT RUNTIME v2.6.4</div>
<div class="term-line muted">Type 'help' or click suggestions below to execute workflows.</div>`;
      }
      return null;
    },
    help: () => {
      return `<div class="term-line out"><strong>AVAILABLE COMMANDS:</strong></div>
<div class="term-line out">  whoami      → Display identity & credentials</div>
<div class="term-line out">  projects    → List production systems</div>
<div class="term-line out">  skills      → Show technical capabilities</div>
<div class="term-line out">  contact     → Communication channel info</div>
<div class="term-line out">  run relay   → Simulate Relay AI agent startup</div>
<div class="term-line out">  clear       → Clear terminal screen</div>`;
    }
  };

  function executeTerminalCommand(cmd) {
    if (!terminalOutput) return;

    const trimmedCmd = cmd.trim().toLowerCase();

    // Add prompt line
    const promptLine = document.createElement('div');
    promptLine.className = 'term-line prompt-line';
    promptLine.innerHTML = `<span class="term-user">visitor@relay</span>:<span class="term-path">~</span>$ <span class="term-cmd">${cmd}</span>`;
    terminalOutput.appendChild(promptLine);

    // Execute command
    const handler = terminalCommands[trimmedCmd];
    if (handler) {
      const result = handler();
      if (result !== null) {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = result;
        terminalOutput.appendChild(resultDiv);
      }
    } else {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'term-line out';
      errorDiv.style.color = '#ff5f57';
      errorDiv.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
      terminalOutput.appendChild(errorDiv);
    }

    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value;
        if (cmd.trim()) {
          executeTerminalCommand(cmd);
          state.terminalHistory.push(cmd);
          terminalInput.value = '';
        }
      }
    });
  }

  // Terminal quick-chip buttons
  $$('.term-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (terminalInput) terminalInput.value = cmd;
      executeTerminalCommand(cmd);
      if (terminalInput) terminalInput.value = '';
    });
  });

  // ============================================
  // BENTO CARD MOUSE-TRACKING GLOW
  // ============================================

  $$('.bento-card').forEach(card => {
    const glowSurface = card.querySelector('.bento-glow-surface');
    if (!glowSurface) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      glowSurface.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)`;
    });

    card.addEventListener('mouseleave', () => {
      glowSurface.style.background = '';
    });
  });

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================

  const revealElements = $$('.bento-card, .skill-matrix-card, .stream-item, .cert-grid-card');

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(index % 4) * 80}ms`;
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ============================================
  // FOOTER LIVE CLOCK (IST)
  // ============================================

  const footerTimeEl = $('#footer-time-ist');
  if (footerTimeEl) {
    function updateISTTime() {
      const now = new Date();
      const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      footerTimeEl.textContent = `IST ${istTime} UTC+5:30`;
    }

    updateISTTime();
    setInterval(updateISTTime, 1000);
  }

  // ============================================
  // INITIALIZATION COMPLETE
  // ============================================

  console.log('%c⚡ JAIINDERVEER PORTFOLIO RUNTIME v2.6.4', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  console.log('%cInteractive systems loaded. Command palette: Ctrl+K or Cmd+K', 'color: #8896ab; font-size: 12px;');

})();
