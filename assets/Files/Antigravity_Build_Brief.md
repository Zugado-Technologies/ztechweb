# Zugado Technologies Website Blueprint — Quick Start

## Recommended workflow

1. Open the website repository in Google Antigravity.
2. Paste the full **Antigravity IDE build brief** from the Word blueprint into the agent.
3. Ask Antigravity to inspect the repository and propose a plan before implementing.
4. Add the persistent rules below to a root `AGENTS.md`.
5. Review the resulting site, run `npm run build`, and resolve all placeholders before launch.

The complete page-by-page sitemap, design, content, legal checklist and deployment plan is in `Zugado_Technologies_Website_Blueprint.docx`.

## Persistent rules (`AGENTS.md`)

- Use Vite + Vanilla JavaScript + semantic HTML + CSS. Do not introduce React, Vue, a backend, or large dependencies unless explicitly approved.
- Keep the website static-first, accessible, responsive and portable from GitHub Pages to future AWS static hosting.
- Never invent corporate particulars, founders, clients, metrics, certifications, testimonials, launch dates, project descriptions or legal facts.
- Never put confidential product/Labs details, secrets, credentials, private documentation or internal URLs in the public source or build.
- Treat all frontend code and static assets as public.
- Keep Zugado Technologies (company), Zugado (flagship product) and Zugado Labs (experimental division) clearly distinct in copy.
- Do not imply that all Labs projects are owned by Zugado Technologies. Ownership is determined by the applicable written agreement.
- Do not imply that external client services are already established. Use enquiry-oriented language until confirmed.
- Make all routes directly loadable on GitHub Pages; do not depend on server-side routing.
- Respect `prefers-reduced-motion`, use semantic landmarks, keyboard navigation, visible focus states and sufficient contrast.
- Do not add analytics, tracking, third-party form processing or non-essential cookies without explicit approval and corresponding privacy review.
- Never make a form appear to submit successfully unless it actually works. Document any integration placeholder.
- Keep legal pages as drafts until the company’s legal adviser reviews them against actual practices and applicable law.
- Run the production build after meaningful changes and report remaining TODOs honestly.

## First agent prompt

You are the senior frontend engineer and design implementer for the Zugado Technologies corporate website.

Build a polished, enterprise-style, static corporate website for Zugado Technologies using Vite + Vanilla JavaScript + semantic HTML + CSS. The primary goal is corporate credibility. The website should be Stripe-inspired in clarity and spacing, but must not copy Stripe’s branding, layout, copy or assets. Use restrained futuristic details and subtle motion; do not make it look like a single-product SaaS landing page.

Business context:
- Zugado Technologies is a registered Indian Private Limited Company. Do not invent its CIN, registered office, founders, team, clients, awards, metrics, launch dates or credentials.
- Present the company without founder biographies or unnecessary internal information.
- Three pillars: technology/product development; flagship product Zugado; experimental product work through Zugado Labs.
- Zugado is a hyperlocal-services technology product. State “beta” only if the company confirms that status is accurate. Do not disclose workflows, marketplace mechanics, matching logic, pricing, roadmap, architecture or confidential differentiators.
- Zugado Labs has one public project, Mind Bolt. Its description, screenshots and GitHub URL will be supplied later. Do not invent what it does.
- Show 2–3 stealth project cards with abstract visuals and neutral labels such as “Stealth project 01”. Never include confidential details in source, HTML, metadata or assets. Visual blur is decorative, not security.
- Labs project ownership varies by written agreement. Do not claim the company owns every Labs project.
- The company expects future business enquiries, careers submissions and independent contributor enquiries. Do not falsely claim an established external client portfolio.

Create static pages:
`/`, `/company/`, `/products/`, `/products/zugado/`, `/labs/`, `/labs/mind-bolt/`, `/labs/contribute/`, `/careers/`, `/contact/`, `/privacy/`, `/terms/`, and `/404.html`.

Design:
- Corporate pages: off-white background, deep navy text, muted slate, restrained blue accent, subtle borders, generous whitespace, clear typography.
- Labs pages: dark charcoal/navy theme with restrained electric blue/violet accents, while retaining clear company identity/navigation.
- Subtle transitions only; support reduced motion.
- Mobile-first, accessible, keyboard-friendly, strong contrast.
- Use original abstract CSS/SVG visuals or approved assets. No fake dashboards, testimonials, metrics or stock-brand imitation.

Content:
- Draft homepage headline: “Building technology with purpose.”
- Draft supporting copy: “Zugado Technologies develops digital products and explores new ideas through Zugado Labs.”
- Primary CTA: “Discuss a project” → Contact.
- External services should be framed as enquiries until the company confirms the service offering is operational.
- Product copy must stay high-level and must not promise launch dates.
- Mind Bolt details must be placeholders pending approved documentation.
- Forms must not pretend to work unless connected to a real service. Document integration requirements.
- Privacy and Terms pages are draft templates pending legal review.
- Leave verified corporate particulars as placeholders until supplied.

Technical:
- Use Vite, Vanilla JavaScript modules, CSS custom properties and minimal dependencies.
- Use separate HTML entry points or a Vite multi-page setup; all pages must load directly on GitHub Pages.
- Include package scripts for dev, build and preview.
- For `zugadotechnologies.com`, use Vite base `/` and document custom-domain/DNS setup.
- Add a GitHub Actions workflow to build and deploy `dist/`; document the required repository settings.
- Keep assets portable for future AWS static hosting.
- No secrets, API keys, confidential data, analytics or non-essential cookies by default.
- Include README instructions for local setup, build, GitHub Pages and later AWS migration.

Workflow:
1. Inspect the existing repository before editing.
2. Present a short implementation plan and file structure.
3. Implement the shared design system and pages.
4. Run the production build and fix errors.
5. Test direct loading, navigation, responsive layouts, keyboard behavior and reduced-motion behavior.
6. Report all completed work, placeholders and required human actions: legal review, domain DNS, repository settings, form integration and approved Mind Bolt content.
Never silently fabricate missing information.
