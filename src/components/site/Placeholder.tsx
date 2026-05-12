import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";

export default function Placeholder({ title, blurb }: { title: string; blurb?: string }) {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
          Migration in progress
        </p>
        <h1 className="mt-4 text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-muted-foreground">
          {blurb ?? "This page is being reconnected to the new VPS API. Live data will return once the backend is deployed."}
        </p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand">
          Go home
        </Link>
      </div>
    </SiteLayout>
  );
}
