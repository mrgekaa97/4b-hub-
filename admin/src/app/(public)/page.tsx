import Link from "next/link";
import { serviceRepository } from "@/lib/repositories/service.repository";
import { industryRepository } from "@/lib/repositories/industry.repository";
import { testimonialRepository } from "@/lib/repositories/testimonial.repository";
import { Icon } from "./_components/Icon";

export const revalidate = 60;

export default async function PublicHomePage() {
  const services = await serviceRepository.findAllPublished();
  const industries = await industryRepository.findAllPublished();
  const testimonials = await testimonialRepository.findAllPublished();

  return (
    <>
    <section className="hero">
      <div className="pillars">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <picture>
        <source srcSet="/uploads/media/logo-wide.webp" type="image/webp" />
        <img
          src="/uploads/media/logo-wide.png"
          alt=""
          className="hero-bg-mark"
          aria-hidden="true"
          loading="eager"
          width={900}
          height={686}
        />
      </picture>
      <div className="container hero-grid reveal">
        <div>
          <div className="hero-logo-mark">
            <picture>
              <source srcSet="/uploads/media/logo-nav.webp" type="image/webp" />
              <img
                src="/uploads/media/logo-nav.png"
                alt=""
                width={56}
                height={56}
                aria-hidden="true"
                loading="eager"
              />
            </picture>
            <span>4 BROTHERS SECURITY &amp; GUARDING</span>
          </div>
          <div className="eyebrow">حراسة معتمدة · ترخيص وزارة الداخلية</div>
          <h1 className="h-display">
            حماية تستحقها منشأتك،
            <br />
            بضمان <span className="gold-text">أربعة إخوة</span>
          </h1>
          <p className="lead" style={{ maxWidth: "52ch", marginTop: "1.2rem" }}>
            فور برذرز شركة مصرية متخصصة في تأمين وحراسة المصانع والمستشفيات والفنادق والمجمعات السكنية والمنشآت التجارية،
            بعقود واضحة وفريق مدرَّب ومسؤولية شخصية عن كل موقع نحرسه.
          </p>
          <div className="btn-row" style={{ marginTop: "2rem" }}>
            <a href="/contact#quote" className="btn btn--primary">
              اطلب عرض سعر الآن{" "}
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="tel:+201000000000" className="btn btn--ghost">
              اتصل بنا الآن
            </a>
          </div>
          <div className="hero-trust">
            <div>
              <div className="stat-num" data-count-to="12" data-suffix="+">
                0
              </div>
              <div className="stat-label">سنة خبرة</div>
            </div>
            <div>
              <div className="stat-num" data-count-to="450" data-suffix="+">
                0
              </div>
              <div className="stat-label">فرد أمن مدرَّب</div>
            </div>
            <div>
              <div className="stat-num" data-count-to="120" data-suffix="+">
                0
              </div>
              <div className="stat-label">موقع تحت الحراسة</div>
            </div>
            <div>
              <div className="stat-num" data-count-to="15" data-suffix=" دقيقة">
                0
              </div>
              <div className="stat-label">زمن الاستجابة</div>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>
            لماذا تختار فور برذرز
          </div>
          <div className="hero-panel-row">
            <span>ترخيص التشغيل</span>
            <b>ساري ومعتمد</b>
          </div>
          <div className="hero-panel-row">
            <span>تأمين ضد المخاطر</span>
            <b>تغطية شاملة</b>
          </div>
          <div className="hero-panel-row">
            <span>تدريب الأفراد</span>
            <b>معتمد دوليًا</b>
          </div>
          <div className="hero-panel-row">
            <span>الإشراف الميداني</span>
            <b>24 / 7</b>
          </div>
          <div className="hero-panel-row">
            <span>بدء الخدمة</span>
            <b>خلال 72 ساعة</b>
          </div>
        </div>
      </div>
    </section>

    <section className="section section--line-bottom">
      <div className="container reveal">
        <div className="section-head center">
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            لماذا فور برذرز
          </div>
          <h2 className="h2">ما الذي يميزنا فعليًا عن أي شركة حراسة أخرى</h2>
        </div>
        <div className="grid grid--3">
          <div className="card why-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
              </svg>
            </div>
            <h3 className="h3">ترخيص وتأمين كامل</h3>
            <p>كل عقد مغطى بترخيص تشغيل ساري ووثيقة تأمين شاملة على الأفراد والموقع.</p>
          </div>
          <div className="card why-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <h3 className="h3">استجابة خلال 15 دقيقة</h3>
            <p>فريق إشراف ميداني متاح على مدار الساعة للتعامل مع أي طارئ فورًا.</p>
          </div>
          <div className="card why-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3" />
                <path d="M5 21c0-4 3-6 7-6s7 2 7 6" />
              </svg>
            </div>
            <h3 className="h3">أفراد مدرَّبون فعليًا</h3>
            <p>برنامج تأهيل داخلي قبل أي تكليف ميداني، لا مجرد توظيف سريع.</p>
          </div>
          <div className="card why-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v12H8l-4 4z" />
              </svg>
            </div>
            <h3 className="h3">تقارير يومية شفافة</h3>
            <p>توثيق كل دورية وحادثة بتقرير واضح يصلك أولًا بأول، لا نهاية الشهر فقط.</p>
          </div>
          <div className="card why-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </div>
            <h3 className="h3">مدير حساب مخصص</h3>
            <p>نقطة تواصل واحدة مسؤولة عن عقدك بالكامل، لا تنقل بين موظفين مختلفين.</p>
          </div>
          <div className="card why-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h11l4-3v10l-4-3H3z" />
                <path d="M6 8v5M2 21h10" />
              </svg>
            </div>
            <h3 className="h3">غرفة عمليات 24/7</h3>
            <p>متابعة مركزية لكل المواقع المتعاقدة على مدار اليوم بالكامل.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="section section--charcoal section--line-bottom">
      <div className="container">
        <div className="section-head center reveal">
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            خدماتنا
          </div>
          <h2 className="h2">تغطية أمنية كاملة لكل نوع منشأة</h2>
          <p className="lead">من الحراسة الثابتة إلى الدوريات المتحركة، نبني الخطة الأمنية حول طبيعة موقعك الفعلية.</p>
        </div>
        <div className="grid grid--3 reveal">
          {services.slice(0, 3).map((s) => (
            <div className="card" key={s.slug}>
              <Icon name={s.icon} />
              <h3 className="h3">{s.title}</h3>
              <p>{s.previewSummary}</p>
              <Link href={`/services#${s.slug}`} className="card-link">
                تفاصيل الخدمة{" "}
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-head reveal">
          <div className="eyebrow">القطاعات</div>
          <h2 className="h2">خبرة متخصصة في القطاعات عالية الحساسية</h2>
        </div>
        <div className="grid grid--4 reveal">
          {industries.slice(0, 4).map((i) => (
            <div className="card" key={i.id}>
              <Icon name={i.icon} />
              <h3 className="h3" style={{ fontSize: "1.05rem" }}>
                {i.title}
              </h3>
              <p style={{ fontSize: ".88rem" }}>{i.description}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }} className="reveal">
          <Link href="/industries" className="btn btn--ghost">
            عرض جميع القطاعات{" "}
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>

    <section className="section section--charcoal section--line-top section--line-bottom">
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
            <p>فريقنا يزور الموقع لتقييم المخاطر وتحديد عدد الأفراد المطلوب.</p>
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

    <section className="section">
      <div className="container reveal">
        <div className="section-head center">
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            آراء عملائنا
          </div>
          <h2 className="h2">شركات تثق في فور برذرز</h2>
        </div>
        <div className="testi-track" style={{ maxWidth: "760px", marginInline: "auto" }}>
          {testimonials.map((t, i) => (
            <div className={`testi-slide${i === 0 ? " is-active" : ""}`} key={t.id}>
              <p className="testi-quote">{t.quoteText}</p>
              <div className="testi-meta">
                <div className="testi-avatar">{t.avatarInitial}</div>
                <div>
                  <div className="testi-name">{t.clientName}</div>
                  <div className="testi-role">{t.clientCompany}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testi-dots" style={{ justifyContent: "center" }}></div>
      </div>
    </section>

    <section className="section section--charcoal section--line-top section--line-bottom">
      <div className="container reveal">
        <div className="section-head center">
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            عملاؤنا
          </div>
          <h2 className="h2">شركات من قطاعات مختلفة تثق في حراستنا</h2>
        </div>
        <div className="clients-strip">
          <div className="client-chip">
            مجموعة صناعية
            <br />
            القاهرة
          </div>
          <div className="client-chip">
            مستشفى خاص
            <br />
            القاهرة الجديدة
          </div>
          <div className="client-chip">
            سلسلة فنادق
            <br />
            الساحل الشمالي
          </div>
          <div className="client-chip">
            كمبوند سكني
            <br />
            التجمع الخامس
          </div>
          <div className="client-chip">
            مركز توزيع
            <br />
            العاشر من رمضان
          </div>
          <div className="client-chip">
            مبنى إداري
            <br />
            مدينة نصر
          </div>
        </div>
        <p className="clients-note">شعارات توضيحية مؤقتة — سيتم استبدالها بشعارات العملاء الفعلية بعد الموافقة.</p>
      </div>
    </section>

    <section className="section">
      <div className="container reveal">
        <div className="section-head center">
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            أسئلة شائعة
          </div>
          <h2 className="h2">قبل ما تتواصل معنا</h2>
        </div>
        <div style={{ maxWidth: "760px", marginInline: "auto" }}>
          <div className="faq-item">
            <button className="faq-q" aria-expanded="false">
              هل فور برذرز حاصلة على ترخيص رسمي؟<span className="plus"></span>
            </button>
            <div className="faq-a">
              <p>نعم، الشركة مرخصة من وزارة الداخلية المصرية لتقديم خدمات الأمن والحراسة، وجميع الأفراد مسجلون رسميًا.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-q" aria-expanded="false">
              كم تستغرق بداية الخدمة بعد توقيع العقد؟<span className="plus"></span>
            </button>
            <div className="faq-a">
              <p>غالبًا خلال 72 ساعة من توقيع العقد ومعاينة الموقع، حسب حجم الفريق المطلوب.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-q" aria-expanded="false">
              هل يمكن تخصيص عدد الحراس وساعات العمل؟<span className="plus"></span>
            </button>
            <div className="faq-a">
              <p>نعم، كل عقد يُبنى بعد معاينة ميدانية للموقع لتحديد عدد الأفراد والمناوبات المناسبة فعليًا.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-q" aria-expanded="false">
              هل تقدمون تغطية تأمينية على الحراس والموقع؟<span className="plus"></span>
            </button>
            <div className="faq-a">
              <p>نعم، جميع عقودنا تشمل تغطية تأمينية شاملة تُذكر بالتفصيل في عرض السعر.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="section section--charcoal">
      <div className="container reveal" style={{ textAlign: "center" }}>
        <h2 className="h2">جاهزون لتأمين موقعك من الأسبوع القادم</h2>
        <p className="lead" style={{ maxWidth: "50ch", marginInline: "auto", marginTop: "1rem" }}>
          أرسل تفاصيل منشأتك واحصل على عرض سعر مبدئي خلال يوم عمل واحد.
        </p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.8rem" }}>
          <Link href="/contact#quote" className="btn btn--primary">
            اطلب عرض سعر{" "}
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link href="/contact" className="btn btn--ghost">
            تواصل معنا مباشرة
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
