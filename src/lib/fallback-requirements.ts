import type { VisaRequirement } from "@/lib/api";

/**
 * Manually curated visa requirement fallback data for Bangladeshi
 * applicants. Used when backend has no record so the country detail
 * pages always show the full information block.
 */

const PASSPORT = "Original passport with minimum 6 months validity from date of travel + 2 blank pages. All previous passports if any.";
const PHOTO = "2 copies recent matte-finish color photo, white background. 35×45 mm for Schengen/UK/Canada/AU; 2×2 inch for USA; 3.5×4.5 cm for Asia.";
const NID = "Photocopy of NID card (both sides). Birth Certificate with English translation for minors.";
const BANK = "Last 6 months personal bank statement on bank letterhead with seal & signature. USD endorsement on passport recommended.";
const SOLV = "Bank solvency certificate (original) issued within last 7 days, on bank letterhead.";
const JOB = "Employment / NOC letter on company letterhead with designation, joining date, salary, leave approval & return confirmation.";
const TRADE = "Updated Trade License (English translated & notarised), TIN certificate and company bank statement.";

type RBase = Partial<Omit<VisaRequirement, "id" | "country_id" | "is_active" | "visa_type">>;
let n = 0;
const r = (visa_type: string, p: RBase): VisaRequirement => ({
  id: `fb-${++n}`, country_id: "fallback", visa_type, is_active: true,
  required_documents: p.required_documents ?? null,
  passport_requirement: p.passport_requirement ?? PASSPORT,
  photo_requirement: p.photo_requirement ?? PHOTO,
  nid_or_birth_certificate: p.nid_or_birth_certificate ?? NID,
  bank_statement: p.bank_statement ?? BANK,
  bank_solvency: p.bank_solvency ?? SOLV,
  job_certificate: p.job_certificate ?? JOB,
  trade_license: p.trade_license ?? TRADE,
  student_id: p.student_id ?? null,
  invitation_letter: p.invitation_letter ?? null,
  medical_documents: p.medical_documents ?? null,
  hotel_booking: p.hotel_booking ?? null,
  air_ticket_booking: p.air_ticket_booking ?? null,
  travel_itinerary: p.travel_itinerary ?? null,
  processing_time: p.processing_time ?? null,
  embassy_fee: p.embassy_fee ?? null,
  service_charge: p.service_charge ?? null,
  important_notes: p.important_notes ?? null,
  eligibility_notes: p.eligibility_notes ?? null,
});

export const FALLBACK_REQUIREMENTS: Record<string, VisaRequirement[]> = {
  nepal: [
    r("Tourist Visa (Visa on Arrival)", {
      required_documents: "Passport, photo, return ticket, hotel booking, USD cash for fee.",
      bank_solvency: null, job_certificate: null, trade_license: null,
      hotel_booking: "Confirmed hotel for full stay.",
      air_ticket_booking: "Confirmed return ticket.",
      processing_time: "On arrival (15–30 minutes at Tribhuvan Airport)",
      embassy_fee: "USD 30 (15 days) / USD 50 (30 days) / USD 125 (90 days)",
      service_charge: "BDT 3,000",
      important_notes: "• Visa on arrival for Bangladeshi citizens at airport & land borders.\n• Carry crisp post-2009 USD notes.\n• Apply online: https://nepaliport.immigration.gov.np\n• Children under 10 are exempt.",
      eligibility_notes: "All Bangladeshi passport holders for tourism, pilgrimage and trekking.",
    }),
    r("Student Visa", {
      required_documents: "Admission letter, NOC from MOE Bangladesh, transcripts, financial papers, police clearance.",
      bank_statement: BANK + " Min USD 5,000 equivalent.",
      student_id: "All academic certificates (SSC, HSC, Bachelor's) attested by Foreign Ministry.",
      invitation_letter: "Original Admission letter from Nepali university registered with MOE Nepal.",
      medical_documents: "Medical fitness certificate. HIV test for stays over 90 days.",
      hotel_booking: "Hostel/accommodation arrangement letter from institution.",
      air_ticket_booking: "Confirmed travel itinerary.",
      processing_time: "15–25 working days (Embassy of Nepal, Dhaka)",
      embassy_fee: "USD 100 per year (multiple entry)", service_charge: "BDT 8,000",
      important_notes: "• Apply at Embassy of Nepal, Baridhara, Dhaka.\n• MBBS aspirants verify with BMDC.\n• Renewable yearly inside Nepal.",
      eligibility_notes: "UG/PG admissions at Tribhuvan, KU, Pokhara University etc.",
    }),
    r("Business Visa", {
      required_documents: "Invitation letter, sponsor letter, trade license, financial papers.",
      invitation_letter: "Original invitation from Nepali company on letterhead.",
      job_certificate: "Cover letter from Bangladeshi company stating purpose.",
      hotel_booking: "Hotel booking by inviting company.",
      air_ticket_booking: "Confirmed return ticket.", travel_itinerary: "Meeting schedule.",
      processing_time: "5–7 working days", embassy_fee: "USD 110 (multiple entry, 1 year)",
      service_charge: "BDT 5,000",
      important_notes: "Multiple entries allowed. Cannot take paid employment.",
      eligibility_notes: "Business owners, exporters, consultants attending meetings.",
    }),
  ],
};
