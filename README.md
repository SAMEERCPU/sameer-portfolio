# Sameer Baskota — Portfolio (Vanilla HTML / CSS / JS)

A production-ready, multi-page personal portfolio for **sameerbaskota.com.np** — built with plain
HTML5, CSS3, and JavaScript. No frameworks, no build step, no npm packages, no CDNs, no external
dependencies of any kind. Every file in this folder is exactly what ships to the browser.

## 1. Run it locally

No build step is required — but opening `index.html` directly via `file://` will block the
`fetch`-free features that still rely on relative paths correctly, so serve it over a local HTTP
server instead:

```bash
# Python
python3 -m http.server 8080

# or Node, if you have it
npx serve .
```

Then open http://localhost:8080.

## 2. Before you deploy — replace the placeholders

| What | Where | Notes |
|---|---|---|
| Portrait photo | `images/portrait.jpg` | Replace with a real professional photo (portrait orientation, ~1000×1250px works well). |
| CV / résumé | `assets/Sameer_Baskota_CV.pdf` | Replace with your actual CV. Downloadable only from the dedicated CV section on the Home page (below About Me) — this is intentional, not a bug. |
| Email | `contact.html` (mailto link) | Currently a placeholder address. |
| Social links | `contact.html` (GH / in / X buttons) | Point these at your real GitHub / LinkedIn / Twitter. |
| OG image | `images/og-image.png` | Placeholder social preview card — regenerate with your branding. |
| Favicons | `images/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Simple radar-mark placeholders. |
| Contact form | `contact.html` + `js/main.js` (`initContactForm`) | The form validates client-side but isn't wired to a backend — see §5. |

Page copy lives directly in each page's HTML (`about.html`, `projects.html`, `skills.html`,
`experience.html`) — there's no separate data file since this is a static multi-page build.

## 3. Project structure

```
index.html          Homepage — cinematic hero + quick links to every section
about.html            About — bio, focus areas, quick facts panel
projects.html          Projects — featured project banner + secondary project cards
skills.html             Skills — four categorized skill-card groups
experience.html          Experience — flight-log style timeline
contact.html              Contact — info panel + validated contact form
404.html                   Custom not-found page

css/
  main.css       Single entry point — @imports every module below in order
  base.css        Design tokens (colors, fonts, spacing), reset, base typography
  layout.css       HUD grid, glass panels, section scaffolding, reveal-on-scroll base state
  loader-nav.css    Loading screen, scroll progress bar, navbar (desktop + mobile)
  hero.css           Hero section: radar sweep, typewriter, portrait glow, mouse spotlight
  components.css      Tags, footer, back-to-top button, shared decorations
  about.css / projects.css / skills.css / experience.css / contact.css
                        Page-specific styles

js/
  main.js         All behavior: loader, scroll progress, nav state, reveal-on-scroll
                    (IntersectionObserver), typewriter effect, mouse-follow spotlight,
                    parallax, contact form validation — vanilla JS, no dependencies

images/           Portrait, favicons, OG image
fonts/            Self-hosted Lora (headings) / Carlito (body) (.woff)
assets/           CV PDF
robots.txt, sitemap.xml   Basic SEO plumbing
```

## 4. Design system

- **Background:** `#F8F3E8` light cream (light is the default; deep navy `#0A1420` for dark mode) with a faint animated coordinate grid (`.hud-grid`).
- **Surface / cards:** white (light) or warm black (dark) with glassmorphism (blur + translucency) and hairline cyan borders,
  finished with corner-bracket accents (`.corner-frame`) for an instrument-panel feel.
- **Primary accent:** `#12355B` navy (light) / `#8DB4E0` sky blue (dark) — links, CTAs, labels.
- **Secondary accent:** `#C8692E` copper (light) / `#E0894F` (dark) — status pulses, "featured" tags.
- **Type:** self-hosted, no CDN — Lora (headings, warm book-style serif) and Carlito (body and labels, friendly humanist sans) ship as local `.woff` files in `/fonts`, loaded via `@font-face` in `css/base.css` with system fallbacks and `font-display: swap`.

## 5. Contact form — connecting it to something real

The form in `contact.html` validates name/email/message client-side (see `initContactForm` in
`js/main.js`) but this is a static site with **no backend**, so submissions currently just confirm
they're ready to send. To actually receive messages, pick one:

- **Formspree / Getform / Basin** — point the `<form>`'s `action` at their endpoint and add a
  `method="POST"`; these work with plain HTML forms and need no JavaScript changes.
- **Your own endpoint** — replace the `fetch`-free `submit` handler in `initContactForm` with a
  `fetch(...)` call to your API.
- **mailto: fallback** — the email address is already visible on the page for direct contact.

## 6. Light / dark theme

The site defaults to dark, but ships a full light theme too, toggled from the sun/moon button
in the navbar (desktop: top-right; mobile: inside the menu). The chosen theme is saved to
`localStorage` (`sbTheme`) and restored on every future visit; if nothing is saved yet, it falls
back to the visitor's OS-level `prefers-color-scheme`. A small blocking script at the top of
every page's `<head>` applies the saved theme before first paint, so there's no flash of the
wrong theme on load.

All colors route through CSS custom properties defined in `css/base.css` (`:root` for dark,
`[data-theme="light"]` for the override). If you add new components, use `var(--ink)`,
`var(--bg-surface)`, etc. rather than hardcoded hex/rgba values, or they won't respond to the
toggle. Both themes were checked against WCAG AA contrast (4.5:1) for body text, labels, and links.

## 7. Deployment

This is static output — deploy it anywhere that serves files:

- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop this folder, or connect the repo. No build
  command needed (leave it blank / "no build").
- **Any shared host / cPanel:** upload the contents of this folder to your `public_html`.
- **GitHub Pages:** push to a repo and enable Pages on the root.

Point `sameerbaskota.com.np`'s DNS at whichever host you choose, following their custom-domain
instructions.

## 8. Accessibility & performance notes

- Skip-to-content link, visible focus rings, semantic landmarks (`header`, `nav`, `main`, `section`,
  `footer`).
- `prefers-reduced-motion` disables/shortens all animation, including the loader and typewriter.
- No external network requests at all — fonts, icons, and animations are all local/inline, so
  there's nothing to block first paint and nothing that can silently fail if a CDN goes down.
- Images should be reasonably sized/compressed before deploying (the placeholder portrait is not
  optimized; replace and compress your real photo).
