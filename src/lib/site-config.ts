// Static fallback config. Admin panel (Phase 2) will overlay site_settings from Supabase.
import logoUrl from "@/assets/world-jumper-logo.png";

export const SITE = {
  companyName: "World Jumper",
  brandName: "World Jumper Tours & Travels",
  tagline: "Govt. Approved Travel & Tourism Company in Bangladesh",
  licenseNo: "0013423",
  primaryPhone: "01687072001",
  phones: ["01687072001", "01757622143", "01337120743", "01337120744", "01337120745"],
  whatsapp: "01687072001",
  whatsappIntl: "8801687072001",
  whatsappMessage:
    "Hello World Jumper, I want to know about visa/tour/air ticket service.",
  email: "info@worldjumperbd.com",
  address: "Dhaka, Bangladesh",
  memberships: ["CAAB", "IATA", "ATAB", "TOB", "BOTOF", "ETAB", "e-Cab", "Lions International"],
  domain: "https://worldjumperbd.com",
  logoUrl,
};

export const whatsappLink = (msg: string = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.whatsappIntl}?text=${encodeURIComponent(msg)}`;
