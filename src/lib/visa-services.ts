// Visa services content adapted from VISAThing's Bangladesh services catalogue.
// Used to drive /visa/services index, /visa/services/:slug detail pages, and header dropdown.

import {
  Compass,
  Globe2,
  FileCheck2,
  Mail,
  Stamp,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type VisaService = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  icon: LucideIcon;
  intro: string;
  highlights: string[];
  process: { step: string; detail: string }[];
  whoIsItFor: string[];
  faqs: { q: string; a: string }[];
};

export const VISA_SERVICES: VisaService[] = [
  {
    slug: "visa-consultancy",
    number: "01",
    title: "Visa Consultancy",
    shortTitle: "Visa Consultancy",
    tagline: "Begin your worldwide journey with expert guidance.",
    summary:
      "Our consultancy ensures smooth visa processing in Bangladesh. Professionals assess your profile and provide an accurate, embassy-compliant application method.",
    icon: Compass,
    intro:
      "World Jumper's visa consultancy is the right starting point for anyone travelling abroad from Bangladesh. We study the destination's current immigration policy, evaluate your personal and financial profile, and design a paperwork strategy that maximises approval chances — for tourist, business, student, family, work or medical visas.",
    highlights: [
      "Country-specific eligibility & risk profiling",
      "Personalised document checklist for every applicant",
      "Embassy / VFS appointment coordination",
      "Cover letter, itinerary & financial story drafting",
      "Mock interview for student & work visa applicants",
    ],
    process: [
      { step: "Discovery call", detail: "30-minute consultation to understand your destination, purpose and timeline." },
      { step: "Profile audit", detail: "We review passport history, financials, employment and any prior refusals." },
      { step: "Document plan", detail: "You receive a tailored checklist with formats, translations and notarisation needs." },
      { step: "Filing strategy", detail: "Application form filling, supporting letters, biometrics booking and fee handling." },
      { step: "Decision support", detail: "We track the file till passport return and help with re-applications if needed." },
    ],
    whoIsItFor: [
      "First-time travellers unsure where to start",
      "Applicants with previous visa refusals",
      "Students preparing for September / January intakes",
      "Business travellers with tight timelines",
    ],
    faqs: [
      {
        q: "Do you guarantee visa approval?",
        a: "No legitimate agency can guarantee approval — embassies hold the final decision. We do guarantee an embassy-compliant file and honest profile assessment.",
      },
      {
        q: "Can I get consultancy without filing through you?",
        a: "Yes. Standalone consultancy is available as a paid one-off session, and the fee is adjustable if you later use our processing service.",
      },
    ],
  },
  {
    slug: "cross-border-visa-processing",
    number: "02",
    title: "Cross-Border Visa Processing",
    shortTitle: "Cross-Border Processing",
    tagline: "Apply to embassies in India — without leaving Bangladesh.",
    summary:
      "Many countries do not have an embassy in Dhaka and accept Bangladeshi applications only from missions in New Delhi, Kolkata or Mumbai. We handle the cross-border filing for you.",
    icon: Globe2,
    intro:
      "Several destinations — including a number of Schengen states, Latin American and African countries — process Bangladeshi passports only from their missions in India. Our cross-border desk takes ownership of the entire pipeline so you do not need to travel to India just to lodge an application.",
    highlights: [
      "Coverage of embassies in New Delhi, Kolkata and Mumbai",
      "Indian transit visa support where required",
      "Authorised representative submission",
      "Courier-tracked passport movement with insurance",
      "Real-time status updates on WhatsApp",
    ],
    process: [
      { step: "Eligibility check", detail: "We confirm the destination accepts third-country submissions and list the exact mission in India." },
      { step: "Document compilation", detail: "Full file is prepared in Dhaka including translations and apostilles." },
      { step: "Indian leg", detail: "Our partner office in India lodges the application as your authorised agent." },
      { step: "Biometrics & interview", detail: "If personal appearance is required, we coordinate appointment dates that suit your schedule." },
      { step: "Passport return", detail: "Decided passport is couriered back to our Dhaka office and handed over to you." },
    ],
    whoIsItFor: [
      "Travellers to countries without a Dhaka embassy",
      "Applicants who cannot afford a separate India trip",
      "Companies sending staff abroad on tight deadlines",
    ],
    faqs: [
      {
        q: "Do I still need an Indian visa?",
        a: "Only if the embassy demands a personal appearance. If submission is document-only, we file as your representative without you needing to travel.",
      },
      {
        q: "How long does cross-border processing take?",
        a: "Typically 3–6 weeks depending on the destination embassy's workload, plus 4–7 days of courier and handling time.",
      },
    ],
  },
  {
    slug: "visa-processing-in-bangladesh",
    number: "03",
    title: "Visa Processing in Bangladesh",
    shortTitle: "In-Bangladesh Processing",
    tagline: "Skip the embassy queue — we file on your behalf.",
    summary:
      "For destinations whose embassies or VFS centres are based in Bangladesh, we receive your file, screen it for compliance and submit it as your authorised agent.",
    icon: FileCheck2,
    intro:
      "World Jumper's in-Bangladesh processing is built for travellers who want a hands-off experience. We collect your documents, audit them against the latest embassy checklist, complete forms accurately, pay government fees and submit the file at the right counter.",
    highlights: [
      "Door-step or office collection of documents",
      "Form filling for embassy & VFS portals",
      "Embassy / service-centre fee payment",
      "Biometrics appointment booking",
      "Passport pickup & secure handover",
    ],
    process: [
      { step: "Document drop", detail: "Submit originals and supporting copies at our office or via courier." },
      { step: "Compliance review", detail: "Each page is checked against the embassy's current rule book." },
      { step: "Online filing", detail: "Application forms are filled and fees paid through your name on the official portal." },
      { step: "Submission day", detail: "We attend the embassy / VFS counter as your authorised agent." },
      { step: "Status tracking", detail: "We monitor the application and notify you the moment a decision is issued." },
    ],
    whoIsItFor: [
      "Busy professionals with no time to stand in queues",
      "Senior travellers and family groups",
      "Repeat business travellers seeking a fixed-fee service",
    ],
    faqs: [
      {
        q: "Will I still need to give biometrics in person?",
        a: "Yes — biometric capture must be done by the applicant. We book the slot and accompany you on the day.",
      },
      {
        q: "Is the embassy fee included?",
        a: "Embassy / VFS fees are billed at actual cost, separate from our service charge. You receive original receipts.",
      },
    ],
  },
  {
    slug: "evisa-processing",
    number: "04",
    title: "E-Visa Processing",
    shortTitle: "E-Visa Processing",
    tagline: "Fast electronic visas — delivered to your inbox.",
    summary:
      "Many countries now issue electronic visas. We handle the online application, pay the official fee and deliver the approved e-visa straight to your email.",
    icon: Mail,
    intro:
      "E-visa systems remove the embassy visit altogether — but they punish small mistakes with hard rejections. Our e-visa desk fills every field correctly, uploads documents in the right format, and tracks the approval until your visa lands in your inbox, ready to print.",
    highlights: [
      "Coverage for Turkey, UAE, Bahrain, Vietnam, Sri Lanka, Cambodia, Kenya and more",
      "Photo & passport-scan formatting included",
      "Application reviewed before submission",
      "Approval letter delivered as PDF + printout",
      "Express options where the destination allows",
    ],
    process: [
      { step: "Eligibility check", detail: "We confirm your passport qualifies for the destination's e-visa scheme." },
      { step: "Document prep", detail: "Photos, scans and supporting letters are formatted to spec." },
      { step: "Online filing", detail: "Application is lodged on the official government portal under your name." },
      { step: "Fee payment", detail: "Government fee is paid via secure card, with receipt shared." },
      { step: "Delivery", detail: "Approved e-visa PDF is emailed and a printed copy handed over." },
    ],
    whoIsItFor: [
      "Last-minute holiday travellers",
      "Frequent business flyers to the Middle East & Asia",
      "Families travelling together to e-visa destinations",
    ],
    faqs: [
      {
        q: "How fast is an e-visa issued?",
        a: "Anywhere from a few hours (UAE, Turkey) to 3–5 working days (Vietnam, Sri Lanka, Kenya). We always quote the realistic window before you pay.",
      },
      {
        q: "Do I need to print the e-visa?",
        a: "Yes — most airlines still ask for a printed copy at boarding. We provide both PDF and a printed copy.",
      },
    ],
  },
  {
    slug: "document-legalization",
    number: "05",
    title: "Document Legalization",
    shortTitle: "Document Legalization",
    tagline: "Apostille, attestation and embassy legalisation — handled.",
    summary:
      "Legalisation, apostille, authentication and notarisation of commercial and non-commercial documents from the Ministry of Foreign Affairs Bangladesh and diplomatic offices.",
    icon: Stamp,
    intro:
      "Studying abroad, opening a foreign branch office, exporting goods or sponsoring a relative — almost all require Bangladeshi documents to be legalised before a foreign authority will accept them. We manage the full chain: notary, MoFA Dhaka, and the destination embassy (in Dhaka or in India).",
    highlights: [
      "Educational, personal & commercial documents",
      "MoFA Bangladesh attestation",
      "Embassy legalisation in Dhaka or via India",
      "Apostille for Hague-Convention countries",
      "Sworn translation arrangements where required",
    ],
    process: [
      { step: "Document audit", detail: "We confirm which authority chain your destination accepts." },
      { step: "Notary & home ministry", detail: "Where required, documents are notarised and routed via the Home / Education Ministry." },
      { step: "MoFA attestation", detail: "Ministry of Foreign Affairs Bangladesh seal is obtained on each document." },
      { step: "Embassy / Apostille", detail: "Final embassy legalisation or Apostille is completed in Dhaka or India." },
      { step: "Hand-over", detail: "Originals are returned with a signed delivery sheet and digital copies." },
    ],
    whoIsItFor: [
      "Students enrolling in foreign universities",
      "Professionals applying for work permits abroad",
      "Exporters and corporate clients",
      "Families processing marriage, birth or NOC documents",
    ],
    faqs: [
      {
        q: "How long does full legalisation take?",
        a: "Local chain (Notary + MoFA) takes 5–7 working days. Embassy step depends on the country — typically another 5–15 working days.",
      },
      {
        q: "Can you handle Apostille for Hague-convention destinations?",
        a: "Yes. Bangladesh's Apostille mechanism is now active for several countries and we process it end to end.",
      },
    ],
  },
  {
    slug: "express-consultation",
    number: "06",
    title: "Express Consultation",
    shortTitle: "Express Consultation",
    tagline: "Need a visa fast? Comprehensive guidance within 24 hours.",
    summary:
      "Tight deadline, urgent embassy appointment or unfinished documents? Our express consultancy delivers an expert review and filing plan within 24 hours.",
    icon: Zap,
    intro:
      "Visa officers worldwide are tightening scrutiny — every supporting document, social profile and statement is being read carefully. When you do not have time to figure things out, our Express Consultation puts a senior consultant on your file inside 24 hours, builds a defensible application story and gets you ready for submission.",
    highlights: [
      "24-hour senior consultant assignment",
      "Same-day document gap analysis",
      "Cover letter, itinerary & sponsor letter drafting",
      "Profile clean-up advice (LinkedIn, social, financial)",
      "Priority filing slots where available",
    ],
    process: [
      { step: "Hour 0", detail: "You share passport, purpose of travel and any existing documents." },
      { step: "Hour 4", detail: "Senior consultant calls back with a gap analysis and required actions." },
      { step: "Hour 12", detail: "All draft letters, statements and translations are sent for your sign-off." },
      { step: "Hour 24", detail: "Final file is locked, fees are paid and submission is scheduled." },
    ],
    whoIsItFor: [
      "Last-minute conference / business trips",
      "Medical-emergency travel",
      "Applicants with embassy appointments inside a week",
      "Re-applications after a recent refusal",
    ],
    faqs: [
      {
        q: "Is express consultation more expensive?",
        a: "Yes, it carries a priority fee on top of the standard consultancy charge — we quote it transparently before starting.",
      },
      {
        q: "Can you guarantee submission within 24 hours?",
        a: "We guarantee a complete file ready for submission within 24 hours; the actual embassy slot depends on availability.",
      },
    ],
  },
];

export function getVisaService(slug: string): VisaService | undefined {
  return VISA_SERVICES.find((s) => s.slug === slug);
}
