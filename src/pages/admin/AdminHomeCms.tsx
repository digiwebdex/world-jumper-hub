import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { CmsListEditor, type FieldDef } from "@/components/admin/CmsListEditor";
import { CmsSingletonEditor } from "@/components/admin/CmsSingletonEditor";
import {
  useHomeHero, useHomeStats, useHomeServices, useHomeDestinations,
  useHomeTestimonials, useHomeWhyUs, useHomeQuickTabs,
} from "@/lib/cms";

const heroFields: FieldDef[] = [
  { name: "kicker", label: "Kicker line", placeholder: "Govt. Approved · License ..." },
  { name: "highlight_word", label: "Highlight word (italic accent)" },
  { name: "headline", label: "Headline", full: true },
  { name: "subheadline", label: "Subheadline", type: "textarea", rows: 2, full: true },
  { name: "background_image_url", label: "Background image", type: "image", full: true },
  { name: "primary_cta_label", label: "Primary CTA label" },
  { name: "primary_cta_link", label: "Primary CTA link" },
  { name: "secondary_cta_label", label: "Secondary CTA label" },
  { name: "secondary_cta_link", label: "Secondary CTA link" },
];
const statsFields: FieldDef[] = [
  { name: "label", label: "Label" },
  { name: "value", label: "Value (number as text)" },
  { name: "suffix", label: "Suffix (e.g. + or  yrs)" },
];
const servicesFields: FieldDef[] = [
  { name: "title", label: "Title" },
  { name: "icon", label: "Icon (lucide name)", placeholder: "Stamp, MapPin, Plane..." },
  { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
  { name: "link", label: "Link URL" },
  { name: "accent", label: "Accent", options: ["orange", "blue", "deep", "sand"] as const },
];
const destFields: FieldDef[] = [
  { name: "name", label: "Destination name" },
  { name: "tag", label: "Tag line (small text)" },
  { name: "image_url", label: "Image", type: "image", full: true },
  { name: "link", label: "Link URL" },
];
const testimonialFields: FieldDef[] = [
  { name: "name", label: "Customer name" },
  { name: "trip", label: "Trip / context" },
  { name: "quote", label: "Quote", type: "textarea", rows: 3, full: true },
  { name: "photo_url", label: "Photo URL", type: "url" },
  { name: "rating", label: "Rating (1-5)", type: "number", default: 5 },
];
const whyFields: FieldDef[] = [
  { name: "title", label: "Title" },
  { name: "icon", label: "Icon (lucide name)", placeholder: "ShieldCheck, Clock..." },
  { name: "description", label: "Description", type: "textarea", rows: 2, full: true },
];
const tabsFields: FieldDef[] = [
  { name: "tab_key", label: "Tab key (unique)", placeholder: "visa, tour, air..." },
  { name: "label", label: "Tab label" },
  { name: "icon", label: "Icon (lucide name)" },
  { name: "link", label: "Link URL" },
  { name: "placeholder", label: "Search placeholder", full: true },
];

export default function AdminHomeCms() {
  const hero = useHomeHero();
  const stats = useHomeStats(true);
  const services = useHomeServices(true);
  const destinations = useHomeDestinations(true);
  const testimonials = useHomeTestimonials(true);
  const why = useHomeWhyUs(true);
  const tabs = useHomeQuickTabs(true);

  return (
    <AdminShell title="Home Page CMS">
      <AdminTabs tabs={[
        { key: "hero", label: "Hero", node:
          <CmsSingletonEditor basePath="/home/hero" data={hero.data} loading={hero.loading} reload={hero.reload} fields={heroFields} />
        },
        { key: "stats", label: "Stats", node:
          <CmsListEditor basePath="/home/stats" rows={stats.data} loading={stats.loading} reload={stats.reload}
            fields={statsFields} rowLabel={(r) => `${r.value}${r.suffix} — ${r.label}`} />
        },
        { key: "services", label: "Services", node:
          <CmsListEditor basePath="/home/services" rows={services.data} loading={services.loading} reload={services.reload}
            fields={servicesFields} rowLabel={(r) => r.title} rowSubLabel={(r) => r.description} />
        },
        { key: "destinations", label: "Destinations", node:
          <CmsListEditor basePath="/home/destinations" rows={destinations.data} loading={destinations.loading} reload={destinations.reload}
            fields={destFields} rowLabel={(r) => r.name} rowSubLabel={(r) => r.tag} />
        },
        { key: "testimonials", label: "Testimonials", node:
          <CmsListEditor basePath="/home/testimonials" rows={testimonials.data} loading={testimonials.loading} reload={testimonials.reload}
            fields={testimonialFields} rowLabel={(r) => `${r.name} — ${r.trip}`} rowSubLabel={(r) => r.quote} />
        },
        { key: "why", label: "Why Us", node:
          <CmsListEditor basePath="/home/why-us" rows={why.data} loading={why.loading} reload={why.reload}
            fields={whyFields} rowLabel={(r) => r.title} rowSubLabel={(r) => r.description} />
        },
        { key: "tabs", label: "Quick Tabs", node:
          <CmsListEditor basePath="/home/quick-tabs" rows={tabs.data} loading={tabs.loading} reload={tabs.reload}
            fields={tabsFields} rowLabel={(r) => `${r.label} (${r.tab_key})`} rowSubLabel={(r) => r.link} />
        },
      ]} />
    </AdminShell>
  );
}
