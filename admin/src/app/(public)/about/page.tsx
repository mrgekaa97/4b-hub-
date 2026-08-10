import { aboutManagementService } from "@/lib/services/aboutManagement.service";
import { Icon } from "../_components/Icon";
import type { AboutContent } from "@/lib/validation/about.schema";

export const revalidate = 60;

const FALLBACK_ABOUT: AboutContent = {
  hero: {
    eyebrow: "من نحن",
    title: "أربعة إخوة، ومسؤولية واحدة لا تتجزأ",
    lead: "بدأت فور برذرز كفكرة عائلية بسيطة: أمان العميل مسؤولية شخصية، وليس بندًا في عقد. اليوم نحرس عشرات المواقع الصناعية والطبية والفندقية والسكنية في مصر بنفس المنطق.",
  },
  story: {
    eyebrow: "قصتنا",
    title: "من حراسة موقع واحد إلى شريك أمني لقطاعات متعددة",
    body: "تأسست الشركة على يد أربعة شركاء يؤمنون بأن جودة الحراسة تُقاس بالتفاصيل: توقيت الدورية، دقة التقرير، وسرعة الاستجابة عند أي طارئ. مع نمو المحفظة إلى مصانع ومستشفيات وفنادق ومجمعات سكنية، حافظنا على نفس المعيار في كل موقع جديد.",
    imageLabel: "صورة فريق العمل الميداني لشركة فور برذرز",
  },
  values: [
    { icon: "I_SHIELD", title: "المسؤولية", text: "كل حادثة، مهما صغرت، تُوثَّق ويُحاسَب عليها." },
    { icon: "I_CLOCK", title: "الدقة في التوقيت", text: "الدوريات والمناوبات تسير بجدول صارم لا يتغير." },
    { icon: "I_CONSULT", title: "الشفافية", text: "تقارير يومية واضحة، بدون صياغة مبهمة." },
    { icon: "I_VIP", title: "الاحترافية", text: "مظهر ولياقة وسلوك يليق بموقع العميل." },
  ],
  stats: [
    { count: 12, suffix: "+", caption: "سنة في السوق المصري" },
    { count: 450, suffix: "+", caption: "فرد أمن مدرَّب" },
    { count: 120, suffix: "+", caption: "موقع تحت الحراسة حاليًا" },
    { count: 8, suffix: "", caption: "قطاعات صناعية مختلفة" },
  ],
  license: {
    eyebrow: "الترخيص والاعتماد",
    title: "تعامل مؤسسي موثق بالكامل",
    imageLabel: "صورة شهادات الترخيص والتأمين الخاصة بالشركة",
    items: [
      "ترخيص تشغيل ساري من وزارة الداخلية المصرية.",
      "سجل تجاري وبطاقة ضريبية سارية باسم الشركة.",
      "وثيقة تأمين شاملة على الأفراد والموقع المؤمَّن.",
      "برنامج تدريب داخلي معتمد لكل فرد قبل التعيين في أي موقع.",
    ],
  },
};

export default async function AboutPage() {
  const published = await aboutManagementService.getPublished();
  const content: AboutContent = (published as AboutContent | null) ?? FALLBACK_ABOUT;

  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container reveal">
          <div className="breadcrumb">
            <a href="/">الرئيسية</a> / من نحن
          </div>
          <div className="eyebrow">{content.hero.eyebrow}</div>
          <h1 className="h1">{content.hero.title}</h1>
          <p className="lead" style={{ maxWidth: "60ch", marginTop: "1rem" }}>
            {content.hero.lead}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split reveal">
          <div>
            <div className="eyebrow">{content.story.eyebrow}</div>
            <h2 className="h2">{content.story.title}</h2>
            <p className="lead" style={{ marginTop: "1rem" }}>
              {content.story.body}
            </p>
          </div>
          <div className="img-frame" role="img" aria-label={content.story.imageLabel}>
            {content.story.imageLabel}
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
            {content.values.map((v, i) => (
              <div className="card" key={i}>
                <Icon name={v.icon} />
                <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: ".88rem" }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container reveal">
          <div className="stats-bar">
            {content.stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="num" data-count-to={s.count} data-suffix={s.suffix}>
                  0
                </div>
                <div className="cap">{s.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--charcoal section--line-top">
        <div className="container split reveal">
          <div className="img-frame" role="img" aria-label={content.license.imageLabel}>
            {content.license.imageLabel}
          </div>
          <div>
            <div className="eyebrow">{content.license.eyebrow}</div>
            <h2 className="h2">{content.license.title}</h2>
            <ul className="check-list" style={{ marginTop: "1.5rem" }}>
              {content.license.items.map((item, i) => (
                <li key={i}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
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
