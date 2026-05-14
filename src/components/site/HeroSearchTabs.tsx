import { useState } from "react";
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
} from "lucide-react";
import { VisaSearchCard } from "./VisaSearchCard";

type TabKey = "visa" | "tours" | "umrah" | "medical" | "airticket";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "visa", label: "Visa Quick Check", icon: Plane },
  { key: "tours", label: "Tours", icon: MapPinned },
  { key: "umrah", label: "Umrah", icon: Moon },
  { key: "medical", label: "Medical", icon: Stethoscope },
  { key: "airticket", label: "Air Ticket", icon: Ticket },
];

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

function SubmitBtn({ onClick, label = "Search" }: { onClick: () => void; label?: string }) {
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

function CardShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white p-6 text-foreground shadow-[0_30px_80px_-20px_rgba(8,12,32,0.55)] md:p-7">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-brand" />
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-orange)]">
        {kicker}
      </p>
      <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight text-foreground md:text-[1.6rem]">
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ToursForm() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState("2");

  const submit = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (date) params.set("date", date);
    if (travelers) params.set("travelers", travelers);
    navigate(`/tours${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <CardShell kicker="Holiday Tours" title="Discover handpicked tour packages">
      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_0.8fr_auto] md:items-end">
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Destination</FieldLabel>
          <TextInput
            placeholder="e.g. Bali, Maldives, Thailand"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
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
              <option key={n} value={n}>
                {n} {n === 1 ? "Person" : "People"}
              </option>
            ))}
          </SelectInput>
        </div>
        <SubmitBtn onClick={submit} label="Find Tours" />
      </div>
    </CardShell>
  );
}

function UmrahForm() {
  const navigate = useNavigate();
  const [pkg, setPkg] = useState("");
  const [month, setMonth] = useState("");
  const [pax, setPax] = useState("1");

  const submit = () => {
    const params = new URLSearchParams();
    if (pkg) params.set("package", pkg);
    if (month) params.set("month", month);
    if (pax) params.set("pax", pax);
    navigate(`/umrah${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <CardShell kicker="Umrah Packages" title="Plan a blessed Umrah journey">
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
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </SelectInput>
        </div>
        <SubmitBtn onClick={submit} label="View Packages" />
      </div>
    </CardShell>
  );
}

function MedicalForm() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [treatment, setTreatment] = useState("");

  const submit = () => {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    if (treatment) params.set("treatment", treatment);
    navigate(`/medical-tourism${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <CardShell kicker="Medical Tourism" title="Trusted hospitals abroad — assisted end to end">
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
          <TextInput
            placeholder="e.g. Cardiology, Oncology, Orthopedic"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
          />
        </div>
        <SubmitBtn onClick={submit} label="Get Assistance" />
      </div>
    </CardShell>
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

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const submit = () => {
    const params = new URLSearchParams({
      trip,
      from,
      to,
      depart,
      pax,
    });
    if (trip === "round" && ret) params.set("return", ret);
    navigate(`/air-ticketing?${params}`);
  };

  return (
    <CardShell kicker="Air Ticketing" title="Best fares from 800+ airlines">
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
        <div className="relative flex flex-col gap-1.5 md:col-span-3">
          <FieldLabel required>From</FieldLabel>
          <TextInput
            placeholder="DAC"
            value={from}
            onChange={(e) => setFrom(e.target.value.toUpperCase())}
          />
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
          <TextInput
            placeholder="DXB"
            value={to}
            onChange={(e) => setTo(e.target.value.toUpperCase())}
          />
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
        <div
          className={`flex flex-col gap-1.5 ${trip === "round" ? "md:col-span-1" : "md:col-span-3"}`}
        >
          <FieldLabel>Pax</FieldLabel>
          <SelectInput value={pax} onChange={(e) => setPax(e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="md:col-span-12 md:flex md:justify-end">
          <SubmitBtn onClick={submit} label="Search Flights" />
        </div>
      </div>
    </CardShell>
  );
}

export function HeroSearchTabs() {
  const [active, setActive] = useState<TabKey>("visa");

  return (
    <div className="w-full">
      {/* Tab strip */}
      <div className="mb-3 flex gap-1.5 overflow-x-auto rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition md:text-sm ${
                isActive
                  ? "bg-white text-[color:var(--brand-blue-deep)] shadow-[0_10px_25px_-12px_rgba(8,12,32,0.5)]"
                  : "text-white/85 hover:bg-white/15 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {active === "visa" && <VisaSearchCard />}
          {active === "tours" && <ToursForm />}
          {active === "umrah" && <UmrahForm />}
          {active === "medical" && <MedicalForm />}
          {active === "airticket" && <AirTicketForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
