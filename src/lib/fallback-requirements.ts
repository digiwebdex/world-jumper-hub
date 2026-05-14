import type { VisaRequirement } from "@/lib/api";

/**
 * Manually curated visa requirement data for Bangladeshi applicants.
 * Used as a fallback when the backend has no record yet so the country
 * detail pages always show full information.
 *
 * Keyed by country slug (matches FALLBACK_COUNTRIES.slug).
 */

type Partial = Partial<Omit<VisaRequirement, "id" | "country_id" | "is_active">>;

const PASSPORT = "Original passport with minimum 6 months validity from date of travel and at least 2 blank pages. All previous passports (if any) must be submitted.";
const PHOTO = "2 copies of recent (within 3 months) matte-finish color photo, white background. Sizes: 35×45 mm for Schengen/UK/Canada/Australia, 2×2 inch for USA, 3.5×4.5 cm for most Asian countries.";
const NID = "Photocopy of National ID card (both sides). Birth Certificate with English translation for minors.";
const BANK = "Personal bank statement of last 6 months on bank letterhead with official seal & signature. USD endorsement on passport recommended.";
const SOLV = "Bank solvency certificate (original) issued within the last 7 days, on bank letterhead with manager's signature & seal.";
const JOB = "Employment / NOC letter on company letterhead stating designation, joining date, monthly salary, leave approval and confirmation of return to job.";
const TRADE = "Updated Trade License (English translated & notarised), TIN certificate, and company bank statement of last 6 months for business owners.";

let counter = 0;
function r(visa_type: string, p: Partial): VisaRequirement {
  counter += 1;
  return {
    id: `fb-${counter}`,
    country_id: "fallback",
    visa_type,
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
    is_active: true,
  };
}

export const FALLBACK_REQUIREMENTS: Record<string, VisaRequirement[]> = {
  /* ---------------- NEPAL ---------------- */
  nepal: [
    r("Tourist Visa (Visa on Arrival)", {
      required_documents: "Passport, photo, return ticket, hotel booking, USD cash for visa fee. Bangladeshi passport holders get visa-on-arrival at Tribhuvan Airport (KTM) and major land borders.",
      bank_statement: "Last 3 months bank statement (recommended, not strictly mandatory at arrival).",
      bank_solvency: null, job_certificate: null, trade_license: null,
      hotel_booking: "Confirmed hotel booking for the entire stay duration.",
      air_ticket_booking: "Confirmed return air ticket.",
      travel_itinerary: "Day-by-day travel plan in Nepal.",
      processing_time: "On arrival (15–30 minutes at airport)",
      embassy_fee: "USD 30 (15 days), USD 50 (30 days), USD 125 (90 days)",
      service_charge: "BDT 3,000 (assistance & document preparation)",
      important_notes: "• Nepal offers visa on arrival to Bangladeshi citizens — no embassy visit needed.\n• Carry crisp USD notes (post-2009) for visa fee at airport.\n• Children under 10 years are exempt from visa fee.\n• You can also apply online via https://nepaliport.immigration.gov.np 15 days before arrival.",
      eligibility_notes: "Available to all Bangladeshi passport holders for tourism, pilgrimage, trekking and short visits.",
    }),
    r("Student Visa", {
      required_documents: "Admission letter from a recognised Nepali institution, NOC from Ministry of Education (Bangladesh), academic transcripts, passport, photo, financial documents and police clearance.",
      bank_statement: BANK + " Minimum USD 5,000 equivalent recommended.",
      job_certificate: "Sponsor's NOC / Job certificate (parent or guardian).",
      trade_license: "Sponsor's trade license (if business owner).",
      student_id: "Previous institution's student ID and all academic certificates (SSC, HSC, Bachelor's etc.) attested by the Foreign Ministry of Bangladesh.",
      invitation_letter: "Original Admission letter from the Nepali university or college, registered with the Ministry of Education, Nepal.",
      medical_documents: "Medical fitness certificate from a recognised hospital. HIV test required for stays over 90 days.",
      hotel_booking: "Hostel/accommodation arrangement letter from the institution.",
      air_ticket_booking: "Confirmed travel itinerary (ticket booking copy).",
      processing_time: "15–25 working days (Nepal Embassy, Dhaka)",
      embassy_fee: "USD 100 (per year, multiple entry)",
      service_charge: "BDT 8,000 (full file processing & embassy submission)",
      important_notes: "• Submit application at the Embassy of Nepal, House 2, Road 3, Baridhara, Dhaka.\n• MBBS / Engineering aspirants must verify university recognition with BMDC / BAETE.\n• Visa is renewable yearly inside Nepal at the Department of Immigration.",
      eligibility_notes: "Open to applicants admitted in undergraduate, graduate and postgraduate programs at Tribhuvan University, KU, Pokhara University and other recognised institutions.",
    }),
    r("Business Visa", {
      required_documents: "Invitation letter from Nepali company, sponsor letter from Bangladeshi company, trade license, passport, photo and financial papers.",
      invitation_letter: "Original invitation letter from the Nepali company on letterhead, stating duration and purpose of business meetings.",
      job_certificate: "Cover letter from your Bangladeshi company on letterhead with purpose of visit.",
      hotel_booking: "Hotel booking or accommodation arrangement by the inviting company.",
      air_ticket_booking: "Confirmed return air ticket.",
      travel_itinerary: "Business meeting schedule.",
      processing_time: "5–7 working days",
      embassy_fee: "USD 110 (multiple entry, 1 year)",
      service_charge: "BDT 5,000",
      important_notes: "Business visa allows multiple entries during validity. Holders cannot take up paid employment.",
      eligibility_notes: "For business owners, exporters, importers, consultants and professionals attending meetings in Nepal.",
    }),
  ],

  /* ---------------- INDIA ---------------- */
  india: [
    r("Tourist Visa", {
      required_documents: "Online application (IVAC), passport, photo, NID, bank statement, ticket & hotel booking, residence proof (utility bill).",
      photo_requirement: "2×2 inch (51×51 mm) recent color photo, white background, matte finish, full face. JPEG upload also required online.",
      bank_statement: "Last 6 months bank statement with minimum BDT 50,000 average balance recommended. Or 3 months bank statement + USD 150 endorsement.",
      hotel_booking: "Confirmed hotel booking for the visit period.",
      air_ticket_booking: "Confirmed return air ticket.",
      travel_itinerary: "Day-wise travel plan inside India.",
      processing_time: "5–10 working days from IVAC submission",
      embassy_fee: "BDT 824 (regular) — paid to IVAC",
      service_charge: "BDT 2,500 (file preparation, e-token, biometric assistance)",
      important_notes: "• Apply online at https://indianvisaonline.gov.in then book IVAC e-token.\n• IVAC centres: Jamuna Future Park, Mirpur, Uttara, Chattogram, Sylhet, Khulna, Rajshahi, Mymensingh, Rangpur, Barishal.\n• Currently India tourist visa is being issued in limited numbers — student & medical visas have priority.",
      eligibility_notes: "Available for sightseeing, meeting friends/relatives, short yoga programs and casual visits.",
    }),
    r("Medical Visa", {
      required_documents: "Hospital appointment letter, medical reports, doctor's referral from Bangladesh, passport, photo and financial documents.",
      bank_statement: BANK + " Dollar endorsement minimum USD 1,000.",
      invitation_letter: "Original appointment letter from Indian hospital (Apollo, Fortis, Medanta, CMC Vellore, Narayana etc.) with patient details, diagnosis and treatment plan.",
      medical_documents: "All medical reports, prescription history, doctor's referral letter from Bangladesh on letterhead, biopsy / scan reports.",
      air_ticket_booking: "Open ticket acceptable for medical visa.",
      processing_time: "5–7 working days",
      embassy_fee: "BDT 824",
      service_charge: "BDT 3,500 (with medical documentation support)",
      important_notes: "• Up to 3 attendants (Medical Attendant Visa) allowed — must be blood relatives.\n• Validity up to 6 months, multiple entry, 60 days per visit.\n• Hospital appointment letter must be dated within 3 months.",
      eligibility_notes: "For patients seeking specialised medical treatment not available or affordable in Bangladesh.",
    }),
    r("Student Visa", {
      required_documents: "Admission letter from UGC/AICTE recognised Indian university, all academic certificates, passport, photo, financial documents and police clearance.",
      bank_statement: BANK + " Sponsor's bank statement with minimum USD 5,000 equivalent.",
      student_id: "All previous academic certificates (SSC, HSC, Bachelor's) with transcripts; notarised English translation if needed.",
      invitation_letter: "Original admission / bonafide letter from the Indian institution.",
      medical_documents: "Medical fitness & HIV test report.",
      hotel_booking: "Hostel allotment letter or accommodation arrangement.",
      air_ticket_booking: "Travel booking copy.",
      processing_time: "10–15 working days",
      embassy_fee: "BDT 824",
      service_charge: "BDT 5,000",
      important_notes: "Valid for full course duration up to 5 years. FRRO registration required after arrival in India.",
      eligibility_notes: "For students admitted in MBBS, BDS, Engineering, MBA and other recognised programs.",
    }),
    r("Business Visa", {
      required_documents: "Invitation from Indian company, NOC from your Bangladeshi employer/company, trade license, financial documents.",
      invitation_letter: "Original business invitation on Indian company letterhead with GST/PAN details.",
      job_certificate: "NOC + cover letter from your Bangladeshi company.",
      processing_time: "7–10 working days",
      embassy_fee: "BDT 824",
      service_charge: "BDT 4,000",
      important_notes: "Multiple entry, valid up to 1 year (or 5 years for select cases). Each visit max 180 days.",
      eligibility_notes: "For trade meetings, exhibitions, conferences and contract negotiations.",
    }),
  ],

  /* ---------------- THAILAND ---------------- */
  thailand: [
    r("Tourist Visa (Single Entry)", {
      required_documents: "Online TR visa application, passport, photo, ticket, hotel booking, financial proof.",
      bank_statement: "Last 6 months bank statement showing minimum BDT 1,50,000 (≈ THB 20,000) balance. USD 700+ endorsement recommended.",
      hotel_booking: "Confirmed hotel booking for full stay.",
      air_ticket_booking: "Confirmed round-trip air ticket.",
      travel_itinerary: "Day-wise travel plan.",
      processing_time: "5–7 working days (Royal Thai Embassy Dhaka)",
      embassy_fee: "BDT 4,000 (single entry)",
      service_charge: "BDT 3,500",
      important_notes: "• Apply via https://thaievisa.go.th — no walk-in submission.\n• Stay up to 60 days, extendable by 30 days inside Thailand.\n• Bangladesh passport holders are NOT eligible for Thai visa-on-arrival currently.",
      eligibility_notes: "For tourism, visiting friends/family and short business meetings under 14 days.",
    }),
    r("Education Visa (ED Visa)", {
      required_documents: "Acceptance letter from MOE-approved Thai school/university, financial documents, passport, photo.",
      student_id: "All previous academic certificates with English translation.",
      invitation_letter: "Acceptance letter + Ministry of Education approval letter from the Thai institution.",
      medical_documents: "Medical certificate (no contagious disease).",
      processing_time: "10–15 working days",
      embassy_fee: "BDT 8,000 (90 days, extendable inside Thailand)",
      service_charge: "BDT 6,000",
      important_notes: "Valid for 90 days initially, then extendable up to 1 year inside Thailand at Immigration Bureau.",
      eligibility_notes: "For students, language learners and short-course participants.",
    }),
    r("Business Visa (Non-B)", {
      required_documents: "Invitation from Thai company, BOI/MOL approval (for work), Bangladeshi employer NOC, financial documents.",
      invitation_letter: "Invitation letter on Thai company letterhead with company registration documents.",
      job_certificate: "NOC + cover letter from Bangladeshi company.",
      processing_time: "7–10 working days",
      embassy_fee: "BDT 6,000 (single) / BDT 15,000 (multiple)",
      service_charge: "BDT 5,000",
      important_notes: "Non-B visa is the gateway to a Thai work permit. Valid 90 days; convertible to 1-year extension after work permit issuance.",
      eligibility_notes: "For business meetings, conferences, exhibitions and pre-employment travel.",
    }),
  ],

  /* ---------------- MALAYSIA ---------------- */
  malaysia: [
    r("eVisa Tourist", {
      required_documents: "Online application via official Malaysia eVisa portal, passport, photo, ticket, hotel booking, financial proof.",
      photo_requirement: "35×50 mm recent color photo, white background, JPEG upload.",
      bank_statement: "Last 3 months bank statement, minimum BDT 1,00,000 balance rec