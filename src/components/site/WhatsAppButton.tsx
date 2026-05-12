import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { whatsappLink } from "@/lib/site-config";

export function WhatsAppFloat({ message }: { message?: string }) {
  return (
    <motion.a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 14 }}
      whileHover={{ scale: 1.1, rotate: 6 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 left-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift ring-4 ring-[#25D366]/20"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.6} />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30" />
    </motion.a>
  );
}

export function WhatsAppButton({
  message, children = "WhatsApp", className = "",
}: { message?: string; children?: React.ReactNode; className?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5 ${className}`}
    >
      <MessageCircle className="h-4 w-4" /> {children}
    </a>
  );
}
