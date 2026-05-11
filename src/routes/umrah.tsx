import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/ui";
import heroImg from "@/assets/hero-umrah.jpg";
import { InquiryForm } from "@/components/site/InquiryForm";
import { supabase, type Package } from "@/lib/supabase";
import { PackageGrid } from "./tours";

export const Route = createFileRoute("/umrah")({
  component: UmrahPage,
  head: () => ({
    meta: [
      { title: "Umrah Packages — World Jumper Tours & Travels" },
      { name: "description", content: "Economy and premium Umrah packages from Bangladesh — full visa, air ticket, hotel, transport and ziyarah included." },
    ],
  }),
});

function UmrahPage() {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void supabase.from("packages").select("*").eq("is_active", true).eq("package_type", "Umrah")
      .order("is_featured", { ascending: false })
      .then(({ data }) => { setItems((data as Package[]) ?? []); setLoading(false); });
  }, []);

  return (
    <SiteLayout>
      <PageHero eyebrow="Umrah Packages" title="Perform Umrah with peace of mind"
        subtitle="Trusted Umrah services with full visa, ticket, hotel and ziyarah arrangements."
        image={heroImg} imageAlt="Kaaba in Mecca during blue hour" />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <PackageGrid items={items} loading={loading} emptyText="No Umrah packages available right now." />
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <InquiryForm sourcePage="umrah" defaultServiceType="Umrah" title="Inquire about Umrah" />
      </section>
    </SiteLayout>
  );
}
