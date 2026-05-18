import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Field, PrimaryButton, GhostButton } from "@/components/admin/form-bits";
import { ImageField } from "@/components/admin/ImageField";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/use-blog";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    api.get<{ row: BlogPost }>(`/blog/${id}`)
      .then((r) => setPost(r.row))
      .catch((e) => alert((e as Error).message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      slug: String(fd.get("slug") ?? "").trim().toLowerCase(),
      title: String(fd.get("title") ?? "").trim(),
      excerpt: String(fd.get("excerpt") ?? ""),
      body: String(fd.get("body") ?? ""),
      cover_image: String(fd.get("cover_image") ?? ""),
      author: String(fd.get("author") ?? "World Jumper"),
      category: String(fd.get("category") ?? "General"),
      is_published: fd.get("is_published") === "true",
      published_at: String(fd.get("published_at") ?? "") || null,
      display_order: Number(fd.get("display_order") ?? 0),
    };
    setSaving(true);
    try {
      if (isNew) {
        await api.post<{ id: string }>("/blog", body);
      } else {
        await api.put(`/blog/${id}`, body);
      }
      navigate("/admin/blog");
    } catch (err) {
      alert((err as Error).message);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <AdminShell title="Blog Post">
      <Card><div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div></Card>
    </AdminShell>
  );

  const dt = post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : "";

  return (
    <AdminShell title={isNew ? "New Blog Post" : "Edit Blog Post"}>
      <Link to="/admin/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to posts
      </Link>

      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Title" name="title" required full
            placeholder="Top 10 travel tips for Schengen visa applicants"
            defaultValue={post?.title ?? ""} />
          <Field label="Slug" name="slug" required
            placeholder="schengen-visa-tips"
            defaultValue={post?.slug ?? ""} />
          <Field label="Category" name="category"
            placeholder="Visa Guides / Travel Tips / News"
            defaultValue={post?.category ?? "General"} />
          <Field label="Author" name="author"
            defaultValue={post?.author ?? "World Jumper"} />
          <Field label="Display order" name="display_order" type="number"
            defaultValue={post?.display_order ?? 0} />
          <ImageField label="Cover image" name="cover_image" full category="blog"
            defaultValue={post?.cover_image ?? ""} />
          <Field label="Excerpt" name="excerpt" textarea rows={3} full
            placeholder="1-2 sentences that appear on the listing card"
            defaultValue={post?.excerpt ?? ""} />
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Body (Markdown)
            </label>
            <textarea
              name="body" rows={20}
              defaultValue={post?.body ?? ""}
              placeholder="# Heading&#10;&#10;Write your post in **markdown**. Supports headings, lists, links, images and more."
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Markdown supported. Use <code>![alt](url)</code> for images, <code>[text](url)</code> for links.
            </p>
          </div>
          <Field label="Publish at (date/time, optional)" name="published_at" type="datetime-local"
            defaultValue={dt} />
          <Field label="Published" name="is_published" type="checkbox"
            placeholder="Visible on the live site"
            defaultValue={post?.is_published ?? false} />
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <GhostButton onClick={() => navigate("/admin/blog")}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {isNew ? "Create" : "Save"}
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </AdminShell>
  );
}
