import { motion } from "framer-motion";
import { Plane, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Animated map-style hero showing planes departing from Dhaka (DAC) to
 * multiple destinations on a stylized world map.
 *
 * Coordinates are in a 1000×500 viewBox using a simple equirectangular
 * projection so we can hand-place destinations without a real map library.
 */

type Dest = { code: string; name: string; x: number; y: number; delay: number };

// Dhaka anchor (≈ 90.4°E, 23.7°N → x=752, y=183 on 1000×500 with lon-180→1000)
const DHAKA = { code: "DAC", name: "Dhaka", x: 752, y: 183 };

const DESTS: Dest[] = [
  { code: "DXB", name: "Dubai",      x: 654, y: 215, delay: 0.0 },
  { code: "JED", name: "Jeddah",     x: 612, y: 220, delay: 0.6 },
  { code: "LHR", name: "London",     x: 488, y: 130, delay: 1.2 },
  { code: "JFK", name: "New York",   x: 285, y: 175, delay: 1.8 },
  { code: "BKK", name: "Bangkok",    x: 808, y: 240, delay: 0.3 },
  { code: "SIN", name: "Singapore",  x: 815, y: 290, delay: 0.9 },
  { code: "KUL", name: "Kuala Lumpur",x: 815, y: 280, delay: 1.5 },
  { code: "IST", name: "Istanbul",   x: 580, y: 175, delay: 2.1 },
];

/** Quadratic bezier control point that arcs *upwards* from the midpoint. */
function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  // dx/dy perpendicular vector → lift the curve up by ~18% of the distance
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const lift = Math.min(120, dist * 0.22);
  // Always lift "up" (negative y in SVG)
  const cx = mx;
  const cy = my - lift;
  return { d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`, cx, cy };
}

export function FlightPath() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--ink-deep)] py-20 text-white md:py-28">
      {/* Aurora glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-[color:var(--brand-orange)]/30 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[color:var(--brand-blue)]/30 blur-[140px]" />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

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
              We fly travelers from Dhaka to 30+ countries every week. Tap a
              destination to start planning your route.
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
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[28px] border border-white/15 bg-[radial-gradient(ellipse_at_center,rgba(50,90,180,0.25),rgba(8,12,32,0.95))] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          <svg
            viewBox="0 0 1000 500"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="path-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F58220" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#F58220" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#2A9DF4" stopOpacity="0.95" />
              </linearGradient>
              <radialGradient id="dot-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#F58220" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F58220" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="dest-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#2A9DF4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2A9DF4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Stylized continents — soft shapes only, not geographically exact */}
            <g fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6">
              {/* North America */}
              <path d="M 90 130 Q 180 90 280 110 Q 360 125 360 200 Q 320 250 250 240 Q 180 235 130 220 Q 90 195 90 130 Z" />
              {/* South America */}
              <path d="M 280 280 Q 320 270 340 320 Q 350 380 320 420 Q 290 440 270 410 Q 250 360 280 280 Z" />
              {/* Europe */}
              <path d="M 470 110 Q 540 95 590 120 Q 600 160 560 175 Q 510 175 480 160 Q 460 140 470 110 Z" />
              {/* Africa */}
              <path d="M 510 200 Q 580 195 610 240 Q 620 320 580 380 Q 540 410 515 380 Q 490 320 500 260 Q 495 225 510 200 Z" />
              {/* Middle East */}
              <path d="M 600 195 Q 670 190 690 225 Q 685 260 640 265 Q 605 255 595 225 Z" />
              {/* Asia */}
              <path d="M 680 130 Q 800 110 880 150 Q 900 200 860 240 Q 800 260 740 245 Q 690 230 670 195 Q 665 160 680 130 Z" />
              {/* SE Asia */}
              <path d="M 800 260 Q 860 260 870 300 Q 850 330 810 320 Q 790 295 800 260 Z" />
              {/* Australia */}
              <path d="M 850 360 Q 910 350 925 390 Q 910 425 870 420 Q 835 405 850 360 Z" />
            </g>

            {/* Routes + planes */}
            {DESTS.map((dest, i) => {
              const { d } = arcPath(DHAKA, dest);
              const totalDur = 5; // seconds for one full flight
              return (
                <g key={dest.code}>
                  {/* Faint baseline path */}
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                  {/* Animated dash overlay (drawing effect) */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#path-grad)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
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
                      times: [0, 0.05, 0.95, 1],
                      repeat: Infinity,
                      delay: dest.delay,
                    }}
                  >
                    <motion.g
                      style={{ offsetPath: `path("${d}")`, offsetRotate: "auto" } as React.CSSProperties}
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      transition={{
                        duration: totalDur,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: dest.delay,
                      }}
                    >
                      {/* triangle plane icon */}
                      <g transform="translate(-7,-7)">
                        <circle cx="7" cy="7" r="11" fill="#F58220" opacity="0.25" />
                        <path
                          d="M 0 7 L 14 2 L 14 5 L 6 7 L 14 9 L 14 12 Z"
                          fill="#FFFFFF"
                          stroke="#F58220"
                          strokeWidth="0.8"
                        />
                      </g>
                    </motion.g>
                  </motion.g>

                  {/* Destination dot + label */}
                  <circle cx={dest.x} cy={dest.y} r="14" fill="url(#dest-glow)" />
                  <circle cx={dest.x} cy={dest.y} r="3.5" fill="#2A9DF4" stroke="#fff" strokeWidth="1" />
                  <text
                    x={dest.x + 8}
                    y={dest.y - 6}
                    fill="rgba(255,255,255,0.95)"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="ui-sans-serif, system-ui"
                    style={{ paintOrder: "stroke", stroke: "rgba(8,12,32,0.85)", strokeWidth: 3 } as React.CSSProperties}
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
                      delay: dest.delay + 4.4,
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
              animate={{ r: [6, 26], opacity: [0.9, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <circle cx={DHAKA.x} cy={DHAKA.y} r="5" fill="#F58220" stroke="#fff" strokeWidth="1.4" />
            <text
              x={DHAKA.x - 4}
              y={DHAKA.y + 22}
              fill="#fff"
              fontSize="13"
              fontWeight="800"
              fontFamily="ui-sans-serif, system-ui"
              style={{ paintOrder: "stroke", stroke: "rgba(8,12,32,0.9)", strokeWidth: 3 } as React.CSSProperties}
            >
              DAC · Dhaka
            </text>
          </svg>

          {/* Floating chips overlay */}
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap justify-center gap-2 md:inset-x-6 md:bottom-6">
            {DESTS.slice(0, 6).map((d) => (
              <span
                key={d.code}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-md transition hover:border-[color:var(--brand-orange)] hover:bg-white/20"
              >
                <Plane className="h-3 w-3 text-[color:var(--brand-orange)]" />
                DAC → {d.code}
              </span>
            ))}
          </div>
        </div>

        {/* Footer of the map: live counter */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 px-6 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-brand">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-extrabold leading-tight">8 routes flying right now</p>
              <p className="text-xs text-white/65">Tickets, visas and ground support — handled end-to-end.</p>
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
