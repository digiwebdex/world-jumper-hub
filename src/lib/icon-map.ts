// Maps CMS icon name strings to lucide-react icon components.
import {
  Plane, Stamp, MapPin, Stethoscope, Moon, Ticket, ShieldCheck, Clock,
  HeartHandshake, Globe2, Sparkles, FileCheck2, Send, PhoneCall, Search,
  Hotel, Star, Award, Users, Briefcase, Heart, CheckCircle2, Compass,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Plane, Stamp, MapPin, Stethoscope, Moon, Ticket, ShieldCheck, Clock,
  HeartHandshake, Globe2, Sparkles, FileCheck2, Send, PhoneCall, Search,
  Hotel, Star, Award, Users, Briefcase, Heart, CheckCircle2, Compass,
};

export function iconFor(name: string | null | undefined, fallback: LucideIcon = Globe2): LucideIcon {
  if (!name) return fallback;
  return MAP[name] ?? fallback;
}
