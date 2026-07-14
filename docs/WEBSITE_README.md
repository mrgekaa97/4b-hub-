> **Note:** This document was originally written when the site lived at the project root. The site now lives under `website/` inside the overall project structure — see `docs/PROJECT-STRUCTURE.md` for the full layout. All commands below should be run from inside the `website/` folder.

# 4 Brothers Security & Guarding — Website (Version 1 Final)

فور برذرز للأمن والحراسات — الموقع الإلكتروني الرسمي

A production-ready, responsive, RTL-first Arabic website for an Egyptian corporate security and guarding company. Built with plain HTML5, CSS3 (design-token system), and vanilla JavaScript — no build tools or frameworks required to run it.

---

## 1. What's in this package

```
site/
├── index.html          Home
├── about.html           About / company story, values, licensing
├── services.html        9 detailed service sections + process timeline
├── industries.html      8 sector-specific pages
├── careers.html          Open roles, benefits, recruitment timeline, FAQ, application form
├── contact.html          Contact info, emergency line, map placeholder, quote request form
├── privacy.html          Minimal privacy policy (linked from footer)
├── robots.txt            Search engine crawl rules
├── sitemap.xml           XML sitemap of all 7 pages
├── site.webmanifest      PWA manifest (icons, theme color)
├── build.py              Python script that generates all HTML pages from shared templates
├── minify.py             Generates the .min.css / .min.js production assets
└── assets/
    ├── css/
    │   ├── styles.css        Source stylesheet (edit this)
    │   └── styles.min.css    Minified — referenced by the live pages
    ├── js/
    │   ├── main.js           Source script (edit this)
    │   └── main.min.js       Minified — referenced by the live pages
    └── img/
        ├── logo-nav.png / .webp     Small logo — navbar, footer, loading screen
        ├── logo-wide.png / .webp    Large logo — hero background watermark
        ├── logo-square.png          Master square crop — used for social image / JSON-LD
        ├── favicon.ico, favicon-16.png, favicon-32.png, apple-touch-icon.png
        └── icon-192.png, icon-512.png (+ .webp)   PWA icons
```

## 2. How the site is built

All 7 pages are generated from **`build.py`** — a single Python script that holds:
- Shared navbar, footer, loading screen, WhatsApp button, back-to-top button (defined once, reused on every page)
- A `page()` function that wraps every page with full SEO `<head>` (title, meta description, canonical, Open Graph, Twitter Card, JSON-LD structured data, favicons, manifest link)
- Per-page content blocks (`home_body`, `about_body`, `services_body`, etc.)

**This means: do not hand-edit the `.html` files directly.** Edit `build.py`, then regenerate:

```bash
python3 build.py     # regenerates all 7 .html files
python3 minify.py    # regenerates styles.min.css and main.min.js
```

If you only change `assets/css/styles.css` or `assets/js/main.js`, you still need to re-run `minify.py` so the live (minified) files reflect your edit.

## 3. Design system quick reference

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0A0A0A` | Primary background |
| `--charcoal` | `#161514` | Card / panel background |
| `--gold` | `#C9A227` | Primary accent, CTAs, links |
| `--gold-bright` | `#E4C766` | Hover states, highlighted numbers |
| `--ivory` | `#F5F0E6` | Primary text on dark |
| `--steel` | `#9C978A` | Secondary text, captions |

Typography: **Cairo** (display/utility) + **IBM Plex Sans Arabic** (body), loaded from Google Fonts. RTL is the default document direction (`dir="rtl"`); English is not yet built (see Changelog).

## 4. Known placeholders — replace before public launch

These were built with placeholder content because real assets weren't available at build time:

- **Phone number / WhatsApp number**: `+20 100 000 0000` / `wa.me/201000000000` — appears in navbar, footer, contact page, emergency band, and the floating WhatsApp button. Search-and-replace `201000000000` and `+20 100 000 0000` across all files.
- **Email**: `info@4brothers-security.com` — confirm this is the real domain/inbox.
- **Address**: "القاهرة الجديدة، مصر" — replace with the exact registered office address.
- **Commercial registry / license numbers**: footer shows `000000` / `0000` — replace with real numbers.
- **Client logos**: Home page "عملاؤنا" section uses generic text chips with a visible disclaimer note. Replace with real client logos (with permission) and remove the note.
- **Google Maps**: Contact page shows a styled placeholder, not a live embed. See Deployment Guide §5.
- **Social links**: Footer Facebook/LinkedIn icons point to `#`. Replace with real profile URLs.
- **Domain**: All canonical/OG URLs assume `https://www.4brothers-security.com`. Update `SITE_URL` in `build.py` if the real domain differs, then regenerate.

## 5. Browser support

Tested with Chromium via Playwright at mobile (390px), tablet (820px), and desktop (1440px) widths. Uses standard CSS Grid/Flexbox, CSS custom properties, and `IntersectionObserver` — supported in all evergreen browsers (Chrome, Edge, Firefox, Safari — last 2 versions). No IE11 support.

See `DEPLOYMENT.md` for hosting instructions and `CHANGELOG.md` for the full Version 1 history.
