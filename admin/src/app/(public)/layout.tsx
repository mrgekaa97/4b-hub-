import { ScrollReveal } from "./_components/ScrollReveal";
import { NavbarBehavior } from "./_components/NavbarBehavior";
import { FaqAccordion } from "./_components/FaqAccordion";
import { TestimonialSlider } from "./_components/TestimonialSlider";
import { StatCounters } from "./_components/StatCounters";
import { ActiveNavLink } from "./_components/ActiveNavLink";
import { settingsService } from "@/lib/services/settings.service";
import { getSetting, getSocialLink } from "@/lib/constants/settings-fallback";

export const revalidate = 60;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await settingsService.getGroupAsMap("general");

  return (
    <>
      <link rel="stylesheet" href="/legacy/site.css" />
      <link rel="icon" href="/uploads/media/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/uploads/media/favicon-32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/uploads/media/favicon-16.png" />
      <link rel="apple-touch-icon" href="/uploads/media/apple-touch-icon.png" />
      {/* Fix for a gap in the legacy stylesheet: .mobile-menu is only ever
          hidden inside @media (max-width:1180px) — there's no base rule
          hiding it on wider viewports, so it rendered in-flow and overlapped
          the fixed navbar above 1180px. See docs/KNOWN_ISSUES.md item 7. */}
      <style>{`@media (min-width: 1181px) { .mobile-menu { display: none; } }`}</style>
      <ScrollReveal />
      <NavbarBehavior />
      <FaqAccordion />
      <TestimonialSlider />
      <StatCounters />
      <ActiveNavLink />

      <a href="#main-content" className="skip-link">
        تخطي إلى المحتوى الرئيسي
      </a>
      <nav className="navbar">
        <div className="container">
          <a href="/" className="brand" aria-label={`${getSetting(settings, "site.company_name_ar")} — الصفحة الرئيسية`}>
            <picture>
              <source srcSet="/uploads/media/logo-nav.webp" type="image/webp" />
              <img
                src="/uploads/media/logo-nav.png"
                alt={`شعار ${getSetting(settings, "site.company_name_ar")}`}
                width={38}
                height={38}
                loading="eager"
              />
            </picture>
            <span className="brand-word">
              <span dir="ltr">4 BROTHERS</span>
              <small>{getSetting(settings, "site.company_name_ar")}</small>
            </span>
          </a>
          <div className="nav-links">
            <a href="/" data-nav="home">
              الرئيسية
            </a>
            <a href="/about" data-nav="about">
              من نحن
            </a>
            <a href="/services" data-nav="services">
              خدماتنا
            </a>
            <a href="/industries" data-nav="industries">
              القطاعات
            </a>
            <a href="/careers" data-nav="careers">
              الوظائف
            </a>
            <a href="/contact" data-nav="contact">
              تواصل معنا
            </a>
          </div>
          <div className="nav-right">
            <div className="lang-switch">
              <a href="#" className="is-active" aria-current="true">
                AR
              </a>
              <a href="#" title="النسخة الإنجليزية قيد التطوير">
                EN
              </a>
            </div>
            <a href="/contact#quote" className="btn btn--primary" style={{ padding: ".7em 1.4em" }}>
              اطلب عرض سعر
            </a>
            <button className="nav-toggle" aria-label="فتح القائمة" aria-expanded="false" aria-controls="mobile-menu">
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className="mobile-menu" id="mobile-menu">
        <a href="/">الرئيسية</a>
        <a href="/about">من نحن</a>
        <a href="/services">خدماتنا</a>
        <a href="/industries">القطاعات</a>
        <a href="/careers">الوظائف</a>
        <a href="/contact">تواصل معنا</a>
        <a href="/contact#quote" className="btn btn--primary">
          اطلب عرض سعر
        </a>
        <div className="lang-switch">
          <a href="#" className="is-active">
            AR
          </a>
          <a href="#">EN</a>
        </div>
      </div>

      {children}

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <a
                href="/"
                className="brand"
                style={{ marginBottom: "1rem" }}
                aria-label={`${getSetting(settings, "site.company_name_ar")} — الصفحة الرئيسية`}
              >
                <picture>
                  <source srcSet="/uploads/media/logo-nav.webp" type="image/webp" />
                  <img
                    src="/uploads/media/logo-nav.png"
                    alt={`شعار ${getSetting(settings, "site.company_name_ar")}`}
                    width={34}
                    height={34}
                    loading="lazy"
                  />
                </picture>
                <span className="brand-word">
                  <span dir="ltr">4 BROTHERS</span>
                  <small>{getSetting(settings, "site.company_name_ar")}</small>
                </span>
              </a>
              <p style={{ color: "var(--steel)", fontSize: ".9rem", maxWidth: "32ch" }}>
                شركة مصرية متخصصة في توفير خدمات الأمن والحراسة للشركات والمنشآت الصناعية والطبية والفندقية والسكنية.
              </p>
              <div className="social-row">
                <a href={getSocialLink(settings, "facebook") || "#"} aria-label="فيسبوك">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16 3.1 15 3 13.9 3c-2.4 0-4 1.5-4 4.1v2.7H7.2V13H10v8h3.5z" />
                  </svg>
                </a>
                <a href={getSocialLink(settings, "linkedin") || "#"} aria-label="لينكدإن">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3.5 9.5h3v11h-3v-11zM9.5 9.5h2.9v1.5h.04c.4-.75 1.4-1.55 2.9-1.55 3.1 0 3.66 2 3.66 4.6v6.45h-3v-5.7c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.5-2.25 3.1v5.8h-3v-11z" />
                  </svg>
                </a>
                <a href={getSocialLink(settings, "whatsapp") || "#"} aria-label="واتساب">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1112 20z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>الشركة</h4>
              <ul>
                <li>
                  <a href="/about">من نحن</a>
                </li>
                <li>
                  <a href="/services">خدماتنا</a>
                </li>
                <li>
                  <a href="/industries">القطاعات</a>
                </li>
                <li>
                  <a href="/careers">الوظائف</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>روابط سريعة</h4>
              <ul>
                <li>
                  <a href="/contact#quote">اطلب عرض سعر</a>
                </li>
                <li>
                  <a href="/contact">تواصل معنا</a>
                </li>
                <li>
                  <a href="/careers#apply">التقديم للوظائف</a>
                </li>
                <li>
                  <a href="/privacy">سياسة الخصوصية</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>التواصل</h4>
              <ul>
                <li>{getSetting(settings, "site.address_ar")}</li>
                <li dir="ltr" style={{ textAlign: "right" }}>
                  {getSetting(settings, "site.phone")}
                </li>
                <li dir="ltr" style={{ textAlign: "right" }}>
                  {getSetting(settings, "site.email")}
                </li>
                <li>{`سجل تجاري رقم ${getSetting(settings, "site.commercial_registry_no")} — ترخيص وزارة الداخلية رقم ${getSetting(settings, "site.security_license_no")}`}</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span><span dir="ltr">© 2026</span> {getSetting(settings, "site.company_name_ar")}. جميع الحقوق محفوظة.</span>
            <span dir="ltr">Built for 4 Brothers Security &amp; Guarding — Egypt</span>
          </div>
        </div>
      </footer>

      <a
        className="whatsapp-fab"
        href={getSocialLink(settings, "whatsapp") || "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب — يفتح في نافذة جديدة"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.5 1.8 6.4L3 29l7.3-2c1.8 1 3.8 1.5 5.7 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.3 1.2 1.2-4.2-.2-.4a10.4 10.4 0 0 1-1.6-5.6c0-5.8 4.7-10.5 10.4-10.5s10.4 4.7 10.4 10.5S21.8 25.7 16 25.7zm5.7-7.8c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2-.4-.5-.7-.5h-.6c-.2 0-.5.1-.8.4a3.6 3.6 0 0 0-1.1 2.7c0 1.6 1.2 3.1 1.3 3.3.2.3 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.2.2-1.4z" />
        </svg>
      </a>
      <button className="back-to-top" aria-label="العودة إلى أعلى الصفحة">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
