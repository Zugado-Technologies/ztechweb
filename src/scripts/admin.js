/**
 * Zugado Technologies — Admin Portal & Studio Controller
 * Handles Blog CMS, Zugado Labs management, Products platform, and Authors directory.
 */

import initialAuthors from '../data/authors.json';
import initialBlogs from '../data/blogs.json';
import initialLabs from '../data/labs.json';
import initialProducts from '../data/products.json';

// Local Storage Keys
const STORAGE_KEYS = {
  AUTH: 'zugado_admin_auth',
  AUTHORS: 'zugado_admin_authors_v1',
  BLOGS: 'zugado_admin_blogs_v1',
  LABS: 'zugado_admin_labs_v1',
  PRODUCTS: 'zugado_admin_products_v1',
  API_URL: 'zugado_admin_api_endpoint'
};

class AdminStudio {
  constructor() {
    this.authors = this.loadData(STORAGE_KEYS.AUTHORS, initialAuthors);
    this.blogs = this.loadData(STORAGE_KEYS.BLOGS, initialBlogs);
    this.labs = this.loadData(STORAGE_KEYS.LABS, initialLabs);
    this.products = this.loadData(STORAGE_KEYS.PRODUCTS, initialProducts);
    this.apiEndpoint = localStorage.getItem(STORAGE_KEYS.API_URL) || '/api';
    
    this.currentTab = 'blogs';
    this.editingBlogId = null;
    this.editingLabsId = null;
    this.editingProductId = null;
    this.editingAuthorId = null;

    this.init();
  }

  loadData(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
    }
    return JSON.parse(JSON.stringify(fallback));
  }

  saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key}:`, e);
    }
  }

  init() {
    this.initTheme();
    this.checkAuth();
    this.bindGlobalEvents();
    this.renderActiveTab();
    this.populateAuthorSelects();
  }

  // =========================================================================
  // Theme Management (Light / Dark)
  // =========================================================================
  initTheme() {
    const savedTheme = localStorage.getItem('zugado_admin_theme') || 'dark';
    this.setTheme(savedTheme);

    const toggleBtn = document.getElementById('admin-theme-toggle');
    if (toggleBtn && !toggleBtn.dataset.bound) {
      toggleBtn.dataset.bound = 'true';
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
        this.showToast(`Switched to ${next.toUpperCase()} theme`, 'info');
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('theme-dark', theme === 'dark');
    localStorage.setItem('zugado_admin_theme', theme);

    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }

  // =========================================================================
  // Avatar & Initials Fallback (Prevents Broken Image Icons)
  // =========================================================================
  renderAvatar(avatarUrl, name, size = 24) {
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
    const fontSize = Math.max(10, Math.round(size * 0.42));

    if (!avatarUrl || avatarUrl === 'null' || avatarUrl === 'undefined' || avatarUrl.trim() === '') {
      return `
        <div class="admin-avatar-fallback" style="width: ${size}px; height: ${size}px; border-radius: 50%; background: ${bgGradient}; color: #ffffff; font-size: ${fontSize}px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          ${initials}
        </div>
      `;
    }

    return `
      <div class="admin-avatar-wrapper" style="width: ${size}px; height: ${size}px; position: relative; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; background: ${bgGradient};">
        <img src="${this.escapeHtml(avatarUrl)}" 
             alt="${safeName}" 
             class="admin-attribution-avatar" 
             style="width: 100%; height: 100%; object-fit: cover; display: block;" 
             onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';" />
        <div class="admin-avatar-fallback" style="display: none; width: 100%; height: 100%; border-radius: 50%; background: ${bgGradient}; color: #ffffff; font-size: ${fontSize}px; font-weight: 700; align-items: center; justify-content: center;">
          ${initials}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // Authentication
  // =========================================================================
  checkAuth() {
    const isAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true' || 
                   localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';

    const gate = document.getElementById('admin-auth-gate');
    const app = document.getElementById('admin-app-root');

    if (!isAuth) {
      if (gate) gate.style.display = 'flex';
      if (app) app.style.display = 'none';
      this.bindAuthForm();
    } else {
      if (gate) gate.style.display = 'none';
      if (app) app.style.display = 'block';
    }
  }

  bindAuthForm() {
    const form = document.getElementById('admin-login-form');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = 'true';

    // Show/Hide password toggle
    const toggleBtn = document.getElementById('admin-toggle-password');
    const pwInput = document.getElementById('admin-password');
    const eyeIcon = document.getElementById('admin-pw-eye');
    const eyeOffIcon = document.getElementById('admin-pw-eye-off');

    if (toggleBtn && pwInput && !toggleBtn.dataset.bound) {
      toggleBtn.dataset.bound = 'true';
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isPassword = pwInput.type === 'password';
        pwInput.type = isPassword ? 'text' : 'password';
        if (eyeIcon) eyeIcon.style.display = isPassword ? 'none' : 'block';
        if (eyeOffIcon) eyeOffIcon.style.display = isPassword ? 'block' : 'none';
        toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        toggleBtn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('admin-username').value.trim();
      const p = document.getElementById('admin-password').value.trim();
      const err = document.getElementById('admin-login-error');

      // Default access credentials
      if ((u === 'admin' || u === 'author') && p === 'Zugado@1598') {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
        sessionStorage.setItem('zugado_admin_user', u);
        this.showToast(`Authenticated as ${u.toUpperCase()}`, 'success');
        this.checkAuth();
      } else {
        if (err) {
          err.textContent = 'Invalid credentials. Please verify your username and password.';
          err.style.display = 'block';
        }
      }
    });
  }

  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    sessionStorage.removeItem('zugado_admin_user');
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    window.location.reload();
  }

  // =========================================================================
  // Event Bindings & Tab Navigation
  // =========================================================================
  bindGlobalEvents() {
    // Tab switching
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Modal Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.admin-modal-overlay');
        if (modal) modal.style.display = 'none';
      });
    });

    // Setup Blog Form Listeners
    this.bindBlogStudioEvents();
    this.bindLabsEvents();
    this.bindProductEvents();
    this.bindAuthorEvents();
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update Tab Buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update Panels
    document.querySelectorAll('.admin-view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabName}`);
    });

    this.renderActiveTab();
  }

  renderActiveTab() {
    switch (this.currentTab) {
      case 'blogs':
        this.renderBlogsList();
        break;
      case 'labs':
        this.renderLabsList();
        break;
      case 'products':
        this.renderProductsList();
        break;
      case 'authors':
        this.renderAuthorsList();
        break;
    }
  }

  // =========================================================================
  // Author Directory Helpers
  // =========================================================================
  getAuthor(id) {
    return this.authors.find(a => a.id === id) || {
      id: 'unknown',
      name: 'Zugado Contributor',
      title: 'Platform Engineer',
      avatar: '/assets/logo_white.png'
    };
  }

  populateAuthorSelects() {
    const blogAuthorSelect = document.getElementById('blog-lead-author');
    const labsCreatorSelect = document.getElementById('labs-lead-creator');
    const productCreatorSelect = document.getElementById('product-lead-creator');

    const optionsHtml = this.authors.map(a => 
      `<option value="${a.id}">${a.name} (${a.title} &bull; ${a.division})</option>`
    ).join('');

    if (blogAuthorSelect) blogAuthorSelect.innerHTML = optionsHtml;
    if (labsCreatorSelect) labsCreatorSelect.innerHTML = optionsHtml;
    if (productCreatorSelect) productCreatorSelect.innerHTML = optionsHtml;
  }

  // =========================================================================
  // Module 1: Blog Writer Platform
  // =========================================================================
  bindBlogStudioEvents() {
    const newBtn = document.getElementById('btn-new-blog');
    const cancelBtn = document.getElementById('btn-cancel-blog');
    const form = document.getElementById('blog-editor-form');
    const titleInput = document.getElementById('blog-title');
    const slugInput = document.getElementById('blog-slug');
    const contentInput = document.getElementById('blog-content-markdown');
    const searchInput = document.getElementById('blog-search');
    const filterSelect = document.getElementById('blog-status-filter');

    if (newBtn) {
      newBtn.addEventListener('click', () => this.openBlogEditor(null));
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        document.getElementById('blog-editor-container').style.display = 'none';
        document.getElementById('blog-list-container').style.display = 'block';
      });
    }

    // Auto-generate slug from title
    if (titleInput && slugInput) {
      titleInput.addEventListener('input', () => {
        if (!this.editingBlogId) {
          slugInput.value = this.slugify(titleInput.value);
        }
      });
    }

    // Live Markdown Preview & Word Count
    if (contentInput) {
      contentInput.addEventListener('input', () => this.updateBlogLivePreview());
    }

    // Toolbar formatting helpers
    document.querySelectorAll('.admin-toolbar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        this.insertMarkdownHelper(action);
      });
    });

    // Form Submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveBlogEntry();
      });
    }

    // Filters
    if (searchInput) {
      searchInput.addEventListener('input', () => this.renderBlogsList());
    }
    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.renderBlogsList());
    }
  }

  renderBlogsList() {
    const container = document.getElementById('blogs-cards-grid');
    if (!container) return;

    const searchTerm = (document.getElementById('blog-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('blog-status-filter')?.value || 'all';

    const filtered = this.blogs.filter(b => {
      const matchSearch = b.title.toLowerCase().includes(searchTerm) || 
                          b.category.toLowerCase().includes(searchTerm) ||
                          b.tags.some(t => t.toLowerCase().includes(searchTerm));
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--admin-surface); border-radius: var(--admin-radius); border: 1px dashed var(--admin-border);">
          <p style="color: var(--admin-text-sub); margin-bottom: 1rem;">No blog articles match your query.</p>
          <button class="admin-btn admin-btn-primary" id="btn-empty-new-blog">+ Write First Article</button>
        </div>
      `;
      document.getElementById('btn-empty-new-blog')?.addEventListener('click', () => this.openBlogEditor(null));
      return;
    }

    container.innerHTML = filtered.map(b => {
      const author = this.getAuthor(b.leadAuthorId);
      const isPublished = b.status === 'published';
      const statusClass = isPublished ? 'tag-emerald' : 'tag-amber';
      const formattedDate = new Date(b.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      return `
        <article class="admin-card">
          <div>
            <div class="admin-card-header">
              <span class="admin-card-tag ${statusClass}">${b.status.toUpperCase()}</span>
              <span style="font-size: 0.75rem; color: var(--admin-text-muted);">${b.readTimeMinutes} min read</span>
            </div>
            <h3 class="admin-card-title">${this.escapeHtml(b.title)}</h3>
            <p class="admin-card-desc">${this.escapeHtml(b.excerpt)}</p>

            <!-- Lead Author Attribution -->
            <div class="admin-attribution-pill">
              ${this.renderAvatar(author.avatar, author.name, 24)}
              <div class="admin-attribution-text">
                <span class="admin-attribution-name">${this.escapeHtml(author.name)}</span> &bull; 
                <span>${this.escapeHtml(author.title)}</span>
              </div>
            </div>

            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
              <span style="font-size: 0.6875rem; background: rgba(255,255,255,0.06); padding: 0.15rem 0.5rem; border-radius: 4px; color: #94a3b8;">${b.category}</span>
              ${b.tags.map(t => `<span style="font-size: 0.6875rem; background: rgba(59,130,246,0.1); color: #60a5fa; padding: 0.15rem 0.5rem; border-radius: 4px;">#${t}</span>`).join('')}
            </div>
          </div>

          <div class="admin-card-footer">
            <span>Published: ${formattedDate}</span>
            <div class="admin-card-actions">
              <button class="admin-btn-icon" data-edit-blog="${b.id}" title="Edit Article">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="admin-btn-icon" data-delete-blog="${b.id}" title="Delete Article" style="color: #f87171;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Bind item action buttons
    container.querySelectorAll('[data-edit-blog]').forEach(btn => {
      btn.addEventListener('click', () => this.openBlogEditor(btn.dataset.editBlog));
    });
    container.querySelectorAll('[data-delete-blog]').forEach(btn => {
      btn.addEventListener('click', () => this.deleteBlog(btn.dataset.deleteBlog));
    });
  }

  openBlogEditor(id) {
    this.editingBlogId = id;
    const form = document.getElementById('blog-editor-form');
    form.reset();

    document.getElementById('blog-list-container').style.display = 'none';
    document.getElementById('blog-editor-container').style.display = 'block';
    this.populateAuthorSelects();

    if (id) {
      const blog = this.blogs.find(b => b.id === id);
      if (blog) {
        document.getElementById('blog-editor-title').textContent = 'Edit Blog Article';
        document.getElementById('blog-title').value = blog.title;
        document.getElementById('blog-slug').value = blog.slug;
        document.getElementById('blog-category').value = blog.category;
        document.getElementById('blog-tags').value = blog.tags.join(', ');
        document.getElementById('blog-lead-author').value = blog.leadAuthorId;
        document.getElementById('blog-cover-image').value = blog.coverImage || '';
        document.getElementById('blog-excerpt').value = blog.excerpt;
        document.getElementById('blog-content-markdown').value = blog.contentMarkdown;
        document.getElementById('blog-status').value = blog.status;
      }
    } else {
      document.getElementById('blog-editor-title').textContent = 'Write New Blog Article';
      document.getElementById('blog-content-markdown').value = '# Write your article header here\n\nBegin your technical analysis...';
    }

    this.updateBlogLivePreview();
  }

  updateBlogLivePreview() {
    const markdown = document.getElementById('blog-content-markdown')?.value || '';
    const previewEl = document.getElementById('blog-rendered-preview');
    const wordCountEl = document.getElementById('blog-word-count');
    const readTimeEl = document.getElementById('blog-read-time');

    const words = markdown.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readTime = Math.max(1, Math.ceil(words / 200));

    if (wordCountEl) wordCountEl.textContent = `${words} words`;
    if (readTimeEl) readTimeEl.textContent = `${readTime} min read`;

    if (previewEl) {
      previewEl.innerHTML = this.renderMarkdown(markdown);
    }
  }

  saveBlogEntry() {
    const title = document.getElementById('blog-title').value.trim();
    const slug = document.getElementById('blog-slug').value.trim() || this.slugify(title);
    const category = document.getElementById('blog-category').value.trim();
    const tags = document.getElementById('blog-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    const leadAuthorId = document.getElementById('blog-lead-author').value;
    const coverImage = document.getElementById('blog-cover-image').value.trim() || '/assets/hyperlocal_urban_grid.jpg';
    const excerpt = document.getElementById('blog-excerpt').value.trim();
    const contentMarkdown = document.getElementById('blog-content-markdown').value;
    const status = document.getElementById('blog-status').value;

    const words = contentMarkdown.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    if (this.editingBlogId) {
      const idx = this.blogs.findIndex(b => b.id === this.editingBlogId);
      if (idx !== -1) {
        this.blogs[idx] = {
          ...this.blogs[idx],
          title, slug, category, tags, leadAuthorId, coverImage,
          excerpt, contentMarkdown, status, readTimeMinutes,
          updatedAt: new Date().toISOString()
        };
        this.showToast('Blog article updated successfully', 'success');
      }
    } else {
      const newBlog = {
        id: slug,
        slug, title, category, tags, leadAuthorId, coAuthorIds: [],
        coverImage, excerpt, contentMarkdown, status, readTimeMinutes,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.blogs.unshift(newBlog);
      this.showToast('New blog article published to studio', 'success');
    }

    this.saveData(STORAGE_KEYS.BLOGS, this.blogs);
    document.getElementById('blog-editor-container').style.display = 'none';
    document.getElementById('blog-list-container').style.display = 'block';
    this.renderBlogsList();
  }

  deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    this.blogs = this.blogs.filter(b => b.id !== id);
    this.saveData(STORAGE_KEYS.BLOGS, this.blogs);
    this.showToast('Article deleted', 'info');
    this.renderBlogsList();
  }

  insertMarkdownHelper(action) {
    const textarea = document.getElementById('blog-content-markdown');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    let replacement = '';

    switch (action) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'italic text'}*`;
        break;
      case 'h2':
        replacement = `\n## ${selected || 'Section Heading'}\n`;
        break;
      case 'code':
        replacement = selected.includes('\n') 
          ? `\n\`\`\`javascript\n${selected || '// code block'}\n\`\`\`\n`
          : `\`${selected || 'code'}\``;
        break;
      case 'quote':
        replacement = `\n> ${selected || 'Quoted statement'}\n`;
        break;
      case 'link':
        replacement = `[${selected || 'link text'}](https://)`;
        break;
    }

    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.focus();
    this.updateBlogLivePreview();
  }

  // =========================================================================
  // Module 2: Zugado Labs Platform Management
  // =========================================================================
  bindLabsEvents() {
    const newBtn = document.getElementById('btn-new-labs');
    const form = document.getElementById('labs-modal-form');
    const filterSelect = document.getElementById('labs-layer-filter');

    if (newBtn) {
      newBtn.addEventListener('click', () => this.openLabsModal(null));
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveLabsItem();
      });
    }

    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.renderLabsList());
    }
  }

  renderLabsList() {
    const container = document.getElementById('labs-cards-grid');
    if (!container) return;

    const layerFilter = document.getElementById('labs-layer-filter')?.value || 'all';

    const filtered = this.labs.filter(item => {
      return layerFilter === 'all' || item.layer === layerFilter;
    });

    container.innerHTML = filtered.map(item => {
      const creator = this.getAuthor(item.leadCreatorId);
      const layerLabels = {
        'layer-01-prototypes': 'Layer 01 &bull; Active Prototypes',
        'layer-02-casestudies': 'Layer 02 &bull; Technical Case Studies',
        'layer-03-stealth': 'Layer 03 &bull; Stealth Protocols'
      };

      return `
        <article class="admin-card">
          <div>
            <div class="admin-card-header">
              <span class="admin-card-tag tag-${item.statusTone || 'blue'}">${item.statusBadge}</span>
              <span style="font-size: 0.6875rem; color: #60a5fa; font-weight: 700;">${layerLabels[item.layer] || item.layer}</span>
            </div>
            
            <h3 class="admin-card-title">${this.escapeHtml(item.name)}</h3>
            <p class="admin-card-desc">${this.escapeHtml(item.summary)}</p>

            <!-- Lead Creator Attribution -->
            <div class="admin-attribution-pill">
              ${this.renderAvatar(creator.avatar, creator.name, 24)}
              <div class="admin-attribution-text">
                <span style="color: #60a5fa; font-size: 0.6875rem; display: block; text-transform: uppercase; font-weight: 700;">Lead Creator</span>
                <span class="admin-attribution-name">${this.escapeHtml(creator.name)}</span> &bull; 
                <span>${this.escapeHtml(item.leadCreatorRole || creator.title)}</span>
              </div>
            </div>

            <!-- IP Agreement Notice -->
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 0.6rem; border-radius: 6px; margin-bottom: 1rem;">
              <span style="font-size: 0.6875rem; color: var(--admin-text-muted); display: block; font-weight: 700; text-transform: uppercase;">Legal &amp; IP Agreement</span>
              <span style="font-size: 0.75rem; color: #94a3b8; font-style: italic;">${this.escapeHtml(item.ipAgreementNotice)}</span>
            </div>

            <!-- Tech Stack Tags -->
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              ${(item.techStack || []).map(t => `<span style="font-size: 0.6875rem; background: rgba(255,255,255,0.05); color: #cbd5e1; padding: 0.15rem 0.45rem; border-radius: 4px;">${t}</span>`).join('')}
            </div>
          </div>

          <div class="admin-card-footer">
            <span>Collaborators: ${(item.collaborators || []).length}</span>
            <div class="admin-card-actions">
              <button class="admin-btn-icon" data-edit-labs="${item.id}" title="Edit Project">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="admin-btn-icon" data-delete-labs="${item.id}" title="Delete Project" style="color: #f87171;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('[data-edit-labs]').forEach(btn => {
      btn.addEventListener('click', () => this.openLabsModal(btn.dataset.editLabs));
    });
    container.querySelectorAll('[data-delete-labs]').forEach(btn => {
      btn.addEventListener('click', () => this.deleteLabsItem(btn.dataset.deleteLabs));
    });
  }

  openLabsModal(id) {
    this.editingLabsId = id;
    const modal = document.getElementById('labs-item-modal');
    const form = document.getElementById('labs-modal-form');
    form.reset();
    this.populateAuthorSelects();

    if (id) {
      const item = this.labs.find(l => l.id === id);
      if (item) {
        document.getElementById('labs-modal-title').textContent = 'Edit Labs Project';
        document.getElementById('labs-name').value = item.name;
        document.getElementById('labs-layer').value = item.layer;
        document.getElementById('labs-badge').value = item.statusBadge;
        document.getElementById('labs-tone').value = item.statusTone || 'blue';
        document.getElementById('labs-summary').value = item.summary;
        document.getElementById('labs-lead-creator').value = item.leadCreatorId;
        document.getElementById('labs-creator-role').value = item.leadCreatorRole || '';
        document.getElementById('labs-collaborators').value = (item.collaborators || []).join(', ');
        document.getElementById('labs-ip-notice').value = item.ipAgreementNotice || '';
        document.getElementById('labs-tech-stack').value = (item.techStack || []).join(', ');
        document.getElementById('labs-doc-url').value = item.documentationUrl || '';
      }
    } else {
      document.getElementById('labs-modal-title').textContent = 'New Zugado Labs Initiative';
      document.getElementById('labs-ip-notice').value = 'Ownership and licensing governed strictly by applicable written research agreements.';
    }

    modal.style.display = 'flex';
  }

  saveLabsItem() {
    const name = document.getElementById('labs-name').value.trim();
    const layer = document.getElementById('labs-layer').value;
    const statusBadge = document.getElementById('labs-badge').value.trim();
    const statusTone = document.getElementById('labs-tone').value;
    const summary = document.getElementById('labs-summary').value.trim();
    const leadCreatorId = document.getElementById('labs-lead-creator').value;
    const leadCreatorRole = document.getElementById('labs-creator-role').value.trim();
    const collaborators = document.getElementById('labs-collaborators').value.split(',').map(s => s.trim()).filter(Boolean);
    const ipAgreementNotice = document.getElementById('labs-ip-notice').value.trim();
    const techStack = document.getElementById('labs-tech-stack').value.split(',').map(s => s.trim()).filter(Boolean);
    const documentationUrl = document.getElementById('labs-doc-url').value.trim() || '#';

    if (this.editingLabsId) {
      const idx = this.labs.findIndex(l => l.id === this.editingLabsId);
      if (idx !== -1) {
        this.labs[idx] = {
          ...this.labs[idx],
          name, layer, statusBadge, statusTone, summary,
          leadCreatorId, leadCreatorRole, collaborators,
          ipAgreementNotice, techStack, documentationUrl
        };
        this.showToast('Labs project updated', 'success');
      }
    } else {
      const newItem = {
        id: this.slugify(name),
        name, layer, statusBadge, statusTone, summary,
        leadCreatorId, leadCreatorRole, collaborators,
        ipAgreementNotice, techStack, documentationUrl,
        featured: true
      };
      this.labs.push(newItem);
      this.showToast('New Labs project registered', 'success');
    }

    this.saveData(STORAGE_KEYS.LABS, this.labs);
    document.getElementById('labs-item-modal').style.display = 'none';
    this.renderLabsList();
  }

  deleteLabsItem(id) {
    if (!confirm('Are you sure you want to remove this Labs project entry?')) return;
    this.labs = this.labs.filter(l => l.id !== id);
    this.saveData(STORAGE_KEYS.LABS, this.labs);
    this.showToast('Labs entry removed', 'info');
    this.renderLabsList();
  }

  // =========================================================================
  // Module 3: Products Platform Management
  // =========================================================================
  bindProductEvents() {
    const newBtn = document.getElementById('btn-new-product');
    const form = document.getElementById('product-modal-form');

    if (newBtn) {
      newBtn.addEventListener('click', () => this.openProductModal(null));
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProductItem();
      });
    }
  }

  renderProductsList() {
    const container = document.getElementById('products-cards-grid');
    if (!container) return;

    container.innerHTML = this.products.map(prod => {
      const creator = this.getAuthor(prod.leadCreatorId);

      return `
        <article class="admin-card">
          <div>
            <div class="admin-card-header">
              <span class="admin-card-tag tag-${prod.statusTone || 'blue'}">${prod.status}</span>
              <span style="font-size: 0.6875rem; color: var(--admin-text-muted); font-weight: 700;">${prod.category}</span>
            </div>
            
            <h3 class="admin-card-title">${this.escapeHtml(prod.name)}</h3>
            <p style="font-size: 0.8125rem; color: #60a5fa; margin: -0.25rem 0 0.75rem; font-weight: 600;">${this.escapeHtml(prod.tagline || '')}</p>
            <p class="admin-card-desc">${this.escapeHtml(prod.summary)}</p>

            <!-- Lead Product/Systems Architect Attribution -->
            <div class="admin-attribution-pill">
              ${this.renderAvatar(creator.avatar, creator.name, 24)}
              <div class="admin-attribution-text">
                <span style="color: #60a5fa; font-size: 0.6875rem; display: block; text-transform: uppercase; font-weight: 700;">Lead Architect / Creator</span>
                <span class="admin-attribution-name">${this.escapeHtml(creator.name)}</span> &bull; 
                <span>${this.escapeHtml(prod.leadCreatorRole || creator.title)}</span>
              </div>
            </div>

            <!-- Features List -->
            <div style="margin-bottom: 1rem;">
              <span style="font-size: 0.6875rem; color: var(--admin-text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 0.35rem;">Architecture Highlights</span>
              <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.8125rem; color: #cbd5e1; line-height: 1.5;">
                ${(prod.features || []).map(f => `<li>${this.escapeHtml(f)}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="admin-card-footer">
            <span>SLA: ${prod.specifications?.dispatchSLA || 'Standard'}</span>
            <div class="admin-card-actions">
              <button class="admin-btn-icon" data-edit-product="${prod.id}" title="Edit Product">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="admin-btn-icon" data-delete-product="${prod.id}" title="Delete Product" style="color: #f87171;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('[data-edit-product]').forEach(btn => {
      btn.addEventListener('click', () => this.openProductModal(btn.dataset.editProduct));
    });
    container.querySelectorAll('[data-delete-product]').forEach(btn => {
      btn.addEventListener('click', () => this.deleteProductItem(btn.dataset.deleteProduct));
    });
  }

  openProductModal(id) {
    this.editingProductId = id;
    const modal = document.getElementById('product-item-modal');
    const form = document.getElementById('product-modal-form');
    form.reset();
    this.populateAuthorSelects();

    if (id) {
      const prod = this.products.find(p => p.id === id);
      if (prod) {
        document.getElementById('product-modal-title').textContent = 'Edit Product';
        document.getElementById('product-name').value = prod.name;
        document.getElementById('product-tagline').value = prod.tagline || '';
        document.getElementById('product-category').value = prod.category;
        document.getElementById('product-status').value = prod.status;
        document.getElementById('product-summary').value = prod.summary;
        document.getElementById('product-lead-creator').value = prod.leadCreatorId;
        document.getElementById('product-creator-role').value = prod.leadCreatorRole || '';
        document.getElementById('product-features').value = (prod.features || []).join('\n');
        document.getElementById('product-sla').value = prod.specifications?.dispatchSLA || '';
      }
    } else {
      document.getElementById('product-modal-title').textContent = 'New Product Entry';
    }

    modal.style.display = 'flex';
  }

  saveProductItem() {
    const name = document.getElementById('product-name').value.trim();
    const tagline = document.getElementById('product-tagline').value.trim();
    const category = document.getElementById('product-category').value.trim();
    const status = document.getElementById('product-status').value.trim();
    const summary = document.getElementById('product-summary').value.trim();
    const leadCreatorId = document.getElementById('product-lead-creator').value;
    const leadCreatorRole = document.getElementById('product-creator-role').value.trim();
    const features = document.getElementById('product-features').value.split('\n').map(f => f.trim()).filter(Boolean);
    const dispatchSLA = document.getElementById('product-sla').value.trim();

    if (this.editingProductId) {
      const idx = this.products.findIndex(p => p.id === this.editingProductId);
      if (idx !== -1) {
        this.products[idx] = {
          ...this.products[idx],
          name, tagline, category, status, summary,
          leadCreatorId, leadCreatorRole, features,
          specifications: {
            ...this.products[idx].specifications,
            dispatchSLA
          }
        };
        this.showToast('Product entry updated', 'success');
      }
    } else {
      const newProduct = {
        id: this.slugify(name),
        name, tagline, category, status, summary,
        statusTone: 'blue',
        leadCreatorId, leadCreatorRole, features,
        specifications: {
          dispatchSLA,
          architecture: 'Distributed Mesh',
          availability: 'Enterprise'
        },
        documentationUrl: '/products/'
      };
      this.products.push(newProduct);
      this.showToast('New Product added', 'success');
    }

    this.saveData(STORAGE_KEYS.PRODUCTS, this.products);
    document.getElementById('product-item-modal').style.display = 'none';
    this.renderProductsList();
  }

  deleteProductItem(id) {
    if (!confirm('Are you sure you want to delete this product listing?')) return;
    this.products = this.products.filter(p => p.id !== id);
    this.saveData(STORAGE_KEYS.PRODUCTS, this.products);
    this.showToast('Product listing removed', 'info');
    this.renderProductsList();
  }

  // =========================================================================
  // Module 4: Authors & Creators Directory
  // =========================================================================
  bindAuthorEvents() {
    const newBtn = document.getElementById('btn-new-author');
    const form = document.getElementById('author-modal-form');

    if (newBtn) {
      newBtn.addEventListener('click', () => this.openAuthorModal(null));
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveAuthorItem();
      });
    }
  }

  renderAuthorsList() {
    const container = document.getElementById('authors-cards-grid');
    if (!container) return;

    container.innerHTML = this.authors.map(author => {
      const isLabs = author.division === 'Zugado Labs';
      const divisionClass = isLabs ? 'tag-purple' : 'tag-blue';

      return `
        <article class="admin-card">
          <div>
            <div class="admin-card-header">
              <span class="admin-card-tag ${divisionClass}">${author.division}</span>
              <span style="font-size: 0.75rem; color: var(--admin-text-muted);">ID: ${author.id}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              ${this.renderAvatar(author.avatar, author.name, 48)}
              <div>
                <h3 class="admin-card-title" style="margin-bottom: 0.15rem;">${this.escapeHtml(author.name)}</h3>
                <p style="font-size: 0.8125rem; color: #60a5fa; margin: 0; font-weight: 600;">${this.escapeHtml(author.title)}</p>
              </div>
            </div>

            <p class="admin-card-desc">${this.escapeHtml(author.bio)}</p>

            <div style="font-size: 0.75rem; color: var(--admin-text-sub); display: flex; flex-direction: column; gap: 0.25rem;">
              <span>Email: ${this.escapeHtml(author.email || 'N/A')}</span>
              <span>GitHub: ${this.escapeHtml(author.github || 'N/A')}</span>
            </div>
          </div>

          <div class="admin-card-footer">
            <span>Profile Active</span>
            <div class="admin-card-actions">
              <button class="admin-btn-icon" data-edit-author="${author.id}" title="Edit Profile">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="admin-btn-icon" data-delete-author="${author.id}" title="Delete Profile" style="color: #f87171;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('[data-edit-author]').forEach(btn => {
      btn.addEventListener('click', () => this.openAuthorModal(btn.dataset.editAuthor));
    });
    container.querySelectorAll('[data-delete-author]').forEach(btn => {
      btn.addEventListener('click', () => this.deleteAuthorItem(btn.dataset.deleteAuthor));
    });
  }

  openAuthorModal(id) {
    this.editingAuthorId = id;
    const modal = document.getElementById('author-item-modal');
    const form = document.getElementById('author-modal-form');
    form.reset();

    if (id) {
      const author = this.authors.find(a => a.id === id);
      if (author) {
        document.getElementById('author-modal-title').textContent = 'Edit Author / Creator Profile';
        document.getElementById('author-name').value = author.name;
        document.getElementById('author-title').value = author.title;
        document.getElementById('author-division').value = author.division;
        document.getElementById('author-bio').value = author.bio;
        document.getElementById('author-avatar').value = author.avatar;
        document.getElementById('author-email').value = author.email || '';
        document.getElementById('author-github').value = author.github || '';
        document.getElementById('author-linkedin').value = author.linkedin || '';
      }
    } else {
      document.getElementById('author-modal-title').textContent = 'Add Author / Creator';
      document.getElementById('author-avatar').value = '/assets/logo_white.png';
    }

    modal.style.display = 'flex';
  }

  saveAuthorItem() {
    const name = document.getElementById('author-name').value.trim();
    const title = document.getElementById('author-title').value.trim();
    const division = document.getElementById('author-division').value;
    const bio = document.getElementById('author-bio').value.trim();
    const avatar = document.getElementById('author-avatar').value.trim() || '/assets/logo_white.png';
    const email = document.getElementById('author-email').value.trim();
    const github = document.getElementById('author-github').value.trim();
    const linkedin = document.getElementById('author-linkedin').value.trim();

    if (this.editingAuthorId) {
      const idx = this.authors.findIndex(a => a.id === this.editingAuthorId);
      if (idx !== -1) {
        this.authors[idx] = {
          ...this.authors[idx],
          name, title, division, bio, avatar, email, github, linkedin
        };
        this.showToast('Profile updated', 'success');
      }
    } else {
      const newAuthor = {
        id: this.slugify(name),
        name, title, division, bio, avatar, email, github, linkedin
      };
      this.authors.push(newAuthor);
      this.showToast('New Author/Creator registered', 'success');
    }

    this.saveData(STORAGE_KEYS.AUTHORS, this.authors);
    this.populateAuthorSelects();
    document.getElementById('author-item-modal').style.display = 'none';
    this.renderAuthorsList();
  }

  deleteAuthorItem(id) {
    if (!confirm('Are you sure you want to remove this author?')) return;
    this.authors = this.authors.filter(a => a.id !== id);
    this.saveData(STORAGE_KEYS.AUTHORS, this.authors);
    this.populateAuthorSelects();
    this.showToast('Author profile removed', 'info');
    this.renderAuthorsList();
  }

  // =========================================================================
  // Utilities & Markdown Renderer
  // =========================================================================
  slugify(text) {
    return text.toString().toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
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

    // Escaped code blocks
    const codeBlocks = [];
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(`<pre><code class="language-${lang}">${this.escapeHtml(code.trim())}</code></pre>`);
      return placeholder;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, (match, code) => `<code>${this.escapeHtml(code)}</code>`);

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Horizontal Rule
    html = html.replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid var(--admin-border); margin: 2rem 0;" />');

    // Blockquote
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: #60a5fa;">$1</a>');

    // Paragraphs
    html = html.split('\n\n').map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<blockquote') || p.startsWith('<hr')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    // Restore Code Blocks
    codeBlocks.forEach((block, idx) => {
      html = html.replace(`__CODE_BLOCK_${idx}__`, block);
    });

    return html;
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
        ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : 
          type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' :
          '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'}
      </svg>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new AdminStudio();
});

