import { NextResponse } from "next/server";
import { serviceRepository } from "@/lib/repositories/service.repository";

/**
 * Consumed by website/build.py at build time (see fetch_services() there).
 * Deliberately public/unauthenticated — this only ever exposes PUBLISHED
 * rows (never drafts), which is the same content already visible to any
 * visitor on the live site, so there's no confidentiality concern. Kept as
 * its own /api/public/* namespace (rather than reusing /api/services) so
 * it's obvious at a glance which routes are meant to be called by the
 * outside world vs. only by the authenticated admin UI.
 */
export async function GET() {
  const services = await serviceRepository.findAllPublished();

  const shaped = services.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    title: s.title,
    summary: s.summary,
    includes: s.includes as string[],
  }));

  return NextResponse.json(
    { services: shaped },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
