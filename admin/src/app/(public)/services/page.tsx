import { serviceRepository } from "@/lib/repositories/service.repository";
import { Icon } from "../_components/Icon";

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await serviceRepository.findAllPublished();

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
            {services.map((s) => (
              <a key={s.slug} href={`#${s.slug}`}>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--3 reveal">
            {services.map((s) => (
              <div className="card" key={s.slug}>
                <Icon name={s.icon} />
                <h3 className="h3">{s.title}</h3>
                <p>{s.previewSummary}</p>
                <a href="/contact#quote" className="card-link">
                  اطلب عرض سعر لهذه الخدمة{" "}
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section--charcoal section--line-top">
        {services.map((s) => (
          <section className="section service-detail" id={s.slug} key={s.slug}>
            <div className="container">
              <div className="service-detail-grid">
                <div>
                  <Icon name={s.icon} />
                  <h2 className="h2">{s.title}</h2>
                </div>
                <div>
                  <p className="lead">{s.summary}</p>
                  <ul className="check-list service-includes">
                    {(s.includes as string[]).map((item, i) => (
                      <li key={i}>
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
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
        ))}
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
