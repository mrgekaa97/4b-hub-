#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.error
OUT = os.path.dirname(os.path.abspath(__file__))

NAV = """
  <a href="#main-content" class="skip-link">تخطي إلى المحتوى الرئيسي</a>
  <nav class="navbar">
    <div class="container">
      <a href="index.html" class="brand" aria-label="فور برذرز للأمن والحراسات — الصفحة الرئيسية">
        <picture>
          <source srcset="assets/img/logo-nav.webp" type="image/webp">
          <img src="assets/img/logo-nav.png" alt="شعار فور برذرز للأمن والحراسات" width="38" height="38" loading="eager">
        </picture>
        <span class="brand-word">4 BROTHERS<small>فور برذرز للأمن والحراسات</small></span>
      </a>
      <div class="nav-links">
        <a href="index.html" data-nav="home">الرئيسية</a>
        <a href="about.html" data-nav="about">من نحن</a>
        <a href="services.html" data-nav="services">خدماتنا</a>
        <a href="industries.html" data-nav="industries">القطاعات</a>
        <a href="careers.html" data-nav="careers">الوظائف</a>
        <a href="contact.html" data-nav="contact">تواصل معنا</a>
      </div>
      <div class="nav-right">
        <div class="lang-switch">
          <a href="#" class="is-active" aria-current="true">AR</a>
          <a href="#" title="النسخة الإنجليزية قيد التطوير">EN</a>
        </div>
        <a href="contact.html#quote" class="btn btn--primary" style="padding:.7em 1.4em;">اطلب عرض سعر</a>
        <button class="nav-toggle" aria-label="فتح القائمة" aria-expanded="false" aria-controls="mobile-menu"><span></span></button>
      </div>
    </div>
  </nav>
  <div class="mobile-menu" id="mobile-menu">
    <a href="index.html">الرئيسية</a>
    <a href="about.html">من نحن</a>
    <a href="services.html">خدماتنا</a>
    <a href="industries.html">القطاعات</a>
    <a href="careers.html">الوظائف</a>
    <a href="contact.html">تواصل معنا</a>
    <a href="contact.html#quote" class="btn btn--primary">اطلب عرض سعر</a>
    <div class="lang-switch"><a href="#" class="is-active">AR</a><a href="#">EN</a></div>
  </div>
"""

LOADING_SCREEN = """
  <div class="loading-screen" aria-hidden="true">
    <img src="assets/img/logo-nav.png" alt="" width="76" height="76" loading="eager">
    <div class="loading-bar"></div>
  </div>
"""

WHATSAPP = """
  <a class="whatsapp-fab" href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر واتساب — يفتح في نافذة جديدة">
    <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.5 1.8 6.4L3 29l7.3-2c1.8 1 3.8 1.5 5.7 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.3 1.2 1.2-4.2-.2-.4a10.4 10.4 0 0 1-1.6-5.6c0-5.8 4.7-10.5 10.4-10.5s10.4 4.7 10.4 10.5S21.8 25.7 16 25.7zm5.7-7.8c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2-.4-.5-.7-.5h-.6c-.2 0-.5.1-.8.4a3.6 3.6 0 0 0-1.1 2.7c0 1.6 1.2 3.1 1.3 3.3.2.3 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.2.2-1.4z"/></svg>
  </a>
  <button class="back-to-top" aria-label="العودة إلى أعلى الصفحة">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  </button>
"""

def footer(current_page=""):
    return f"""
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <a href="index.html" class="brand" style="margin-bottom:1rem;" aria-label="فور برذرز للأمن والحراسات — الصفحة الرئيسية">
            <picture>
              <source srcset="assets/img/logo-nav.webp" type="image/webp">
              <img src="assets/img/logo-nav.png" alt="شعار فور برذرز للأمن والحراسات" width="34" height="34" loading="lazy">
            </picture>
            <span class="brand-word">4 BROTHERS<small>فور برذرز للأمن والحراسات</small></span>
          </a>
          <p style="color:var(--steel);font-size:.9rem;max-width:32ch;">
            شركة مصرية متخصصة في توفير خدمات الأمن والحراسة للشركات والمنشآت الصناعية والطبية والفندقية والسكنية.
          </p>
          <div class="social-row">
            <a href="#" aria-label="فيسبوك"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16 3.1 15 3 13.9 3c-2.4 0-4 1.5-4 4.1v2.7H7.2V13H10v8h3.5z"/></svg></a>
            <a href="#" aria-label="لينكدإن"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3.5 9.5h3v11h-3v-11zM9.5 9.5h2.9v1.5h.04c.4-.75 1.4-1.55 2.9-1.55 3.1 0 3.66 2 3.66 4.6v6.45h-3v-5.7c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.5-2.25 3.1v5.8h-3v-11z"/></svg></a>
            <a href="https://wa.me/201000000000" aria-label="واتساب"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1112 20z"/></svg></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>الشركة</h4>
          <ul>
            <li><a href="about.html">من نحن</a></li>
            <li><a href="services.html">خدماتنا</a></li>
            <li><a href="industries.html">القطاعات</a></li>
            <li><a href="careers.html">الوظائف</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>روابط سريعة</h4>
          <ul>
            <li><a href="contact.html#quote">اطلب عرض سعر</a></li>
            <li><a href="contact.html">تواصل معنا</a></li>
            <li><a href="careers.html#apply">التقديم للوظائف</a></li>
            <li><a href="privacy.html">سياسة الخصوصية</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>التواصل</h4>
          <ul>
            <li>القاهرة الجديدة، مصر</li>
            <li dir="ltr" style="text-align:right;">+20 100 000 0000</li>
            <li dir="ltr" style="text-align:right;">info@4brothers-security.com</li>
            <li>سجل تجاري رقم 000000 — ترخيص وزارة الداخلية رقم 0000</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 فور برذرز للأمن والحراسات. جميع الحقوق محفوظة.</span>
        <span>Built for 4 Brothers Security &amp; Guarding — Egypt</span>
      </div>
    </div>
  </footer>
"""

SITE_URL = "https://www.4brothers-security.com"

def page(title, desc, body, active, og_image="assets/img/logo-hero.png", extra_head="", json_ld=None):
    canonical = f"{SITE_URL}/{active}"
    ld = json_ld or f"""{{
  "@context": "https://schema.org",
  "@type": "SecurityService",
  "name": "4 Brothers Security & Guarding \u2014 \u0641\u0648\u0631 \u0628\u0631\u0630\u0631\u0632 \u0644\u0644\u0623\u0645\u0646 \u0648\u0627\u0644\u062d\u0631\u0627\u0633\u0627\u062a",
  "image": "{SITE_URL}/assets/img/logo-square.png",
  "url": "{canonical}",
  "telephone": "+201000000000",
  "priceRange": "$$",
  "areaServed": "EG",
  "address": {{
    "@type": "PostalAddress",
    "addressLocality": "\u0627\u0644\u0642\u0627\u0647\u0631\u0629 \u0627\u0644\u062c\u062f\u064a\u062f\u0629",
    "addressCountry": "EG"
  }}
}}"""
    return f"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0A0A0A">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="4 Brothers Security & Guarding">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE_URL}/{og_image}">
<meta property="og:url" content="{canonical}">
<meta property="og:locale" content="ar_EG">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{SITE_URL}/{og_image}">

<!-- Favicons -->
<link rel="icon" href="assets/img/favicon.ico" sizes="any">
<link rel="icon" href="assets/img/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="assets/img/favicon-16.png" type="image/png" sizes="16x16">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="assets/css/styles.min.css">
<script type="application/ld+json">{ld}</script>
{extra_head}
</head>
<body>
{LOADING_SCREEN}
{NAV}
<main id="main-content">
{body}
</main>
{footer(active)}
{WHATSAPP}
<script src="assets/js/main.min.js" defer></script>
</body>
</html>
"""

def write(name, html):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", name)

def active_script(pagefile):
    return f"""<script>
document.querySelectorAll('[data-nav]').forEach(a=>{{
  if(a.getAttribute('href')==='{pagefile}') a.classList.add('is-active');
}});
</script>"""

# ---------- shared inline icons (24x24, stroke) ----------
I_SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"/></svg>'
I_FACTORY = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V10l5 3V10l5 3V7l6 4v10H3z"/></svg>'
I_HOSPITAL = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18"/><path d="M12 8v6M9 11h6"/></svg>'
I_HOTEL = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/></svg>'
I_HOME = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>'
I_BUILDING = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20"/><path d="M9 7h1M14 7h1M9 12h1M14 12h1M9 17h1M14 17h1"/></svg>'
I_WAREHOUSE = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-5 9 5v12"/><path d="M3 12h18"/></svg>'
I_SCHOOL = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>'
I_GOV = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 4H3z"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8"/><path d="M3 21h18"/></svg>'
I_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
I_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
I_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>'
I_PATROL = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></svg>'
I_CCTV = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11l4-3v10l-4-3H3z"/><path d="M6 8v5M2 21h10"/></svg>'
I_EVENT = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V8a4 4 0 014-4h8a4 4 0 014 4v13"/><path d="M9 21v-6h6v6"/></svg>'
I_VIP = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>'
I_CONSULT = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H8l-4 4z"/></svg>'

# ---------- icon lookup, for mapping CMS icon keys (e.g. "I_SHIELD") back to their SVG markup ----------
ICON_BY_KEY = {name: value for name, value in list(globals().items()) if name.startswith("I_") and isinstance(value, str)}

# ================================================================
# HOME
# ================================================================
home_body = f"""
<section class="hero">
  <div class="pillars"><span></span><span></span><span></span><span></span></div>
  <picture>
    <source srcset="assets/img/logo-wide.webp" type="image/webp">
    <img src="assets/img/logo-wide.png" alt="" class="hero-bg-mark" aria-hidden="true" loading="eager" width="900" height="686">
  </picture>
  <div class="container hero-grid reveal">
    <div>
      <div class="hero-logo-mark">
        <picture>
          <source srcset="assets/img/logo-nav.webp" type="image/webp">
          <img src="assets/img/logo-nav.png" alt="" width="56" height="56" aria-hidden="true" loading="eager">
        </picture>
        <span>4 BROTHERS SECURITY &amp; GUARDING</span>
      </div>
      <div class="eyebrow">حراسة معتمدة · ترخيص وزارة الداخلية</div>
      <h1 class="h-display">حماية تستحقها منشأتك،<br>بضمان <span class="gold-text">أربعة إخوة</span></h1>
      <p class="lead" style="max-width:52ch;margin-top:1.2rem;">
        فور برذرز شركة مصرية متخصصة في تأمين وحراسة المصانع والمستشفيات والفنادق والمجمعات السكنية والمنشآت التجارية،
        بعقود واضحة وفريق مدرَّب ومسؤولية شخصية عن كل موقع نحرسه.
      </p>
      <div class="btn-row" style="margin-top:2rem;">
        <a href="contact.html#quote" class="btn btn--primary">اطلب عرض سعر الآن {I_ARROW}</a>
        <a href="tel:+201000000000" class="btn btn--ghost">اتصل بنا الآن</a>
      </div>
      <div class="hero-trust">
        <div><div class="stat-num" data-count-to="12" data-suffix="+">0</div><div class="stat-label">سنة خبرة</div></div>
        <div><div class="stat-num" data-count-to="450" data-suffix="+">0</div><div class="stat-label">فرد أمن مدرَّب</div></div>
        <div><div class="stat-num" data-count-to="120" data-suffix="+">0</div><div class="stat-label">موقع تحت الحراسة</div></div>
        <div><div class="stat-num" data-count-to="15" data-suffix=" دقيقة">0</div><div class="stat-label">زمن الاستجابة</div></div>
      </div>
    </div>
    <div class="hero-panel">
      <div class="eyebrow" style="margin-bottom:1rem;">لماذا تختار فور برذرز</div>
      <div class="hero-panel-row"><span>ترخيص التشغيل</span><b>ساري ومعتمد</b></div>
      <div class="hero-panel-row"><span>تأمين ضد المخاطر</span><b>تغطية شاملة</b></div>
      <div class="hero-panel-row"><span>تدريب الأفراد</span><b>معتمد دوليًا</b></div>
      <div class="hero-panel-row"><span>الإشراف الميداني</span><b>24 / 7</b></div>
      <div class="hero-panel-row"><span>بدء الخدمة</span><b>خلال 72 ساعة</b></div>
    </div>
  </div>
</section>

<section class="section section--line-bottom">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">لماذا فور برذرز</div>
      <h2 class="h2">ما الذي يميزنا فعليًا عن أي شركة حراسة أخرى</h2>
    </div>
    <div class="grid grid--3">
      <div class="card why-card">
        <div class="card-icon">{I_SHIELD}</div>
        <h3 class="h3">ترخيص وتأمين كامل</h3>
        <p>كل عقد مغطى بترخيص تشغيل ساري ووثيقة تأمين شاملة على الأفراد والموقع.</p>
      </div>
      <div class="card why-card">
        <div class="card-icon">{I_CLOCK}</div>
        <h3 class="h3">استجابة خلال 15 دقيقة</h3>
        <p>فريق إشراف ميداني متاح على مدار الساعة للتعامل مع أي طارئ فورًا.</p>
      </div>
      <div class="card why-card">
        <div class="card-icon">{I_PATROL}</div>
        <h3 class="h3">أفراد مدرَّبون فعليًا</h3>
        <p>برنامج تأهيل داخلي قبل أي تكليف ميداني، لا مجرد توظيف سريع.</p>
      </div>
      <div class="card why-card">
        <div class="card-icon">{I_CONSULT}</div>
        <h3 class="h3">تقارير يومية شفافة</h3>
        <p>توثيق كل دورية وحادثة بتقرير واضح يصلك أولًا بأول، لا نهاية الشهر فقط.</p>
      </div>
      <div class="card why-card">
        <div class="card-icon">{I_VIP}</div>
        <h3 class="h3">مدير حساب مخصص</h3>
        <p>نقطة تواصل واحدة مسؤولة عن عقدك بالكامل، لا تنقل بين موظفين مختلفين.</p>
      </div>
      <div class="card why-card">
        <div class="card-icon">{I_CCTV}</div>
        <h3 class="h3">غرفة عمليات 24/7</h3>
        <p>متابعة مركزية لكل المواقع المتعاقدة على مدار اليوم بالكامل.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--charcoal section--line-bottom">
  <div class="container">
    <div class="section-head center reveal">
      <div class="eyebrow" style="justify-content:center;">خدماتنا</div>
      <h2 class="h2">تغطية أمنية كاملة لكل نوع منشأة</h2>
      <p class="lead">من الحراسة الثابتة إلى الدوريات المتحركة، نبني الخطة الأمنية حول طبيعة موقعك الفعلية.</p>
    </div>
    <div class="grid grid--3 reveal">
      <div class="card">
        <div class="card-icon">{I_SHIELD}</div>
        <h3 class="h3">الحراسة الثابتة</h3>
        <p>أفراد أمن مؤهلون في نقاط ثابتة داخل وخارج الموقع، على مدار الساعة.</p>
        <a href="services.html#static-guarding" class="card-link">تفاصيل الخدمة {I_ARROW}</a>
      </div>
      <div class="card">
        <div class="card-icon">{I_PATROL}</div>
        <h3 class="h3">الدوريات المتحركة</h3>
        <p>جولات تفتيش منتظمة وموثقة لمواقع متعددة أو مساحات واسعة.</p>
        <a href="services.html#mobile-patrol" class="card-link">تفاصيل الخدمة {I_ARROW}</a>
      </div>
      <div class="card">
        <div class="card-icon">{I_CCTV}</div>
        <h3 class="h3">المراقبة والتحكم</h3>
        <p>إدارة غرف المراقبة وربط أنظمة الكاميرات بفريق الاستجابة الميداني.</p>
        <a href="services.html#cctv" class="card-link">تفاصيل الخدمة {I_ARROW}</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <div class="eyebrow">القطاعات</div>
      <h2 class="h2">خبرة متخصصة في القطاعات عالية الحساسية</h2>
    </div>
    <div class="grid grid--4 reveal">
      <div class="card"><div class="card-icon">{I_FACTORY}</div><h3 class="h3" style="font-size:1.05rem;">المصانع</h3><p style="font-size:.88rem;">تأمين محيط ومداخل ومخازن.</p></div>
      <div class="card"><div class="card-icon">{I_HOSPITAL}</div><h3 class="h3" style="font-size:1.05rem;">المستشفيات</h3><p style="font-size:.88rem;">حراسة بروتوكولات حساسة وخصوصية المرضى.</p></div>
      <div class="card"><div class="card-icon">{I_HOTEL}</div><h3 class="h3" style="font-size:1.05rem;">الفنادق</h3><p style="font-size:.88rem;">حضور لائق يحفظ تجربة الضيف.</p></div>
      <div class="card"><div class="card-icon">{I_HOME}</div><h3 class="h3" style="font-size:1.05rem;">المجمعات السكنية</h3><p style="font-size:.88rem;">بوابات، دوريات، وتحكم دخول صارم.</p></div>
    </div>
    <div style="text-align:center;margin-top:2.5rem;" class="reveal">
      <a href="industries.html" class="btn btn--ghost">عرض جميع القطاعات {I_ARROW}</a>
    </div>
  </div>
</section>

<section class="section section--charcoal section--line-top section--line-bottom">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">آلية العمل</div>
      <h2 class="h2">من أول اتصال إلى بدء الحراسة الفعلي</h2>
    </div>
    <div class="timeline">
      <div class="timeline-step">
        <div class="timeline-num">01</div>
        <h4>تواصل أولي</h4>
        <p>ترسل تفاصيل الموقع عبر نموذج طلب عرض السعر أو مكالمة مباشرة.</p>
      </div>
      <div class="timeline-step">
        <div class="timeline-num">02</div>
        <h4>معاينة ميدانية</h4>
        <p>فريقنا يزور الموقع لتقييم المخاطر وتحديد عدد الأفراد المطلوب.</p>
      </div>
      <div class="timeline-step">
        <div class="timeline-num">03</div>
        <h4>عرض سعر وعقد</h4>
        <p>عرض مكتوب بالتفاصيل الكاملة، ثم توقيع عقد واضح البنود.</p>
      </div>
      <div class="timeline-step">
        <div class="timeline-num">04</div>
        <h4>بدء الخدمة</h4>
        <p>انتشار الفريق المدرَّب في الموقع خلال 72 ساعة من التوقيع.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">آراء عملائنا</div>
      <h2 class="h2">شركات تثق في فور برذرز</h2>
    </div>
    <div class="testi-track" style="max-width:760px;margin-inline:auto;">
      <div class="testi-slide is-active">
        <p class="testi-quote">التزام فريق فور برذرز بمواعيد الدوريات وتوثيق كل حادثة صغيرة أعطانا راحة بال حقيقية داخل المصنع.</p>
        <div class="testi-meta"><div class="testi-avatar">م</div><div><div class="testi-name">مدير المصنع</div><div class="testi-role">مصنع صناعات غذائية — العاشر من رمضان</div></div></div>
      </div>
      <div class="testi-slide">
        <p class="testi-quote">التعامل مع فريق الأمن في المستشفى احترافي وهادئ، وهذا بالضبط ما نحتاجه في بيئة طبية حساسة.</p>
        <div class="testi-meta"><div class="testi-avatar">هـ</div><div><div class="testi-name">مدير العمليات</div><div class="testi-role">مستشفى خاص — القاهرة الجديدة</div></div></div>
      </div>
      <div class="testi-slide">
        <p class="testi-quote">بدأنا العقد خلال أقل من أسبوع، والتقارير اليومية بتوصلنا بانتظام. تعامل مؤسسي فعلاً.</p>
        <div class="testi-meta"><div class="testi-avatar">ك</div><div><div class="testi-name">مدير المرافق</div><div class="testi-role">كمبوند سكني — التجمع الخامس</div></div></div>
      </div>
    </div>
    <div class="testi-dots" style="justify-content:center;"></div>
  </div>
</section>

<section class="section section--charcoal section--line-top section--line-bottom">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">عملاؤنا</div>
      <h2 class="h2">شركات من قطاعات مختلفة تثق في حراستنا</h2>
    </div>
    <div class="clients-strip">
      <div class="client-chip">مجموعة صناعية<br>القاهرة</div>
      <div class="client-chip">مستشفى خاص<br>القاهرة الجديدة</div>
      <div class="client-chip">سلسلة فنادق<br>الساحل الشمالي</div>
      <div class="client-chip">كمبوند سكني<br>التجمع الخامس</div>
      <div class="client-chip">مركز توزيع<br>العاشر من رمضان</div>
      <div class="client-chip">مبنى إداري<br>مدينة نصر</div>
    </div>
    <p class="clients-note">شعارات توضيحية مؤقتة — سيتم استبدالها بشعارات العملاء الفعلية بعد الموافقة.</p>
  </div>
</section>

<section class="section">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">أسئلة شائعة</div>
      <h2 class="h2">قبل ما تتواصل معنا</h2>
    </div>
    <div style="max-width:760px;margin-inline:auto;">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">هل فور برذرز حاصلة على ترخيص رسمي؟<span class="plus"></span></button>
        <div class="faq-a"><p>نعم، الشركة مرخصة من وزارة الداخلية المصرية لتقديم خدمات الأمن والحراسة، وجميع الأفراد مسجلون رسميًا.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">كم تستغرق بداية الخدمة بعد توقيع العقد؟<span class="plus"></span></button>
        <div class="faq-a"><p>غالبًا خلال 72 ساعة من توقيع العقد ومعاينة الموقع، حسب حجم الفريق المطلوب.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">هل يمكن تخصيص عدد الحراس وساعات العمل؟<span class="plus"></span></button>
        <div class="faq-a"><p>نعم، كل عقد يُبنى بعد معاينة ميدانية للموقع لتحديد عدد الأفراد والمناوبات المناسبة فعليًا.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">هل تقدمون تغطية تأمينية على الحراس والموقع؟<span class="plus"></span></button>
        <div class="faq-a"><p>نعم، جميع عقودنا تشمل تغطية تأمينية شاملة تُذكر بالتفصيل في عرض السعر.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--charcoal">
  <div class="container reveal" style="text-align:center;">
    <h2 class="h2">جاهزون لتأمين موقعك من الأسبوع القادم</h2>
    <p class="lead" style="max-width:50ch;margin-inline:auto;margin-top:1rem;">أرسل تفاصيل منشأتك واحصل على عرض سعر مبدئي خلال يوم عمل واحد.</p>
    <div class="btn-row" style="justify-content:center;margin-top:1.8rem;">
      <a href="contact.html#quote" class="btn btn--primary">اطلب عرض سعر {I_ARROW}</a>
      <a href="contact.html" class="btn btn--ghost">تواصل معنا مباشرة</a>
    </div>
  </div>
</section>
"""

write("index.html", page(
  title="فور برذرز للأمن والحراسات | شركة حراسة معتمدة في مصر",
  desc="فور برذرز شركة مصرية متخصصة في خدمات الأمن والحراسة للمصانع والمستشفيات والفنادق والمجمعات السكنية والمنشآت التجارية.",
  body=home_body,
  active="index.html"
) + active_script("index.html"))

# ================================================================
# ABOUT
# ================================================================
about_body = f"""
<section class="page-hero">
  <div class="container reveal">
    <div class="breadcrumb"><a href="index.html">الرئيسية</a> / من نحن</div>
    <div class="eyebrow">من نحن</div>
    <h1 class="h1">أربعة إخوة، ومسؤولية واحدة لا تتجزأ</h1>
    <p class="lead" style="max-width:60ch;margin-top:1rem;">
      بدأت فور برذرز كفكرة عائلية بسيطة: أمان العميل مسؤولية شخصية، وليس بندًا في عقد. اليوم نحرس عشرات المواقع الصناعية
      والطبية والفندقية والسكنية في مصر بنفس المنطق.
    </p>
  </div>
</section>

<section class="section">
  <div class="container split reveal">
    <div>
      <div class="eyebrow">قصتنا</div>
      <h2 class="h2">من حراسة موقع واحد إلى شريك أمني لقطاعات متعددة</h2>
      <p class="lead" style="margin-top:1rem;">
        تأسست الشركة على يد أربعة شركاء يؤمنون بأن جودة الحراسة تُقاس بالتفاصيل: توقيت الدورية، دقة التقرير، وسرعة
        الاستجابة عند أي طارئ. مع نمو المحفظة إلى مصانع ومستشفيات وفنادق ومجمعات سكنية، حافظنا على نفس المعيار في كل موقع جديد.
      </p>
    </div>
    <div class="img-frame" role="img" aria-label="صورة فريق العمل الميداني لشركة فور برذرز">صورة فريق العمل الميداني</div>
  </div>
</section>

<section class="section section--charcoal section--line-top section--line-bottom">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">قيمنا</div>
      <h2 class="h2">ما لا نتنازل عنه في أي عقد</h2>
    </div>
    <div class="grid grid--4">
      <div class="card"><div class="card-icon">{I_SHIELD}</div><h3 class="h3" style="font-size:1.05rem;">المسؤولية</h3><p style="font-size:.88rem;">كل حادثة، مهما صغرت، تُوثَّق ويُحاسَب عليها.</p></div>
      <div class="card"><div class="card-icon">{I_CLOCK}</div><h3 class="h3" style="font-size:1.05rem;">الدقة في التوقيت</h3><p style="font-size:.88rem;">الدوريات والمناوبات تسير بجدول صارم لا يتغير.</p></div>
      <div class="card"><div class="card-icon">{I_CONSULT}</div><h3 class="h3" style="font-size:1.05rem;">الشفافية</h3><p style="font-size:.88rem;">تقارير يومية واضحة، بدون صياغة مبهمة.</p></div>
      <div class="card"><div class="card-icon">{I_VIP}</div><h3 class="h3" style="font-size:1.05rem;">الاحترافية</h3><p style="font-size:.88rem;">مظهر ولياقة وسلوك يليق بموقع العميل.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container reveal">
    <div class="stats-bar">
      <div class="stat-card"><div class="num" data-count-to="12" data-suffix="+">0</div><div class="cap">سنة في السوق المصري</div></div>
      <div class="stat-card"><div class="num" data-count-to="450" data-suffix="+">0</div><div class="cap">فرد أمن مدرَّب</div></div>
      <div class="stat-card"><div class="num" data-count-to="120" data-suffix="+">0</div><div class="cap">موقع تحت الحراسة حاليًا</div></div>
      <div class="stat-card"><div class="num" data-count-to="8" data-suffix="">0</div><div class="cap">قطاعات صناعية مختلفة</div></div>
    </div>
  </div>
</section>

<section class="section section--charcoal section--line-top">
  <div class="container split reveal">
    <div class="img-frame" role="img" aria-label="صورة شهادات الترخيص والتأمين الخاصة بالشركة">شهادات الترخيص والتأمين</div>
    <div>
      <div class="eyebrow">الترخيص والاعتماد</div>
      <h2 class="h2">تعامل مؤسسي موثق بالكامل</h2>
      <ul class="check-list" style="margin-top:1.5rem;">
        <li>{I_CHECK}<span>ترخيص تشغيل ساري من وزارة الداخلية المصرية.</span></li>
        <li>{I_CHECK}<span>سجل تجاري وبطاقة ضريبية سارية باسم الشركة.</span></li>
        <li>{I_CHECK}<span>وثيقة تأمين شاملة على الأفراد والموقع المؤمَّن.</span></li>
        <li>{I_CHECK}<span>برنامج تدريب داخلي معتمد لكل فرد قبل التعيين في أي موقع.</span></li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container reveal" style="text-align:center;">
    <h2 class="h2">تحدث مع فريقنا مباشرة</h2>
    <p class="lead" style="margin-top:.8rem;">نرحب بأي استفسار عن سجلنا أو تراخيصنا قبل توقيع أي عقد.</p>
    <div class="btn-row" style="justify-content:center;margin-top:1.6rem;">
      <a href="contact.html#quote" class="btn btn--primary">اطلب عرض سعر {I_ARROW}</a>
      <a href="contact.html" class="btn btn--ghost">تواصل معنا</a>
    </div>
  </div>
</section>
"""

write("about.html", page(
  title="من نحن | فور برذرز للأمن والحراسات",
  desc="تعرف على قصة فور برذرز، قيمنا، تراخيصنا، وسجلنا في تقديم خدمات الأمن والحراسة في مصر.",
  body=about_body,
  active="about.html"
) + active_script("about.html"))

# ================================================================
# SERVICES
# ================================================================
def service_card(icon, title, desc):
    return f"""
    <div class="card">
      <div class="card-icon">{icon}</div>
      <h3 class="h3">{title}</h3>
      <p>{desc}</p>
      <a href="contact.html#quote" class="card-link">اطلب عرض سعر لهذه الخدمة {I_ARROW}</a>
    </div>"""

def service_detail(anchor, icon, title, summary, includes, reverse=False):
    order = "direction:rtl;" if reverse else ""
    items = "".join(f'<li>{I_CHECK}<span>{i}</span></li>' for i in includes)
    return f"""
<section class="section service-detail" id="{anchor}">
  <div class="container">
    <div class="service-detail-grid">
      <div>
        <div class="card-icon">{icon}</div>
        <h2 class="h2">{title}</h2>
      </div>
      <div>
        <p class="lead">{summary}</p>
        <ul class="check-list service-includes">{items}</ul>
        <div class="btn-row" style="margin-top:1.8rem;">
          <a href="contact.html#quote" class="btn btn--primary">اطلب هذه الخدمة {I_ARROW}</a>
        </div>
      </div>
    </div>
  </div>
</section>"""

# ---------- The Bridge: fetch published services from the CMS at build time ----------
# CMS_API_BASE is set as an env var on the website's Vercel project, pointing
# at the admin app's origin (e.g. "https://4b-hub-admin.vercel.app"). If it's
# unset, unreachable, or returns no services, we fall back to the hardcoded
# list below — the site must never fail to build just because the CMS is
# briefly down. See admin/src/app/api/public/services/route.ts for the other
# half of this bridge, and admin/src/lib/services/websiteBridge.service.ts
# for what actually triggers a rebuild when a service is published.
_FALLBACK_SERVICES_DATA = [
    ("static-guarding", I_SHIELD, "الحراسة الثابتة",
     "أفراد أمن مؤهلون يتمركزون في نقاط ثابتة عند البوابات والمداخل والمخازن، على مدار الساعة أو بمناوبات محددة حسب جدول موقعك.",
     ["فرد أو أكثر حسب حجم الموقع وعدد المداخل", "سجل حضور وتسليم/استلام مناوبة موثق", "زي رسمي موحد ومظهر لائق", "تقرير يومي بحركة الدخول والخروج"]),
    ("mobile-patrol", I_PATROL, "الدوريات المتحركة",
     "جولات تفتيش منتظمة وموثقة بالتوقيت لتغطية مواقع متعددة أو مساحات ومحيط واسع لا يحتاج تمركزًا ثابتًا.",
     ["جدول دوريات محدد بفواصل زمنية واضحة", "تسجيل نقاط التفتيش إلكترونيًا أو ورقيًا", "استجابة فورية لأي إنذار أثناء الجولة", "تقرير مفصل بعدد الجولات ونتائجها"]),
    ("cctv", I_CCTV, "إدارة غرف المراقبة",
     "تشغيل ومتابعة كاميرات المراقبة القائمة لديك، وربطها بفريق استجابة ميداني فوري عند رصد أي نشاط غير معتاد.",
     ["مراقبون مدرَّبون على أنظمة CCTV المختلفة", "تنبيه فوري لفريق الحراسة الميداني عند الحاجة", "أرشفة اللقطات حسب سياسة العميل", "تقرير حوادث موثق بالوقت والتفاصيل"]),
    ("commercial-security", I_BUILDING, "أمن المنشآت التجارية",
     "تأمين مداخل المباني الإدارية والتجارية وتنظيم حركة الزوار والموردين دون التأثير على انسيابية العمل اليومي.",
     ["تحكم في تصاريح الدخول للموظفين والزوار", "تنسيق مع الاستقبال وخدمات المبنى", "إشراف على مواقف السيارات والمصاعد", "بروتوكول إخلاء وطوارئ معتمد"]),
    ("event-security", I_EVENT, "أمن الفعاليات",
     "تغطية أمنية مؤقتة للمؤتمرات والفعاليات والافتتاحات، بأعداد أفراد مرنة تتناسب مع حجم الحدث ومدته.",
     ["تخطيط أمني مسبق لمسارات الحضور والطوارئ", "أفراد إضافيون لأيام أو ساعات الذروة فقط", "تنسيق مباشر مع منظم الفعالية", "تفتيش مداخل وإدارة تصاريح الدخول"]),
    ("executive-protection", I_VIP, "الحماية الشخصية",
     "مرافقة أمنية مدرَّبة لكبار المسؤولين التنفيذيين والضيوف أثناء الزيارات الرسمية أو التنقلات الحساسة.",
     ["أفراد حماية شخصية ذوو خبرة موثقة", "تقييم مسبق لمسار التحرك ونقاط الخطر", "تنسيق مع فرق الأمن الأخرى إن وُجدت", "سرية تامة في التعامل مع تفاصيل الزيارة"]),
    ("security-consulting", I_CONSULT, "الاستشارات الأمنية",
     "تقييم شامل للمخاطر ووضع بروتوكولات الدخول والطوارئ قبل بدء أي تعاقد تشغيلي، لعملاء يريدون خطة قبل التنفيذ.",
     ["زيارة ميدانية وتقييم نقاط الضعف الفعلية", "توصيات مكتوبة قابلة للتطبيق المباشر", "مراجعة بروتوكولات الطوارئ القائمة", "لا يشترط التعاقد على تشغيل حراسة لاحقًا"]),
    ("residential-security", I_HOME, "أمن المجمعات السكنية",
     "بوابات دخول، دوريات ليلية، وتحكم في حركة السيارات والزوار داخل الكمبوند، مع مراعاة خصوصية السكان.",
     ["نظام تصاريح للزوار والموردين", "دوريات ليلية منتظمة داخل المجمع", "تنسيق مع إدارة المجمع أو اتحاد الملاك", "تقرير أسبوعي بالحوادث والملاحظات"]),
    ("industrial-security", I_FACTORY, "أمن المنشآت الصناعية",
     "تأمين محيط المصنع والمخازن ونقاط الشحن والتفريغ على مدار الوردية، مع بروتوكولات تراعي طبيعة العمليات الصناعية.",
     ["تأمين نقاط الشحن والتفريغ والمخازن", "تفتيش المركبات الداخلة والخارجة", "تنسيق مع نوبات العمل الصناعية المتعددة", "بروتوكول خاص بالمواد أو المعدات الحساسة"]),
]

def fetch_services_from_cms():
    api_base = os.environ.get("CMS_API_BASE", "").rstrip("/")
    if not api_base:
        print("CMS_API_BASE not set — using fallback services data.")
        return _FALLBACK_SERVICES_DATA

    try:
        req = urllib.request.Request(f"{api_base}/api/public/services", headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
        print(f"CMS fetch failed ({e}) — using fallback services data.")
        return _FALLBACK_SERVICES_DATA

    services = payload.get("services") or []
    if not services:
        print("CMS returned zero published services — using fallback services data.")
        return _FALLBACK_SERVICES_DATA

    result = []
    for s in services:
        icon_svg = ICON_BY_KEY.get(s.get("icon", ""), I_SHIELD)  # unknown icon key -> safe default, never a broken build
        result.append((s["slug"], icon_svg, s["title"], s["summary"], s["includes"]))

    print(f"Fetched {len(result)} published services from CMS.")
    return result

SERVICES_DATA = fetch_services_from_cms()

services_body = f"""
<section class="page-hero">
  <div class="container reveal">
    <div class="breadcrumb"><a href="index.html">الرئيسية</a> / خدماتنا</div>
    <div class="eyebrow">خدماتنا</div>
    <h1 class="h1">خدمات حراسة مبنية حول موقعك، لا قالب جاهز</h1>
    <p class="lead" style="max-width:60ch;margin-top:1rem;">
      كل خدمة أدناه تُخصَّص بعد معاينة ميدانية فعلية — عدد الأفراد والمعدات والمناوبات تتحدد حسب طبيعة الموقع، لا حسب باقة موحدة.
    </p>
    <div class="quick-nav" style="margin-top:2rem;">
      {"".join(f'<a href="#{a}">{t}</a>' for a,_,t,_,_ in SERVICES_DATA)}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid grid--3 reveal">
      {service_card(I_SHIELD, "الحراسة الثابتة", "أفراد أمن في نقاط ثابتة عند البوابات والمداخل والمخازن، على مدار الساعة أو بمناوبات محددة.")}
      {service_card(I_PATROL, "الدوريات المتحركة", "جولات تفتيش منتظمة وموثقة بالتوقيت لمواقع متعددة أو مساحات ومحيط واسع.")}
      {service_card(I_CCTV, "إدارة غرف المراقبة", "تشغيل ومتابعة كاميرات المراقبة وربطها بفريق استجابة ميداني فوري.")}
      {service_card(I_BUILDING, "أمن المنشآت التجارية", "تأمين مداخل المباني الإدارية والتجارية وتنظيم حركة الزوار والموردين.")}
      {service_card(I_EVENT, "أمن الفعاليات", "تغطية أمنية مؤقتة للمؤتمرات والفعاليات والافتتاحات بأعداد مرنة حسب الحدث.")}
      {service_card(I_VIP, "الحماية الشخصية", "مرافقة أمنية لكبار المسؤولين التنفيذيين والضيوف أثناء الزيارات الرسمية.")}
      {service_card(I_CONSULT, "الاستشارات الأمنية", "تقييم المخاطر ووضع بروتوكولات الدخول والطوارئ قبل بدء أي تعاقد تشغيلي.")}
      {service_card(I_HOME, "أمن المجمعات السكنية", "بوابات دخول، دوريات ليلية، وتحكم في حركة السيارات والزوار داخل الكمبوند.")}
      {service_card(I_FACTORY, "أمن المنشآت الصناعية", "تأمين محيط المصنع والمخازن ونقاط الشحن والتفريغ على مدار الوردية.")}
    </div>
  </div>
</section>

<div class="section--charcoal section--line-top">
  {"".join(service_detail(a,i,t,s,inc,reverse=(idx%2==1)) for idx,(a,i,t,s,inc) in enumerate(SERVICES_DATA))}
</div>

<section class="section section--line-top">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">آلية العمل</div>
      <h2 class="h2">من أول اتصال إلى بدء الحراسة الفعلي</h2>
    </div>
    <div class="timeline">
      <div class="timeline-step"><div class="timeline-num">01</div><h4>تواصل أولي</h4><p>ترسل تفاصيل الموقع عبر نموذج طلب عرض السعر أو مكالمة مباشرة.</p></div>
      <div class="timeline-step"><div class="timeline-num">02</div><h4>معاينة ميدانية</h4><p>فريقنا يزور الموقع لتقييم المخاطر وتحديد عدد الأفراد المطلوب فعليًا.</p></div>
      <div class="timeline-step"><div class="timeline-num">03</div><h4>عرض سعر وعقد</h4><p>عرض مكتوب بالتفاصيل الكاملة، ثم توقيع عقد واضح البنود.</p></div>
      <div class="timeline-step"><div class="timeline-num">04</div><h4>بدء الخدمة</h4><p>انتشار الفريق المدرَّب في الموقع خلال 72 ساعة من التوقيع.</p></div>
    </div>
  </div>
</section>

<section class="section section--charcoal">
  <div class="container reveal" style="text-align:center;">
    <h2 class="h2">لم تجد الخدمة المناسبة لموقعك؟</h2>
    <p class="lead" style="margin-top:.8rem;">صف لنا طبيعة الموقع وسنقترح الحل الأمني المناسب خلال يوم عمل.</p>
    <div class="btn-row" style="justify-content:center;margin-top:1.6rem;">
      <a href="contact.html#quote" class="btn btn--primary">اطلب عرض سعر {I_ARROW}</a>
    </div>
  </div>
</section>
"""

write("services.html", page(
  title="خدماتنا | فور برذرز للأمن والحراسات",
  desc="خدمات الحراسة الثابتة والدوريات المتحركة وإدارة المراقبة والاستشارات الأمنية من فور برذرز.",
  body=services_body,
  active="services.html"
) + active_script("services.html"))

# ================================================================
# INDUSTRIES
# ================================================================
def industry_card(icon, title, desc):
    return f"""
    <div class="card">
      <div class="card-icon">{icon}</div>
      <h3 class="h3">{title}</h3>
      <p>{desc}</p>
      <a href="contact.html#quote" class="card-link">اطلب استشارة لهذا القطاع {I_ARROW}</a>
    </div>"""

industries_body = f"""
<section class="page-hero">
  <div class="container reveal">
    <div class="breadcrumb"><a href="index.html">الرئيسية</a> / القطاعات</div>
    <div class="eyebrow">القطاعات</div>
    <h1 class="h1">لكل قطاع مخاطره الخاصة، ولكل موقع خطته الأمنية</h1>
    <p class="lead" style="max-width:60ch;margin-top:1rem;">
      حراسة مستشفى تختلف عن حراسة مصنع، وحراسة فندق تختلف عن حراسة مجمع سكني. نبني فريق كل موقع حسب طبيعة القطاع فعليًا.
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid grid--4 reveal">
      {industry_card(I_FACTORY, "المصانع", "تأمين المحيط الخارجي، بوابات الشحن والتفريغ، والمخازن على مدار الوردية.")}
      {industry_card(I_HOSPITAL, "المستشفيات", "حراسة تراعي خصوصية المرضى وتحكمًا دقيقًا في الدخول للأقسام الحساسة.")}
      {industry_card(I_HOTEL, "الفنادق", "حضور لائق عند المدخل الرئيسي مع حراسة مواقف السيارات والمرافق الخلفية.")}
      {industry_card(I_HOME, "المجمعات السكنية", "بوابات دخول، دوريات ليلية، وتسجيل حركة الزوار والموردين.")}
      {industry_card(I_BUILDING, "المباني التجارية والإدارية", "تنظيم حركة الموظفين والزوار وتأمين مواقف السيارات والمصاعد.")}
      {industry_card(I_WAREHOUSE, "المستودعات ومراكز التوزيع", "تأمين نقاط الشحن ومراقبة حركة البضائع والمخزون.")}
      {industry_card(I_SCHOOL, "المؤسسات التعليمية", "تحكم صارم في دخول وخروج الطلاب وحراسة محيط المدرسة أو الجامعة.")}
      {industry_card(I_GOV, "المنشآت الحكومية", "بروتوكولات دخول متوافقة مع اشتراطات الجهات الحكومية والتنسيق الأمني الرسمي.")}
    </div>
  </div>
</section>

<section class="section section--charcoal section--line-top section--line-bottom">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">لماذا التخصص القطاعي مهم</div>
      <h2 class="h2">نفس المعيار، بروتوكولات مختلفة</h2>
    </div>
    <div class="grid grid--3">
      <div class="card"><h3 class="h3">تقييم مخاطر لكل قطاع</h3><p>نبدأ كل تعاقد بمعاينة تحدد نقاط الضعف الفعلية في الموقع، لا قائمة عامة.</p></div>
      <div class="card"><h3 class="h3">تدريب موجّه</h3><p>أفراد الأمن في المستشفيات مثلاً يتدربون على التعامل مع بيئة طبية حساسة تحديدًا.</p></div>
      <div class="card"><h3 class="h3">تقارير مخصصة</h3><p>نموذج التقرير اليومي يعكس ما يهم قطاعك: حركة شحن، دخول مرضى، أو زوار مجمع سكني.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container reveal" style="text-align:center;">
    <h2 class="h2">قطاعك غير موجود في القائمة؟</h2>
    <p class="lead" style="margin-top:.8rem;">تواصل معنا ووصف طبيعة منشأتك، ونرشح لك الحل الأمني المناسب.</p>
    <div class="btn-row" style="justify-content:center;margin-top:1.6rem;">
      <a href="contact.html#quote" class="btn btn--primary">اطلب عرض سعر {I_ARROW}</a>
      <a href="services.html" class="btn btn--ghost">تصفح الخدمات</a>
    </div>
  </div>
</section>
"""

write("industries.html", page(
  title="القطاعات | فور برذرز للأمن والحراسات",
  desc="خبرة فور برذرز في تأمين المصانع والمستشفيات والفنادق والمجمعات السكنية والمنشآت التجارية والحكومية في مصر.",
  body=industries_body,
  active="industries.html"
) + active_script("industries.html"))

# ================================================================
# CAREERS
# ================================================================
careers_body = f"""
<section class="page-hero">
  <div class="container reveal">
    <div class="breadcrumb"><a href="index.html">الرئيسية</a> / الوظائف</div>
    <div class="eyebrow">انضم إلينا</div>
    <h1 class="h1">فريق يستحق سُمعة أربعة إخوة</h1>
    <p class="lead" style="max-width:60ch;margin-top:1rem;">
      نبحث عن أفراد أمن وضباط تطوير أعمال يؤمنون بالانضباط والدقة. كل فرد في فور برذرز يمثّل الشركة كاملة أمام العميل.
    </p>
  </div>
</section>

<section class="section">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">المزايا</div>
      <h2 class="h2">بيئة عمل منضبطة، بمزايا واضحة</h2>
    </div>
    <div class="grid grid--3">
      <div class="card"><div class="card-icon">{I_CHECK}</div><h3 class="h3" style="font-size:1.05rem;">تعيين رسمي</h3><p style="font-size:.88rem;">تأمينات اجتماعية وعقد عمل موثق من اليوم الأول.</p></div>
      <div class="card"><div class="card-icon">{I_SHIELD}</div><h3 class="h3" style="font-size:1.05rem;">تدريب معتمد</h3><p style="font-size:.88rem;">برنامج تأهيل قبل أي تكليف ميداني.</p></div>
      <div class="card"><div class="card-icon">{I_CLOCK}</div><h3 class="h3" style="font-size:1.05rem;">مواعيد مناوبات واضحة</h3><p style="font-size:.88rem;">جداول عمل ثابتة ومعلنة مسبقًا.</p></div>
      <div class="card"><div class="card-icon">{I_VIP}</div><h3 class="h3" style="font-size:1.05rem;">مسار ترقي فعلي</h3><p style="font-size:.88rem;">من فرد أمن إلى مشرف موقع فمدير عمليات.</p></div>
      <div class="card"><div class="card-icon">{I_HOSPITAL}</div><h3 class="h3" style="font-size:1.05rem;">تغطية طبية</h3><p style="font-size:.88rem;">تأمين صحي أساسي لجميع الموظفين الدائمين.</p></div>
      <div class="card"><div class="card-icon">{I_CONSULT}</div><h3 class="h3" style="font-size:1.05rem;">مكافآت أداء</h3><p style="font-size:.88rem;">حوافز دورية مرتبطة بتقييم الأداء الفعلي في الموقع.</p></div>
    </div>
  </div>
</section>

<section class="section section--charcoal section--line-top section--line-bottom">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">الوظائف المتاحة</div>
      <h2 class="h2">الأدوار المفتوحة حاليًا</h2>
    </div>
    <div class="grid grid--2">
      <div class="card">
        <h3 class="h3">فرد أمن وحراسة</h3>
        <p style="margin-top:.5rem;">تأمين مواقع ثابتة أو دوريات متحركة حسب التكليف.</p>
        <ul class="check-list" style="margin-top:1rem;">
          <li>{I_CHECK}<span>اللياقة البدنية وحسن السيرة والسلوك</span></li>
          <li>{I_CHECK}<span>القدرة على العمل بنظام المناوبات</span></li>
        </ul>
        <a href="#apply" class="card-link">قدّم الآن {I_ARROW}</a>
      </div>
      <div class="card">
        <h3 class="h3">مشرف موقع</h3>
        <p style="margin-top:.5rem;">إدارة فريق أمن في موقع واحد أو أكثر ومتابعة التقارير اليومية.</p>
        <ul class="check-list" style="margin-top:1rem;">
          <li>{I_CHECK}<span>خبرة سابقة لا تقل عن 3 سنوات في الحراسة</span></li>
          <li>{I_CHECK}<span>مهارات تواصل وكتابة تقارير جيدة</span></li>
        </ul>
        <a href="#apply" class="card-link">قدّم الآن {I_ARROW}</a>
      </div>
      <div class="card">
        <h3 class="h3">ضابط تطوير أعمال</h3>
        <p style="margin-top:.5rem;">استقطاب عملاء B2B جدد ومتابعة تجديد العقود القائمة.</p>
        <ul class="check-list" style="margin-top:1rem;">
          <li>{I_CHECK}<span>خبرة مبيعات B2B، يُفضَّل في قطاع الخدمات الأمنية</span></li>
          <li>{I_CHECK}<span>قدرة على التواصل مع مدراء المرافق والمشتريات</span></li>
        </ul>
        <a href="#apply" class="card-link">قدّم الآن {I_ARROW}</a>
      </div>
      <div class="card">
        <h3 class="h3">مدير عمليات ميدانية</h3>
        <p style="margin-top:.5rem;">الإشراف على مشرفي المواقع المتعددة وضبط جودة الأداء.</p>
        <ul class="check-list" style="margin-top:1rem;">
          <li>{I_CHECK}<span>خبرة إدارية في قطاع الحراسة لا تقل عن 5 سنوات</span></li>
          <li>{I_CHECK}<span>القدرة على التنقل بين المواقع بانتظام</span></li>
        </ul>
        <a href="#apply" class="card-link">قدّم الآن {I_ARROW}</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--line-top">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">خطوات التقديم</div>
      <h2 class="h2">من التقديم إلى التعيين الفعلي</h2>
    </div>
    <div class="timeline">
      <div class="timeline-step"><div class="timeline-num">01</div><h4>تقديم الطلب</h4><p>تملأ نموذج التقديم أدناه ببياناتك الأساسية.</p></div>
      <div class="timeline-step"><div class="timeline-num">02</div><h4>فرز أولي</h4><p>فريق التوظيف يراجع الطلب ويتواصل خلال 5 أيام عمل.</p></div>
      <div class="timeline-step"><div class="timeline-num">03</div><h4>مقابلة شخصية</h4><p>مقابلة مباشرة لتقييم الملاءمة للدور المطلوب.</p></div>
      <div class="timeline-step"><div class="timeline-num">04</div><h4>تدريب تأهيلي</h4><p>برنامج تدريب قصير قبل أي تكليف ميداني فعلي.</p></div>
      <div class="timeline-step"><div class="timeline-num">05</div><h4>التعيين</h4><p>توقيع العقد وتوزيع الزي الرسمي والتكليف بالموقع.</p></div>
    </div>
  </div>
</section>

<section class="section section--charcoal section--line-top section--line-bottom">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">أسئلة شائعة</div>
      <h2 class="h2">قبل ما تقدّم على وظيفة</h2>
    </div>
    <div style="max-width:760px;margin-inline:auto;">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">هل يوجد فترة اختبار؟<span class="plus"></span></button>
        <div class="faq-a"><p>نعم، فترة اختبار مدتها 3 أشهر يتم خلالها تقييم الأداء قبل التثبيت في العقد الدائم.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">هل يتم توفير الزي الرسمي والمعدات؟<span class="plus"></span></button>
        <div class="faq-a"><p>نعم، الشركة توفر الزي الرسمي الكامل والمعدات الأساسية اللازمة لأداء العمل.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">كيف يتم تحديد نظام المناوبات؟<span class="plus"></span></button>
        <div class="faq-a"><p>يُحدَّد جدول المناوبات مسبقًا حسب الموقع المكلَّف به الموظف، ويُعلَن قبل بداية كل شهر.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">هل يوجد مواصلات للمواقع البعيدة؟<span class="plus"></span></button>
        <div class="faq-a"><p>بعض المواقع توفر مواصلات مؤسسية، ويُحدَّد ذلك بوضوح أثناء المقابلة الشخصية حسب الموقع.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="apply">
  <div class="container reveal" style="max-width:820px;margin-inline:auto;">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">التقديم</div>
      <h2 class="h2">قدّم بياناتك الآن</h2>
      <p class="lead">فريق التوظيف يراجع الطلبات ويتواصل خلال 5 أيام عمل.</p>
    </div>
    <form data-validate novalidate>
      <div class="form-grid">
        <div class="field"><label for="c-full_name">الاسم بالكامل *</label><input id="c-full_name" type="text" name="full_name" required><span class="error">برجاء إدخال الاسم بالكامل.</span></div>
        <div class="field"><label for="c-phone">رقم الهاتف *</label><input id="c-phone" type="tel" name="phone" required><span class="error">برجاء إدخال رقم هاتف صحيح.</span></div>
        <div class="field"><label for="c-email">البريد الإلكتروني</label><input id="c-email" type="email" name="email"><span class="error">برجاء إدخال بريد إلكتروني صحيح.</span></div>
        <div class="field">
          <label for="c-role">الوظيفة المتقدم لها *</label>
          <select id="c-role" name="role" required>
            <option value="">اختر الوظيفة</option>
            <option>فرد أمن وحراسة</option>
            <option>مشرف موقع</option>
            <option>ضابط تطوير أعمال</option>
            <option>مدير عمليات ميدانية</option>
          </select>
          <span class="error">برجاء اختيار الوظيفة.</span>
        </div>
        <div class="field full"><label for="c-experience">سنوات الخبرة</label><input id="c-experience" type="text" name="experience" placeholder="مثال: 4 سنوات في قطاع الحراسة"></div>
        <div class="field full"><label for="c-message">نبذة مختصرة</label><textarea id="c-message" name="message" placeholder="أخبرنا عن خبرتك السابقة ولماذا ترغب في الانضمام لفريق فور برذرز"></textarea></div>
      </div>
      <button type="submit" class="btn btn--primary btn--block" style="margin-top:1.5rem;">إرسال طلب التقديم</button>
      <p class="form-note">بإرسال هذا النموذج، أنت توافق على تواصل فريق فور برذرز معك بخصوص هذا التقديم.</p>
    </form>
    <div class="form-success">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
      <h3 class="h3">تم استلام طلبك بنجاح</h3>
      <p class="lead" style="margin-top:.5rem;">سيتواصل معك فريق التوظيف خلال 5 أيام عمل.</p>
    </div>
  </div>
</section>
"""

write("careers.html", page(
  title="الوظائف | فور برذرز للأمن والحراسات",
  desc="انضم إلى فريق فور برذرز — وظائف فرد أمن، مشرف موقع، ضابط تطوير أعمال، ومدير عمليات ميدانية في مصر.",
  body=careers_body,
  active="careers.html"
) + active_script("careers.html"))

# ================================================================
# CONTACT (includes Quote Request)
# ================================================================
contact_body = f"""
<section class="page-hero">
  <div class="container reveal">
    <div class="breadcrumb"><a href="index.html">الرئيسية</a> / تواصل معنا</div>
    <div class="eyebrow">تواصل معنا</div>
    <h1 class="h1">تحدث مع فريقنا، أو اطلب عرض سعر مباشرة</h1>
    <p class="lead" style="max-width:60ch;margin-top:1rem;">
      نرد على استفسارات الشركات خلال يوم عمل واحد. لطلبات الحراسة العاجلة، تواصل عبر الهاتف أو واتساب مباشرة.
    </p>
  </div>
</section>

<section class="section section--line-bottom">
  <div class="container">
    <div class="grid grid--4 reveal">
      <div class="card">
        <div class="card-icon">{I_CLOCK}</div>
        <h3 class="h3" style="font-size:1.05rem;">الهاتف</h3>
        <p style="font-size:.9rem;" dir="ltr">+20 100 000 0000</p>
      </div>
      <div class="card">
        <div class="card-icon">{I_CONSULT}</div>
        <h3 class="h3" style="font-size:1.05rem;">البريد الإلكتروني</h3>
        <p style="font-size:.9rem;" dir="ltr">info@4brothers-security.com</p>
      </div>
      <div class="card">
        <div class="card-icon">{I_HOME}</div>
        <h3 class="h3" style="font-size:1.05rem;">المقر الرئيسي</h3>
        <p style="font-size:.9rem;">القاهرة الجديدة، مصر</p>
      </div>
      <div class="card">
        <div class="card-icon">{I_SHIELD}</div>
        <h3 class="h3" style="font-size:1.05rem;">ساعات العمل</h3>
        <p style="font-size:.9rem;">الأحد – الخميس، 9 ص – 6 م<br>الدعم الميداني: 24/7</p>
      </div>
    </div>
    <div class="btn-row" style="justify-content:center;margin-top:2rem;">
      <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
        تواصل عبر واتساب مباشرة
      </a>
    </div>
  </div>
</section>

<section class="section--tight">
  <div class="container reveal">
    <div class="emergency-band">
      <div>
        <div class="eyebrow" style="margin-bottom:.4rem;">خط الطوارئ — متاح 24/7</div>
        <p style="color:var(--steel);font-size:.92rem;max-width:46ch;">
          لأي طارئ أمني في موقع متعاقد معنا حاليًا، اتصل مباشرة على الرقم التالي في أي وقت.
        </p>
      </div>
      <a href="tel:+201000000000" class="num">+20 100 000 0000</a>
    </div>
  </div>
</section>

<section class="section section--charcoal" id="quote">
  <div class="container reveal" style="max-width:900px;margin-inline:auto;">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">طلب عرض سعر</div>
      <h2 class="h2">أخبرنا عن موقعك لنجهّز عرض سعر دقيق</h2>
      <p class="lead">كل عرض يُبنى بعد مراجعة تفاصيل الموقع الفعلية — لا أسعار موحدة.</p>
    </div>
    <form data-validate novalidate>
      <div class="form-progress" aria-hidden="true"><span class="is-active"></span><span class="is-active"></span><span></span></div>
      <div class="form-grid">
        <div class="form-section-label">بيانات التواصل</div>
        <div class="field"><label for="q-company">اسم الشركة *</label><input id="q-company" type="text" name="company" required autocomplete="organization"><span class="error">برجاء إدخال اسم الشركة.</span></div>
        <div class="field"><label for="q-contact_name">اسم المسؤول *</label><input id="q-contact_name" type="text" name="contact_name" required autocomplete="name"><span class="error">برجاء إدخال اسم المسؤول.</span></div>
        <div class="field"><label for="q-phone">رقم الهاتف *</label><input id="q-phone" type="tel" name="phone" required autocomplete="tel" placeholder="01xxxxxxxxx"><span class="error">برجاء إدخال رقم هاتف صحيح.</span></div>
        <div class="field"><label for="q-email">البريد الإلكتروني *</label><input id="q-email" type="email" name="email" required autocomplete="email"><span class="error">برجاء إدخال بريد إلكتروني صحيح.</span></div>

        <div class="form-section-label">تفاصيل الموقع</div>
        <div class="field">
          <label for="q-industry">نوع المنشأة *</label>
          <select id="q-industry" name="industry" required>
            <option value="">اختر نوع المنشأة</option>
            <option>مصنع</option>
            <option>مستشفى</option>
            <option>فندق</option>
            <option>مجمع سكني</option>
            <option>مبنى تجاري / إداري</option>
            <option>مستودع / مركز توزيع</option>
            <option>مؤسسة تعليمية</option>
            <option>جهة حكومية</option>
          </select>
          <span class="error">برجاء اختيار نوع المنشأة.</span>
        </div>
        <div class="field">
          <label for="q-guards">عدد أفراد الأمن المطلوب تقريبًا</label>
          <select id="q-guards" name="guards">
            <option value="">اختر النطاق</option>
            <option>1 – 3 أفراد</option>
            <option>4 – 10 أفراد</option>
            <option>11 – 25 فرد</option>
            <option>أكثر من 25 فرد</option>
          </select>
        </div>
        <div class="field full"><label for="q-location">موقع المنشأة (المدينة / المنطقة) *</label><input id="q-location" type="text" name="location" required><span class="error">برجاء إدخال موقع المنشأة.</span></div>
        <div class="field">
          <label for="q-preferred_contact">طريقة التواصل المفضلة</label>
          <select id="q-preferred_contact" name="preferred_contact">
            <option value="">اختر الطريقة</option>
            <option>مكالمة هاتفية</option>
            <option>واتساب</option>
            <option>بريد إلكتروني</option>
          </select>
        </div>

        <div class="form-section-label">تفاصيل إضافية</div>
        <div class="field full"><label for="q-message">تفاصيل إضافية</label><textarea id="q-message" name="message" placeholder="مواعيد التشغيل، طبيعة المخاطر، أو أي متطلبات خاصة بالموقع"></textarea></div>
      </div>
      <button type="submit" class="btn btn--primary btn--block" style="margin-top:1.5rem;">إرسال طلب عرض السعر</button>
      <p class="form-note">سيتواصل معك أحد مستشارينا خلال يوم عمل واحد لتحديد موعد معاينة الموقع.</p>
    </form>
    <div class="form-success">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
      <h3 class="h3">تم استلام طلبك بنجاح</h3>
      <p class="lead" style="margin-top:.5rem;">سيتواصل معك فريقنا خلال يوم عمل واحد لتحديد موعد المعاينة.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container reveal">
    <div class="section-head center">
      <div class="eyebrow" style="justify-content:center;">موقعنا</div>
      <h2 class="h2">المقر الرئيسي — القاهرة الجديدة</h2>
    </div>
    <div class="map-placeholder" role="img" aria-label="خريطة توضح موقع المقر الرئيسي لفور برذرز في القاهرة الجديدة">
      {I_HOME}
      <span>خريطة جوجل التفاعلية — سيتم تفعيلها عند ربط الموقع بحساب Google Maps للشركة</span>
    </div>
  </div>
</section>
"""

write("contact.html", page(
  title="تواصل معنا | فور برذرز للأمن والحراسات",
  desc="تواصل مع فور برذرز للأمن والحراسات أو اطلب عرض سعر لخدمات الحراسة لمنشأتك في مصر.",
  body=contact_body,
  active="contact.html"
) + active_script("contact.html"))

# ================================================================
# PRIVACY POLICY (minimal, avoids dead footer link)
# ================================================================
privacy_body = f"""
<section class="page-hero">
  <div class="container reveal">
    <div class="breadcrumb"><a href="index.html">الرئيسية</a> / سياسة الخصوصية</div>
    <div class="eyebrow">سياسة الخصوصية</div>
    <h1 class="h1">كيف نتعامل مع بياناتك</h1>
    <p class="lead" style="max-width:60ch;margin-top:1rem;">آخر تحديث: يوليو 2026</p>
  </div>
</section>
<section class="section">
  <div class="container reveal" style="max-width:760px;">
    <p class="lead" style="margin-bottom:1.5rem;">
      تلتزم فور برذرز للأمن والحراسات بحماية بيانات الشركات والأفراد الذين يتواصلون معنا عبر هذا الموقع، سواء لطلب عرض سعر أو التقديم على وظيفة.
    </p>
    <h2 class="h2" style="font-size:1.3rem;margin-bottom:.6rem;">البيانات التي نجمعها</h2>
    <p style="color:var(--steel);margin-bottom:1.2rem;">اسم الشركة أو الفرد، بيانات التواصل (هاتف وبريد إلكتروني)، وتفاصيل الطلب أو التقديم كما تُدخلها في نماذج الموقع.</p>
    <h2 class="h2" style="font-size:1.3rem;margin-bottom:.6rem;">كيف نستخدم البيانات</h2>
    <p style="color:var(--steel);margin-bottom:1.2rem;">فقط للرد على طلبك — سواء إعداد عرض سعر أو مراجعة طلب توظيف — ولا تتم مشاركتها مع أي طرف ثالث لأغراض تسويقية.</p>
    <h2 class="h2" style="font-size:1.3rem;margin-bottom:.6rem;">التواصل بخصوص هذه السياسة</h2>
    <p style="color:var(--steel);">لأي استفسار عن بياناتك، راسلنا على info@4brothers-security.com.</p>
  </div>
</section>
"""

write("privacy.html", page(
  title="سياسة الخصوصية | فور برذرز للأمن والحراسات",
  desc="سياسة الخصوصية الخاصة بموقع فور برذرز للأمن والحراسات وكيفية التعامل مع بيانات الزوار.",
  body=privacy_body,
  active="privacy.html"
) + active_script("privacy.html"))

print("\\nAll pages generated successfully.")
