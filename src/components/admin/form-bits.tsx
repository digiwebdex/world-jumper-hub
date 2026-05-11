import type { ReactNode } from "react";

export function Field({
  label, name, type = "text", defaultValue, placeholder, required, full, textarea, options, rows = 3,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | boolean | null;
  placeholder?: string;
  required?: boolean;
  full?: boolean;
  textarea?: boolean;
  options?: readonly string[];
  rows?: number;
}) {
  const cls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground/80">
        {label}{required && <span className="text-destructive"> *</span>}
      </label>
      {options ? (
        <select name={name} defaultValue={String(defaultValue ?? "")} className={cls}>
          <option value="">Select...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "checkbox" ? (
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <input type="checkbox" name={name} defaultChecked={Boolean(defaultValue)} value="true" className="h-4 w-4 accent-[var(--brand-blue)]" />
          <span className="text-muted-foreground">{placeholder ?? "Enabled"}</span>
        </label>
      ) : textarea ? (
        <textarea name={name} rows={rows} defaultValue={String(defaultValue ?? "")} placeholder={placeholder} className={cls} />
      ) : (
        <input
          name={name} type={type} required={required}
          defaultValue={defaultValue == null ? "" : String(defaultValue)}
          placeholder={placeholder} className={cls}
        />
      )}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">{children}</div>
  );
}

export function PrimaryButton({ children, onClick, type = "button", disabled }: {
  children: ReactNode; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-brand disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button
      type={type} onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
    >
      {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children, wide }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10">
      <div className={`w-full ${wide ? "max-w-4xl" : "max-w-2xl"} rounded-2xl bg-card shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">{children}</div>;
}
