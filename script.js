/**
 * Zugado Technologies — Launching Soon Interactive Script
 * Handles real-time countdown, 3D tilt effects, modal interactions, and newsletter subscriptions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Countdown Timer
  initCountdown();

  // 2. Interactive 3D Stage Tilt
  init3DTilt();

  // 3. Modal Dialog Triggers
  initModal();

  // 4. Form Submissions
  initForms();

  // 5. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/**
 * Real-time Countdown Timer
 */
function initCountdown() {
  const daysEl = document.getElementById('days-val');
  const hoursEl = document.getElementById('hours-val');
  const minutesEl = document.getElementById('minutes-val');
  const secondsEl = document.getElementById('seconds-val');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Stored target or set to 14 days, 8 hours, 54 minutes from now
  const STORAGE_KEY = 'zugado_launch_target_timestamp';
  let targetTime = localStorage.getItem(STORAGE_KEY);

  if (!targetTime || isNaN(targetTime)) {
    // 14 days, 8 hours, 54 minutes, 11 seconds into the future (matches reference starting point)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    futureDate.setHours(futureDate.getHours() + 8);
    futureDate.setMinutes(futureDate.getMinutes() + 54);
    futureDate.setSeconds(futureDate.getSeconds() + 11);
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
      // Subtle pulse effect on second tick
      secondsEl.parentElement.classList.add('tick-pulse');
      setTimeout(() => secondsEl.parentElement.classList.remove('tick-pulse'), 300);
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 3D Parallax Tilt Effect on Centerpiece
 */
function init3DTilt() {
  const stage = document.getElementById('visual-stage');
  const tiltCard = document.getElementById('tilt-element');

  if (!stage || !tiltCard || window.matchMedia('(max-width: 1024px)').matches) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  stage.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/**
 * Modal Handling
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

  // Close when clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * Form Submission handling (Inline and Modal)
 */
function initForms() {
  const inlineForm = document.getElementById('inline-sub-form');
  const inlineInput = document.getElementById('inline-email-input');
  const inlineFeedback = document.getElementById('inline-feedback');

  const modalForm = document.getElementById('modal-sub-form');
  const modalInput = document.getElementById('modal-email-input');
  const modalFeedback = document.getElementById('modal-feedback');

  function handleSubscribe(e, inputEl, feedbackEl, isModal) {
    e.preventDefault();
    const email = inputEl.value.trim();

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedbackEl.className = 'form-feedback error';
      feedbackEl.textContent = 'Please enter a valid email address.';
      return;
    }

    // Success State
    feedbackEl.className = 'form-feedback success';
    feedbackEl.innerHTML = '&#10003; You are on the VIP launch list! We will notify you soon.';
    inputEl.value = '';

    // Save to localStorage simulation
    const subscribers = JSON.parse(localStorage.getItem('zugado_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('zugado_subscribers', JSON.stringify(subscribers));
    }

    if (isModal) {
      setTimeout(() => {
        const modal = document.getElementById('notify-modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, 2500);
    }
  }

  if (inlineForm && inlineInput && inlineFeedback) {
    inlineForm.addEventListener('submit', (e) => handleSubscribe(e, inlineInput, inlineFeedback, false));
  }

  if (modalForm && modalInput && modalFeedback) {
    modalForm.addEventListener('submit', (e) => handleSubscribe(e, modalInput, modalFeedback, true));
  }
}
