import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { ICON_NAMES } from "@/lib/visa-services-db";
import { Loader2, Plus, Trash2, ArrowLeft, Save } from "lucide-react";

type FormState = {
  slug: string; number: string; title: string; short_title: string;
  tagline: string; summary: string; icon: string; intro: string;
  highlights: string[]; process: { step: string; detail: string }[];
  who_is_it_for: string[]; faqs: { q: string; a: string }[];
  display_order: number; published: boolean;
};

const empty: FormState = {
  slug: "", number: "", title: "", short_title: "", tagline: "", summary: "",
  icon: "Globe2", intro: "", highlights: [""], process: [{ step: "", detail: "" }],
  who_is_it_for: [""], faqs: [{ q: "", a: "" }], display_order: 99, published: true,
};

export default function AdminVisaServiceEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === "new";
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    supabase.from("visa_services").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
      if (error || !data) { setErr("Service not found"); setLoading(false); return; }
      setForm({
        slug: data.slug, number: data.number, title: data.title, short_title: data.short_title,
        tagline: data.tagline, summary: data.summary, icon: data.icon, intro: data.intro,
        highlights: (data.highlights as string[]) || [""],
        process: (data.process as { step: string; detail: string }[]) || [{ step: "", detail: "" }],
        who_is_it_for: (data.who_is_it_for as string[]) || [""],
        faqs: (data.faqs as { q: string; a: string }[]) || [{ q: "", a: "" }],
        display_order: data.display_order, published: data.published,
      });
      setLoading(false);
    });
  }, [id, isNew]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    const payload = {
      ...form,
      highlights: form.highlights.filter(Boolean),
      who_is_it_for: form.who_is_it_for.filter(Boolean),
      process: form.process.filter(p => p.step || p.detail),
      faqs: form.faqs.filter(f => f.q || f.a),
    };
    const res = isNew
      ? await supabase.from("visa_services").insert(payload).select("id").single()
      : await supabase.from("visa_services").update(payload).eq("id", id!).select("id").single();
    setBusy(false);
    if (res.error) { setErr(res.error.message); return; }
    navigate("/admin/visa-services");
  };

  if (loading) return <AdminShell title="Edit Service"><Loader2 className="h-5 w-5 animate-spin" /></AdminShell>;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(s => ({ ...s, [k]: v }));
  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) =>
    <input {...props} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />;
  const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) =>
    <textarea {...props} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />;
  const Label = ({ children }: { children: React.ReactNode }) =>
    <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">{children}</label>;

  return (
    <AdminShell title={isNew ? "New Visa Service" : "Edit Visa Service"}>
      <Link to="/admin/visa-services" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back to list
      </Link>
      <form onSubmit={save} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Basics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Title</Label><Input required value={form.title} onChange={e => set("title", e.target.value)} /></div>
            <div><Label>Short Title</Label><Input value={form.short_title} onChange={e => set("short_title", e.target.value)} /></div>
            <div><Label>Slug (URL)</Label><Input required pattern="[a-z0-9-]+" value={form.slug} onChange={e => set("slug", e.target.value)} /></div>
            <div><Label>Number</Label><Input value={form.number} onChange={e => set("number", e.target.value)} placeholder="01" /></div>
            <div>
              <Label>Icon</Label>
              <select value={form.icon} onChange={e => set("icon", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {ICON_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={e => set("display_order", parseInt(e.target.value) || 0)} /></div>
            <div className="md:col-span-2"><Label>Tagline</Label><Input value={form.tagline} onChange={e => set("tagline", e.target.value)} /></div>
            <div className="md:col-span-2"><Label>Summary</Label><Textarea rows={3} value={form.summary} onChange={e => set("summary", e.target.value)} /></div>
            <div className="md:col-span-2"><Label>Intro (long description)</Label><Textarea rows={5} value={form.intro} onChange={e => set("intro", e.target.value)} /></div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input id="pub" type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} />
              <label htmlFor="pub" className="text-sm">Published (visible on site)</label>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <ArraySection title="Highlights"
          items={form.highlights}
          onAdd={() => set("highlights", [...form.highlights, ""])}
          onRemove={(i) => set("highlights", form.highlights.filter((_, x) => x !== i))}
          render={(v, i) => <Input value={v} onChange={e => {
            const next = [...form.highlights]; next[i] = e.target.value; set("highlights", next);
          }} />}
        />

        {/* Process */}
        <ArraySection title="Process Steps"
          items={form.process}
          onAdd={() => set("process", [...form.process, { step: "", detail: "" }])}
          onRemove={(i) => set("process", form.process.filter((_, x) => x !== i))}
          render={(v, i) => (
            <div className="grid gap-2 md:grid-cols-3">
              <Input placeholder="Step name" value={v.step} onChange={e => {
                const next = [...form.process]; next[i] = { ...v, step: e.target.value }; set("process", next);
              }} />
              <div className="md:col-span-2">
                <Input placeholder="Detail" value={v.detail} onChange={e => {
                  const next = [...form.process]; next[i] = { ...v, detail: e.target.value }; set("process", next);
                }} />
              </div>
            </div>
          )}
        />

        {/* Who Is It For */}
        <ArraySection title="Who Is It For"
          items={form.who_is_it_for}
          onAdd={() => set("who_is_it_for", [...form.who_is_it_for, ""])}
          onRemove={(i) => set("who_is_it_for", form.who_is_it_for.filter((_, x) => x !== i))}
          render={(v, i) => <Input value={v} onChange={e => {
            const next = [...form.who_is_it_for]; next[i] = e.target.value; set("who_is_it_for", next);
          }} />}
        />

        {/* FAQs */}
        <ArraySection title="FAQs"
          items={form.faqs}
          onAdd={() => set("faqs", [...form.faqs, { q: "", a: "" }])}
          onRemove={(i) => set("faqs", form.faqs.filter((_, x) => x !== i))}
          render={(v, i) => (
            <div className="space-y-2">
              <Input placeholder="Question" value={v.q} onChange={e => {
                const next = [...form.faqs]; next[i] = { ...v, q: e.target.value }; set("faqs", next);
              }} />
              <Textarea rows={2} placeholder="Answer" value={v.a} onChange={e => {
                const next = [...form.faqs]; next[i] = { ...v, a: e.target.value }; set("faqs", next);
              }} />
            </div>
          )}
        />

        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="sticky bottom-4 flex justify-end gap-2">
          <Link to="/admin/visa-services" className="rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium">Cancel</Link>
          <button disabled={busy} type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isNew ? "Create" : "Save Changes"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

function ArraySection<T>({ title, items, onAdd, onRemove, render }: {
  title: string; items: T[]; onAdd: () => void; onRemove: (i: number) => void;
  render: (v: T, i: number) => React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
        <button type="button" onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">{render(v, i)}</div>
            <button type="button" onClick={() => onRemove(i)}
              className="rounded-md border border-destructive/30 p-2 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
