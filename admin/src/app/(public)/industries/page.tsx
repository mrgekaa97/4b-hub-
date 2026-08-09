import { industryRepository } from "@/lib/repositories/industry.repository";
import { Icon } from "../_components/Icon";

export const revalidate = 60;

export default async function IndustriesPage() {
  const industries = await industryRepository.findAllPublished();

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
            {industries.map((i) => (
              <div className="card" key={i.id}>
                <Icon name={i.icon} />
                <h3 className="h3">{i.title}</h3>
                <p>{i.description}</p>
                <a href="/contact#quote" className="card-link">
                  اطلب استشارة لهذا القطاع{" "}
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            ))}
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
