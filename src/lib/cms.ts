// Typed hooks for each CMS list, wrapping useCmsList with sane fallbacks.
import { useCmsList, useCmsSingleton, type ListRow } from "@/lib/cms-hooks";

// ---------------- Home ----------------
export interface HomeHero {
  id: number;
  kicker: string | null;
  headline: string | null;
  highlight_word: string | null;
  subheadline: string | null;
  background_image_url: string | null;
  primary_cta_label: string | null;
  primary_cta_link: string | null;
  secondary_cta_label: string | null;
  secondary_cta_link: string | null;
}
const HOME_HERO_FALLBACK: HomeHero = {
  id: 1,
  kicker: "Govt. Approved · License 0013423",
  headline: "Jump into the world.",
  highlight_word: "world",
  subheadline: "Visa, tours, air tickets, Umrah & medical journeys — one consultant, one trusted Dhaka travel house.",
  background_image_url: null,
  primary_cta_label: "Start a Visa",
  primary_cta_link: "/visa",
  secondary_cta_label: "Talk to us",
  secondary_cta_link: "/contact",
};
export const useHomeHero = () => useCmsSingleton<HomeHero>("/home/hero", HOME_HERO_FALLBACK);

export interface HomeStat extends ListRow { label: string; value: string; suffix: string }
export const useHomeStats = (includeInactive = false) =>
  useCmsList<HomeStat>("/home/stats", [], { includeInactive });

export interface HomeService extends ListRow {
  title: string; description: string; icon: string; link: string; accent: string;
}
export const useHomeServices = (includeInactive = false) =>
  useCmsList<HomeService>("/home/services", [], { includeInactive });

export interface HomeDestination extends ListRow {
  name: string; tag: string; image_url: string; link: string;
}
export const useHomeDestinations = (includeInactive = false) =>
  useCmsList<HomeDestination>("/home/destinations", [], { includeInactive });

export interface HomeTestimonial extends ListRow {
  name: string; trip: string; quote: string; photo_url: string | null; rating: number;
}
export const useHomeTestimonials = (includeInactive = false) =>
  useCmsList<HomeTestimonial>("/home/testimonials", [], { includeInactive });

export interface HomeWhyUs extends ListRow {
  title: string; description: string; icon: string;
}
export const useHomeWhyUs = (includeInactive = false) =>
  useCmsList<HomeWhyUs>("/home/why-us", [], { includeInactive });

export interface HomeQuickTab extends ListRow {
  tab_key: string; label: string; icon: string; link: string; placeholder: string;
}
export const useHomeQuickTabs = (includeInactive = false) =>
  useCmsList<HomeQuickTab>("/home/quick-tabs", [], { includeInactive });

// ---------------- About ----------------
export interface AboutPage {
  id: number;
  hero_kicker: string | null; hero_eyebrow: string | null;
  hero_title: string | null; hero_subtitle: string | null;
  hero_image_url: string | null;
  founding_label: string | null; founding_title: string | null;
  story_paragraph_1: string | null; story_paragraph_2: string | null;
  quote_text: string | null; quote_image_url: string | null;
}
const ABOUT_PAGE_FALLBACK: AboutPage = {
  id: 1,
  hero_kicker: "Our Story", hero_eyebrow: "About",
  hero_title: "A travel house, Dhaka-born.",
  hero_subtitle: "Govt. Approved Travel & Tourism Company — License No. 0013423.",
  hero_image_url: null,
  founding_label: "Founding note",
  founding_title: "We believe travel should feel like a gift, not a transaction.",
  story_paragraph_1: "World Jumper began with a simple frustration: too many trips were sold like commodities, too few were treated as memories in the making.",
  story_paragraph_2: "We are licensed, audited, IATA-approved and proudly accredited by every major travel body in the country.",
  quote_text: "Not all those who wander are lost — some are simply in good hands.",
  quote_image_url: null,
};
export const useAboutPage = () => useCmsSingleton<AboutPage>("/about/page", ABOUT_PAGE_FALLBACK);

export interface AboutPillar extends ListRow {
  title: string; body: string; image_url: string | null;
}
export const useAboutPillars = (includeInactive = false) =>
  useCmsList<AboutPillar>("/about/pillars", [], { includeInactive });

export interface AboutTeam extends ListRow {
  name: string; role: string; bio: string | null; photo_url: string | null;
}
export const useAboutTeam = (includeInactive = false) =>
  useCmsList<AboutTeam>("/about/team", [], { includeInactive });

export interface AboutStat extends ListRow {
  label: string; value: string; suffix: string;
}
export const useAboutStats = (includeInactive = false) =>
  useCmsList<AboutStat>("/about/stats", [], { includeInactive });

// ---------------- Services + FAQs ----------------
export interface ServiceItem extends ListRow {
  title: string; description: string; icon: string; link: string;
}
export const useServiceItems = (includeInactive = false) =>
  useCmsList<ServiceItem>("/services/items", [], { includeInactive });

export interface Faq extends ListRow {
  question: string; answer: string; category: string;
}
export const useFaqs = (includeInactive = false) =>
  useCmsList<Faq>("/services/faqs", [], { includeInactive });

// ---------------- Nav + Footer ----------------
export interface NavItem extends ListRow {
  label: string; url: string; parent_id: string | null; opens_new_tab: boolean;
}
export const useNavMenu = (includeInactive = false) =>
  useCmsList<NavItem>("/nav-footer/nav", [], { includeInactive });

export interface FooterLink extends ListRow {
  label: string; url: string; column_group: string;
}
export const useFooterLinks = (includeInactive = false) =>
  useCmsList<FooterLink>("/nav-footer/footer", [], { includeInactive });
