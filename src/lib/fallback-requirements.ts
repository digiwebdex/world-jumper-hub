import type { VisaRequirement } from "@/lib/api";

/**
 * Manually curated visa requirement data for Bangladeshi applicants.
 * Used when the backend has no record yet so the country detail pages
 * always show the full information block.
 *
 * Keyed by country slug (matches FALLBACK_COUNTRIES.slug).
 */

type Req = Omit<VisaRequirement, "id" | "country_id" | "is_active">;

const COMMON_PHOTO = "2 copies of recent (within 3 months) matte-finish color photo, white background. Size depends on embassy: 35×45 mm for Schengen/UK/Canada/Australia, 2×2 inch for USA, 3.5×4.5 cm for most Asian countries.";
const COMMON_PASSPORT = "Original passport with minimum 6 months validity from date of travel and at least 2 blank pages. All previous passports (if any) must be submitted.";
const COMMON_NID = "Photocopy of National ID card (both sides) or Birth Certificate with English translation for minors.";
const COMMON_BANK_STMT = "Personal bank statement of last 6 months on bank letterhead with official seal & signature. Minimum balance recommendation varies by destination.";
const COMMON_SOLVENCY = "Bank solvency certificate (original) issued within the last 7 days, on bank letterhead with manager's signature & seal.";
const COMMON_JOB = "Employment / NOC letter on company letterhead stating designation, joining date, monthly salary, leave approval and confirmation of return to job.";
const COMMON_TRADE = "Updated Trade License (English translated & notarised), TIN certificate, and company bank statement of last 6 months for business owners.";

function build(items: Req[]): VisaRequirement[] {
  return items.map((r, i) => ({
    ...r,
    id: `${r.visa_type.toLowerCase().replace(/\s+/g, "-")}-${i}`,
    country_id: "fallback",
    is_active: true,
  }));
}

/* ------------------------------------------------------------------ */
/*  NEPAL                                                              */
/* ------------------------------------------------------------------ */
const NEPAL: VisaRequirement[] = build([
  {
    visa_type: "Tourist Visa (Visa on Arrival)",
    required_documents: "Passport, photo, return ticket, hotel booking, USD cash for visa fee. Bangladeshi passport holders get visa-on-arrival at Tribhuvan Airport (KTM) and major land borders.",
    passport_requirement: COMMON_PASSPORT,
    photo_requirement: "1 recent passport size color photo (35×45 mm), white background.",
    nid_or_birth_certificate: COMMON_NID,
    bank_statement: "Last 3 months bank statement (recommended, not strictly mandatory at arrival).",
    bank_solvency: null,
    job_certificate: null,
    trade_license: null,
    student_id: null,
    invitation_letter: null,
    medical_documents: null,
    hotel_booking: "Confirmed hotel booking for the entire stay duration.",
    air_ticket_booking: "Confirmed return air ticket.",
    travel_itinerary: "Day-by-day travel plan in Nepal.",
    processing_time: "On arrival (15–30 minutes at airport)",
    embassy_fee: "USD 30 (15 days), USD 50 (30 days), USD 125 (90 days)",
    service_charge: "BDT 3,000 (assistance & document preparation)",
    important_notes: "• Nepal offers visa on arrival to Bangladeshi citizens — no embassy visit needed.\n• Carry crisp USD notes (post-2009) for visa fee at airport.\n• Children under 10 years are exempt from visa fee.\n• You can also apply online via https://nepaliport.immigration.gov.np 15 days before arrival.",
    eligibility_notes: "Available to all Bangladeshi passport holders for tourism, pilgrimage, trekking and short visits.",
  },
  {
    visa_type: "Student Visa",
    required_documents: "Admission/offer letter from a recognised Nepali institution, NOC from Ministry of Education (Bangladesh), academic transcripts, passport, photo, financial documents and police clearance.",
    passport_requirement: COMMON_PASSPORT,
    photo_requirement: COMMON_PHOTO,
    nid_or_birth_certificate: COMMON_NID,
    bank_statement: COMMON_BANK_STMT + " Minimum USD 5,000 equivalent recommended.",
    bank_solvency: COMMON_SOLVENCY,
    job_certificate: "Sponsor's NOC / Job certificate (parent or guardian).",
    trade_license: "Sponsor's trade license (if business owner).",
    student_id: "Previous institution's student ID and all academic certificates (SSC, HSC, Bachelor's etc.) attested by the Foreign Ministry of Bangladesh.",
    invitation_letter: "Original I-20 / Admission letter from the Nepali university or college, registered with the Ministry of Education, Nepal.",
    medical_documents: "Medical fitness certificate from a recognised hospital. HIV test required for stays over 90 days.",
    hotel_booking: "Hostel/accommodation arrangement letter from the institution.",
    air_ticket_booking: "Confirmed travel itinerary (ticket booking copy).",
    travel_itinerary: null,
    processing_time: "15–25 working days (Nepal Embassy, Dhaka)",
    embassy_fee: "USD 100 (per year, multiple entry)",
    service_charge: "BDT 8,000 (full file processing & embassy submission)",
    important_notes: "• Submit application at the Embassy of Nepal, House 2, Road 3, Baridhara, Dhaka.\n• MBBS / Engineering aspirants must verify university recognition with BMDC / BAETE.\n• Visa is renewable yearly inside Nepal at the Department of Immigration.",
    eligibility_notes: "Open to applicants admitted in undergraduate, graduate and postgraduate programs at Tribhuvan University, KU, Pokhara University and other recognised institutions.",
  },
  {
    visa_type: "Business Visa",
    required_documents: "Invitation letter from Nepali company, sponsor letter from Bangladeshi company, trade license, passport, photo and financial papers.",
    passport_requirement: COMMON_PASSPORT,
    photo_requirement: COMMON_PHOTO,
    nid_or_birth_certificate: COMMON_NID,
    bank_statement: COMMON_BANK_STMT + " Company bank statement also required.",
    bank_solvency: COMMON_SOLVENCY,
    job_certificate: "Cover letter from your Bangladeshi company on letterhead with purpose of visit.",
    trade_license: COMMON_TRADE,
    student_id: null,
    invitation_letter: "Original invitation letter from the Nepali company on letterhead, stating duration and purpose of business meetings.",
    medical_documents: null,
    hotel_booking: "Hotel booking or accommodation arrangement by the inviting company.",
    air_ticket_booking: "Confirmed return air ticket.",
    travel_itinerary: "Business meeting schedule.",
    processing_time: "5–7 working days",
    embassy_fee: "USD 110 (multiple entry, 1 year)",
    service_charge: "BDT 5,000",
    important_notes: "Business visa allows multiple entries during validity. Holders cannot take up paid employment.",
    eligibility_notes: "For business owners, exporters, importers, consultants and professionals attending meetings in Nepal.",
  },
]);

/* ------------------------------------------------------------------ */
/*  INDIA                                                              */
/* ------------------------------------------------------------------ */
const INDIA: VisaRequirement[] = build([
  {
    visa_type: "Tourist Visa",
    required_documents: "Online application (IVAC), passport, photo, NID, bank statement, ticket & hotel booking, residence proof (utility bill).",
    passport_requirement: COMMON_PASSPORT,
    photo_requirement: "2×2 inch (51×51 mm) recent color photo, white background, matte finish, full face. JPEG upload also required online.",
    nid_or_birth_certificate: COMMON_NID,
    bank_statement: "Last 6 months personal bank statement with minimum BDT 50,000 average balance recommended. Or last 3 months bank statement + dollar endorsement (USD 150 minimum).",
    bank_solvency: COMMON_SOLVENCY,
    job_certificate: COMMON_JOB,
    trade_license: COMMON_TRADE,
    student_id: "Student ID + last academic certificate for students.",
    invitation_letter: null,
    medical_documents: null,
    hotel_booking: "Confirmed hotel booking for the visit period.",
    air_ticket_booking: "Confirmed return air ticket.",
    travel_itinerary: "Day-wise travel plan inside India.",
    processing_time: "5–10 working days from IVAC submission",
    embassy_fee: "BDT 824 (regular) — paid to IVAC",
    service_charge: "BDT 2,500 (file preparation, e-token, biometric assistance)",
    important_notes: "• Apply online at https://indianvisaonline.gov.in then book IVAC e-token.\n• IVAC centres: Jamuna Future Park, Mirpur, Uttara, Chattogram, Sylhet, Khulna, Rajshahi, Mymensingh, Rangpur, Barishal.\n• Currently India tourist visa is being issued in limited numbers — student & medical visas have priority.",
    eligibility_notes: "Available for sightseeing, meeting friends/relatives, short yoga programs and casual visits.",
  },
  {
    visa_type: "Medical Visa",
    required_documents: "Hospital appointment letter, medical reports, doctor's referral from Bangladesh, passport, photo and financial documents.",
    passport_requirement: COMMON_PASSPORT,
    photo_requirement: "2×2 inch white background matte color photo.",
    nid_or_birth_certificate: COMMON_NID,
    bank_statement: COMMON_BANK_STMT + " Dollar endorsement minimum USD 1,000.",
    bank_solvency: COMMON_SOLVENCY,
    job_certificate: COMMON_JOB + " Or sponsor's job certificate.",
    trade_license: null,
    student_id: null,
    invitation_letter: "Original appointment letter from Indian hospital (Apollo, Fortis, Medanta, CMC Vellore, Narayana etc.) with patient details, diagnosis and treatment plan.",
    medical_documents: "All medical reports, prescription history, doctor's referral letter from Bangladesh on letterhead, biopsy / scan reports.",
    hotel_booking: null,
    air_ticket_booking: "Open ticket acceptable for medical visa.",
    travel_itinerary: null,
    processing_time: "5–7 working days",
    embassy_fee: "BDT 824",
    service_charge: "BDT 3,500 (with medical documentation support)",
    important_notes: "• Up to 3 attendants (Medical Attendant Visa) allowed for the patient — must be blood relatives.\n• Validity up to 6 months, multiple entry, with 60 days per visit.\n• Hospital appointment letter must be dated within 3 months.",
    eligibility_notes: "For patients seeking specialised medical treatment not available or affordable in Bangladesh.",
  },
  {
    visa_type: "Student Visa",
    required_documents: "Admission letter from Indian university (UGC/AICTE recognised), all academic certificates, passport, photo, financial documents and police clearance.",
    passport_requirement: COMMON_PASSPORT,
    photo_requirement: "2×2 inch white background matte color photo.",
    nid_or_birth_certificate: COMMON_NID,
    bank_statement: COMMON_BANK_STMT + " Sponsor's bank statement with minimum USD 5,000 equivalent.",
    bank_solvency: COMMON_SOLVENCY,
    job_certificate: "Parent/sponsor job certificate.",
    trade_license: "Sponsor trade license if business.",
    student_id: "All previous academic certificates (SSC, HSC, Bachelor's) with transcripts. Notarised English translation if needed.",
    invitation_letter: "Original admission letter / bonafide certificate from the Indian institution.",
    medical_documents: "Medical fitness & HIV test report.",
    hotel_booking: "Hostel allotment letter or accommodation arrangement.",
    air_ticket_booking: "Travel booking copy.",
    travel_