# uploads/

Binary files referenced by `database/media.json` and served by the website.

## uploads/media/

Currently holds the **real** logo, favicon, and PWA icon files generated for the site (14 files — see `database/media.json` for what each one is and where it's used). These are the actual production assets, copied here so the future admin dashboard's Media Library module has a real folder to list, and so new uploads (once a real upload mechanism exists — see note below) land in the same place as the existing ones.

## A note on file uploads and this environment

`window.storage` (the persistence API available to a React-artifact admin dashboard) only stores **text/JSON, not binary files** — there is no way for a browser-based artifact to write a new file into this `uploads/media/` folder directly. So for Version 1, the CMS's Media Library module works as a **registry manager**: the admin can add/edit/remove entries in `database/media.json` (filename, label, alt text, which page it's used on) and reference files that already exist here, but actually adding a *new* image file to this folder still requires a real file upload endpoint — a small backend detail deferred to Version 2, same as the Quote Requests / Contact Messages limitation described in `database/README.md`.
