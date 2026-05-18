// Tiny tabs strip for admin pages.
import { useState, type ReactNode } from "react";

interface Tab { key: string; label: string; node: ReactNode }

export function AdminTabs({ tabs, defaultKey }: { tabs: Tab[]; defaultKey?: string }) {
  const [active, setActive] = useState(defaultKey || tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) || tabs[0];
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
              active === t.key
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{current?.node}</div>
    </div>
  );
}
