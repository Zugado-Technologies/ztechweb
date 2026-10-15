/**
 * Zugado Technologies — V2 Interactive Script
 * Canvas node network, 3D mouse parallax tilt, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNetworkCanvas();
  init3DStageTilt();
  initNavigation();
});

/**
 * 1. Interactive Background Network Canvas
 */
function initNetworkCanvas() {
  const canvas = document.getElementById('bg-network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 18000); // Dynamic count based on screen area
    const clampedCount = Math.min(Math.max(count, 35), 90);

    for (let i = 0; i < clampedCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 1,
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
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.baseAlpha + ')';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(245, 205, 27, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * 2. 3D Interactive Parallax Tilt on Stage
 */
function init3DStageTilt() {
  const stage = document.getElementById('tech-stage');
  const card = document.getElementById('tech-card');
  const coords = document.getElementById('stage-coords');

  if (!stage || !card || window.matchMedia('(max-width: 1024px)').matches) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    const rotX = normY * -12;
    const rotY = normX * 12;

    card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    if (coords) {
      coords.textContent = `X: ${normX.toFixed(2)} • Y: ${normY.toFixed(2)}`;
    }
  });

  stage.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (coords) {
      coords.textContent = 'X: 0.00 • Y: 0.00';
    }
  });
}

/**
 * 3. Navigation & Smooth Scroll
 */
function initNavigation() {
  const toggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
