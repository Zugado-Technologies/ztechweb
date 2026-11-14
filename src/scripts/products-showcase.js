/**
 * Zugado Technologies — Public Products Showcase Hydration
 * Renders products and spatial engines from Admin Studio data with Lead Creator attribution.
 */

import initialProducts from '../data/products.json';
import initialAuthors from '../data/authors.json';

const STORAGE_KEYS = {
  PRODUCTS: 'zugado_admin_products_v1',
  AUTHORS: 'zugado_admin_authors_v1'
};

function loadDataset(key, fallback) {
  try {
    const local = localStorage.getItem(key);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Could not load local overlay for ${key}:`, e);
  }
  return fallback;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function renderAvatar(avatarUrl, name, size = 26) {
  const safeName = escapeHtml(name || 'Zugado Contributor');
  const initials = (name || 'Z')
    .trim()
    .split(/\s+/)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const gradients = [
    'linear-gradient(135deg, #2563eb, #1d4ed8)',
    'linear-gradient(135deg, #7c3aed, #6d28d9)',
    'linear-gradient(135deg, #059669, #047857)',
    'linear-gradient(135deg, #d97706, #b45309)',
    'linear-gradient(135deg, #0891b2, #0e7490)'
  ];
  const charCode = (name || 'Z').charCodeAt(0) || 0;
  const bgGradient = gradients[charCode % gradients.length];
  const fontSize = Math.max(10, Math.round(size * 0.42));

  if (!avatarUrl || avatarUrl === 'null' || avatarUrl === 'undefined' || avatarUrl.trim() === '') {
    return `
      <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background: ${bgGradient}; color: #ffffff; font-size: ${fontSize}px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
        ${initials}
      </div>
    `;
  }

  return `
    <div style="width: ${size}px; height: ${size}px; position: relative; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; background: ${bgGradient};">
      <img src="${escapeHtml(avatarUrl)}" 
           alt="${safeName}" 
           style="width: 100%; height: 100%; object-fit: cover; display: block;" 
           onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';" />
      <div style="display: none; width: 100%; height: 100%; border-radius: 50%; background: ${bgGradient}; color: #ffffff; font-size: ${fontSize}px; font-weight: 700; align-items: center; justify-content: center;">
        ${initials}
      </div>
    </div>
  `;
}

export function initProductsShowcase() {
  const container = document.getElementById('public-products-grid');
  if (!container) return;

  const products = loadDataset(STORAGE_KEYS.PRODUCTS, initialProducts);
  const authors = loadDataset(STORAGE_KEYS.AUTHORS, initialAuthors);

  function getAuthor(id) {
    return authors.find(a => a.id === id) || {
      id: 'architect',
      name: 'Zugado Platform Engineer',
      title: 'Systems Engineering',
      avatar: '/assets/logo_white.png'
    };
  }

  container.innerHTML = products.map((item, idx) => {
    const creator = getAuthor(item.leadCreatorId);
    const badge = item.status || 'Active';
    const tagTone = item.statusTone || 'blue';

    return `
      <article class="labs-card reveal-on-scroll" style="margin-bottom: 0;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <span style="font-size: 0.75rem; font-family: monospace; font-weight: 700; color: #2563eb; letter-spacing: 0.08em;">${escapeHtml(item.category || 'COMMERCIAL SYSTEM')}</span>
            <span style="font-size: 0.75rem; font-weight: 700; background: #eff6ff; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: var(--zg-radius-pill);">${escapeHtml(badge)}</span>
          </div>

          <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--zg-dark); margin-bottom: 0.35rem;">
            ${escapeHtml(item.name)}
          </h3>
          <div style="font-size: 0.8125rem; font-weight: 600; color: #2563eb; margin-bottom: 1rem;">
            ${escapeHtml(item.tagline || '')}
          </div>

          <p style="font-size: 0.9375rem; color: var(--zg-text-sub); line-height: 1.6; margin-bottom: 1.5rem;">
            ${escapeHtml(item.summary)}
          </p>

          <!-- Lead Creator Attribution -->
          <div style="display: flex; align-items: center; gap: 0.75rem; background: #f8fafc; border: 1px solid var(--zg-border); padding: 0.65rem 0.9rem; border-radius: 12px; margin-bottom: 1.25rem;">
            ${renderAvatar(creator.avatar, creator.name, 30)}
            <div style="overflow: hidden;">
              <span style="font-size: 0.6875rem; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.06em; display: block;">Lead Creator</span>
              <span style="font-size: 0.8125rem; font-weight: 700; color: var(--zg-dark);">${escapeHtml(creator.name)}</span>
              <span style="font-size: 0.75rem; color: var(--zg-text-muted);"> &bull; ${escapeHtml(item.leadCreatorRole || creator.title)}</span>
            </div>
          </div>

          <!-- Feature List -->
          <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: 0.4rem;">
            ${(item.features || []).map(f => `
              <li style="font-size: 0.8125rem; color: #475569; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #10b981; font-weight: 700;">&check;</span>
                <span>${escapeHtml(f)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="border-top: 1px solid var(--zg-border); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <a href="/contact/" class="zg-btn-pill-dark" style="padding: 0.45rem 1rem; font-size: 0.8125rem;">
            Inquire for Access
          </a>
          <span style="font-size: 0.75rem; color: var(--zg-text-muted);">
            Contributors: ${(item.contributors || []).length}
          </span>
        </div>
      </article>
    `;
  }).join('');
}

// Auto-run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsShowcase);
} else {
  initProductsShowcase();
}

// Sync across tabs
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEYS.PRODUCTS || e.key === STORAGE_KEYS.AUTHORS) {
    initProductsShowcase();
  }
});

window.addEventListener('focus', initProductsShowcase);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') initProductsShowcase();
});

