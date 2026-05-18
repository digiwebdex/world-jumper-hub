// Public hook for site_settings (contact info, social links, brand strings).
// Falls back to the static SITE config so the site never breaks.
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SITE } from "@/lib/site-config";

export interface SiteSettings {
  company_name: string | null;
  brand_name: string | null;
  license_no: string | null;
  primary_phone: string | null;
  secondary_phone: string | null;
  other_phones: string | null; // comma-separated
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  footer_about_text: string | null;
}

export interface ResolvedContact {
  brandName: string;
  tagline: string;
  licenseNo: string;
  phones: string[];
  email: string;
  address: string;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  footerAbout: string;
}

function resolve(s: Partial<SiteSettings> | null): ResolvedContact {
  const phonesArr = [
    s?.primary_phone,
    s?.secondary_phone,
    ...(s?.other_phones ? s.other_phones.split(",").map((p) => p.trim()) : []),
  ].filter((p): p is string => !!p && p.length > 0);
  return {
    brandName: s?.brand_name || SITE.brandName,
    tagline: SITE.tagline,
    licenseNo: s?.license_no || SITE.licenseNo,
    phones: phonesArr.length ? phonesArr : SITE.phones,
    email: s?.email || SITE.email,
    address: s?.address || SITE.address,
    facebook: s?.facebook_url || null,
    instagram: s?.instagram_url || null,
    linkedin: s?.linkedin_url || null,
    youtube: s?.youtube_url || null,
    footerAbout: s?.footer_about_text || SITE.tagline,
  };
}

export function useSiteContact() {
  const [data, setData] = useState<ResolvedContact>(() => resolve(null));
  useEffect(() => {
    let cancelled = false;
    api
      .get<{ settings: SiteSettings | null }>("/site-settings")
      .then((r) => { if (!cancelled) setData(resolve(r.settings)); })
      .catch(() => { /* keep fallback */ });
    return () => { cancelled = true; };
  }, []);
  return data;
}
