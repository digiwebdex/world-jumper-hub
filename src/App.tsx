import { Routes, Route, Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";

import HomePage from "@/routes/index";
import AboutPage from "@/routes/about";
import ServicesPage from "@/routes/services";
import VisaPage from "@/routes/visa";
import ToursPage from "@/routes/tours";
import UmrahPage from "@/routes/umrah";
import MedicalPage from "@/routes/medical-tourism";
import AirTicketPage from "@/routes/air-ticketing";
import ContactPage from "@/routes/contact";
import FaqPage from "@/routes/faq";

import LoginPage from "@/routes/admin.login";
import Dashboard from "@/routes/admin.index";
import VisaCountriesAdmin from "@/routes/admin.visa-countries";
import VisaReqAdmin from "@/routes/admin.visa-requirements";
import PackagesAdmin from "@/routes/admin.packages";
import InquiriesAdmin from "@/routes/admin.inquiries";
import SettingsAdmin from "@/routes/admin.settings";

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
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/visa" element={<VisaPage />} />
      <Route path="/tours" element={<ToursPage />} />
      <Route path="/umrah" element={<UmrahPage />} />
      <Route path="/medical-tourism" element={<MedicalPage />} />
      <Route path="/air-ticketing" element={<AirTicketPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />

      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/visa-countries" element={<VisaCountriesAdmin />} />
      <Route path="/admin/visa-requirements" element={<VisaReqAdmin />} />
      <Route path="/admin/packages" element={<PackagesAdmin />} />
      <Route path="/admin/inquiries" element={<InquiriesAdmin />} />
      <Route path="/admin/settings" element={<SettingsAdmin />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
