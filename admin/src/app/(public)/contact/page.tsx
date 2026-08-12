import { QuoteForm } from "./_components/QuoteForm";

export default function ContactPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container reveal">
          <div className="breadcrumb">
            <a href="/">الرئيسية</a> / تواصل معنا
          </div>
          <div className="eyebrow">تواصل معنا</div>
          <h1 className="h1">تحدث مع فريقنا، أو اطلب عرض سعر مباشرة</h1>
          <p className="lead" style={{ maxWidth: "60ch", marginTop: "1rem" }}>
            نرد على استفسارات الشركات خلال يوم عمل واحد. لطلبات الحراسة العاجلة، تواصل عبر الهاتف أو واتساب مباشرة.
          </p>
        </div>
      </section>

      <section className="section section--line-bottom">
        <div className="container">
          <div className="grid grid--4 reveal">
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                الهاتف
              </h3>
              <p style={{ fontSize: ".9rem" }} dir="ltr">
                +20 100 000 0000
              </p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v12H8l-4 4z" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                البريد الإلكتروني
              </h3>
              <p style={{ fontSize: ".9rem" }} dir="ltr">
                info@4brothers-security.com
              </p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l9-8 9 8" />
                  <path d="M5 10v10h14V10" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                المقر الرئيسي
              </h3>
              <p style={{ fontSize: ".9rem" }}>القاهرة الجديدة، مصر</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                ساعات العمل
              </h3>
              <p style={{ fontSize: ".9rem" }}>
                الأحد – الخميس، 9 ص – 6 م
                <br />
                الدعم الميداني: 24/7
              </p>
            </div>
          </div>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: "2rem" }}>
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              تواصل عبر واتساب مباشرة
            </a>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container reveal">
          <div className="emergency-band">
            <div>
              <div className="eyebrow" style={{ marginBottom: ".4rem" }}>
                خط الطوارئ — متاح 24/7
              </div>
              <p style={{ color: "var(--steel)", fontSize: ".92rem", maxWidth: "46ch" }}>
                لأي طارئ أمني في موقع متعاقد معنا حاليًا، اتصل مباشرة على الرقم التالي في أي وقت.
              </p>
            </div>
            <a href="tel:+201000000000" className="num" dir="ltr">
              +20 100 000 0000
            </a>
          </div>
        </div>
      </section>

      <section className="section section--charcoal" id="quote">
        <div className="container reveal" style={{ maxWidth: "900px", marginInline: "auto" }}>
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              طلب عرض سعر
            </div>
            <h2 className="h2">أخبرنا عن موقعك لنجهّز عرض سعر دقيق</h2>
            <p className="lead">كل عرض يُبنى بعد مراجعة تفاصيل الموقع الفعلية — لا أسعار موحدة.</p>
          </div>
          <QuoteForm />
        </div>
      </section>

      <section className="section">
        <div className="container reveal">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              موقعنا
            </div>
            <h2 className="h2">المقر الرئيسي — القاهرة الجديدة</h2>
          </div>
          <div className="map-placeholder" role="img" aria-label="خريطة توضح موقع المقر الرئيسي لفور برذرز في القاهرة الجديدة">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-8 9 8" />
              <path d="M5 10v10h14V10" />
            </svg>
            <span>خريطة جوجل التفاعلية — سيتم تفعيلها عند ربط الموقع بحساب Google Maps للشركة</span>
          </div>
        </div>
      </section>
    </main>
  );
}
