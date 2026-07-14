#!/usr/bin/env python3
"""
Checks that the :root color/spacing token VALUES in website/assets/css/styles.css
match the canonical values in shared/design-tokens/tokens.css.

The two files intentionally stay separate (the website must remain a
self-contained, independently deployable folder — see docs/DEPLOYMENT.md).
This script exists so a future edit to one doesn't silently drift from the other.

Usage:  python3 shared/design-tokens/check-sync.py
Exit code 0 = in sync, 1 = drift detected.
"""
import re, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CANON = os.path.join(ROOT, "shared", "design-tokens", "tokens.css")
WEBSITE_CSS = os.path.join(ROOT, "website", "assets", "css", "styles.css")

TOKEN_RE = re.compile(r"(--[\w-]+):\s*([^;]+);")

def extract_tokens(path):
    text = open(path, encoding="utf-8").read()
    root_block = re.search(r":root\s*\{(.*?)\}", text, re.S)
    if not root_block:
        return {}
    return dict(TOKEN_RE.findall(root_block.group(1)))

canon_tokens = extract_tokens(CANON)
site_tokens = extract_tokens(WEBSITE_CSS)

# Only compare tokens that exist in both — the CMS-only tokens
# (--sidebar-w, --topbar-h, --danger, --warning) are expected to be
# canonical-only and are not required on the public website.
shared_keys = set(canon_tokens) & set(site_tokens)
drift = []
for k in sorted(shared_keys):
    if canon_tokens[k].strip() != site_tokens[k].strip():
        drift.append((k, canon_tokens[k], site_tokens[k]))

missing_from_site = set(canon_tokens) - set(site_tokens) - {
    "--sidebar-w", "--topbar-h", "--danger", "--warning", "--font-primary"
}

if drift or missing_from_site:
    print("DESIGN TOKEN DRIFT DETECTED:")
    for k, canon_v, site_v in drift:
        print(f"  {k}: shared={canon_v!r}  website={site_v!r}")
    for k in sorted(missing_from_site):
        print(f"  {k}: present in shared/, missing from website/")
    sys.exit(1)
else:
    print(f"OK — {len(shared_keys)} shared tokens match between shared/ and website/.")
    sys.exit(0)
