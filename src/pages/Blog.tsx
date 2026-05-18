import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, SectionHeading } from "@/components/site/ui";
import { useBlogPosts } from "@/lib/use-blog";
import { useSeo } from "@/lib/use-seo";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";

export default function Blog() {
  useSeo("blog", {
    title: "Travel Blog & Visa News",
    description: "Visa updates, travel tips, country guides and Umrah news from World Jumper Tours & Travels, Bangladesh.",
    path: "/blog",
  });

  const { data: posts, loading } = useBlogPosts();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Stories & updates"
        title="World Jumper Blog"
        subtitle="Visa news, country guides and travel know-how from our consultants."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeading
            eyebrow="Latest posts"
            title="Read what's new"
            intro="Updates from our visa desk and travel team."
          />
          <div className="mt-10">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center text-muted-foreground">
                No posts published yet. Check back soon.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      {p.cover_image ? (
                        <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                          World Jumper
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <span className="inline-flex w-fit rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                        {p.category}
                      </span>
                      <h2 className="text-lg font-bold leading-snug group-hover:text-accent">{p.title}</h2>
                      {p.excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>}
                      <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {p.author}</span>
                          {p.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(p.published_at).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
