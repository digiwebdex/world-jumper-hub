import { Routes, Route, Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Visa from "@/pages/Visa";
import VisaCountryDetail from "@/pages/VisaCountryDetail";
import VisaServices from "@/pages/VisaServices";
import VisaServiceDetail from "@/pages/VisaServiceDetail";
import Contact from "@/pages/Contact";
import Faq from "@/pages/Faq";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { Tours, Umrah, Medical, AirTicketing } from "@/pages/Packages";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminSignup from "@/pages/admin/AdminSignup";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminVisaCountries from "@/pages/admin/AdminVisaCountries";
import AdminVisaRequirements from "@/pages/admin/AdminVisaRequirements";
import AdminVisaServices from "@/pages/admin/AdminVisaServices";
import AdminVisaServiceEditor from "@/pages/admin/AdminVisaServiceEditor";
import AdminPartners from "@/pages/admin/AdminPartners";
import AdminPackages from "@/pages/admin/AdminPackages";
import AdminInquiries from "@/pages/admin/AdminInquiries";
import AdminSettings from "@/pages/admin/AdminSettings";

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
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/visa" element={<Visa />} />
      <Route path="/visa/services" element={<VisaServices />} />
      <Route path="/visa/services/:slug" element={<VisaServiceDetail />} />
      <Route path="/visa/:slug" element={<VisaCountryDetail />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/umrah" element={<Umrah />} />
      <Route path="/medical-tourism" element={<Medical />} />
      <Route path="/air-ticketing" element={<AirTicketing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/visa-countries" element={<AdminVisaCountries />} />
      <Route path="/admin/visa-requirements" element={<AdminVisaRequirements />} />
      <Route path="/admin/visa-services" element={<AdminVisaServices />} />
      <Route path="/admin/visa-services/new" element={<AdminVisaServiceEditor />} />
      <Route path="/admin/visa-services/:id" element={<AdminVisaServiceEditor />} />
      <Route path="/admin/packages" element={<AdminPackages />} />
      <Route path="/admin/inquiries" element={<AdminInquiries />} />
      <Route path="/admin/settings" element={<AdminSettings />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
