#!/usr/bin/env python3
import re, os

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")

def minify_css(text):
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s*([{}:;,])\s*", r"\1", text)
    text = re.sub(r";}", "}", text)
    return text.strip()

def minify_js(text):
    # Remove full-line // comments and /* */ blocks; collapse blank lines.
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    lines = []
    for line in text.split("\n"):
        stripped = line.strip()
        if stripped.startswith("//"):
            continue
        if stripped == "":
            continue
        lines.append(stripped)
    return "\n".join(lines)

css_path = f"{BASE}/css/styles.css"
css_out = f"{BASE}/css/styles.min.css"
with open(css_path, encoding="utf-8") as f:
    css = f.read()
with open(css_out, "w", encoding="utf-8") as f:
    f.write(minify_css(css))

js_path = f"{BASE}/js/main.js"
js_out = f"{BASE}/js/main.min.js"
with open(js_path, encoding="utf-8") as f:
    js = f.read()
with open(js_out, "w", encoding="utf-8") as f:
    f.write(minify_js(js))

orig_css = os.path.getsize(css_path)
min_css = os.path.getsize(css_out)
orig_js = os.path.getsize(js_path)
min_js = os.path.getsize(js_out)

print(f"CSS: {orig_css} -> {min_css} bytes ({100 - round(min_css/orig_css*100)}% smaller)")
print(f"JS:  {orig_js} -> {min_js} bytes ({100 - round(min_js/orig_js*100)}% smaller)")
