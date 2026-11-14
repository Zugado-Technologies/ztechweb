/**
 * Zugado Labs — Dynamic Research Catalog Hydration
 * Renders active prototypes, research case studies, and confidential stealth protocols
 * with Lead Creator attribution and statutory IP notices from Admin Studio data.
 */

import initialLabs from '../data/labs.json';
import initialAuthors from '../data/authors.json';

const STORAGE_KEYS = {
  LABS: 'zugado_admin_labs_v1',
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

function renderAvatar(avatarUrl, name, size = 28) {
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
      <div class="labs-avatar-fallback" style="width: ${size}px; height: ${size}px; border-radius: 50%; background: ${bgGradient}; color: #ffffff; font-size: ${fontSize}px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
        ${initials}
      </div>
    `;
  }

  return `
    <div class="labs-avatar-wrapper" style="width: ${size}px; height: ${size}px; position: relative; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; background: ${bgGradient};">
      <img src="${escapeHtml(avatarUrl)}" 
           alt="${safeName}" 
           style="width: 100%; height: 100%; object-fit: cover; display: block;" 
           onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';" />
      <div class="labs-avatar-fallback" style="display: none; width: 100%; height: 100%; border-radius: 50%; background: ${bgGradient}; color: #ffffff; font-size: ${fontSize}px; font-weight: 700; align-items: center; justify-content: center;">
        ${initials}
      </div>
    </div>
  `;
}

export function initLabsShowcase() {
  const labsData = loadDataset(STORAGE_KEYS.LABS, initialLabs);
  const authorsData = loadDataset(STORAGE_KEYS.AUTHORS, initialAuthors);

  function getAuthor(id) {
    return authorsData.find(a => a.id === id) || {
      id: 'contributor',
      name: 'Zugado Labs Fellow',
      title: 'Systems Researcher',
      avatar: '/assets/zugado_logo_labs.png'
    };
  }

  // -------------------------------------------------------------------------
  // 1. Hydrate Layer 01: Active Prototypes
  // -------------------------------------------------------------------------
  const prototypesGrid = document.querySelector('#layer-prototypes .labs-active-grid');
  if (prototypesGrid) {
    const prototypes = labsData.filter(l => l.layer === 'layer-01-prototypes');
    if (prototypes.length > 0) {
      prototypesGrid.innerHTML = prototypes.map((item, idx) => {
        const creator = getAuthor(item.leadCreatorId);
        const num = String(idx + 1).padStart(2, '0');
        const badge = item.statusBadge || 'ACTIVE PROTOTYPE';

        return `
          <article class="labs-card reveal-on-scroll">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <span style="font-size: 0.75rem; font-family: monospace; font-weight: 700; color: #2563eb; letter-spacing: 0.08em;">PROTOTYPE // ${num}</span>
                <span style="font-size: 0.75rem; font-weight: 700; background: #eff6ff; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: var(--zg-radius-pill);">${escapeHtml(badge)}</span>
              </div>
              <h3 style="font-size: 1.65rem; font-weight: 800; color: var(--zg-dark); margin-bottom: 0.75rem;">
                ${escapeHtml(item.name)}
              </h3>
              <p style="font-size: 0.975rem; color: var(--zg-text-sub); line-height: 1.65; margin-bottom: 1.5rem;">
                ${escapeHtml(item.summary)}
              </p>

              <!-- Lead Creator Attribution -->
              <div style="display: flex; align-items: center; gap: 0.75rem; background: #f8fafc; border: 1px solid var(--zg-border); padding: 0.65rem 0.9rem; border-radius: 12px; margin-bottom: 1.25rem;">
                ${renderAvatar(creator.avatar, creator.name, 32)}
                <div style="overflow: hidden;">
                  <span style="font-size: 0.6875rem; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.06em; display: block;">Lead Creator</span>
                  <span style="font-size: 0.8125rem; font-weight: 700; color: var(--zg-dark);">${escapeHtml(creator.name)}</span>
                  <span style="font-size: 0.75rem; color: var(--zg-text-muted);"> &bull; ${escapeHtml(item.leadCreatorRole || creator.title)}</span>
                </div>
              </div>

              <!-- Tech Stack Chips -->
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
                ${(item.techStack || []).map(t => `<span style="font-size: 0.6875rem; background: #ffffff; border: 1px solid var(--zg-border); color: #334155; padding: 0.2rem 0.55rem; border-radius: 9999px; font-weight: 600;">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>

            <!-- IP Agreement Notice -->
            <div style="background: #f1f5f9; border: 1px solid var(--zg-border-subtle); border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.75rem; color: #64748b; line-height: 1.45;">
              <strong style="color: #475569;">IP Notice:</strong> ${escapeHtml(item.ipAgreementNotice || 'Governed strictly by applicable written research agreements.')}
            </div>
          </article>
        `;
      }).join('');
    }
  }

  // -------------------------------------------------------------------------
  // 2. Hydrate Layer 02: Research Case Studies
  // -------------------------------------------------------------------------
  const caseStudiesGrid = document.querySelector('#layer-casestudies .labs-case-grid');
  if (caseStudiesGrid) {
    const caseStudies = labsData.filter(l => l.layer === 'layer-02-casestudies');
    if (caseStudies.length > 0) {
      caseStudiesGrid.innerHTML = caseStudies.map((cs, idx) => {
        const creator = getAuthor(cs.leadCreatorId);
        const num = String(idx + 1).padStart(2, '0');
        const badge = cs.statusBadge || 'PUBLISHED BENCHMARK';

        return `
          <article class="labs-case-card reveal-on-scroll">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 700; color: #0284c7; letter-spacing: 0.08em;">CASE STUDY // ${num}</span>
                <span style="font-size: 0.6875rem; font-weight: 700; color: #0284c7; background: #f0f9ff; padding: 0.15rem 0.5rem; border-radius: 9999px;">${escapeHtml(badge)}</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--zg-dark); margin: 0.5rem 0 0.75rem;">
                ${escapeHtml(cs.name)}
              </h3>
              <p style="font-size: 0.925rem; color: var(--zg-text-sub); line-height: 1.6; margin-bottom: 1.25rem;">
                ${escapeHtml(cs.summary)}
              </p>

              <!-- Lead Author / Researcher Attribution -->
              <div style="display: flex; align-items: center; gap: 0.6rem; background: #f8fafc; border: 1px solid var(--zg-border); padding: 0.5rem 0.75rem; border-radius: 10px; margin-bottom: 1rem;">
                ${renderAvatar(creator.avatar, creator.name, 26)}
                <div style="overflow: hidden;">
                  <span style="font-size: 0.6875rem; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.06em; display: block;">Lead Researcher</span>
                  <span style="font-size: 0.8125rem; font-weight: 700; color: var(--zg-dark);">${escapeHtml(creator.name)}</span>
                  <span style="font-size: 0.75rem; color: var(--zg-text-muted);"> &bull; ${escapeHtml(cs.leadCreatorRole || creator.title)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <!-- Tech Stack -->
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 0.85rem;">
                ${(cs.techStack || []).map(t => `<span style="font-size: 0.6875rem; background: #f1f5f9; color: #475569; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600;">${escapeHtml(t)}</span>`).join('')}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--zg-border-subtle); padding-top: 0.75rem;">
                <span style="font-size: 0.75rem; color: #64748b; font-style: italic;">${escapeHtml(cs.ipAgreementNotice || 'Published Research')}</span>
                <a href="/blog/" style="font-size: 0.8125rem; font-weight: 600; color: #2563eb; text-decoration: none; white-space: nowrap; margin-left: 0.5rem;">Read &rarr;</a>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
  }

  // -------------------------------------------------------------------------
  // 3. Hydrate Layer 03: Undisclosed Stealth Protocols
  // -------------------------------------------------------------------------
  const stealthGrid = document.querySelector('#layer-stealth .labs-stealth-grid');
  if (stealthGrid) {
    const stealthProtocols = labsData.filter(l => l.layer === 'layer-03-stealth');
    if (stealthProtocols.length > 0) {
      stealthGrid.innerHTML = stealthProtocols.map((sp, idx) => {
        const creator = getAuthor(sp.leadCreatorId);
        const badge = sp.statusBadge || 'CONFIDENTIAL // STEALTH RESEARCH NODE';
        const techStr = (sp.techStack || []).join(' // ') || 'Restricted Discrete Mesh';

        return `
          <article class="labs-stealth-card reveal-on-scroll">
            <div class="labs-blurred-layer">
              <h4 style="font-size: 1.5rem; margin-bottom: 1rem;">${escapeHtml(sp.name)}</h4>
              <p>${escapeHtml(sp.summary)}</p>
              <pre style="background: #111; padding: 1rem; border-radius: 8px;"><code>const hash = crypto.createHmac('sha256', secret).update(nodePayload); // ${escapeHtml(techStr)}</code></pre>
            </div>

            <div class="labs-confidential-overlay">
              <div class="labs-redacted-badge">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>${escapeHtml(badge)}</span>
              </div>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">
                ${escapeHtml(sp.name)} &bull; Classified
              </h3>
              <p style="font-size: 0.875rem; color: #a1a1aa; max-width: 440px; margin: 0 auto 1.25rem; line-height: 1.5;">
                ${escapeHtml(sp.summary)}
              </p>

              <!-- Lead Creator Attribution Badge -->
              <div style="display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 0.4rem 0.85rem; border-radius: 9999px; margin-bottom: 0.75rem;">
                ${renderAvatar(creator.avatar, creator.name, 22)}
                <span style="font-size: 0.75rem; color: #e2e8f0; font-weight: 600;">
                  <strong style="color: #60a5fa;">Lead:</strong> ${escapeHtml(creator.name)}
                </span>
              </div>

              <!-- Statutory Non-Disclosure Notice -->
              <div style="font-size: 0.75rem; color: #94a3b8; font-style: italic; max-width: 400px; margin: 0 auto; line-height: 1.4;">
                ${escapeHtml(sp.ipAgreementNotice || 'Strictly governed under bilateral Non-Disclosure Agreement.')}
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
  }
}

// Auto-run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLabsShowcase);
} else {
  initLabsShowcase();
}

// React instantly to changes made in Admin Studio across tabs or windows
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEYS.LABS || e.key === STORAGE_KEYS.AUTHORS) {
    initLabsShowcase();
  }
});

// React when returning to this tab
window.addEventListener('focus', () => {
  initLabsShowcase();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    initLabsShowcase();
  }
});
