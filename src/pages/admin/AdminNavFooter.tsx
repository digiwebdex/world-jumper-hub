import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { CmsListEditor, type FieldDef } from "@/components/admin/CmsListEditor";
import { useNavMenu, useFooterLinks } from "@/lib/cms";

const navFields: FieldDef[] = [
  { name: "label", label: "Menu label" },
  { name: "url", label: "URL", placeholder: "/visa or https://..." },
];
const footerFields: FieldDef[] = [
  { name: "column_group", label: "Column group", placeholder: "Explore / Company / Legal" },
  { name: "label", label: "Link label" },
  { name: "url", label: "URL", full: true },
];

export default function AdminNavFooter() {
  const nav = useNavMenu(true);
  const footer = useFooterLinks(true);

  return (
    <AdminShell title="Navigation & Footer">
      <AdminTabs tabs={[
        { key: "nav", label: "Header Menu", node:
          <CmsListEditor basePath="/nav-footer/nav" rows={nav.data} loading={nav.loading} reload={nav.reload}
            fields={navFields} rowLabel={(r) => r.label} rowSubLabel={(r) => r.url} />
        },
        { key: "footer", label: "Footer Links", node:
          <CmsListEditor basePath="/nav-footer/footer" rows={footer.data} loading={footer.loading} reload={footer.reload}
            fields={footerFields} rowLabel={(r) => `${r.column_group} · ${r.label}`} rowSubLabel={(r) => r.url} />
        },
      ]} />
    </AdminShell>
  );
}
