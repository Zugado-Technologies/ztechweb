(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function a(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function r(t){if(t.ep)return;t.ep=!0;const e=a(t);fetch(t.href,e)}})();function p(){const o=document.querySelector(".mobile-nav-toggle"),n=document.querySelector(".mobile-drawer");o&&n&&(o.addEventListener("click",()=>{const t=n.classList.toggle("open");o.setAttribute("aria-expanded",String(t)),o.setAttribute("aria-label",t?"Close navigation menu":"Open navigation menu"),document.body.style.overflow=t?"hidden":""}),n.querySelectorAll("a").forEach(t=>{t.addEventListener("click",()=>{n.classList.remove("open"),o.setAttribute("aria-expanded","false"),o.setAttribute("aria-label","Open navigation menu"),document.body.style.overflow=""})}));const a=window.location.pathname.replace(/\/$/,"")||"/";document.querySelectorAll(".nav-link, .mobile-nav-link, .orbix-nav-link, .orbix-dock-link").forEach(t=>{const e=t.getAttribute("href");if(!e)return;const s=e.replace(/\/$/,"")||"/";(s===a||s!=="/"&&a.startsWith(s))&&t.classList.add("active")})}function h(){document.querySelectorAll("form[data-inquiry-form]").forEach(n=>{n.addEventListener("submit",a=>{a.preventDefault();const r=n.querySelector(".form-alert");n.querySelector('button[type="submit"]');const t=new FormData(n),e=Object.fromEntries(t.entries()),s=e.inquiry_type||"General Inquiry",c=e.name||"Anonymous",i=e.email||"Not provided",l=e.role||e.area_of_interest||"",u=e.message||e.note||"",f=encodeURIComponent(`[Zugado Tech] ${s}: ${c}`);let d=`Name: ${c}
Email: ${i}
`;l&&(d+=`Role/Area: ${l}
`),e.portfolio&&(d+=`Portfolio/GitHub: ${e.portfolio}
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
        `)})})}function b(){const o=window.location.pathname;if(!(o.startsWith("/beta")||o.includes("/beta")))return;const a="zugado_beta_authorized";if(localStorage.getItem(a)==="true"||sessionStorage.getItem(a)==="true")return;function t(){if(document.getElementById("zugado-beta-auth-gate")||!document.body)return;const e=document.createElement("div");e.id="zugado-beta-auth-gate",e.className="beta-auth-overlay",e.innerHTML=`
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
    `,document.body.appendChild(e),document.body.classList.add("beta-auth-locked");const s=document.getElementById("beta-auth-form"),c=document.getElementById("beta-auth-error"),i=document.getElementById("beta-username"),l=document.getElementById("beta-password"),u=e.querySelector(".beta-auth-card");s.addEventListener("submit",f=>{f.preventDefault();const d=i.value.trim(),m=l.value.trim();d==="admin"&&m==="Zugado@1598"?(localStorage.setItem(a,"true"),sessionStorage.setItem(a,"true"),u.style.transform="scale(0.96)",u.style.opacity="0",e.style.transition="opacity 0.4s ease",e.style.opacity="0",setTimeout(()=>{e.remove(),document.body.classList.remove("beta-auth-locked")},400)):(c.textContent="Invalid username or password. Please verify your credentials.",c.style.display="block",l.value="",l.focus(),u.classList.add("shake"),setTimeout(()=>u.classList.remove("shake"),500))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t):t()}b();function g(){const o=document.querySelectorAll(".reveal-on-scroll");if(!o.length)return;const n=new IntersectionObserver(a=>{a.forEach(r=>{r.isIntersecting&&(r.target.classList.add("is-revealed"),n.unobserve(r.target))})},{threshold:.1,rootMargin:"0px 0px -30px 0px"});o.forEach(a=>n.observe(a))}function y(){const o=document.querySelector(".orbix-dock-reading"),n=document.querySelector(".orbix-dock-menu-btn, .orbix-dock-toggle"),a=document.querySelector(".mobile-drawer");o&&window.addEventListener("scroll",()=>{const r=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight,e=t>0?Math.round(r/t*100):0;o.textContent=`${Math.min(100,Math.max(0,e))}%`},{passive:!0}),n&&a&&n.addEventListener("click",()=>{const r=a.classList.toggle("open");n.setAttribute("aria-expanded",String(r)),document.body.style.overflow=r?"hidden":""})}function v(){const o=document.querySelector(".orbix-manifesto-para");if(!o)return;const n=o.textContent.trim();o.innerHTML="";const a=n.split(/\s+/),r=[];a.forEach((e,s)=>{const c=document.createElement("span");c.style.display="inline-block",c.style.whiteSpace="nowrap",c.style.marginRight="0.3em";for(let i=0;i<e.length;i++){const l=document.createElement("span");l.className="orbix-char ghost",l.textContent=e[i],c.appendChild(l),r.push(l)}o.appendChild(c)});function t(){const e=o.getBoundingClientRect(),s=window.innerHeight,c=s*.85,i=s*.25,l=e.top;let u=(c-l)/(c-i);u=Math.max(0,Math.min(1,u));const f=Math.floor(u*r.length);r.forEach((d,m)=>{m<=f?(d.classList.remove("ghost"),d.classList.add("active")):(d.classList.remove("active"),d.classList.add("ghost"))})}window.addEventListener("scroll",t,{passive:!0}),window.addEventListener("resize",t,{passive:!0}),t()}function E(){const o=document.querySelectorAll(".orbix-drag-pill");o.length&&o.forEach(n=>{let a=0,r=0,t=0,e=0,s=!1;n.addEventListener("pointerdown",i=>{s=!0,a=i.clientX-t,r=i.clientY-e,n.setPointerCapture(i.pointerId),n.style.transition="none",n.style.zIndex="50"}),n.addEventListener("pointermove",i=>{s&&(t=i.clientX-a,e=i.clientY-r,n.style.transform=`translate3d(${t}px, ${e}px, 0)`)});const c=i=>{if(s){s=!1;try{n.releasePointerCapture(i.pointerId)}catch{}t=0,e=0,n.style.transition="transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)",n.style.transform="translate3d(0, 0, 0)",n.style.zIndex="10"}};n.addEventListener("pointerup",c),n.addEventListener("pointercancel",c)})}function w(){const o=document.querySelectorAll(".orbix-tab-btn"),n=document.querySelectorAll(".orbix-tab-panel");!o.length||!n.length||o.forEach(a=>{a.addEventListener("click",()=>{const r=a.getAttribute("data-target");o.forEach(e=>e.classList.remove("active")),n.forEach(e=>e.classList.remove("active")),a.classList.add("active");const t=document.getElementById(r);t&&t.classList.add("active")})})}function L(){const o=document.querySelectorAll(".orbix-faq-question");o.length&&o.forEach(n=>{n.addEventListener("click",()=>{const a=n.closest(".orbix-faq-item"),r=a.classList.contains("open");document.querySelectorAll(".orbix-faq-item").forEach(t=>{t.classList.remove("open");const e=t.querySelector(".orbix-faq-question");e&&e.setAttribute("aria-expanded","false")}),r||(a.classList.add("open"),n.setAttribute("aria-expanded","true"))})})}document.addEventListener("DOMContentLoaded",()=>{p(),h(),g(),y(),v(),E(),w(),L()});
