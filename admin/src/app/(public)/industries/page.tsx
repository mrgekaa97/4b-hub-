export default function IndustriesPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container reveal">
          <div className="breadcrumb">
            <a href="/">الرئيسية</a> / القطاعات
          </div>
          <div className="eyebrow">القطاعات</div>
          <h1 className="h1">لكل قطاع مخاطره الخاصة، ولكل موقع خطته الأمنية</h1>
          <p className="lead" style={{ maxWidth: "60ch", marginTop: "1rem" }}>
            حراسة مستشفى تختلف عن حراسة مصنع، وحراسة فندق تختلف عن حراسة مجمع سكني. نبني فريق كل موقع حسب طبيعة القطاع فعليًا.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--4 reveal">
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21V10l5 3V10l5 3V7l6 4v10H3z" />
                </svg>
              </div>
              <h3 className="h3">المصانع</h3>
              <p>تأمين المحيط الخارجي، بوابات الشحن والتفريغ، والمخازن على مدار الوردية.</p>
              <a href="/contact#quote" className="card-link">
                اطلب استشارة لهذا القطاع{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="3" width="16" height="18" />
                  <path d="M12 8v6M9 11h6" />
                </svg>
              </div>
              <h3 className="h3">المستشفيات</h3>
              <p>حراسة تراعي خصوصية المرضى وتحكمًا دقيقًا في الدخول للأقسام الحساسة.</p>
              <a href="/contact#quote" className="card-link">
                اطلب استشارة لهذا القطاع{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21V9l9-6 9 6v12" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </div>
              <h3 className="h3">الفنادق</h3>
              <p>حضور لائق عند المدخل الرئيسي مع حراسة مواقف السيارات والمرافق الخلفية.</p>
              <a href="/contact#quote" className="card-link">
                اطلب استشارة لهذا القطاع{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l9-8 9 8" />
                  <path d="M5 10v10h14V10" />
                </svg>
              </div>
              <h3 className="h3">المجمعات السكنية</h3>
              <p>بوابات دخول، دوريات ليلية، وتسجيل حركة الزوار والموردين.</p>
              <a href="/contact#quote" className="card-link">
                اطلب استشارة لهذا القطاع{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" />
                  <path d="M9 7h1M14 7h1M9 12h1M14 12h1M9 17h1M14 17h1" />
                </svg>
              </div>
              <h3 className="h3">المباني التجارية والإدارية</h3>
              <p>تنظيم حركة الموظفين والزوار وتأمين مواقف السيارات والمصاعد.</p>
              <a href="/contact#quote" className="card-link">
                اطلب استشارة لهذا القطاع{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21V9l9-5 9 5v12" />
                  <path d="M3 12h18" />
                </svg>
              </div>
              <h3 className="h3">المستودعات ومراكز التوزيع</h3>
              <p>تأمين نقاط الشحن ومراقبة حركة البضائع والمخزون.</p>
              <a href="/contact#quote" className="card-link">
                اطلب استشارة لهذا القطاع{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 9l10-5 10 5-10 5-10-5z" />
                  <path d="M6 12v5c3 2 9 2 12 0v-5" />
                </svg>
              </div>
              <h3 className="h3">المؤسسات التعليمية</h3>
              <p>تحكم صارم في دخول وخروج الطلاب وحراسة محيط المدرسة أو الجامعة.</p>
              <a href="/contact#quote" className="card-link">
                اطلب استشارة لهذا القطاع{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l9 4H3z" />
                  <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
                  <path d="M3 21h18" />
                </svg>
              </div>
              <h3 className="h3">المنشآت الحكومية</h3>
              <p>بروتوكولات دخول متوافقة مع اشتراطات الجهات الحكومية والتنسيق الأمني الرسمي.</p>
              <a href="/contact#quote" className="card-link">
                اطلب استشارة لهذا القطاع{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--charcoal section--line-top section--line-bottom">
        <div className="container reveal">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              لماذا التخصص القطاعي مهم
            </div>
            <h2 className="h2">نفس المعيار، بروتوكولات مختلفة</h2>
          </div>
          <div className="grid grid--3">
            <div className="card">
              <h3 className="h3">تقييم مخاطر لكل قطاع</h3>
              <p>نبدأ كل تعاقد بمعاينة تحدد نقاط الضعف الفعلية في الموقع، لا قائمة عامة.</p>
            </div>
            <div className="card">
              <h3 className="h3">تدريب موجّه</h3>
              <p>أفراد الأمن في المستشفيات مثلاً يتدربون على التعامل مع بيئة طبية حساسة تحديدًا.</p>
            </div>
            <div className="card">
              <h3 className="h3">تقارير مخصصة</h3>
              <p>نموذج التقرير اليومي يعكس ما يهم قطاعك: حركة شحن، دخول مرضى، أو زوار مجمع سكني.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container reveal" style={{ textAlign: "center" }}>
          <h2 className="h2">قطاعك غير موجود في القائمة؟</h2>
          <p className="lead" style={{ marginTop: ".8rem" }}>
            تواصل معنا ووصف طبيعة منشأتك، ونرشح لك الحل الأمني المناسب.
          </p>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.6rem" }}>
            <a href="/contact#quote" className="btn btn--primary">
              اطلب عرض سعر{" "}
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="/services" className="btn btn--ghost">
              تصفح الخدمات
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
