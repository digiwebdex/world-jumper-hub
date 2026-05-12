// Thin client for the VPS Express API. Uses cookie-based session auth.

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) || "/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, fd: FormData) =>
    request<T>(path, { method: "POST", body: fd }),
};

// ---------- Types ----------
export type InquiryStatus = "New" | "Contacted" | "Processing" | "Completed" | "Cancelled";

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
