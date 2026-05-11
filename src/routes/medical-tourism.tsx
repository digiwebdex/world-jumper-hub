import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import { InquiryForm } from "@/components/site/InquiryForm";
import { supabase, type Package } from "@/lib/supabase";
import { PackageGrid } from "./tours";

export const Route = createFileRoute("/medical-tourism")({
  component: MedicalPage,
  head: () => ({
    meta: [
      { title: "Medical Tourism — World Jumper Tours & Travels" },
      { name: "description", content: "Medical tourism support from Bangladesh — India, Thailand, Singapore. Hospital coordination, medical visa, hotel & translator." },
    ],
  }),
});

function MedicalPage() {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void supabase.from("packages").select("*").eq("is_active", true).eq("package_type", "Medical Tourism")
      .order("is_featured", { ascending: false })
      .then(({ data }) => { setItems((data as Package[]) ?? []); setLoading(false); });
  }, []);

  return (
    <SiteLayout>
      <PageHero eyebrow="Medical Tourism" title="Trusted medical travel support"
        subtitle="End-to-end coordination with top hospitals in India, Thailand and Singapore." />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <PackageGrid items={items} loading={loading} emptyText="No medical tourism packages right now." />
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <InquiryForm sourcePage="medical-tourism" defaultServiceType="Medical Tourism" title="Inquire about medical travel"
          subtitle="Share your treatment / hospital preference — we'll coordinate everything." />
      </section>
    </SiteLayout>
  );
}
