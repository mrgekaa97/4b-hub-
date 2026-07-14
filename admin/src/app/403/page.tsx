export default function ForbiddenPage() {
  return (
    <main dir="rtl" className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0A0A0A] text-center text-[#F5F0E6]">
      <h1 className="text-3xl font-black text-[#C9A227]">403</h1>
      <p className="text-[#9C978A]">غير مصرح لك بالوصول إلى هذا القسم.</p>
      <a href="/dashboard" className="mt-2 text-sm font-bold text-[#C9A227] hover:underline">
        العودة إلى لوحة التحكم
      </a>
    </main>
  );
}
