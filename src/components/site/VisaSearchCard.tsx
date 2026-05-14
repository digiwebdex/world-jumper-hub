import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { api, type VisaCountry } from "@/lib/api";

const VISA_CATEGORIES = [
  "Tourist Visa",
  "Business Visa",
  "Student Visa",
  "Medical Visa",
  "Family Visit Visa",
  "Work / Employment Visa",
  "Transit Visa",
  "Visa On Arrival",
  "E-Visa",
  "Conference Visa",
  "Hajj / Umrah Visa",
  "Cross Border Visa",
  "Document Legalization",
] as const;

const FALLBACK_COUNTRIES: VisaCountry[] = [
  ["India", "india", "in"],
  ["Thailand", "thailand", "th"],
  ["Malaysia", "malaysia", "my"],
  ["Singapore", "singapore", "sg"],
  ["Indonesia", "indonesia", "id"],
  ["Vietnam", "vietnam", "vn"],
  ["Sri Lanka", "sri-lanka", "lk"],
  ["Nepal", "nepal", "np"],
  ["Bhutan", "bhutan", "bt"],
  ["Maldives", "maldives", "mv"],
  ["China", "china", "cn"],
  ["Japan", "japan", "jp"],
  ["South Korea", "south-korea", "kr"],
  ["United Arab Emirates", "united-arab-emirates", "ae"],
  ["Saudi Arabia", "saudi-arabia", "sa"],
  ["Qatar", "qatar", "qa"],
  ["Oman", "oman", "om"],
  ["Turkey", "turkey", "tr"],
  ["Egypt", "egypt", "eg"],
  ["United Kingdom", "united-kingdom", "gb"],
  ["United States", "united-states", "us"],
  ["Canada", "canada", "ca"],
  ["Australia", "australia", "au"],
  ["New Zealand", "new-zealand", "nz"],
  ["Germany", "germany", "de"],
  ["France", "france", "fr"],
  ["Italy", "italy", "it"],
  ["Spain", "spain", "es"],
  ["Netherlands", "netherlands", "nl"],
  ["Switzerland", "switzerland", "ch"],
  ["Sweden", "sweden", "se"],
  ["Norway", "norway", "no"],
  ["Denmark", "denmark", "dk"],
  ["Finland", "finland", "fi"],
  ["Russia", "russia", "ru"],
  ["South Africa", "south-africa", "za"],
  ["Brazil", "brazil", "br"],
].map(([country_name, slug, cc]) => ({
  id: slug,
  country_name,
  slug,
  flag_url: `https://flagcdn.com/w160/${cc}.png`,
  short_description: null,
  is_featured: false,
  is_active: true,
}));

type FieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, required, children }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-foreground/80">
        {required && <span className="mr-0.5 text-red-500">*</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function Pill({
  children,
  onClick,
  open,
  placeholder,
}: {
  children: React.ReactNode;
  onClick: () => void;
  open: boolean;
  placeholder?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left transition ${
        open
          ? "border-[color:var(--brand-orange)] ring-2 ring-[color:var(--brand-orange)]/20"
          : "border-border hover:border-[color:var(--brand-blue-deep)]/40"
      }`}
    >
      <span
        className={`truncate text-sm font-semibold ${
          placeholder ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {children}
      </span>
      <ChevronDown
        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function Dropdown({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-40 max-h-72 overflow-y-auto rounded-xl border border-border bg-white p-1.5 shadow-[0_-20px_50px_-12px_rgba(8,12,32,0.25)]"
      >
        {children}
      </motion.div>
    </>
  );
}

function Option({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition ${
        active
          ? "bg-[color:var(--brand-blue-deep)]/5 font-semibold text-[color:var(--brand-blue-deep)]"
          : "text-foreground hover:bg-[color:var(--cream)]"
      }`}
    >
      {children}
    </button>
  );
}

export function VisaSearchCard({ bare = false }: { bare?: boolean } = {}) {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [destSlug, setDestSlug] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [openDest, setOpenDest] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [destQuery, setDestQuery] = useState("");
  const [catQuery, setCatQuery] = useState("");

  const filteredCountries = useMemo(() => {
    const q = destQuery.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.country_name.toLowerCase().includes(q));
  }, [countries, destQuery]);

  const filteredCategories = useMemo(() => {
    const q = catQuery.trim().toLowerCase();
    if (!q) return VISA_CATEGORIES as readonly string[];
    return (VISA_CATEGORIES as readonly string[]).filter((c) =>
      c.toLowerCase().includes(q),
    );
  }, [catQuery]);

  useEffect(() => {
    api
      .get<{ countries: VisaCountry[] }>("/visa-countries")
      .then((r) => {
        const list = r.countries || [];
        setCountries(list.length ? list : FALLBACK_COUNTRIES);
      })
      .catch(() => setCountries(FALLBACK_COUNTRIES));
  }, []);

  const selectedDest = useMemo(
    () => countries.find((c) => c.slug === destSlug) || null,
    [countries, destSlug],
  );

  function handleSubmit() {
    if (!destSlug) {
      setOpenDest(true);
      return;
    }
    const qs = category ? `?type=${encodeURIComponent(category)}` : "";
    navigate(`/visa/${destSlug}${qs}`);
  }

  const inner = (
    <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
        {/* Citizen — fixed Bangladesh */}
        <Field label="I'm a Citizen of" required>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[color:var(--cream)] px-3.5 py-2.5">
            <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
              <img
                src="https://flagcdn.com/w40/bd.png"
                alt="Bangladesh"
                className="h-4 w-6 rounded-sm object-cover"
              />
              Bangladesh
            </span>
          </div>
        </Field>

        {/* Destination */}
        <Field label="Traveling to" required>
          <div className="relative">
            <Pill
              open={openDest}
              placeholder={!selectedDest}
              onClick={() => {
                setOpenDest((v) => !v);
                setOpenCat(false);
              }}
            >
              {selectedDest ? (
                <span className="flex items-center gap-2.5">
                  {selectedDest.flag_url && (
                    <img
                      src={selectedDest.flag_url}
                      alt={selectedDest.country_name}
                      className="h-4 w-6 rounded-sm object-cover"
                    />
                  )}
                  {selectedDest.country_name}
                </span>
              ) : (
                "Select country"
              )}
            </Pill>
            <Dropdown open={openDest} onClose={() => setOpenDest(false)}>
              {countries.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">Loading countries…</p>
              ) : (
                countries.map((c) => (
                  <Option
                    key={c.id}
                    active={c.slug === destSlug}
                    onClick={() => {
                      setDestSlug(c.slug);
                      setOpenDest(false);
                    }}
                  >
                    {c.flag_url && (
                      <img
                        src={c.flag_url}
                        alt={c.country_name}
                        className="h-4 w-6 rounded-sm object-cover"
                      />
                    )}
                    {c.country_name}
                  </Option>
                ))
              )}
            </Dropdown>
          </div>
        </Field>

        {/* Category */}
        <Field label="Visa Category">
          <div className="relative">
            <Pill
              open={openCat}
              placeholder={!category}
              onClick={() => {
                setOpenCat((v) => !v);
                setOpenDest(false);
              }}
            >
              {category || "Visa Category (optional)"}
            </Pill>
            <Dropdown open={openCat} onClose={() => setOpenCat(false)}>
              <Option
                active={category === ""}
                onClick={() => {
                  setCategory("");
                  setOpenCat(false);
                }}
              >
                <span className="text-muted-foreground">Any category</span>
              </Option>
              {VISA_CATEGORIES.map((c) => (
                <Option
                  key={c}
                  active={category === c}
                  onClick={() => {
                    setCategory(c);
                    setOpenCat(false);
                  }}
                >
                  {c}
                </Option>
              ))}
            </Dropdown>
          </div>
        </Field>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="group inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-blue-deep)] px-6 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(20,40,90,0.55)] transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-orange)] md:w-auto"
        >
          <Search className="h-4 w-4" />
          Check Details
        </button>
      </div>
  );

  if (bare) return inner;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white p-6 text-foreground shadow-[0_30px_80px_-20px_rgba(8,12,32,0.55)] md:p-7">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-brand" />
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-orange)]">
        Visa Quick Check
      </p>
      <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight text-foreground md:text-[1.6rem]">
        Find your visa requirements in 30 seconds
      </h3>
      <div className="mt-5">{inner}</div>
    </div>
  );
}
