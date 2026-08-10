import { ApplicationForm } from "./_components/ApplicationForm";
import { careerRepository } from "@/lib/repositories/career.repository";

export const revalidate = 60;

export default async function CareersPage() {
  const careers = await careerRepository.findAllPublished();

  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container reveal">
          <div className="breadcrumb">
            <a href="/">الرئيسية</a> / الوظائف
          </div>
          <div className="eyebrow">انضم إلينا</div>
          <h1 className="h1">فريق يستحق سُمعة أربعة إخوة</h1>
          <p className="lead" style={{ maxWidth: "60ch", marginTop: "1rem" }}>
            نبحث عن أفراد أمن وضباط تطوير أعمال يؤمنون بالانضباط والدقة. كل فرد في فور برذرز يمثّل الشركة كاملة أمام العميل.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container reveal">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              المزايا
            </div>
            <h2 className="h2">بيئة عمل منضبطة، بمزايا واضحة</h2>
          </div>
          <div className="grid grid--3">
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                تعيين رسمي
              </h3>
              <p style={{ fontSize: ".88rem" }}>تأمينات اجتماعية وعقد عمل موثق من اليوم الأول.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                تدريب معتمد
              </h3>
              <p style={{ fontSize: ".88rem" }}>برنامج تأهيل قبل أي تكليف ميداني.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                مواعيد مناوبات واضحة
              </h3>
              <p style={{ fontSize: ".88rem" }}>جداول عمل ثابتة ومعلنة مسبقًا.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                مسار ترقي فعلي
              </h3>
              <p style={{ fontSize: ".88rem" }}>من فرد أمن إلى مشرف موقع فمدير عمليات.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="3" width="16" height="18" />
                  <path d="M12 8v6M9 11h6" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                تغطية طبية
              </h3>
              <p style={{ fontSize: ".88rem" }}>تأمين صحي أساسي لجميع الموظفين الدائمين.</p>
            </div>
            <div className="card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v12H8l-4 4z" />
                </svg>
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                مكافآت أداء
              </h3>
              <p style={{ fontSize: ".88rem" }}>حوافز دورية مرتبطة بتقييم الأداء الفعلي في الموقع.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--charcoal section--line-top section--line-bottom">
        <div className="container reveal">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              الوظائف المتاحة
            </div>
            <h2 className="h2">الأدوار المفتوحة حاليًا</h2>
          </div>
          <div className="grid grid--2">
            {careers.map((c) => (
              <div className="card" key={c.id}>
                <h3 className="h3">{c.title}</h3>
                <p style={{ marginTop: ".5rem" }}>{c.description}</p>
                <ul className="check-list" style={{ marginTop: "1rem" }}>
                  {(c.requirements as string[]).map((item, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#apply" className="card-link">
                  قدّم الآن{" "}
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--line-top">
        <div className="container reveal">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              خطوات التقديم
            </div>
            <h2 className="h2">من التقديم إلى التعيين الفعلي</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <div className="timeline-num">01</div>
              <h4>تقديم الطلب</h4>
              <p>تملأ نموذج التقديم أدناه ببياناتك الأساسية.</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-num">02</div>
              <h4>فرز أولي</h4>
              <p>فريق التوظيف يراجع الطلب ويتواصل خلال 5 أيام عمل.</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-num">03</div>
              <h4>مقابلة شخصية</h4>
              <p>مقابلة مباشرة لتقييم الملاءمة للدور المطلوب.</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-num">04</div>
              <h4>تدريب تأهيلي</h4>
              <p>برنامج تدريب قصير قبل أي تكليف ميداني فعلي.</p>
            </div>
            <div className="timeline-step">
              <div className="timeline-num">05</div>
              <h4>التعيين</h4>
              <p>توقيع العقد وتوزيع الزي الرسمي والتكليف بالموقع.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--charcoal section--line-top section--line-bottom">
        <div className="container reveal">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              أسئلة شائعة
            </div>
            <h2 className="h2">قبل ما تقدّم على وظيفة</h2>
          </div>
          <div style={{ maxWidth: "760px", marginInline: "auto" }}>
            <div className="faq-item">
              <button className="faq-q" aria-expanded="false">
                هل يوجد فترة اختبار؟<span className="plus"></span>
              </button>
              <div className="faq-a">
                <p>نعم، فترة اختبار مدتها 3 أشهر يتم خلالها تقييم الأداء قبل التثبيت في العقد الدائم.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-q" aria-expanded="false">
                هل يتم توفير الزي الرسمي والمعدات؟<span className="plus"></span>
              </button>
              <div className="faq-a">
                <p>نعم، الشركة توفر الزي الرسمي الكامل والمعدات الأساسية اللازمة لأداء العمل.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-q" aria-expanded="false">
                كيف يتم تحديد نظام المناوبات؟<span className="plus"></span>
              </button>
              <div className="faq-a">
                <p>يُحدَّد جدول المناوبات مسبقًا حسب الموقع المكلَّف به الموظف، ويُعلَن قبل بداية كل شهر.</p>
              </div>
            </div>
            <div className="faq-item">
              <button className="faq-q" aria-expanded="false">
                هل يوجد مواصلات للمواقع البعيدة؟<span className="plus"></span>
              </button>
              <div className="faq-a">
                <p>بعض المواقع توفر مواصلات مؤسسية، ويُحدَّد ذلك بوضوح أثناء المقابلة الشخصية حسب الموقع.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="apply">
        <div className="container reveal" style={{ maxWidth: "820px", marginInline: "auto" }}>
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              التقديم
            </div>
            <h2 className="h2">قدّم بياناتك الآن</h2>
            <p className="lead">فريق التوظيف يراجع الطلبات ويتواصل خلال 5 أيام عمل.</p>
          </div>
          <ApplicationForm />
        </div>
      </section>
    </main>
  );
}
