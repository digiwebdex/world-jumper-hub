import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  MapPinned,
  Moon,
  Stethoscope,
  Ticket,
  Search,
  Calendar,
  ArrowRightLeft,
  Phone,
  Sparkles,
} from "lucide-react";
import { VisaSearchCard } from "./VisaSearchCard";
import { api, type VisaCountry } from "@/lib/api";
import { useHomeQuickTabs } from "@/lib/cms";
import { iconFor } from "@/lib/icon-map";

type TabKey = "visa" | "tours" | "airticket" | "umrah" | "medical";

// Default tab metadata — labels/icons can be overridden by CMS (home_quick_tabs).
// CMS rows are matched by tab_key (visa/tour/air/umrah/medical) and control
// visibility (is_active) and order (display_order).
const DEFAULT_TABS: {
  key: TabKey;
  cmsKey: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  kicker: string;
  title: string;
}[] = [
  { key: "visa",      cmsKey: "visa",    label: "Visa",    icon: Plane,       kicker: "Visa Quick Check", title: "Find your visa requirements in 30 seconds" },
  { key: "tours",     cmsKey: "tour",    label: "Tours",   icon: MapPinned,   kicker: "Holiday Tours",    title: "Discover handpicked tour packages" },
  { key: "airticket", cmsKey: "air",     label: "Air",     icon: Ticket,      kicker: "Air Ticketing",    title: "Best fares from 800+ airlines" },
  { key: "umrah",     cmsKey: "umrah",   label: "Umrah",   icon: Moon,        kicker: "Umrah Packages",   title: "Plan a blessed Umrah journey" },
  { key: "medical",   cmsKey: "medical", label: "Medical", icon: Stethoscope, kicker: "Medical Tourism",  title: "Trusted hospitals abroad — assisted end to end" },
];

/* ---------------- shared input atoms ---------------- */

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[12px] font-semibold text-foreground/80">
      {required && <span className="mr-0.5 text-red-500">*</span>}
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-[42px] w-full rounded-xl border border-border bg-white px-3.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground/70 focus:border-[color:var(--brand-orange)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-orange)]/20"
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-[42px] w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground focus:border-[color:var(--brand-orange)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-orange)]/20"
    />
  );
}

function SubmitBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-blue-deep)] px-6 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(20,40,90,0.55)] transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-orange)] md:w-auto"
    >
      <Search className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ---------------- forms (bare — no card wrapper) ---------------- */

function ToursForm() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState("2");

  const submit = () => {
    const p = new URLSearchParams();
    if (destination) p.set("destination", destination);
    if (date) p.set("date", date);
    if (travelers) p.set("travelers", travelers);
    navigate(`/tours${p.toString() ? `?${p}` : ""}`);
  };

  return (
    <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_0.8fr_auto] md:items-end">
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Destination</FieldLabel>
        <TextInput placeholder="e.g. Bali, Maldives, Thailand" value={destination} onChange={(e) => setDestination(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Travel Date</FieldLabel>
        <div className="relative">
          <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Travelers</FieldLabel>
        <SelectInput value={travelers} onChange={(e) => setTravelers(e.target.value)}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? "Person" : "People"}</option>
          ))}
        </SelectInput>
      </div>
      <SubmitBtn onClick={submit} label="Find Tours" />
    </div>
  );
}

function UmrahForm() {
  const navigate = useNavigate();
  const [pkg, setPkg] = useState("");
  const [month, setMonth] = useState("");
  const [pax, setPax] = useState("1");

  const submit = () => {
    const p = new URLSearchParams();
    if (pkg) p.set("package", pkg);
    if (month) p.set("month", month);
    if (pax) p.set("pax", pax);
    navigate(`/umrah${p.toString() ? `?${p}` : ""}`);
  };

  return (
    <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_0.8fr_auto] md:items-end">
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Package Type</FieldLabel>
        <SelectInput value={pkg} onChange={(e) => setPkg(e.target.value)}>
          <option value="">Select package</option>
          <option>Economy (4★)</option>
          <option>Premium (5★)</option>
          <option>Deluxe (5★ Haram view)</option>
          <option>Family Package</option>
          <option>Ramadan Special</option>
        </SelectInput>
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Departure Month</FieldLabel>
        <TextInput type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Pilgrims</FieldLabel>
        <SelectInput value={pax} onChange={(e) => setPax(e.target.value)}>
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
        </SelectInput>
      </div>
      <SubmitBtn onClick={submit} label="View Packages" />
    </div>
  );
}

function MedicalForm() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [treatment, setTreatment] = useState("");

  const submit = () => {
    const p = new URLSearchParams();
    if (country) p.set("country", country);
    if (treatment) p.set("treatment", treatment);
    navigate(`/medical-tourism${p.toString() ? `?${p}` : ""}`);
  };

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_1.2fr_auto] md:items-end">
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Country</FieldLabel>
        <SelectInput value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select country</option>
          <option>India</option>
          <option>Thailand</option>
          <option>Singapore</option>
          <option>Malaysia</option>
          <option>Turkey</option>
        </SelectInput>
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Treatment / Specialty</FieldLabel>
        <TextInput placeholder="e.g. Cardiology, Oncology, Orthopedic" value={treatment} onChange={(e) => setTreatment(e.target.value)} />
      </div>
      <SubmitBtn onClick={submit} label="Get Assistance" />
    </div>
  );
}

function AirTicketForm() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<"oneway" | "round">("round");
  const [from, setFrom] = useState("DAC");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [pax, setPax] = useState("1");

  const swap = () => { setFrom(to); setTo(from); };

  const submit = () => {
    const p = new URLSearchParams({ trip, from, to, depart, pax });
    if (trip === "round" && ret) p.set("return", ret);
    navigate(`/air-ticketing?${p}`);
  };

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {(["round", "oneway"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTrip(t)}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
              trip === t
                ? "border-[color:var(--brand-blue-deep)] bg-[color:var(--brand-blue-deep)] text-white"
                : "border-border bg-white text-foreground/70 hover:border-[color:var(--brand-blue-deep)]/40"
            }`}
          >
            {t === "round" ? "Round Trip" : "One Way"}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-12 md:items-end">
        <div className="flex flex-col gap-1.5 md:col-span-3">
          <FieldLabel required>From</FieldLabel>
          <TextInput placeholder="DAC" value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} />
        </div>
        <div className="hidden md:col-span-1 md:flex md:justify-center md:pb-2">
          <button
            type="button"
            onClick={swap}
            className="rounded-full border border-border bg-white p-2 text-foreground/70 transition hover:border-[color:var(--brand-orange)] hover:text-[color:var(--brand-orange)]"
            aria-label="Swap"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-3">
          <FieldLabel required>To</FieldLabel>
          <TextInput placeholder="DXB" value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <FieldLabel required>Departure</FieldLabel>
          <TextInput type="date" value={depart} onChange={(e) => setDepart(e.target.value)} />
        </div>
        {trip === "round" && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <FieldLabel>Return</FieldLabel>
            <TextInput type="date" value={ret} onChange={(e) => setRet(e.target.value)} />
          </div>
        )}
        <div className={`flex flex-col gap-1.5 ${trip === "round" ? "md:col-span-1" : "md:col-span-3"}`}>
          <FieldLabel>Pax</FieldLabel>
          <SelectInput value={pax} onChange={(e) => setPax(e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n}</option>)}
          </SelectInput>
        </div>
        <div className="md:col-span-12 md:flex md:justify-end">
          <SubmitBtn onClick={submit} label="Search Flights" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- unified card ---------------- */

export function HeroSearchTabs() {
  const { data: cmsTabs } = useHomeQuickTabs();
  const [active, setActive] = useState<TabKey>("visa");
  const [hotCountries, setHotCountries] = useState<string[]>([]);

  useEffect(() => {
    api
      .get<{ countries: VisaCountry[] }>("/visa-countries")
      .then((r) => setHotCountries((r.countries || []).slice(0, 4).map((c) => c.country_name)))
      .catch(() => setHotCountries(["Thailand", "India", "Malaysia", "Dubai"]));
  }, []);

  // Merge CMS overrides (label/icon) and CMS visibility/order with the defaults.
  const TABS = (() => {
    if (!cmsTabs.length) return DEFAULT_TABS;
    const byKey = new Map(cmsTabs.map((t) => [t.tab_key, t]));
    return DEFAULT_TABS
      .filter((d) => {
        const cms = byKey.get(d.cmsKey);
        return !cms || cms.is_active;
      })
      .map((d) => {
        const cms = byKey.get(d.cmsKey);
        return {
          ...d,
          label: cms?.label || d.label,
          icon: cms?.icon ? iconFor(cms.icon, d.icon) : d.icon,
          order: cms?.display_order ?? 9999,
        };
      })
      .sort((a, b) => a.order - b.order);
  })();

  const activeMeta = TABS.find((t) => t.key === active) ?? TABS[0];
  if (!activeMeta) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white p-5 text-foreground shadow-[0_30px_80px_-20px_rgba(8,12,32,0.55)] md:p-7">
      {/* gradient top bar */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-brand" />

      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-orange)]">
            {activeMeta.kicker}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight text-foreground md:text-[1.6rem]">
            {activeMeta.title}
          </h3>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-[color:var(--cream)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground/70 md:inline-flex">
          <Sparkles className="h-3 w-3 text-[color:var(--brand-orange)]" />
          All-in-one search
        </span>
      </div>

      {/* tab pills — INSIDE the card */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto rounded-2xl bg-[color:var(--cream)] p-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition md:text-[13px] ${
                isActive
                  ? "bg-[color:var(--brand-blue-deep)] text-white shadow-[0_10px_25px_-12px_rgba(8,12,32,0.5)]"
                  : "text-foreground/70 hover:bg-white hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* form area */}
      <div className="mt-5 min-h-[110px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {active === "visa" && <VisaSearchCard bare />}
            {active === "tours" && <ToursForm />}
            {active === "umrah" && <UmrahForm />}
            {active === "medical" && <MedicalForm />}
            {active === "airticket" && <AirTicketForm />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* trust strip */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          12 inquiries today
        </div>
        <a
          href="tel:+8801687072001"
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[color:var(--brand-blue-deep)] hover:text-[color:var(--brand-orange)]"
        >
          <Phone className="h-3.5 w-3.5" />
          01687-072001
        </a>
        {hotCountries.length > 0 && (
          <p className="hidden items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground md:inline-flex">
            <Sparkles className="h-3 w-3 text-[color:var(--brand-orange)]" />
            Now showing <span className="font-bold text-foreground">{hotCountries.join(" · ")}</span>
          </p>
        )}
      </div>
    </div>
  );
}
