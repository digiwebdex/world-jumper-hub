// Generic admin editor for any "simple list" CMS table.
// Renders a list with reorder/toggle/delete + a form modal for create/edit.
import { useState } from "react";
import { api } from "@/lib/api";
import type { ListRow } from "@/lib/cms-hooks";
import { Field, PrimaryButton, GhostButton, Modal, Card } from "@/components/admin/form-bits";
import { ImageField } from "@/components/admin/ImageField";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Loader2, Save, X } from "lucide-react";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "image";
  placeholder?: string;
  rows?: number;
  full?: boolean;
  options?: readonly string[];
  default?: string | number | boolean | null;
}

interface Props<T extends ListRow> {
  basePath: string;       // e.g. "/home/stats"
  rows: T[];
  loading: boolean;
  reload: () => void | Promise<void>;
  fields: FieldDef[];
  rowLabel: (r: T) => string;
  rowSubLabel?: (r: T) => string;
}

export function CmsListEditor<T extends ListRow>({
  basePath, rows, loading, reload, fields, rowLabel, rowSubLabel,
}: Props<T>) {
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);

  const startCreate = () => { setEditing(null); setCreating(true); };
  const cancel = () => { setEditing(null); setCreating(false); };

  const save = async (form: HTMLFormElement) => {
    const fd = new FormData(form);
    const body: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = fd.get(f.name);
      if (raw == null) continue;
      const s = String(raw).trim();
      if (f.type === "number") body[f.name] = s === "" ? 0 : Number(s);
      else body[f.name] = s === "" ? (f.default ?? "") : s;
    }
    body.display_order = Number(fd.get("display_order") ?? 0);
    body.is_active = fd.get("is_active") === "true";

    try {
      if (editing) {
        await api.put(`${basePath}/${editing.id}`, body);
      } else {
        const nextOrder = rows.length ? Math.max(...rows.map(r => r.display_order)) + 10 : 10;
        if (!body.display_order) body.display_order = nextOrder;
        await api.post(basePath, body);
      }
      cancel();
      await reload();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const toggle = async (r: T) => {
    setBusy(r.id);
    try {
      await api.put(`${basePath}/${r.id}`, { is_active: !r.is_active });
      await reload();
    } finally { setBusy(null); }
  };

  const move = async (r: T, dir: -1 | 1) => {
    setBusy(r.id);
    try {
      await api.put(`${basePath}/${r.id}`, { display_order: r.display_order + dir * 15 });
      await reload();
    } finally { setBusy(null); }
  };

  const remove = async (r: T) => {
    if (!confirm(`Delete "${rowLabel(r)}"?`)) return;
    setBusy(r.id);
    try {
      await api.delete(`${basePath}/${r.id}`);
      await reload();
    } finally { setBusy(null); }
  };

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} item{rows.length === 1 ? "" : "s"}</p>
        <PrimaryButton onClick={startCreate}><Plus className="h-4 w-4" /> Add</PrimaryButton>
      </div>

      {loading && rows.length === 0 ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          No items yet. Click <strong>Add</strong> to create the first one.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-2.5">
              <span className="w-10 font-mono text-xs text-muted-foreground">{r.display_order}</span>
              <div className="flex-1 min-w-0">
                <p className={`truncate text-sm font-medium ${r.is_active ? "" : "text-muted-foreground line-through"}`}>{rowLabel(r)}</p>
                {rowSubLabel && <p className="truncate text-xs text-muted-foreground">{rowSubLabel(r)}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => move(r, -1)} disabled={busy === r.id} className="rounded p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50" title="Move up"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(r, 1)} disabled={busy === r.id} className="rounded p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50" title="Move down"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => toggle(r)} disabled={busy === r.id} className="rounded p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50" title={r.is_active ? "Hide" : "Show"}>
                  {r.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing(r)} className="rounded p-1.5 text-muted-foreground hover:bg-muted" title="Edit"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(r)} disabled={busy === r.id} className="rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={creating || editing !== null} onClose={cancel} title={editing ? "Edit item" : "New item"} wide>
        <form onSubmit={(e) => { e.preventDefault(); save(e.currentTarget); }} className="grid gap-4 md:grid-cols-2">
          {fields.map((f) => (
            f.type === "image" ? (
              <ImageField
                key={f.name}
                label={f.label}
                name={f.name}
                full={f.full}
                defaultValue={editing ? (editing[f.name] as string | null) : ""}
              />
            ) : (
              <Field
                key={f.name}
                label={f.label}
                name={f.name}
                type={f.type === "textarea" ? "text" : (f.type ?? "text")}
                textarea={f.type === "textarea"}
                rows={f.rows}
                placeholder={f.placeholder}
                full={f.full}
                options={f.options}
                defaultValue={editing ? (editing[f.name] as string | number | null) : (f.default ?? "")}
              />
            )
          ))}
          <Field
            label="Display order"
            name="display_order"
            type="number"
            defaultValue={editing?.display_order ?? 0}
          />
          <Field
            label="Active"
            name="is_active"
            type="checkbox"
            placeholder="Show on site"
            defaultValue={editing ? editing.is_active : true}
          />
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <GhostButton onClick={cancel}><X className="h-4 w-4" /> Cancel</GhostButton>
            <PrimaryButton type="submit"><Save className="h-4 w-4" /> Save</PrimaryButton>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
