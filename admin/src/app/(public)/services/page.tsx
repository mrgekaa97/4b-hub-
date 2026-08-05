export default function ServicesPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container reveal">
          <div className="breadcrumb">
            <a href="/">الرئيسية</a> / خدماتنا
          </div>
          <div className="eyebrow">خدماتنا</div>
          <h1 className="h1">خدمات حراسة مبنية حول موقعك، لا قالب جاهز</h1>
          <p className="lead" style={{ maxWidth: "60ch", marginTop: "1rem" }}>
            كل خدمة أدناه تُخصَّص بعد معاينة ميدانية فعلية — عدد الأفراد والمعدات والمناوبات تتحدد حسب طبيعة الموقع، لا حسب باقة موحدة.
          </p>
          <div className="quick-nav" style={{ marginTop: "2rem" }}>
            <a href="#static-guarding">الحراسة الثابتة</a>
            <a href="#mobile-patrol">الدوريات المتحركة</a>
            <a href="#cctv">إدارة غرف المراقبة</a>
            <a href="#commercial-security">أمن المنشآت التجارية</a>
            <a href="#event-security">أمن الفعاليات</a>
            <a href="#executive-protection">الحماية الشخصية</a>
            <a href="#security-consulting">الاستشارات الأمنية</a>
            <a href="#residential-security">أمن المجمعات السكنية</a>
            <a href="#industrial-security">أمن المنشآت الصناعية</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--3 reveal">
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
                </svg>
              </div>
              <h3 className="h3">الحراسة الثابتة</h3>
              <p>أفراد أمن في نقاط ثابتة عند البوابات والمداخل والمخازن، على مدار الساعة أو بمناوبات محددة.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5 21c0-4 3-6 7-6s7 2 7 6" />
                </svg>
              </div>
              <h3 className="h3">الدوريات المتحركة</h3>
              <p>جولات تفتيش منتظمة وموثقة بالتوقيت لمواقع متعددة أو مساحات ومحيط واسع.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h11l4-3v10l-4-3H3z" />
                  <path d="M6 8v5M2 21h10" />
                </svg>
              </div>
              <h3 className="h3">إدارة غرف المراقبة</h3>
              <p>تشغيل ومتابعة كاميرات المراقبة وربطها بفريق استجابة ميداني فوري.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
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
              <h3 className="h3">أمن المنشآت التجارية</h3>
              <p>تأمين مداخل المباني الإدارية والتجارية وتنظيم حركة الزوار والموردين.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 21V8a4 4 0 014-4h8a4 4 0 014 4v13" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </div>
              <h3 className="h3">أمن الفعاليات</h3>
              <p>تغطية أمنية مؤقتة للمؤتمرات والفعاليات والافتتاحات بأعداد مرنة حسب الحدث.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </div>
              <h3 className="h3">الحماية الشخصية</h3>
              <p>مرافقة أمنية لكبار المسؤولين التنفيذيين والضيوف أثناء الزيارات الرسمية.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v12H8l-4 4z" />
                </svg>
              </div>
              <h3 className="h3">الاستشارات الأمنية</h3>
              <p>تقييم المخاطر ووضع بروتوكولات الدخول والطوارئ قبل بدء أي تعاقد تشغيلي.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
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
              <h3 className="h3">أمن المجمعات السكنية</h3>
              <p>بوابات دخول، دوريات ليلية، وتحكم في حركة السيارات والزوار داخل الكمبوند.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21V10l5 3V10l5 3V7l6 4v10H3z" />
                </svg>
              </div>
              <h3 className="h3">أمن المنشآت الصناعية</h3>
              <p>تأمين محيط المصنع والمخازن ونقاط الشحن والتفريغ على مدار الوردية.</p>
              <a href="/contact#quote" className="card-link">
                اطلب عرض سعر لهذه الخدمة{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section--charcoal section--line-top">
        <section className="section service-detail" id="static-guarding">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
                  </svg>
                </div>
                <h2 className="h2">الحراسة الثابتة</h2>
              </div>
              <div>
                <p className="lead">
                  أفراد أمن مؤهلون يتمركزون في نقاط ثابتة عند البوابات والمداخل والمخازن، على مدار الساعة أو بمناوبات محددة حسب جدول موقعك.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>فرد أو أكثر حسب حجم الموقع وعدد المداخل</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>سجل حضور وتسليم/استلام مناوبة موثق</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>زي رسمي موحد ومظهر لائق</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تقرير يومي بحركة الدخول والخروج</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-detail" id="mobile-patrol">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3" />
                    <path d="M5 21c0-4 3-6 7-6s7 2 7 6" />
                  </svg>
                </div>
                <h2 className="h2">الدوريات المتحركة</h2>
              </div>
              <div>
                <p className="lead">
                  جولات تفتيش منتظمة وموثقة بالتوقيت لتغطية مواقع متعددة أو مساحات ومحيط واسع لا يحتاج تمركزًا ثابتًا.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>جدول دوريات محدد بفواصل زمنية واضحة</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تسجيل نقاط التفتيش إلكترونيًا أو ورقيًا</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>استجابة فورية لأي إنذار أثناء الجولة</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تقرير مفصل بعدد الجولات ونتائجها</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-detail" id="cctv">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h11l4-3v10l-4-3H3z" />
                    <path d="M6 8v5M2 21h10" />
                  </svg>
                </div>
                <h2 className="h2">إدارة غرف المراقبة</h2>
              </div>
              <div>
                <p className="lead">
                  تشغيل ومتابعة كاميرات المراقبة القائمة لديك، وربطها بفريق استجابة ميداني فوري عند رصد أي نشاط غير معتاد.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>مراقبون مدرَّبون على أنظمة CCTV المختلفة</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تنبيه فوري لفريق الحراسة الميداني عند الحاجة</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>أرشفة اللقطات حسب سياسة العميل</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تقرير حوادث موثق بالوقت والتفاصيل</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-detail" id="commercial-security">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" />
                    <path d="M9 7h1M14 7h1M9 12h1M14 12h1M9 17h1M14 17h1" />
                  </svg>
                </div>
                <h2 className="h2">أمن المنشآت التجارية</h2>
              </div>
              <div>
                <p className="lead">
                  تأمين مداخل المباني الإدارية والتجارية وتنظيم حركة الزوار والموردين دون التأثير على انسيابية العمل اليومي.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تحكم في تصاريح الدخول للموظفين والزوار</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تنسيق مع الاستقبال وخدمات المبنى</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>إشراف على مواقف السيارات والمصاعد</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>بروتوكول إخلاء وطوارئ معتمد</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-detail" id="event-security">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21V8a4 4 0 014-4h8a4 4 0 014 4v13" />
                    <path d="M9 21v-6h6v6" />
                  </svg>
                </div>
                <h2 className="h2">أمن الفعاليات</h2>
              </div>
              <div>
                <p className="lead">
                  تغطية أمنية مؤقتة للمؤتمرات والفعاليات والافتتاحات، بأعداد أفراد مرنة تتناسب مع حجم الحدث ومدته.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تخطيط أمني مسبق لمسارات الحضور والطوارئ</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>أفراد إضافيون لأيام أو ساعات الذروة فقط</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تنسيق مباشر مع منظم الفعالية</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تفتيش مداخل وإدارة تصاريح الدخول</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-detail" id="executive-protection">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                  </svg>
                </div>
                <h2 className="h2">الحماية الشخصية</h2>
              </div>
              <div>
                <p className="lead">
                  مرافقة أمنية مدرَّبة لكبار المسؤولين التنفيذيين والضيوف أثناء الزيارات الرسمية أو التنقلات الحساسة.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>أفراد حماية شخصية ذوو خبرة موثقة</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تقييم مسبق لمسار التحرك ونقاط الخطر</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تنسيق مع فرق الأمن الأخرى إن وُجدت</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>سرية تامة في التعامل مع تفاصيل الزيارة</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-detail" id="security-consulting">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v12H8l-4 4z" />
                  </svg>
                </div>
                <h2 className="h2">الاستشارات الأمنية</h2>
              </div>
              <div>
                <p className="lead">
                  تقييم شامل للمخاطر ووضع بروتوكولات الدخول والطوارئ قبل بدء أي تعاقد تشغيلي، لعملاء يريدون خطة قبل التنفيذ.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>زيارة ميدانية وتقييم نقاط الضعف الفعلية</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>توصيات مكتوبة قابلة للتطبيق المباشر</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>مراجعة بروتوكولات الطوارئ القائمة</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>لا يشترط التعاقد على تشغيل حراسة لاحقًا</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-detail" id="residential-security">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11l9-8 9 8" />
                    <path d="M5 10v10h14V10" />
                  </svg>
                </div>
                <h2 className="h2">أمن المجمعات السكنية</h2>
              </div>
              <div>
                <p className="lead">
                  بوابات دخول، دوريات ليلية، وتحكم في حركة السيارات والزوار داخل الكمبوند، مع مراعاة خصوصية السكان.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>نظام تصاريح للزوار والموردين</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>دوريات ليلية منتظمة داخل المجمع</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تنسيق مع إدارة المجمع أو اتحاد الملاك</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تقرير أسبوعي بالحوادث والملاحظات</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-detail" id="industrial-security">
          <div className="container">
            <div className="service-detail-grid">
              <div>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21V10l5 3V10l5 3V7l6 4v10H3z" />
                  </svg>
                </div>
                <h2 className="h2">أمن المنشآت الصناعية</h2>
              </div>
              <div>
                <p className="lead">
                  تأمين محيط المصنع والمخازن ونقاط الشحن والتفريغ على مدار الوردية، مع بروتوكولات تراعي طبيعة العمليات الصناعية.
                </p>
                <ul className="check-list service-includes">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تأمين نقاط الشحن والتفريغ والمخازن</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تفتيش المركبات الداخلة والخارجة</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تنسيق مع نوبات العمل الصناعية المتعددة</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>بروتوكول خاص بالمواد أو المعدات الحساسة</span>
                  </li>
                </ul>
                <div className="btn-row" style={{ marginTop: "1.8rem" }}>
                  <a href="/contact#quote" className="btn btn--primary">
                    اطلب هذه الخدمة{" "}
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="section section--line-top">
        <div className="container reveal">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              آلية العمل
            </div>
            <h2 className="h2">من أول اتصال إلى بدء الحراسة الفعلي</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <div className="timeline-num">01</div>
              <h4>تواصل أولي</h4>
              <p>ترسل تفاصيل الموقع عبر نموذج طلب عرض السعر أو مكالمة مباشرة.</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-num">02</div>
              <h4>معاينة ميدانية</h4>
              <p>فريقنا يزور الموقع لتقييم المخاطر وتحديد عدد الأفراد المطلوب فعليًا.</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-num">03</div>
              <h4>عرض سعر وعقد</h4>
              <p>عرض مكتوب بالتفاصيل الكاملة، ثم توقيع عقد واضح البنود.</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-num">04</div>
              <h4>بدء الخدمة</h4>
              <p>انتشار الفريق المدرَّب في الموقع خلال 72 ساعة من التوقيع.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--charcoal">
        <div className="container reveal" style={{ textAlign: "center" }}>
          <h2 className="h2">لم تجد الخدمة المناسبة لموقعك؟</h2>
          <p className="lead" style={{ marginTop: ".8rem" }}>
            صف لنا طبيعة الموقع وسنقترح الحل الأمني المناسب خلال يوم عمل.
          </p>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.6rem" }}>
            <a href="/contact#quote" className="btn btn--primary">
              اطلب عرض سعر{" "}
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
