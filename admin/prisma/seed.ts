/**
 * Seeds:
 *   1. Every permission in PERMISSIONS (lib/constants/permissions.ts)
 *   2. The single "administrator" role, granted all of them
 *   3. One admin User (password from env, never hardcoded — see below)
 *   4. Real content imported from /database/*.json (services, industries,
 *      careers, settings, seo) so the CMS starts with the site's actual
 *      live content instead of empty tables.
 *   5. The sample Quote Requests / Contact Messages from /database/*.json,
 *      clearly marked — see /database/README.md for why those are sample data.
 *
 * Run with: npm run db:seed  (wraps `tsx prisma/seed.ts`)
 */
import { PrismaClient, ContentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ALL_PERMISSIONS, SYSTEM_ROLES, ROLE_PERMISSION_PRESETS } from "../src/lib/constants/permissions";

const prisma = new PrismaClient();

const DATABASE_DIR = path.resolve(__dirname, "../../database");

function readJson<T>(filename: string): T {
  const full = path.join(DATABASE_DIR, filename);
  return JSON.parse(fs.readFileSync(full, "utf-8"));
}

async function seedRbac() {
  for (const key of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, group: key.split(".")[0] ?? key, description: null },
    });
  }

  const roleDefs = [
    { key: SYSTEM_ROLES.ADMINISTRATOR, name: "مدير الموقع", description: "صلاحية كاملة على جميع الأقسام." },
    {
      key: SYSTEM_ROLES.OPERATIONS_MANAGER,
      name: "مدير العمليات",
      description: "إدارة الموظفين والمواقع والحضور والطلبات اليومية، بدون إعدادات الموقع أو المستخدمين.",
    },
  ];

  const roles = new Map<string, { id: string }>();
  for (const def of roleDefs) {
    const role = await prisma.role.upsert({
      where: { key: def.key },
      update: {},
      create: { key: def.key, name: def.name, description: def.description, isSystem: true },
    });
    roles.set(def.key, role);
  }

  const allPermissionRows = await prisma.permission.findMany();
  const permissionByKey = new Map(allPermissionRows.map((p) => [p.key, p]));

  for (const def of roleDefs) {
    const role = roles.get(def.key);
    if (!role) throw new Error(`Role '${def.key}' was not created — this should never happen`);
    const roleId = role.id;
    const grantedKeys = ROLE_PERMISSION_PRESETS[def.key] ?? [];
    for (const key of grantedKeys) {
      const permission = permissionByKey.get(key);
      if (!permission) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId: permission.id } },
        update: {},
        create: { roleId, permissionId: permission.id },
      });
    }
  }

  const adminRole = roles.get(SYSTEM_ROLES.ADMINISTRATOR);
  if (!adminRole) throw new Error("Administrator role was not created — this should never happen");
  return adminRole;
}

async function seedAdminUser(roleId: string) {
  // The placeholder password lives in database/admin-users.json for reference
  // only — seeding reads the REAL initial password from an env var so it's
  // never committed to source control. Falls back to a random one printed
  // once to the console if the env var isn't set.
  const rawPassword = process.env.SEED_ADMIN_PASSWORD;
  const password = rawPassword ?? randomUUID();
  if (!rawPassword) {
    console.warn(
      `\n⚠ SEED_ADMIN_PASSWORD not set — generated a random one-time password:\n  ${password}\n  Log in and change it immediately; it will not be shown again.\n`
    );
  }
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      displayName: "مدير الموقع",
      email: null,
      passwordHash,
      roleId,
      isActive: true,
    },
  });
}

async function seedSettings() {
  const settings = readJson<Record<string, unknown>>("settings.json");
  for (const [key, value] of Object.entries(settings)) {
    if (key.startsWith("_")) continue; // skip the _note field
    await prisma.setting.upsert({
      where: { key: `site.${key}` },
      update: { value: value as any },
      create: {
        key: `site.${key}`,
        group: "general",
        valueType: typeof value === "object" ? "JSON" : "STRING",
        value: value as any,
      },
    });
  }

  const seo = readJson<Record<string, { title: string; description: string }>>("seo.json");
  for (const [page, fields] of Object.entries(seo)) {
    await prisma.setting.upsert({
      where: { key: `seo.${page}` },
      update: { value: fields as any },
      create: { key: `seo.${page}`, group: "seo", valueType: "JSON", value: fields as any },
    });
  }
}

async function seedServices() {
  const services = readJson<any[]>("services.json");
  for (const [i, s] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        icon: s.icon,
        title: s.title,
        summary: s.summary,
        includes: s.includes,
        status: ContentStatus.PUBLISHED, // already live on the real site
        sortOrder: i,
        publishedAt: new Date(),
      },
    });
  }
}

async function seedIndustries() {
  const industries = readJson<any[]>("industries.json");
  for (const [i, ind] of industries.entries()) {
    await prisma.industry.create({
      data: {
        icon: ind.icon,
        title: ind.title,
        description: ind.description,
        status: ContentStatus.PUBLISHED,
        sortOrder: i,
        publishedAt: new Date(),
      },
    });
  }
}

async function seedCareers() {
  const careers = readJson<any[]>("careers.json");
  for (const c of careers) {
    await prisma.careerPosting.create({
      data: {
        title: c.title,
        type: c.type,
        description: c.description,
        requirements: c.requirements,
        status: ContentStatus.PUBLISHED,
        isOpen: c.status === "open",
        publishedAt: new Date(),
      },
    });
  }
}

async function seedSampleRequests() {
  const { requests } = readJson<{ requests: any[] }>("quote-requests.json");
  for (const r of requests) {
    await prisma.quoteRequest.create({
      data: {
        company: r.company,
        contactName: r.contact_name,
        phone: r.phone,
        email: r.email,
        industry: r.industry,
        guardsRange: r.guards_range,
        location: r.location,
        preferredContact: r.preferred_contact,
        message: r.message,
        status: r.status.toUpperCase(),
        submittedAt: new Date(r.submitted_at),
      },
    });
  }

  const { messages } = readJson<{ messages: any[] }>("contact-messages.json");
  for (const m of messages) {
    await prisma.contactMessage.create({
      data: {
        name: m.name,
        email: m.email,
        phone: m.phone,
        subject: m.subject,
        message: m.message,
        status: m.status.toUpperCase(),
        submittedAt: new Date(m.submitted_at),
      },
    });
  }
}

async function seedPages() {
  // Home/About don't have a structured JSON source yet (their content lives
  // inline in website/build.py's home_body/about_body strings) — so V1 seeds
  // an empty draft shell here. Populating it for real happens in the Home
  // Page Editor / About Page Editor modules themselves.
  for (const slug of ["home", "about"]) {
    await prisma.page.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: slug === "home" ? "الرئيسية" : "من نحن",
        draftData: {},
        publishedData: null,
        status: ContentStatus.DRAFT,
      },
    });
  }
}

async function seedTestimonials() {
  // Extracted from the live homepage (website/build.py home_body) — these
  // are the real testimonials currently on the site, not placeholders.
  const testimonials = [
    {
      quoteText: "التزام فريق فور برذرز بمواعيد الدوريات وتوثيق كل حادثة صغيرة أعطانا راحة بال حقيقية داخل المصنع.",
      clientName: "مدير المصنع",
      clientCompany: "مصنع صناعات غذائية — العاشر من رمضان",
      avatarInitial: "م",
    },
    {
      quoteText: "التعامل مع فريق الأمن في المستشفى احترافي وهادئ، وهذا بالضبط ما نحتاجه في بيئة طبية حساسة.",
      clientName: "مدير العمليات",
      clientCompany: "مستشفى خاص — القاهرة الجديدة",
      avatarInitial: "هـ",
    },
    {
      quoteText: "بدأنا العقد خلال أقل من أسبوع، والتقارير اليومية بتوصلنا بانتظام. تعامل مؤسسي فعلاً.",
      clientName: "مدير المرافق",
      clientCompany: "كمبوند سكني — التجمع الخامس",
      avatarInitial: "ك",
    },
  ];

  for (const [i, t] of testimonials.entries()) {
    const existing = await prisma.testimonial.findFirst({ where: { clientName: t.clientName, clientCompany: t.clientCompany } });
    if (existing) continue;
    await prisma.testimonial.create({
      data: { ...t, status: ContentStatus.PUBLISHED, sortOrder: i, publishedAt: new Date() },
    });
  }
}

async function main() {
  console.log("Seeding RBAC...");
  const adminRole = await seedRbac();

  console.log("Seeding admin user...");
  await seedAdminUser(adminRole.id);

  console.log("Seeding settings + SEO...");
  await seedSettings();

  console.log("Seeding services, industries, careers...");
  await seedServices();
  await seedIndustries();
  await seedCareers();

  console.log("Seeding testimonials...");
  await seedTestimonials();

  console.log("Seeding sample quote requests + contact messages...");
  await seedSampleRequests();

  console.log("Seeding page shells (home/about)...");
  await seedPages();

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
