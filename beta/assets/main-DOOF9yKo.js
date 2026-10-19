(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();function p(){const a=document.querySelector(".mobile-nav-toggle"),o=document.querySelector(".mobile-drawer");a&&o&&(a.addEventListener("click",()=>{const e=o.classList.toggle("open");a.setAttribute("aria-expanded",String(e)),a.setAttribute("aria-label",e?"Close navigation menu":"Open navigation menu"),document.body.style.overflow=e?"hidden":""}),o.querySelectorAll("a").forEach(e=>{e.addEventListener("click",()=>{o.classList.remove("open"),a.setAttribute("aria-expanded","false"),a.setAttribute("aria-label","Open navigation menu"),document.body.style.overflow=""})}));const n=window.location.pathname.replace(/\/$/,"")||"/";document.querySelectorAll(".nav-link, .mobile-nav-link, .orbix-nav-link, .orbix-dock-link").forEach(e=>{const t=e.getAttribute("href");if(!t)return;const s=t.replace(/\/$/,"")||"/";(s===n||s!=="/"&&n.startsWith(s))&&e.classList.add("active")})}function b(){document.querySelectorAll("form[data-inquiry-form]").forEach(o=>{o.addEventListener("submit",n=>{n.preventDefault();const r=o.querySelector(".form-alert");o.querySelector('button[type="submit"]');const e=new FormData(o),t=Object.fromEntries(e.entries()),s=t.inquiry_type||"General Inquiry",c=t.name||"Anonymous",i=t.email||"Not provided",l=t.role||t.area_of_interest||"",u=t.message||t.note||"",f=encodeURIComponent(`[Zugado Tech] ${s}: ${c}`);let d=`Name: ${c}
Email: ${i}
`;l&&(d+=`Role/Area: ${l}
`),t.portfolio&&(d+=`Portfolio/GitHub: ${t.portfolio}
`),d+=`
Message:
${u}
`;const m=`mailto:hello@zugadotechnologies.com?subject=${f}&body=${encodeURIComponent(d)}`;window.location.href=m,r&&(r.className="form-alert info",r.innerHTML=`
          <strong>Opening your email client...</strong><br />
          If your client does not open automatically, please send your inquiry directly to 
          <a href="${m}" style="text-decoration: underline; font-weight: 600;">hello@zugadotechnologies.com</a>.<br />
          <span style="font-size: 0.8125rem; color: var(--color-text-muted);">
            Note: This static website uses secure client-side dispatch. Submissions are received directly by our team.
          </span>
        `)})})}function h(){const a=window.location.pathname;if(!(a.startsWith("/beta")||a.includes("/beta")))return;const n="zugado_beta_authorized";if(localStorage.getItem(n)==="true"||sessionStorage.getItem(n)==="true")return;function e(){if(document.getElementById("zugado-beta-auth-gate")||!document.body)return;const t=document.createElement("div");t.id="zugado-beta-auth-gate",t.className="beta-auth-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),document.body.classList.add("beta-auth-locked");const s=document.getElementById("beta-auth-form"),c=document.getElementById("beta-auth-error"),i=document.getElementById("beta-username"),l=document.getElementById("beta-password"),u=t.querySelector(".beta-auth-card");s.addEventListener("submit",f=>{f.preventDefault();const d=i.value.trim(),m=l.value.trim();d==="admin"&&m==="Zugado@1598"?(localStorage.setItem(n,"true"),sessionStorage.setItem(n,"true"),u.style.transform="scale(0.96)",u.style.opacity="0",t.style.transition="opacity 0.4s ease",t.style.opacity="0",setTimeout(()=>{t.remove(),document.body.classList.remove("beta-auth-locked")},400)):(c.textContent="Invalid username or password. Please verify your credentials.",c.style.display="block",l.value="",l.focus(),u.classList.add("shake"),setTimeout(()=>u.classList.remove("shake"),500))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}h();function y(){const a=document.querySelectorAll(".reveal-on-scroll");if(!a.length)return;const o=new IntersectionObserver(n=>{n.forEach(r=>{r.isIntersecting&&(r.target.classList.add("is-revealed"),o.unobserve(r.target))})},{threshold:.1,rootMargin:"0px 0px -30px 0px"});a.forEach(n=>o.observe(n))}function v(){const a=document.querySelector(".orbix-dock-reading"),o=document.querySelector(".orbix-dock-menu-btn, .orbix-dock-toggle"),n=document.querySelector(".mobile-drawer");if(a&&window.addEventListener("scroll",()=>{const r=window.scrollY,e=document.documentElement.scrollHeight-window.innerHeight,t=e>0?Math.round(r/e*100):0;a.textContent=`${Math.min(100,Math.max(0,t))}%`},{passive:!0}),o&&n){o.addEventListener("click",()=>{const e=n.classList.toggle("open");o.setAttribute("aria-expanded",String(e)),document.body.style.overflow=e?"hidden":""});const r=n.querySelector(".mobile-drawer-close");r&&r.addEventListener("click",()=>{n.classList.remove("open"),o.setAttribute("aria-expanded","false"),document.body.style.overflow=""}),n.querySelectorAll("a").forEach(e=>{e.addEventListener("click",()=>{n.classList.remove("open"),o.setAttribute("aria-expanded","false"),document.body.style.overflow=""})})}}function g(){const a=document.querySelector(".orbix-manifesto-para");if(!a)return;const o=a.textContent.trim();a.innerHTML="";const n=o.split(/\s+/),r=[];n.forEach((t,s)=>{const c=document.createElement("span");c.style.display="inline-block",c.style.whiteSpace="nowrap",c.style.marginRight="0.3em";for(let i=0;i<t.length;i++){const l=document.createElement("span");l.className="orbix-char ghost",l.textContent=t[i],c.appendChild(l),r.push(l)}a.appendChild(c)});function e(){const t=a.getBoundingClientRect(),s=window.innerHeight,c=s*.85,i=s*.25,l=t.top;let u=(c-l)/(c-i);u=Math.max(0,Math.min(1,u));const f=Math.floor(u*r.length);r.forEach((d,m)=>{m<=f?(d.classList.remove("ghost"),d.classList.add("active")):(d.classList.remove("active"),d.classList.add("ghost"))})}window.addEventListener("scroll",e,{passive:!0}),window.addEventListener("resize",e,{passive:!0}),e()}function E(){const a=document.querySelectorAll(".orbix-drag-pill");a.length&&a.forEach(o=>{let n=0,r=0,e=0,t=0,s=!1;o.addEventListener("pointerdown",i=>{s=!0,n=i.clientX-e,r=i.clientY-t,o.setPointerCapture(i.pointerId),o.style.transition="none",o.style.zIndex="50"}),o.addEventListener("pointermove",i=>{s&&(e=i.clientX-n,t=i.clientY-r,o.style.transform=`translate3d(${e}px, ${t}px, 0)`)});const c=i=>{if(s){s=!1;try{o.releasePointerCapture(i.pointerId)}catch{}e=0,t=0,o.style.transition="transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)",o.style.transform="translate3d(0, 0, 0)",o.style.zIndex="10"}};o.addEventListener("pointerup",c),o.addEventListener("pointercancel",c)})}function L(){const a=document.querySelectorAll(".orbix-tab-btn"),o=document.querySelectorAll(".orbix-tab-panel");!a.length||!o.length||a.forEach(n=>{n.addEventListener("click",()=>{const r=n.getAttribute("data-target");a.forEach(t=>t.classList.remove("active")),o.forEach(t=>t.classList.remove("active")),n.classList.add("active");const e=document.getElementById(r);e&&e.classList.add("active")})})}function w(){const a=document.querySelectorAll(".orbix-faq-question");a.length&&a.forEach(o=>{o.addEventListener("click",()=>{const n=o.closest(".orbix-faq-item"),r=n.classList.contains("open");document.querySelectorAll(".orbix-faq-item").forEach(e=>{e.classList.remove("open");const t=e.querySelector(".orbix-faq-question");t&&t.setAttribute("aria-expanded","false")}),r||(n.classList.add("open"),o.setAttribute("aria-expanded","true"))})})}document.addEventListener("DOMContentLoaded",()=>{p(),b(),y(),v(),g(),E(),L(),w()});
