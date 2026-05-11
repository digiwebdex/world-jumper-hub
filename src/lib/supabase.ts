import { createClient } from "@supabase/supabase-js";

// Hardcoded fallback for the World Jumper Supabase project.
// These are public (publishable / anon) keys — safe to ship in client code.
// You may override at build time by setting VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://ogrzkbltmexafmcakkbg.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "sb_publishable_upB3aXCpF_NdTM8cozE3yg_93gNPtSo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type InquiryStatus = "New" | "Contacted" | "Processing" | "Completed" | "Cancelled";
export type ServiceType =
  | "Air Ticket"
  | "Tourist Visa"
  | "Business Visa"
  | "Medical Visa"
  | "Tour Package"
  | "Medical Tourism"
  | "Umrah"
  | "Other";

export interface VisaCountry {
  id: string;
  country_name: string;
  slug: string;
  flag_url: string | null;
  short_description: string | null;
  is_featured: boolean;
  is_active: boolean;
}

export interface VisaRequirement {
  id: string;
  country_id: string;
  visa_type: string;
  required_documents: string | null;
  passport_requirement: string | null;
  photo_requirement: string | null;
  nid_or_birth_certificate: string | null;
  bank_statement: string | null;
  bank_solvency: string | null;
  job_certificate: string | null;
  trade_license: string | null;
  student_id: string | null;
  invitation_letter: string | null;
  medical_documents: string | null;
  hotel_booking: string | null;
  air_ticket_booking: string | null;
  travel_itinerary: string | null;
  processing_time: string | null;
  embassy_fee: string | null;
  service_charge: string | null;
  important_notes: string | null;
  eligibility_notes: string | null;
  is_active: boolean;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  package_type: "Tour" | "Umrah" | "Medical Tourism" | "Air Ticket Offer";
  destination: string | null;
  duration: string | null;
  price: string | null;
  short_description: string | null;
  full_description: string | null;
  included_services: string | null;
  excluded_services: string | null;
  image_url: string | null;
  gallery_urls: string | null;
  brochure_url: string | null;
  is_featured: boolean;
  is_active: boolean;
}
