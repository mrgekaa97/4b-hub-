export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container reveal">
          <div className="breadcrumb">
            <a href="/">الرئيسية</a> / من نحن
          </div>
          <div className="eyebrow">من نحن</div>
          <h1 className="h1">أربعة إخوة، ومسؤولية واحدة لا تتجزأ</h1>
          <p className="lead" style={{ maxWidth: "60ch", marginTop: "1rem" }}>
            بدأت فور برذرز كفكرة عائلية بسيطة: أمان العميل مسؤولية شخصية، وليس بندًا في عقد. اليوم نحرس عشرات المواقع الصناعية
            والطبية والفندقية والسكنية في مصر بنفس المنطق.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split reveal">
          <div>
            <div className="eyebrow">قصتنا</div>
            <h2 className="h2">من حراسة موقع واحد إلى شريك أمني لقطاعات متعددة</h2>
            <p className="lead" style={{ marginTop: "1rem" }}>
              تأسست الشركة على يد أربعة شركاء يؤمنون بأن جودة الحراسة تُقاس بالتفاصيل: توقيت الدورية، دقة التقرير، وسرعة
              الاستجابة عند أي طارئ. مع نمو المحفظة إلى مصانع ومستشفيات وفنادق ومجمعات سكنية، حافظنا على نفس المعيار في كل موقع جديد.
            </p>
          </div>
          <div className="img-frame" role="img" aria-label="صورة فريق العمل الميداني لشركة فور برذرز">
            صورة فريق العمل الميداني
          </div>
        </div>
      </section>

      <section className="section section--charcoal section--line-top section--line-bottom">
        <div className="container reveal">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              قيمنا
            </div>
            <h2 className="h2">ما لا نتنازل عنه في أي عقد</h2>
          </div>
          <div className="grid grid--4">
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                المسؤولية
              </h3>
              <p style={{ fontSize: ".88rem" }}>كل حادثة، مهما صغرت، تُوثَّق ويُحاسَب عليها.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                الدقة في التوقيت
              </h3>
              <p style={{ fontSize: ".88rem" }}>الدوريات والمناوبات تسير بجدول صارم لا يتغير.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v12H8l-4 4z" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                الشفافية
              </h3>
              <p style={{ fontSize: ".88rem" }}>تقارير يومية واضحة، بدون صياغة مبهمة.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                الاحترافية
              </h3>
              <p style={{ fontSize: ".88rem" }}>مظهر ولياقة وسلوك يليق بموقع العميل.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container reveal">
          <div className="stats-bar">
            <div className="stat-card">
              <div className="num" data-count-to="12" data-suffix="+">
                0
              </div>
              <div className="cap">سنة في السوق المصري</div>
            </div>
            <div className="stat-card">
              <div className="num" data-count-to="450" data-suffix="+">
                0
              </div>
              <div className="cap">فرد أمن مدرَّب</div>
            </div>
            <div className="stat-card">
              <div className="num" data-count-to="120" data-suffix="+">
                0
              </div>
              <div className="cap">موقع تحت الحراسة حاليًا</div>
            </div>
            <div className="stat-card">
              <div className="num" data-count-to="8" data-suffix="">
                0
              </div>
              <div className="cap">قطاعات صناعية مختلفة</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--charcoal section--line-top">
        <div className="container split reveal">
          <div className="img-frame" role="img" aria-label="صورة شهادات الترخيص والتأمين الخاصة بالشركة">
            شهادات الترخيص والتأمين
          </div>
          <div>
            <div className="eyebrow">الترخيص والاعتماد</div>
            <h2 className="h2">تعامل مؤسسي موثق بالكامل</h2>
            <ul className="check-list" style={{ marginTop: "1.5rem" }}>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>ترخيص تشغيل ساري من وزارة الداخلية المصرية.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>سجل تجاري وبطاقة ضريبية سارية باسم الشركة.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>وثيقة تأمين شاملة على الأفراد والموقع المؤمَّن.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>برنامج تدريب داخلي معتمد لكل فرد قبل التعيين في أي موقع.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container reveal" style={{ textAlign: "center" }}>
          <h2 className="h2">تحدث مع فريقنا مباشرة</h2>
          <p className="lead" style={{ marginTop: ".8rem" }}>
            نرحب بأي استفسار عن سجلنا أو تراخيصنا قبل توقيع أي عقد.
          </p>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.6rem" }}>
            <a href="/contact#quote" className="btn btn--primary">
              اطلب عرض سعر{" "}
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="/contact" className="btn btn--ghost">
              تواصل معنا
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
