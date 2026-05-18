import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { CmsListEditor, type FieldDef } from "@/components/admin/CmsListEditor";
import { CmsSingletonEditor } from "@/components/admin/CmsSingletonEditor";
import { useAboutPage, useAboutPillars, useAboutTeam, useAboutStats } from "@/lib/cms";

const pageFields: FieldDef[] = [
  { name: "hero_eyebrow", label: "Hero eyebrow" },
  { name: "hero_kicker", label: "Hero kicker" },
  { name: "hero_title", label: "Hero title", full: true },
  { name: "hero_subtitle", label: "Hero subtitle", type: "textarea", rows: 2, full: true },
  { name: "hero_image_url", label: "Hero image", type: "image", full: true },
  { name: "founding_label", label: "Founding note label" },
  { name: "founding_title", label: "Founding note title" },
  { name: "story_paragraph_1", label: "Story paragraph 1", type: "textarea", rows: 4, full: true },
  { name: "story_paragraph_2", label: "Story paragraph 2", type: "textarea", rows: 4, full: true },
  { name: "quote_text", label: "Quote text", type: "textarea", rows: 2, full: true },
  { name: "quote_image_url", label: "Quote background image", type: "url", full: true },
];
const pillarFields: FieldDef[] = [
  { name: "title", label: "Title" },
  { name: "image_url", label: "Image URL", type: "url" },
  { name: "body", label: "Body", type: "textarea", rows: 3, full: true },
];
const teamFields: FieldDef[] = [
  { name: "name", label: "Name" },
  { name: "role", label: "Role" },
  { name: "photo_url", label: "Photo URL", type: "url" },
  { name: "bio", label: "Bio", type: "textarea", rows: 3, full: true },
];
const statsFields: FieldDef[] = [
  { name: "label", label: "Label" },
  { name: "value", label: "Value" },
  { name: "suffix", label: "Suffix" },
];

export default function AdminAboutCms() {
  const page = useAboutPage();
  const pillars = useAboutPillars(true);
  const team = useAboutTeam(true);
  const stats = useAboutStats(true);

  return (
    <AdminShell title="About Page CMS">
      <AdminTabs tabs={[
        { key: "page", label: "Page Content", node:
          <CmsSingletonEditor basePath="/about/page" data={page.data} loading={page.loading} reload={page.reload} fields={pageFields} />
        },
        { key: "pillars", label: "Pillars", node:
          <CmsListEditor basePath="/about/pillars" rows={pillars.data} loading={pillars.loading} reload={pillars.reload}
            fields={pillarFields} rowLabel={(r) => r.title} rowSubLabel={(r) => r.body} />
        },
        { key: "team", label: "Team", node:
          <CmsListEditor basePath="/about/team" rows={team.data} loading={team.loading} reload={team.reload}
            fields={teamFields} rowLabel={(r) => `${r.name} — ${r.role}`} rowSubLabel={(r) => r.bio ?? ""} />
        },
        { key: "stats", label: "Stats", node:
          <CmsListEditor basePath="/about/stats" rows={stats.data} loading={stats.loading} reload={stats.reload}
            fields={statsFields} rowLabel={(r) => `${r.value}${r.suffix} — ${r.label}`} />
        },
      ]} />
    </AdminShell>
  );
}
