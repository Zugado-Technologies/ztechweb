/**
 * Zugado Technologies — Dual-Mode & Stealth Interactive Engine
 * Handles Stealth Mode toggle, 2-day countdown, 3D tilt effects, and modal interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Stealth Mode Toggle Engine
  initStealthMode();

  // 2. Real-time Countdown Timer (2-Day Target)
  initCountdown();

  // 3. Interactive 3D Stages (Light & Stealth)
  init3DStages();

  // 4. Background Particle Network Canvas
  initNetworkCanvas();

  // 5. Modal Dialog & Subscriptions
  initModal();
  initForms();

  // 6. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/**
 * 1. Stealth Mode Switch Engine
 */
function initStealthMode() {
  const toggleBtn = document.getElementById('stealth-toggle');
  const toggleWrapper = document.querySelector('.stealth-toggle-wrapper');
  const statusText = document.getElementById('stealth-status-text');
  const logoImg = document.getElementById('brand-logo-img');
  const metaTheme = document.getElementById('meta-theme-color');
  const viewLight = document.getElementById('view-light-mode');
  const viewStealth = document.getElementById('view-stealth-mode');

  if (!toggleBtn) return;

  // Stored state or default to FALSE (Light mode by default)
  const STORAGE_KEY = 'zugado_stealth_mode_v2';
  let isStealth = localStorage.getItem(STORAGE_KEY) === 'true';

  function applyStealthMode(active, save = true) {
    isStealth = active;

    if (active) {
      document.body.classList.add('stealth-active');
      toggleBtn.setAttribute('aria-checked', 'true');
      if (statusText) statusText.textContent = 'ACTIVE';
      if (logoImg) logoImg.src = 'assets/zugado_logo_white.png';
      if (metaTheme) metaTheme.setAttribute('content', '#07090e');
      if (viewLight) viewLight.setAttribute('aria-hidden', 'true');
      if (viewStealth) viewStealth.setAttribute('aria-hidden', 'false');
    } else {
      document.body.classList.remove('stealth-active');
      toggleBtn.setAttribute('aria-checked', 'false');
      if (statusText) statusText.textContent = 'OFF';
      if (logoImg) logoImg.src = 'assets/zugado_logo_dark.png';
      if (metaTheme) metaTheme.setAttribute('content', '#ffffff');
      if (viewLight) viewLight.setAttribute('aria-hidden', 'false');
      if (viewStealth) viewStealth.setAttribute('aria-hidden', 'true');
    }

    if (save) {
      localStorage.setItem(STORAGE_KEY, active ? 'true' : 'false');
    }
  }

  // Set initial state
  applyStealthMode(isStealth, false);

  // Toggle handlers
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    applyStealthMode(!isStealth);
  });

  if (toggleWrapper) {
    toggleWrapper.addEventListener('click', () => {
      applyStealthMode(!isStealth);
    });
  }
}

/**
 * 2. Real-time Countdown Timer (2-Day Target)
 */
function initCountdown() {
  const daysEl = document.getElementById('days-val');
  const hoursEl = document.getElementById('hours-val');
  const minutesEl = document.getElementById('minutes-val');
  const secondsEl = document.getElementById('seconds-val');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const STORAGE_KEY = 'zugado_launch_target_2days';
  let targetTime = localStorage.getItem(STORAGE_KEY);

  if (!targetTime || isNaN(targetTime)) {
    // 2 days into the future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    targetTime = futureDate.getTime();
    localStorage.setItem(STORAGE_KEY, targetTime.toString());
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  function updateTimer() {
    const now = Date.now();
    let diff = targetTime - now;

    if (diff <= 0) {
      diff = 0;
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n.toString());

    if (daysEl.textContent !== pad(days)) daysEl.textContent = pad(days);
    if (hoursEl.textContent !== pad(hours)) hoursEl.textContent = pad(hours);
    if (minutesEl.textContent !== pad(minutes)) minutesEl.textContent = pad(minutes);
    if (secondsEl.textContent !== pad(seconds)) {
      secondsEl.textContent = pad(seconds);
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 3. Interactive 3D Stages Parallax Tilt
 */
function init3DStages() {
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  // Light Stage
  const lightStage = document.getElementById('visual-stage');
  const lightCard = document.getElementById('tilt-element');

  if (lightStage && lightCard) {
    lightStage.addEventListener('mousemove', (e) => {
      const rect = lightStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
      lightCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    lightStage.addEventListener('mouseleave', () => {
      lightCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // Stealth Stage
  const stealthStage = document.getElementById('stealth-visual-stage');
  const stealthCard = document.getElementById('stealth-tilt-card');
  const coords = document.getElementById('stealth-coords');

  if (stealthStage && stealthCard) {
    stealthStage.addEventListener('mousemove', (e) => {
      const rect = stealthStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const normX = (x - rect.width / 2) / (rect.width / 2);
      const normY = (y - rect.height / 2) / (rect.height / 2);

      const rotateX = normY * -12;
      const rotateY = normX * 12;

      stealthCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (coords) {
        coords.textContent = `X: ${normX.toFixed(2)} • Y: ${normY.toFixed(2)}`;
      }
    });

    stealthStage.addEventListener('mouseleave', () => {
      stealthCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (coords) {
        coords.textContent = 'X: 0.00 • Y: 0.00';
      }
    });
  }
}

/**
 * 4. Background Particle Network Canvas
 */
function initNetworkCanvas() {
  const canvas = document.getElementById('bg-network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.max(Math.floor((width * height) / 18000), 30), 80);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.6 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(245, 205, 27, ' : 'rgba(255, 255, 255, ',
        baseAlpha: Math.random() * 0.35 + 0.15,
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();

  function animate() {
    // Only draw when stealth mode is active to save resources
    if (document.body.classList.contains('stealth-active')) {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 2;
            p.y -= (dy / dist) * force * 2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.baseAlpha + ')';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 205, 27, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * 5. Modal Dialog Handling
 */
function initModal() {
  const modal = document.getElementById('notify-modal');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.getElementById('modal-close');
  const emailInput = document.getElementById('modal-email-input');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (emailInput) emailInput.focus();
    }, 200);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 6. Form Submission Handlers
 */
function initForms() {
  const inlineForm = document.getElementById('inline-sub-form');
  const inlineFeedback = document.getElementById('inline-feedback');
  const modalForm = document.getElementById('modal-sub-form');
  const modalFeedback = document.getElementById('modal-feedback');

  if (inlineForm && inlineFeedback) {
    inlineForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('inline-email-input');
      const email = input ? input.value.trim() : '';

      if (email) {
        inlineFeedback.textContent = "✓ You're on the list! We will notify you on launch day.";
        inlineFeedback.className = 'form-feedback success';
        if (input) input.value = '';
        setTimeout(() => {
          inlineFeedback.textContent = '';
        }, 5000);
      }
    });
  }

  if (modalForm && modalFeedback) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('modal-email-input');
      const email = input ? input.value.trim() : '';

      if (email) {
        modalFeedback.textContent = "✓ Access granted. Invitation link dispatched to your inbox.";
        modalFeedback.className = 'modal-feedback success';
        if (input) input.value = '';
        setTimeout(() => {
          const modal = document.getElementById('notify-modal');
          if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
          modalFeedback.textContent = '';
        }, 2200);
      }
    });
  }
}
