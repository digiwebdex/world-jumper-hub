import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useBlogPostBySlug } from "@/lib/use-blog";
import { usePageTitle } from "@/lib/use-page-title";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, loading, error } = useBlogPostBySlug(slug);

  usePageTitle(
    post?.title ?? "Loading…",
    post?.excerpt || undefined,
    { image: post?.cover_image || undefined, path: `/blog/${slug ?? ""}` }
  );

  const html = useMemo(() => {
    if (!post?.body) return "";
    const raw = marked.parse(post.body, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [post?.body]);

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : error || !post ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center text-muted-foreground">
            Post not found.
          </div>
        ) : (
          <>
            <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
              {post.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-5xl">{post.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: "long" })}
                </span>
              )}
            </div>

            {post.cover_image && (
              <img
                src={post.cover_image} alt={post.title}
                className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-lg"
              />
            )}

            {post.excerpt && (
              <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
            )}

            <div
              className="prose prose-lg mt-8 max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-accent prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </>
        )}
      </article>
    </SiteLayout>
  );
}
