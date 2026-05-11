import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";

export function WhatsAppFloat({ message }: { message?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export function WhatsAppButton({
  message,
  children = "WhatsApp",
  className = "",
}: {
  message?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] ${className}`}
    >
      <MessageCircle className="h-4 w-4" /> {children}
    </a>
  );
}
