import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, PrimaryButton } from "@/components/admin/form-bits";
import { api } from "@/lib/api";
import { useBlogPosts } from "@/lib/use-blog";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AdminBlog() {
  const { data: posts, loading, reload } = useBlogPosts(true);
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (id: string, current: boolean) => {
    setBusy(id);
    try {
      await api.put(`/blog/${id}`, {
        is_published: !current,
        published_at: !current ? new Date().toISOString() : null,
      });
      await reload();
    } finally { setBusy(null); }
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setBusy(id);
    try {
      await api.delete(`/blog/${id}`);
      await reload();
    } finally { setBusy(null); }
  };

  return (
    <AdminShell title="Blog Posts">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
        <Link to="/admin/blog/new">
          <PrimaryButton><Plus className="h-4 w-4" /> New post</PrimaryButton>
        </Link>
      </div>

      <Card>
        {loading && posts.length === 0 ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
            No posts yet. Click <strong>New post</strong> to write the first one.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-muted">
                  {p.cover_image && <img src={p.cover_image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${p.is_published ? "" : "text-muted-foreground"}`}>
                    {p.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    <span className="font-mono">/{p.slug}</span> · {p.category} · {p.author}
                    {p.published_at && ` · ${new Date(p.published_at).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggle(p.id, p.is_published)} disabled={busy === p.id}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
                    title={p.is_published ? "Unpublish" : "Publish"}>
                    {p.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <Link to={`/admin/blog/${p.id}`} className="rounded p-1.5 text-muted-foreground hover:bg-muted" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button onClick={() => remove(p.id, p.title)} disabled={busy === p.id}
                    className="rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminShell>
  );
}
