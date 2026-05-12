import { Routes, Route, Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import Placeholder from "@/components/site/Placeholder";

function NotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <Link to="/" className="mt-6 inline-block rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand">
          Go home
        </Link>
      </div>
    </SiteLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="World Jumper Tours & Travels" blurb="Site is being reconnected to the VPS backend. Public pages return shortly." />} />
      <Route path="/about" element={<Placeholder title="About" />} />
      <Route path="/services" element={<Placeholder title="Services" />} />
      <Route path="/visa" element={<Placeholder title="Visa Services" />} />
      <Route path="/tours" element={<Placeholder title="Tour Packages" />} />
      <Route path="/umrah" element={<Placeholder title="Umrah Packages" />} />
      <Route path="/medical-tourism" element={<Placeholder title="Medical Tourism" />} />
      <Route path="/air-ticketing" element={<Placeholder title="Air Ticketing" />} />
      <Route path="/contact" element={<Placeholder title="Contact" />} />
      <Route path="/faq" element={<Placeholder title="FAQ" />} />
      <Route path="/admin/*" element={<Placeholder title="Admin Panel" blurb="Admin pages are being rewired to the VPS API. Available after the next conversion pass." />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
