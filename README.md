# Zugado Technologies — Corporate Website

Official corporate website for **Zugado Technologies Private Limited**, built with Vite, semantic HTML, modern CSS design tokens, and Vanilla JavaScript.

---

## Architecture & Principles

- **Framework-free & Static-First**: Built with Vite + Vanilla JS + Semantic HTML + CSS. No React, Vue, or heavy client-side frameworks.
- **Enterprise Credibility**: Clean typography, generous spacing, and deliberate layout inspired by Stripe's clarity while maintaining distinct corporate identity.
- **Strict Brand & Entity Separation**:
  - **Zugado Technologies**: Corporate parent entity (Indian Private Limited Company).
  - **Zugado**: Flagship hyperlocal-services product (in active development).
  - **Zugado Labs**: Experimental innovation studio (dark studio theme) featuring public project **Mind Bolt** and confidential stealth prototypes.
- **Static Multi-Page Routing**: Real static HTML entry points (`/company/index.html`, etc.) allowing direct page load and refresh on GitHub Pages without server-side rewrites.
- **AWS Migration Ready**: Clean root-relative paths and pure static output in `dist/` ready for future AWS S3 + CloudFront hosting.

---

## Directory Structure

```
Zugado Technologies/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions Vite build & GitHub Pages deploy
├── public/
│   ├── assets/                 # Brand assets & logos
│   ├── CNAME                   # www.zugadotechnologies.com
│   ├── favicon.png             # Site favicon
│   └── robots.txt              # Search engine directives
├── src/
│   ├── styles/
│   │   ├── tokens.css          # Design tokens & color system
│   │   ├── global.css          # Reset, typography, containers, buttons
│   │   ├── components.css      # Header, drawer, footer, cards, forms
│   │   └── labs.css            # Zugado Labs dark studio theme
│   └── scripts/
│       ├── main.js             # Application initialization
│       ├── navigation.js       # Mobile menu & active link highlighting
│       └── forms.js            # Transparent form dispatch & mailto fallback
├── company/index.html          # Company overview & approach
├── products/
│   ├── index.html              # Products portfolio
│   └── zugado/index.html       # Zugado flagship product
├── labs/
│   ├── index.html              # Zugado Labs studio
│   ├── mind-bolt/index.html    # Mind Bolt documentation (placeholders)
│   └── contribute/index.html   # Independent Contributor EOI
├── careers/index.html          # Careers & talent submission
├── contact/index.html          # Business & general inquiries
├── privacy/index.html          # Privacy Notice (Draft Template)
├── terms/index.html            # Terms of Use (Draft Template)
├── 404.html                    # Branded 404 error page
├── index.html                  # Homepage
├── AGENTS.md                   # Persistent workspace constraints & rules
├── vite.config.js              # Multi-page build configuration
└── package.json                # Project scripts & dependencies
```

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Generates production-optimized static files in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## Deployment to GitHub Pages

This repository includes an automated GitHub Actions deployment workflow in `.github/workflows/deploy.yml`.

### Repository Configuration:
1. In your GitHub repository, navigate to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Pushes to `main` or `v2` will automatically trigger the workflow, build the site, and publish the `dist/` folder.

### Custom Domain Setup (`zugadotechnologies.com`):
1. In **Settings** → **Pages** → **Custom domain**, enter `www.zugadotechnologies.com`.
2. Configure DNS records with your registrar:
   - **Apex domain (`@`)**: Point A records to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **`www` subdomain**: CNAME record pointing to `<your-org-or-username>.github.io`.
3. Enable **Enforce HTTPS** once DNS propagation completes.

---

## Future AWS Migration Readiness

The static build is 100% portable to an AWS serverless architecture:
1. **Amazon S3**: Create a private S3 bucket and upload the contents of `dist/`.
2. **CloudFront**: Configure an Amazon CloudFront distribution pointing to the S3 bucket with Origin Access Control (OAC).
3. **Route 53**: Alias records pointing `zugadotechnologies.com` and `www.zugadotechnologies.com` to the CloudFront distribution.
4. **AWS Certificate Manager (ACM)**: Provision a free public SSL/TLS certificate for custom domain HTTPS.
5. **Default Root Object & Error Responses**: Set default root object to `index.html` and configure custom error response for 404 pointing to `/404.html`.

---

## Launch Checklist & Required Human Actions

- [ ] **Corporate Particulars**: Verify exact registered entity name, CIN, and registered office address from Ministry of Corporate Affairs (MCA) records before publication.
- [ ] **Legal Review**: Have the company's legal counsel review the draft templates in `/privacy/` and `/terms/`.
- [ ] **Mind Bolt Documentation**: Supply approved technical documentation, description, screenshots, and repository link for `/labs/mind-bolt/`.
- [ ] **Form Backend Integration**: Currently, forms use accessible client dispatch with clear fallback instructions. Connect an external form provider (such as Formspree, AWS SES API, or a dedicated serverless function) when backend processing is desired.
- [ ] **DNS & HTTPS**: Verify custom domain records and enforce HTTPS in GitHub Pages settings.
