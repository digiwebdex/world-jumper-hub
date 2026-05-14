import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { api, type VisaCountry } from "@/lib/api";
import { FALLBACK_COUNTRIES } from "@/lib/fallback-countries";

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

const Pill = ({
  children,
  onClick,
  open,
  placeholder,
  pillRef,
}: {
  children: React.ReactNode;
  onClick: () => void;
  open: boolean;
  placeholder?: boolean;
  pillRef?: React.Ref<HTMLButtonElement>;
}) => {
  return (
    <button
      ref={pillRef}
      type="button"
      onClick={onClick}
        className={`group flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left transition ${
        open
          ? "border-[color:var(--brand-orange)] ring-2 ring-[color:var(--brand-orange)]/20"
          : "border-border hover:border-[color:var(--brand-blue-deep)]/40"
      }`}
    >
      <span
        className={`min-w-0 truncate text-sm font-semibold ${
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
};

function Dropdown({
  open,
  onClose,
  anchorRef,
  children,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    placement: "bottom" | "top";
  } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const gap = 8;
      const margin = 12;
      const spaceBelow = vh - rect.bottom - gap - margin;
      const spaceAbove = rect.top - gap - margin;
      const placement: "bottom" | "top" = spaceBelow >= 280 || spaceBelow >= spaceAbove ? "bottom" : "top";
      const maxHeight = Math.max(220, Math.min(560, placement === "bottom" ? spaceBelow : spaceAbove));
      const minWidth = Math.max(rect.width, 260);
      const width = Math.min(minWidth, vw - margin * 2);
      let left = rect.left;
      if (left + width > vw - margin) left = Math.max(margin, vw - margin - width);
      const top = placement === "bottom" ? rect.bottom + gap : rect.top - gap - 0; // top is bottom of menu when placement=top
      setPos({ top, left, width, maxHeight, placement });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  const style: React.CSSProperties = pos
    ? pos.placement === "bottom"
      ? { top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }
      : { top: pos.top - pos.maxHeight, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }
    : { visibility: "hidden" };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        style={style}
        className="fixed z-[70] overflow-y-auto overscroll-contain rounded-xl border border-border bg-white p-1.5 shadow-[0_24px_60px_-16px_rgba(8,12,32,0.28)] scrollbar-thin scrollbar-thumb-[color:var(--brand-blue-deep)]/30 scrollbar-track-transparent [scrollbar-gutter:stable]"
      >
        {children}
      </motion.div>
    </>,
    document.body,
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
    <div className="grid w-full min-w-0 gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.55fr)_minmax(0,1.3fr)_auto] md:items-end">
        {/* Citizen — fixed Bangladesh */}
        <Field label="I'm a Citizen of" required>
          <div className="flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-[color:var(--cream)] px-4">
            <span className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-foreground">
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
              <div className="sticky top-0 z-10 -mx-1 mb-1 bg-white px-1 pb-2">
                <input
                  autoFocus
                  type="text"
                  value={destQuery}
                  onChange={(e) => setDestQuery(e.target.value)}
                  placeholder="Search country…"
                  className="w-full rounded-lg border border-border bg-[color:var(--cream)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand-blue-deep)]"
                />
              </div>
              {countries.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">Loading countries…</p>
              ) : filteredCountries.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">No countries match “{destQuery}”.</p>
              ) : (
                filteredCountries.map((c) => (
                  <Option
                    key={c.id}
                    active={c.slug === destSlug}
                    onClick={() => {
                      setDestSlug(c.slug);
                      setOpenDest(false);
                      setDestQuery("");
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
              <div className="sticky top-0 z-10 -mx-1 mb-1 bg-white px-1 pb-2">
                <input
                  autoFocus
                  type="text"
                  value={catQuery}
                  onChange={(e) => setCatQuery(e.target.value)}
                  placeholder="Search visa category…"
                  className="w-full rounded-lg border border-border bg-[color:var(--cream)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand-blue-deep)]"
                />
              </div>
              <Option
                active={category === ""}
                onClick={() => {
                  setCategory("");
                  setOpenCat(false);
                  setCatQuery("");
                }}
              >
                <span className="text-muted-foreground">Any category</span>
              </Option>
              {filteredCategories.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">No categories match “{catQuery}”.</p>
              ) : (
                filteredCategories.map((c) => (
                  <Option
                    key={c}
                    active={category === c}
                    onClick={() => {
                      setCategory(c);
                      setOpenCat(false);
                      setCatQuery("");
                    }}
                  >
                    {c}
                  </Option>
                ))
              )}
            </Dropdown>
          </div>
        </Field>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="group inline-flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-blue-deep)] px-5 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(20,40,90,0.55)] transition hover:-translate-y-0.5 hover:bg-[color:var(--brand-orange)] md:w-auto md:min-w-[150px]"
        >
          <Search className="h-4 w-4" />
          Check Details
        </button>
      </div>
  );

  if (bare) return inner;

  return (
    <div className="relative rounded-3xl border border-white/15 bg-white p-6 text-foreground shadow-[0_30px_80px_-20px_rgba(8,12,32,0.55)] md:p-7">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-brand" />
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
