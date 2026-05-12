import { motion } from "framer-motion";
import { Plane, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Animated map showing planes departing from Dhaka (DAC) to multiple
 * destinations on a real equirectangular world map.
 *
 * Coordinate math (viewBox 1000×500, source map 4378×2434):
 *   x = (lon + 180) * 2.7778
 *   y = (90 - lat) * 3.0875 - 28   // -28 trims polar padding to fit 500 tall
 */

type Dest = {
  code: string;
  name: string;
  flag: string;
  x: number;
  y: number;
  delay: number;
};

const DHAKA = { code: "DAC", name: "Dhaka", x: 751, y: 177 };

const DESTS: Dest[] = [
  { code: "DXB", name: "Dubai",        flag: "🇦🇪", x: 654, y: 172, delay: 0.0 },
  { code: "JED", name: "Jeddah",       flag: "🇸🇦", x: 609, y: 191, delay: 0.5 },
  { code: "IST", name: "Istanbul",     flag: "🇹🇷", x: 580, y: 124, delay: 1.0 },
  { code: "LHR", name: "London",       flag: "🇬🇧", x: 499, y: 91,  delay: 1.5 },
  { code: "JFK", name: "New York",     flag: "🇺🇸", x: 294, y: 124, delay: 2.0 },
  { code: "YYZ", name: "Toronto",      flag: "🇨🇦", x: 279, y: 116, delay: 2.5 },
  { code: "BKK", name: "Bangkok",      flag: "🇹🇭", x: 779, y: 208, delay: 0.3 },
  { code: "KUL", name: "Kuala Lumpur", flag: "🇲🇾", x: 782, y: 242, delay: 0.8 },
  { code: "SIN", name: "Singapore",    flag: "🇸🇬", x: 788, y: 246, delay: 1.3 },
  { code: "NRT", name: "Tokyo",        flag: "🇯🇵", x: 888, y: 140, delay: 1.8 },
  { code: "SYD", name: "Sydney",       flag: "🇦🇺", x: 920, y: 354, delay: 2.3 },
];

/** Quadratic bezier control point that arcs *upwards* from the midpoint. */
function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const lift = Math.min(140, Math.max(30, dist * 0.28));
  return { d: `M ${a.x} ${a.y} Q ${mx} ${my - lift} ${b.x} ${b.y}` };
}

/** Stylized plane silhouette (tip points to the right at 0deg). */
const PLANE_PATH =
  "M22 2 L4 9 L-6 8 L-6 11 L4 12 L0 18 L3 18 L9 13 L18 14 L22 11 Z";

export function FlightPath() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--ink-deep)] py-20 text-white md:py-28">
      {/* Aurora glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-[color:var(--brand-orange)]/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[color:var(--brand-blue)]/25 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Heading */}
        <div className="mb-10 grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white/85 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--brand-orange)] opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--brand-orange)]" />
              </span>
              Live · From Dhaka to the world
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.05] md:text-5xl">
              From <span className="text-gradient-brand">Bangladesh</span>,<br />
              to anywhere on the map.
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/75">
              We fly travelers from Dhaka to 30+ countries every week — watch
              our planes take off in real time.
            </p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <div className="inline-flex flex-col gap-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">Hub</span>
              <span className="font-display text-2xl font-extrabold">Dhaka · DAC 🇧🇩</span>
              <span className="text-xs text-white/70">Hazrat Shahjalal Intl. Airport</span>
            </div>
          </div>
        </div>

        {/* Map canvas */}
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[28px] border border-white/15 bg-[radial-gradient(ellipse_at_center,rgba(40,80,170,0.35),rgba(6,10,28,0.98))] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          {/* Subtle lat/lon grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "5% 10%",
            }}
          />

          <svg
            viewBox="0 0 1000 500"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="path-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F58220" stopOpacity="0.15" />
                <stop offset="55%" stopColor="#F58220" stopOpacity="1" />
                <stop offset="100%" stopColor="#2A9DF4" stopOpacity="1" />
              </linearGradient>
              <radialGradient id="dot-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#F58220" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#F58220" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="dest-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#2A9DF4" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#2A9DF4" stopOpacity="0" />
              </radialGradient>
              <filter id="map-tint">
                {/* Recolor the grey world map to a soft cyan tone */}
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.55
                          0 0 0 0 0.78
                          0 0 0 0 1
                          0 0 0 0.55 0"
                />
              </filter>
            </defs>

            {/* Real world map as background — equirectangular, slightly cropped to fit 1000x500 */}
            <image
              href="/world-map.svg"
              x="0"
              y="-28"
              width="1000"
              height="556"
              preserveAspectRatio="xMidYMid slice"
              filter="url(#map-tint)"
              opacity="0.55"
            />

            {/* Routes + planes */}
            {DESTS.map((dest) => {
              const { d } = arcPath(DHAKA, dest);
              const totalDur = 6;
              return (
                <g key={dest.code}>
                  {/* Faint baseline path */}
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="0.8"
                    strokeDasharray="2 4"
                  />
                  {/* Animated drawing overlay */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#path-grad)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 1], opacity: [0, 0.95, 0] }}
                    transition={{
                      duration: totalDur,
                      times: [0, 0.6, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: dest.delay,
                    }}
                  />
                  {/* Plane traveling along the path */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration: totalDur,
                      times: [0, 0.05, 0.92, 1],
                      repeat: Infinity,
                      delay: dest.delay,
                    }}
                  >
                    <motion.g
                      style={{
                        offsetPath: `path("${d}")`,
                        offsetRotate: "auto",
                      } as React.CSSProperties}
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      transition={{
                        duration: totalDur,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: dest.delay,
                      }}
                    >
                      {/* Plane glow + silhouette, tip at +x */}
                      <g transform="scale(0.55)">
                        <circle r="14" fill="#F58220" opacity="0.28" />
                        <path
                          d={PLANE_PATH}
                          fill="#FFFFFF"
                          stroke="#F58220"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                      </g>
                    </motion.g>
                  </motion.g>

                  {/* Destination glow + dot + label */}
                  <circle cx={dest.x} cy={dest.y} r="14" fill="url(#dest-glow)" />
                  <circle
                    cx={dest.x}
                    cy={dest.y}
                    r="3.2"
                    fill="#2A9DF4"
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  <text
                    x={dest.x + 7}
                    y={dest.y - 5}
                    fill="rgba(255,255,255,0.95)"
                    fontSize="10.5"
                    fontWeight="700"
                    fontFamily="ui-sans-serif, system-ui"
                    style={{
                      paintOrder: "stroke",
                      stroke: "rgba(8,12,32,0.9)",
                      strokeWidth: 3,
                    } as React.CSSProperties}
                  >
                    {dest.code}
                  </text>
                  {/* Pulse on arrival */}
                  <motion.circle
                    cx={dest.x}
                    cy={dest.y}
                    r={4}
                    fill="none"
                    stroke="#2A9DF4"
                    strokeWidth="1.2"
                    initial={{ r: 4, opacity: 0 }}
                    animate={{ r: [4, 22], opacity: [0.9, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: dest.delay + (totalDur * 0.9),
                      ease: "easeOut",
                    }}
                  />
                </g>
              );
            })}

            {/* Origin: Dhaka */}
            <circle cx={DHAKA.x} cy={DHAKA.y} r="22" fill="url(#dot-glow)" />
            <motion.circle
              cx={DHAKA.x}
              cy={DHAKA.y}
              r={6}
              fill="none"
              stroke="#F58220"
              strokeWidth="1.4"
              animate={{ r: [6, 28], opacity: [0.95, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <circle
              cx={DHAKA.x}
              cy={DHAKA.y}
              r="5"
              fill="#F58220"
              stroke="#fff"
              strokeWidth="1.4"
            />
            <text
              x={DHAKA.x - 6}
              y={DHAKA.y + 22}
              fill="#fff"
              fontSize="13"
              fontWeight="800"
              fontFamily="ui-sans-serif, system-ui"
              style={{
                paintOrder: "stroke",
                stroke: "rgba(8,12,32,0.95)",
                strokeWidth: 3,
              } as React.CSSProperties}
            >
              DAC · Dhaka 🇧🇩
            </text>
          </svg>

          {/* Floating destination chips */}
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap justify-center gap-2 md:inset-x-6 md:bottom-6">
            {DESTS.slice(0, 8).map((d) => (
              <span
                key={d.code}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-md transition hover:border-[color:var(--brand-orange)] hover:bg-white/20"
              >
                <span className="text-sm leading-none">{d.flag}</span>
                DAC → {d.code}
              </span>
            ))}
          </div>
        </div>

        {/* Footer of the map */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 px-6 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-brand">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-extrabold leading-tight">
                {DESTS.length} routes flying right now
              </p>
              <p className="text-xs text-white/65">
                Tickets, visas and ground support — handled end-to-end.
              </p>
            </div>
          </div>
          <Link
            to="/air-ticketing"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(245,130,32,0.6)] transition hover:-translate-y-0.5"
          >
            Book a flight <Plane className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
