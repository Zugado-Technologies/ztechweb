import { initNavigation } from './navigation.js';
import { initForms } from './forms.js';

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function initOrbixDock() {
  const readingEl = document.querySelector('.orbix-dock-reading');
  const dockMenuBtn = document.querySelector('.orbix-dock-menu-btn, .orbix-dock-toggle');
  const drawer = document.querySelector('.mobile-drawer');

  if (readingEl) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      readingEl.textContent = `${Math.min(100, Math.max(0, progress))}%`;
    }, { passive: true });
  }

  if (dockMenuBtn && drawer) {
    dockMenuBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      dockMenuBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
}

/**
 * Scrollytelling Character-by-Character Text Reveal
 * Inspired by Orbix Studio Manifesto scroll scrub
 */
function initScrollyManifesto() {
  const manifesto = document.querySelector('.orbix-manifesto-para');
  if (!manifesto) return;

  const rawText = manifesto.textContent.trim();
  manifesto.innerHTML = '';

  const words = rawText.split(/\s+/);
  const chars = [];

  words.forEach((word, wIdx) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';
    wordSpan.style.marginRight = '0.3em';

    for (let i = 0; i < word.length; i++) {
      const c = document.createElement('span');
      c.className = 'orbix-char ghost';
      c.textContent = word[i];
      wordSpan.appendChild(c);
      chars.push(c);
    }
    manifesto.appendChild(wordSpan);
  });

  function updateScrolly() {
    const rect = manifesto.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    // Calculate progress as manifesto moves through middle of viewport
    const startY = windowH * 0.85;
    const endY = windowH * 0.25;
    const currentY = rect.top;

    let progress = (startY - currentY) / (startY - endY);
    progress = Math.max(0, Math.min(1, progress));

    const activeCount = Math.floor(progress * chars.length);

    chars.forEach((c, idx) => {
      if (idx <= activeCount) {
        c.classList.remove('ghost');
        c.classList.add('active');
      } else {
        c.classList.remove('active');
        c.classList.add('ghost');
      }
    });
  }

  window.addEventListener('scroll', updateScrolly, { passive: true });
  window.addEventListener('resize', updateScrolly, { passive: true });
  updateScrolly();
}

/**
 * Draggable Elastic Badges with Spring Snapback
 */
function initDraggablePills() {
  const pills = document.querySelectorAll('.orbix-drag-pill');
  if (!pills.length) return;

  pills.forEach((pill) => {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    pill.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      pill.setPointerCapture(e.pointerId);
      pill.style.transition = 'none';
      pill.style.zIndex = '50';
    });

    pill.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      pill.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        pill.releasePointerCapture(e.pointerId);
      } catch (err) {}
      // Spring bounce back to initial origin
      currentX = 0;
      currentY = 0;
      pill.style.transition = 'transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      pill.style.transform = 'translate3d(0, 0, 0)';
      pill.style.zIndex = '10';
    };

    pill.addEventListener('pointerup', endDrag);
    pill.addEventListener('pointercancel', endDrag);
  });
}

/**
 * Process Tab Switcher
 */
function initProcessTabs() {
  const tabs = document.querySelectorAll('.orbix-tab-btn');
  const panels = document.querySelectorAll('.orbix-tab-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * Accessible FAQ Accordion
 */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.orbix-faq-question');
  if (!questions.length) return;

  questions.forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.orbix-faq-item');
      const isOpen = item.classList.contains('open');

      // Close other items
      document.querySelectorAll('.orbix-faq-item').forEach(i => {
        i.classList.remove('open');
        const btn = i.querySelector('.orbix-faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initForms();
  initScrollReveal();
  initOrbixDock();
  initScrollyManifesto();
  initDraggablePills();
  initProcessTabs();
  initFaqAccordion();
});
