import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { CmsListEditor, type FieldDef } from "@/components/admin/CmsListEditor";
import { useServiceItems, useFaqs } from "@/lib/cms";

const itemFields: FieldDef[] = [
  { name: "title", label: "Title" },
  { name: "icon", label: "Icon (lucide name)", placeholder: "Stamp, MapPin..." },
  { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
  { name: "link", label: "Link URL" },
];
const faqFields: FieldDef[] = [
  { name: "category", label: "Category", placeholder: "Visa, Tours, Umrah, Payment..." },
  { name: "question", label: "Question", full: true },
  { name: "answer", label: "Answer", type: "textarea", rows: 5, full: true },
];

export default function AdminServicesFaqs() {
  const items = useServiceItems(true);
  const faqs = useFaqs(true);

  return (
    <AdminShell title="Services & FAQs">
      <AdminTabs tabs={[
        { key: "items", label: "Services List", node:
          <CmsListEditor basePath="/services/items" rows={items.data} loading={items.loading} reload={items.reload}
            fields={itemFields} rowLabel={(r) => r.title} rowSubLabel={(r) => r.description} />
        },
        { key: "faqs", label: "FAQs", node:
          <CmsListEditor basePath="/services/faqs" rows={faqs.data} loading={faqs.loading} reload={faqs.reload}
            fields={faqFields} rowLabel={(r) => r.question} rowSubLabel={(r) => `${r.category} · ${r.answer.slice(0, 80)}`} />
        },
      ]} />
    </AdminShell>
  );
}
