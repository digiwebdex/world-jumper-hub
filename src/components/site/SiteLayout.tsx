import { Header } from "./Header";
import { Footer } from "./Footer";
import { FlightPath } from "./FlightPath";
import { WhatsAppFloat } from "./WhatsAppButton";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <FlightPath />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
