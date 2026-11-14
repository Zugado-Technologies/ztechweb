/**
 * Zugado Technologies — Public Blog Controller
 * Powers dynamic article listing, tag search, and reader view with Lead Author attribution.
 */

import defaultBlogs from '../data/blogs.json';
import defaultAuthors from '../data/authors.json';

class ZugadoBlogPlatform {
  constructor() {
    this.authors = this.loadData('zugado_admin_authors_v1', defaultAuthors);
    this.blogs = this.loadData('zugado_admin_blogs_v1', defaultBlogs)
      .filter(b => b.status === 'published'); // Only show published blogs publicly

    this.activeCategory = 'all';
    this.searchQuery = '';

    this.init();
  }

  loadData(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(`Could not load local overlay for ${key}:`, e);
    }
    return fallback;
  }

  init() {
    this.renderCategoryPills();
    this.renderArticles();
    this.bindEvents();
    this.checkUrlHash();
  }

  getAuthor(id) {
    return this.authors.find(a => a.id === id) || {
      id: 'contributor',
      name: 'Zugado Engineering Team',
      title: 'Systems & Research',
      division: 'Zugado Technologies',
      avatar: '/assets/logo_white.png',
      bio: 'Engineers and researchers contributing to spatial coordination, distributed infrastructure, and applied research.'
    };
  }

  bindEvents() {
    const searchInput = document.getElementById('blog-public-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderArticles();
      });
    }

    // Modal close
    const modal = document.getElementById('blog-reader-modal');
    const closeBtn = document.getElementById('blog-reader-close');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        history.pushState('', document.title, window.location.pathname);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
          history.pushState('', document.title, window.location.pathname);
        }
      });
    }

    window.addEventListener('hashchange', () => this.checkUrlHash());
  }

  renderCategoryPills() {
    const container = document.getElementById('blog-category-filter-bar');
    if (!container) return;

    const categories = ['all', ...new Set(this.blogs.map(b => b.category))];

    container.innerHTML = categories.map(cat => {
      const label = cat === 'all' ? 'All Publications' : cat;
      const isActive = cat === this.activeCategory;
      return `
        <button class="blog-cat-btn ${isActive ? 'active' : ''}" data-cat="${cat}">
          ${label}
        </button>
      `;
    }).join('');

    container.querySelectorAll('.blog-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.dataset.cat;
        this.renderCategoryPills();
        this.renderArticles();
      });
    });
  }

  renderArticles() {
    const grid = document.getElementById('blog-articles-grid');
    if (!grid) return;

    const filtered = this.blogs.filter(b => {
      const matchesCat = this.activeCategory === 'all' || b.category === this.activeCategory;
      const matchesSearch = !this.searchQuery || 
        b.title.toLowerCase().includes(this.searchQuery) ||
        b.excerpt.toLowerCase().includes(this.searchQuery) ||
        b.tags.some(t => t.toLowerCase().includes(this.searchQuery));
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #ffffff; border-radius: 20px; border: 1px solid var(--zg-border);">
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #09090b; margin-bottom: 0.5rem;">No publications found</h3>
          <p style="color: #71717a; margin: 0;">Try adjusting your search criteria or category filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(b => {
      const author = this.getAuthor(b.leadAuthorId);
      const formattedDate = new Date(b.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      return `
        <article class="blog-article-card" data-slug="${b.slug}">
          <img src="${b.coverImage || '/assets/hyperlocal_urban_grid.jpg'}" alt="${this.escapeHtml(b.title)}" class="blog-card-media" />
          <div class="blog-card-content">
            <div>
              <div class="blog-meta-strip">
                <span class="blog-category-tag">${this.escapeHtml(b.category)}</span>
                <span class="blog-read-time">${b.readTimeMinutes} min read</span>
              </div>
              <h2 class="blog-card-title">${this.escapeHtml(b.title)}</h2>
              <p class="blog-card-excerpt">${this.escapeHtml(b.excerpt)}</p>
            </div>

            <!-- Lead Author Attribution Card Footer -->
            <div class="blog-card-author">
              ${this.renderAvatar(author.avatar, author.name, 36)}
              <div class="blog-author-info">
                <span class="blog-author-name">${this.escapeHtml(author.name)}</span>
                <span class="blog-author-title">${this.escapeHtml(author.title)} &bull; ${author.division}</span>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.blog-article-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        window.location.hash = slug;
      });
    });
  }

  checkUrlHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;

    const blog = this.blogs.find(b => b.slug === hash || b.id === hash);
    if (blog) {
      this.openReader(blog);
    }
  }

  openReader(blog) {
    const modal = document.getElementById('blog-reader-modal');
    const container = document.getElementById('blog-reader-content');
    if (!modal || !container) return;

    const author = this.getAuthor(blog.leadAuthorId);
    const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1.25rem;">
          <span class="blog-category-tag">${this.escapeHtml(blog.category)}</span>
          <span style="font-size: 0.8125rem; color: #71717a;">Published ${formattedDate}</span>
          <span style="color: #cbd5e1;">&bull;</span>
          <span style="font-size: 0.8125rem; color: #71717a;">${blog.readTimeMinutes} min read</span>
        </div>

        <h1 style="font-size: 2.25rem; font-weight: 800; color: #09090b; line-height: 1.25; margin: 0 0 1.25rem;">
          ${this.escapeHtml(blog.title)}
        </h1>

        <p style="font-size: 1.15rem; color: #52525b; line-height: 1.6; margin: 0 0 2rem; border-left: 3px solid #2563eb; padding-left: 1.25rem; font-style: italic;">
          ${this.escapeHtml(blog.excerpt)}
        </p>

        <img src="${blog.coverImage || '/assets/hyperlocal_urban_grid.jpg'}" alt="${this.escapeHtml(blog.title)}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 16px; margin-bottom: 2.5rem;" />
      </div>

      <!-- Rendered Article Body -->
      <div class="admin-rendered-content" style="color: #18181b; font-size: 1.05rem; line-height: 1.75;">
        ${this.renderMarkdown(blog.contentMarkdown)}
      </div>

      <!-- Lead Author & Researcher Signature Card -->
      <div class="blog-author-bio-card">
        ${this.renderAvatar(author.avatar, author.name, 64)}
        <div style="flex: 1;">
          <div style="font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: #2563eb; letter-spacing: 0.08em; margin-bottom: 0.25rem;">
            Lead Author &amp; Researcher
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #09090b; margin: 0 0 0.2rem;">${this.escapeHtml(author.name)}</h3>
          <p style="font-size: 0.8125rem; color: #71717a; margin: 0 0 0.75rem; font-weight: 500;">
            ${this.escapeHtml(author.title)} &bull; ${author.division}
          </p>
          <p style="font-size: 0.875rem; color: #52525b; line-height: 1.6; margin: 0;">
            ${this.escapeHtml(author.bio)}
          </p>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  renderMarkdown(md) {
    if (!md) return '';
    let html = md;

    const codeBlocks = [];
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(`<pre style="background: #09090b; color: #f8fafc; padding: 1.25rem; border-radius: 12px; overflow-x: auto; font-family: monospace; font-size: 0.875rem;"><code>${this.escapeHtml(code.trim())}</code></pre>`);
      return placeholder;
    });

    html = html.replace(/`([^`]+)`/g, (match, code) => `<code style="background: #f1f5f9; color: #0f172a; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.875em;">${this.escapeHtml(code)}</code>`);
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 1.35rem; font-weight: 700; color: #09090b; margin-top: 1.75rem;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 1.65rem; font-weight: 800; color: #09090b; margin-top: 2.25rem; margin-bottom: 0.75rem;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 2rem; font-weight: 800; color: #09090b;">$1</h1>');
    html = html.replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 2.5rem 0;" />');
    html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left: 4px solid #2563eb; margin: 1.5rem 0; padding-left: 1.25rem; color: #475569; font-style: italic;">$1</blockquote>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: underline;">$1</a>');

    html = html.split('\n\n').map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<blockquote') || p.startsWith('<hr')) {
        return p;
      }
      return `<p style="margin: 1rem 0; color: #334155; line-height: 1.75;">${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    codeBlocks.forEach((block, idx) => {
      html = html.replace(`__CODE_BLOCK_${idx}__`, block);
    });

    return html;
  }

  renderAvatar(avatarUrl, name, size = 36) {
    const safeName = this.escapeHtml(name || 'Zugado Contributor');
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
    const fontSize = Math.max(12, Math.round(size * 0.42));

    if (!avatarUrl || avatarUrl === 'null' || avatarUrl === 'undefined' || avatarUrl.trim() === '') {
      return `
        <div class="blog-author-avatar-badge" style="width: ${size}px; height: ${size}px; background: ${bgGradient};">
          <span style="font-weight: 800; font-size: ${fontSize}px; color: #ffffff;">${initials}</span>
        </div>
      `;
    }

    return `
      <div class="blog-author-avatar-badge" style="width: ${size}px; height: ${size}px; background: #0b0f17; position: relative;">
        <img src="${this.escapeHtml(avatarUrl)}" 
             alt="${safeName}" 
             style="width: 100%; height: 100%; object-fit: cover; display: block;" 
             onerror="this.onerror=null; this.parentElement.style.background='${bgGradient}'; this.parentElement.innerHTML='<span style=\\'font-weight:800;font-size:${fontSize}px;color:#fff;\\'>${initials}</span>';" />
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ZugadoBlogPlatform();
});

