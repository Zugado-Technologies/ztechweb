/**
 * Zugado Technologies - Static Client-Side Auth Gate for /beta
 * Protected Access Gate for the Beta Slug
 * 
 * Required Credentials:
 *   Username: admin
 *   Password: Zugado@1598
 */

export function initBetaAuth() {
  const path = window.location.pathname;
  const isBetaPath = path.startsWith('/beta') || path.includes('/beta');
  
  if (!isBetaPath) return;

  const AUTH_KEY = 'zugado_beta_authorized';
  const isAuthorized = localStorage.getItem(AUTH_KEY) === 'true' || sessionStorage.getItem(AUTH_KEY) === 'true';

  if (isAuthorized) {
    return; // Already authenticated
  }

  function renderGate() {
    if (document.getElementById('zugado-beta-auth-gate')) return;
    if (!document.body) return;

    // Create full-screen static login gate overlay
    const overlay = document.createElement('div');
    overlay.id = 'zugado-beta-auth-gate';
    overlay.className = 'beta-auth-overlay';
    overlay.innerHTML = `
      <div class="beta-auth-card">
        <div class="beta-auth-header">
          <div class="beta-auth-badge">
            <span class="beta-auth-pulse"></span>
            <span>RESTRICTED ACCESS &bull; PRIVATE BETA</span>
          </div>
          <h2 class="beta-auth-title">Authorization Required</h2>
          <p class="beta-auth-desc">
            Enter credentials to access the internal development preview.
          </p>
        </div>

        <form id="beta-auth-form" class="beta-auth-form" autocomplete="off">
          <div id="beta-auth-error" class="beta-auth-error" style="display: none;"></div>

          <div class="beta-auth-field">
            <label for="beta-username" class="beta-auth-label">Username</label>
            <input 
              type="text" 
              id="beta-username" 
              name="username" 
              class="beta-auth-input" 
              placeholder="admin" 
              required 
              autofocus 
            />
          </div>

          <div class="beta-auth-field">
            <label for="beta-password" class="beta-auth-label">Password</label>
            <input 
              type="password" 
              id="beta-password" 
              name="password" 
              class="beta-auth-input" 
              placeholder="••••••••••••" 
              required 
            />
          </div>

          <button type="submit" class="beta-auth-btn">
            <span>Authenticate &amp; Enter</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </form>

        <div class="beta-auth-footer">
          Zugado Technologies Private Limited &bull; Internal Review
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add('beta-auth-locked');

    const form = document.getElementById('beta-auth-form');
    const errorEl = document.getElementById('beta-auth-error');
    const userInput = document.getElementById('beta-username');
    const passInput = document.getElementById('beta-password');
    const card = overlay.querySelector('.beta-auth-card');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = userInput.value.trim();
      const p = passInput.value.trim();

      if (u === 'admin' && p === 'Zugado@1598') {
        localStorage.setItem(AUTH_KEY, 'true');
        sessionStorage.setItem(AUTH_KEY, 'true');
        
        // Success smooth unlock transition
        card.style.transform = 'scale(0.96)';
        card.style.opacity = '0';
        overlay.style.transition = 'opacity 0.4s ease';
        overlay.style.opacity = '0';

        setTimeout(() => {
          overlay.remove();
          document.body.classList.remove('beta-auth-locked');
        }, 400);
      } else {
        errorEl.textContent = 'Invalid username or password. Please verify your credentials.';
        errorEl.style.display = 'block';
        passInput.value = '';
        passInput.focus();
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGate);
  } else {
    renderGate();
  }
}
