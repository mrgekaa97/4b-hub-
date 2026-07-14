> **Note:** This document was originally written when the site lived at the project root. The site now lives under `website/` inside the overall project structure — see `docs/PROJECT-STRUCTURE.md` for the full layout. All commands below should be run from inside the `website/` folder.

# Deployment Guide — 4 Brothers Security & Guarding

This is a fully static site (HTML/CSS/JS, no server-side code, no database, no build step required at deploy time). It can be hosted anywhere that serves static files.

## 1. Before you deploy

1. Open `README.md` §4 and replace every placeholder (phone, WhatsApp number, email, address, license numbers, client logos, social links).
2. If your real domain isn't `4brothers-security.com`, open `build.py`, change the `SITE_URL` constant near the top, then run:
   ```bash
   python3 build.py
   python3 minify.py
   ```
3. Also update the `Sitemap:` line in `robots.txt` and every `<loc>` in `sitemap.xml` to match your real domain.

## 2. Recommended hosting options

Any of these work well for a static site like this:

**Option A — Netlify / Vercel (easiest)**
1. Create a new site, drag-and-drop the whole `site/` folder (or connect a Git repo containing it).
2. Set the publish directory to the folder containing `index.html` (project root).
3. HTTPS is automatic. Done.

**Option B — Traditional web hosting / cPanel**
1. Upload the entire contents of `site/` (not the folder itself — its *contents*) into `public_html/` via FTP/SFTP or the File Manager.
2. Make sure `index.html` ends up at the domain root (`public_html/index.html`, not `public_html/site/index.html`).

**Option C — Your own VPS with Nginx**
1. Copy the contents of `site/` to e.g. `/var/www/4brothers/`.
2. Example server block:
   ```nginx
   server {
     listen 80;
     server_name 4brothers-security.com www.4brothers-security.com;
     root /var/www/4brothers;
     index index.html;

     location / {
       try_files $uri $uri.html $uri/ =404;
     }

     location ~* \.(png|jpg|jpeg|webp|svg|ico|woff2?)$ {
       expires 30d;
       add_header Cache-Control "public, immutable";
     }
   }
   ```
3. Point DNS A/AAAA records at the server, then add HTTPS with `certbot --nginx`.

## 3. DNS & HTTPS

- Point your domain's A record (and `www` CNAME) at your host.
- Enable HTTPS (Netlify/Vercel do this automatically; on your own server use Let's Encrypt/Certbot).
- The site assumes `https://www.4brothers-security.com` in canonical URLs, Open Graph tags, and `sitemap.xml`. If you use the bare domain (no `www`) or a different domain, update `SITE_URL` in `build.py` and regenerate as shown above.

## 4. After going live

1. **Google Search Console**: verify the domain, then submit `https://yourdomain.com/sitemap.xml`.
2. **Bing Webmaster Tools**: same as above, optional but recommended.
3. Test the live Open Graph tags with Facebook's Sharing Debugger and Twitter's Card Validator — paste your home page URL and confirm the logo image and description show correctly.
4. Run a fresh **Lighthouse** audit (Chrome DevTools → Lighthouse tab, or `npx lighthouse https://yourdomain.com --view`) on the live URL. On a real server with a CDN, fonts and images load far faster than in local testing — scores should sit in the 90s across Performance, Accessibility, Best Practices, and SEO once real assets replace the placeholders in README §4.

## 5. Activating the real Google Map

The contact page currently shows a styled placeholder (not a live embed), since no Google Maps API key or exact office coordinates were available at build time. To activate it:

1. Get an embed URL from Google Maps: search your office address → **Share** → **Embed a map** → copy the `<iframe>` src URL.
2. In `build.py`, find the `.map-placeholder` block inside `contact_body` and replace it with:
   ```html
   <div style="aspect-ratio:21/8;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--line);">
     <iframe src="YOUR_EMBED_URL_HERE" width="100%" height="100%" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="خريطة موقع فور برذرز"></iframe>
   </div>
   ```
3. Regenerate: `python3 build.py`.

## 6. Making future content edits

- **Text/content changes**: edit the relevant `*_body` variable in `build.py`, then run `python3 build.py`.
- **Style changes**: edit `assets/css/styles.css`, then run `python3 minify.py` (this regenerates `styles.min.css`, which is what the live pages actually load).
- **Script changes**: edit `assets/js/main.js`, then run `python3 minify.py`.
- Always run both `build.py` and `minify.py` before re-deploying if you touched CSS/JS, since the pages reference the `.min.` files, not the source files.

## 7. Rolling back

Keep the previous deployed version of the `site/` folder (or a Git tag) before uploading a new one, so you can restore instantly if something looks wrong after a deploy — there's no database or server state to worry about, just files.
