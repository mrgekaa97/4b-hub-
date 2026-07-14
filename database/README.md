# database/

A simple **JSON-file datastore** for Version 1 — not a real database server. This is intentional for a lightweight CMS: no MySQL/Postgres/MongoDB to install or manage, just files the admin dashboard reads and writes.

## Files

| File | Real or sample data? | Holds |
|---|---|---|
| `services.json` | **Real** — extracted from the live site | The 9 services shown on `website/services.html` |
| `industries.json` | **Real** — extracted from the live site | The 8 industries shown on `website/industries.html` |
| `careers.json` | **Real** — extracted from the live site | The 4 open roles shown on `website/careers.html` |
| `settings.json` | **Real placeholders** — same values flagged in `docs/README.md` §4 | Company name, phone, WhatsApp, email, address, license numbers, social links |
| `seo.json` | **Real** — extracted from the live site | Per-page `<title>` and meta description for all 7 pages |
| `media.json` | **Real** — points at the actual files in `/uploads/media/` | Registry of the logo/favicon/icon assets already in use |
| `admin-users.json` | **Placeholder** | One admin account shape, with a placeholder (not real/hashed) password — **must be replaced before go-live** |
| `quote-requests.json` | **Sample/demo only** | 3 fake quote requests, so the CMS's "Quote Requests" module has something to display and manage while being built |
| `contact-messages.json` | **Sample/demo only** | 2 fake contact messages, same reason as above |

## Important limitation — please read

The live website (`website/contact.html`) has a quote-request form and the careers page has an application form, but **they are static HTML forms with client-side-only validation**. When a visitor submits one today, they see a success message, but nothing is actually saved anywhere — there is no server behind the public site to write into `quote-requests.json` or `contact-messages.json`.

That means, as of Version 1:
- The admin dashboard **can** fully manage `services.json`, `industries.json`, `careers.json`, `settings.json`, `seo.json`, and `media.json` — editing these through the CMS and having it reflect on the real site is a legitimate, working V1 feature (see `admin/README.md` for exactly how that reflects back into `website/`).
- The "Quote Requests" and "Contact Messages" modules in the CMS are **fully functional as an interface** (view, filter, change status, delete) but are working against the seeded sample data above, not live submissions — because there is no backend on the public site yet to deliver real ones here.

## What Version 2 would need to make submissions real

1. A small backend endpoint (e.g. a serverless function) that the public site's forms `POST` to instead of only doing client-side validation.
2. That endpoint appends the submission into `quote-requests.json` / `contact-messages.json` (or, better, a real database once volume justifies it).
3. Basic spam protection (honeypot field or a CAPTCHA) since the form would then be internet-facing.

This is called out here so it's an explicit, informed decision — not a silent gap.
