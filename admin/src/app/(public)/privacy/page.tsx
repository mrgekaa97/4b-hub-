export default function PrivacyPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container reveal">
          <div className="breadcrumb">
            <a href="/">الرئيسية</a> / سياسة الخصوصية
          </div>
          <div className="eyebrow">سياسة الخصوصية</div>
          <h1 className="h1">كيف نتعامل مع بياناتك</h1>
          <p className="lead" style={{ maxWidth: "60ch", marginTop: "1rem" }}>
            آخر تحديث: يوليو 2026
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container reveal" style={{ maxWidth: "760px" }}>
          <p className="lead" style={{ marginBottom: "1.5rem" }}>
            تلتزم فور برذرز للأمن والحراسات بحماية بيانات الشركات والأفراد الذين يتواصلون معنا عبر هذا الموقع، سواء لطلب عرض سعر أو التقديم على وظيفة.
          </p>
          <h2 className="h2" style={{ fontSize: "1.3rem", marginBottom: ".6rem" }}>
            البيانات التي نجمعها
          </h2>
          <p style={{ color: "var(--steel)", marginBottom: "1.2rem" }}>
            اسم الشركة أو الفرد، بيانات التواصل (هاتف وبريد إلكتروني)، وتفاصيل الطلب أو التقديم كما تُدخلها في نماذج الموقع.
          </p>
          <h2 className="h2" style={{ fontSize: "1.3rem", marginBottom: ".6rem" }}>
            كيف نستخدم البيانات
          </h2>
          <p style={{ color: "var(--steel)", marginBottom: "1.2rem" }}>
            فقط للرد على طلبك — سواء إعداد عرض سعر أو مراجعة طلب توظيف — ولا تتم مشاركتها مع أي طرف ثالث لأغراض تسويقية.
          </p>
          <h2 className="h2" style={{ fontSize: "1.3rem", marginBottom: ".6rem" }}>
            التواصل بخصوص هذه السياسة
          </h2>
          <p style={{ color: "var(--steel)" }}>لأي استفسار عن بياناتك، راسلنا على info@4brothers-security.com.</p>
        </div>
      </section>
    </main>
  );
}
