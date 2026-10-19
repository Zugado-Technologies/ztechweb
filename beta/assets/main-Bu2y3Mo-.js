(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const e of o)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const e={};return o.integrity&&(e.integrity=o.integrity),o.referrerPolicy&&(e.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?e.credentials="include":o.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function s(o){if(o.ep)return;o.ep=!0;const e=a(o);fetch(o.href,e)}})();function p(){const n=document.querySelector(".mobile-nav-toggle"),t=document.querySelector(".mobile-drawer");n&&t&&(n.addEventListener("click",()=>{const o=t.classList.toggle("open");n.setAttribute("aria-expanded",String(o)),n.setAttribute("aria-label",o?"Close navigation menu":"Open navigation menu"),document.body.style.overflow=o?"hidden":""}),t.querySelectorAll("a").forEach(o=>{o.addEventListener("click",()=>{t.classList.remove("open"),n.setAttribute("aria-expanded","false"),n.setAttribute("aria-label","Open navigation menu"),document.body.style.overflow=""})}));const a=window.location.pathname.replace(/\/$/,"")||"/";document.querySelectorAll(".nav-link, .mobile-nav-link, .orbix-nav-link, .orbix-dock-link").forEach(o=>{const e=o.getAttribute("href");if(!e)return;const r=e.replace(/\/$/,"")||"/";(r===a||r!=="/"&&a.startsWith(r))&&o.classList.add("active")})}function b(){document.querySelectorAll("form[data-inquiry-form]").forEach(t=>{t.addEventListener("submit",a=>{a.preventDefault();const s=t.querySelector(".form-alert");t.querySelector('button[type="submit"]');const o=new FormData(t),e=Object.fromEntries(o.entries()),r=e.inquiry_type||"General Inquiry",c=e.name||"Anonymous",i=e.email||"Not provided",l=e.role||e.area_of_interest||"",u=e.message||e.note||"",f=encodeURIComponent(`[Zugado Tech] ${r}: ${c}`);let d=`Name: ${c}
Email: ${i}
`;l&&(d+=`Role/Area: ${l}
`),e.portfolio&&(d+=`Portfolio/GitHub: ${e.portfolio}
`),d+=`
Message:
${u}
`;const m=`mailto:hello@zugadotechnologies.com?subject=${f}&body=${encodeURIComponent(d)}`;window.location.href=m,s&&(s.className="form-alert info",s.innerHTML=`
          <strong>Opening your email client...</strong><br />
          If your client does not open automatically, please send your inquiry directly to 
          <a href="${m}" style="text-decoration: underline; font-weight: 600;">hello@zugadotechnologies.com</a>.<br />
          <span style="font-size: 0.8125rem; color: var(--color-text-muted);">
            Note: This static website uses secure client-side dispatch. Submissions are received directly by our team.
          </span>
        `)})})}function h(){const n=window.location.pathname;if(!(n.startsWith("/beta")||n.includes("/beta")))return;const a="zugado_beta_authorized";if(localStorage.getItem(a)==="true"||sessionStorage.getItem(a)==="true")return;function o(){if(document.getElementById("zugado-beta-auth-gate")||!document.body)return;const e=document.createElement("div");e.id="zugado-beta-auth-gate",e.className="beta-auth-overlay",e.innerHTML=`
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
    `,document.body.appendChild(e),document.body.classList.add("beta-auth-locked");const r=document.getElementById("beta-auth-form"),c=document.getElementById("beta-auth-error"),i=document.getElementById("beta-username"),l=document.getElementById("beta-password"),u=e.querySelector(".beta-auth-card");r.addEventListener("submit",f=>{f.preventDefault();const d=i.value.trim(),m=l.value.trim();d==="admin"&&m==="Zugado@1598"?(localStorage.setItem(a,"true"),sessionStorage.setItem(a,"true"),u.style.transform="scale(0.96)",u.style.opacity="0",e.style.transition="opacity 0.4s ease",e.style.opacity="0",setTimeout(()=>{e.remove(),document.body.classList.remove("beta-auth-locked")},400)):(c.textContent="Invalid username or password. Please verify your credentials.",c.style.display="block",l.value="",l.focus(),u.classList.add("shake"),setTimeout(()=>u.classList.remove("shake"),500))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o):o()}h();function y(){const n=document.querySelectorAll(".reveal-on-scroll");if(!n.length)return;const t=new IntersectionObserver(a=>{a.forEach(s=>{s.isIntersecting&&(s.target.classList.add("is-revealed"),t.unobserve(s.target))})},{threshold:.1,rootMargin:"0px 0px -30px 0px"});n.forEach(a=>t.observe(a))}function v(){const n=document.querySelector(".orbix-dock-menu-btn, .orbix-dock-toggle"),t=document.querySelector(".mobile-drawer");if(n&&t){n.addEventListener("click",()=>{const s=t.classList.toggle("open");n.setAttribute("aria-expanded",String(s)),document.body.style.overflow=s?"hidden":""});const a=t.querySelector(".mobile-drawer-close");a&&a.addEventListener("click",()=>{t.classList.remove("open"),n.setAttribute("aria-expanded","false"),document.body.style.overflow=""}),t.querySelectorAll("a").forEach(s=>{s.addEventListener("click",()=>{t.classList.remove("open"),n.setAttribute("aria-expanded","false"),document.body.style.overflow=""})})}}function g(){const n=document.querySelector(".orbix-manifesto-para");if(!n)return;const t=n.textContent.trim();n.innerHTML="";const a=t.split(/\s+/),s=[];a.forEach((e,r)=>{const c=document.createElement("span");c.style.display="inline-block",c.style.whiteSpace="nowrap",c.style.marginRight="0.3em";for(let i=0;i<e.length;i++){const l=document.createElement("span");l.className="orbix-char ghost",l.textContent=e[i],c.appendChild(l),s.push(l)}n.appendChild(c)});function o(){const e=n.getBoundingClientRect(),r=window.innerHeight,c=r*.85,i=r*.25,l=e.top;let u=(c-l)/(c-i);u=Math.max(0,Math.min(1,u));const f=Math.floor(u*s.length);s.forEach((d,m)=>{m<=f?(d.classList.remove("ghost"),d.classList.add("active")):(d.classList.remove("active"),d.classList.add("ghost"))})}window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o,{passive:!0}),o()}function E(){const n=document.querySelectorAll(".orbix-drag-pill");n.length&&n.forEach(t=>{let a=0,s=0,o=0,e=0,r=!1;t.addEventListener("pointerdown",i=>{r=!0,a=i.clientX-o,s=i.clientY-e,t.setPointerCapture(i.pointerId),t.style.transition="none",t.style.zIndex="50"}),t.addEventListener("pointermove",i=>{r&&(o=i.clientX-a,e=i.clientY-s,t.style.transform=`translate3d(${o}px, ${e}px, 0)`)});const c=i=>{if(r){r=!1;try{t.releasePointerCapture(i.pointerId)}catch{}o=0,e=0,t.style.transition="transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)",t.style.transform="translate3d(0, 0, 0)",t.style.zIndex="10"}};t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c)})}function L(){const n=document.querySelectorAll(".orbix-tab-btn"),t=document.querySelectorAll(".orbix-tab-panel");!n.length||!t.length||n.forEach(a=>{a.addEventListener("click",()=>{const s=a.getAttribute("data-target");n.forEach(e=>e.classList.remove("active")),t.forEach(e=>e.classList.remove("active")),a.classList.add("active");const o=document.getElementById(s);o&&o.classList.add("active")})})}function w(){const n=document.querySelectorAll(".orbix-faq-question");n.length&&n.forEach(t=>{t.addEventListener("click",()=>{const a=t.closest(".orbix-faq-item"),s=a.classList.contains("open");document.querySelectorAll(".orbix-faq-item").forEach(o=>{o.classList.remove("open");const e=o.querySelector(".orbix-faq-question");e&&e.setAttribute("aria-expanded","false")}),s||(a.classList.add("open"),t.setAttribute("aria-expanded","true"))})})}document.addEventListener("DOMContentLoaded",()=>{p(),b(),y(),v(),g(),E(),L(),w()});
