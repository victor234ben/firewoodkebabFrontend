import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/utils/constants";
import heroBg from "@/assets/hero-bg.jpg";

const STATS = [
  { num: "4.9", suffix: "★", label: "Rating" },
  { num: "2K+", suffix: "", label: "Happy Orders" },
  { num: "30", suffix: "min", label: "Avg. Delivery" },
];

const HeroSection = () => {
  return (
    <section
     className="relative min-h-[80vh] md:min-h-screen flex overflow-hidden"
      style={{ backgroundColor: "#0e0d0b" }}
    >
      {/* ── MOBILE background image (ENHANCED VISIBILITY) ── */}
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <img
          src={heroBg}
          alt=""
          aria-hidden
          className="w-full h-full object-cover opacity-35"
        />
        {/* Warm overlay instead of plain dark */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0e0d0b]/50 via-[#1a1410]/30 to-[#0e0d0b]/80"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,13,11,0.5), rgba(26,20,16,0.35), rgba(14,13,11,0.85))",
          }}
        />
        {/* Warm glow accent at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 60% at 50% 100%, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── LEFT CONTENT PANEL ── */}
      <div className="relative z-10 mb:mt-10 flex flex-col justify-center w-full lg:w-[54%] px-6 sm:px-12 lg:px-20 xl:px-28 py-24 lg:py-0">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="flex items-center gap-3 mb-10"
        >
          {/* Placeholder for optional eyebrow */}
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="font-bebas text-white leading-[1.05] mb-4"
          style={{ fontSize: "clamp(4rem, 6vw, 5.9rem)", fontWeight: 800 }}
        >
          Grilled Over
          <br />
          <em className="not-italic text-primary">Open Fire.</em>
          <br />
          Delivered&nbsp;Fresh.
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="text-white/45 text-base md:text-lg leading-relaxed mb-12 max-w-sm font-body"
        >
          {APP_TAGLINE}
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="mb-10 max-w-[500px]"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/menu" className="shrink-0">
              <Button
                size="lg"
                className="w-full sm:w-auto h-full rounded-xl font-semibold text-sm py-4 transition-all duration-300"
                style={{
                  background: "hsl(var(--primary))",
                  boxShadow: "0 8px 24px hsl(var(--primary) / 0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px hsl(var(--primary) / 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px hsl(var(--primary) / 0.35)";
                }}
              >
                Order Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.52 }}
          className="flex items-center gap-8 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {STATS.map(({ num, suffix, label }) => (
            <div key={label}>
              <p className="text-white font-oswald font-bold text-xl leading-none mb-1">
                {num}
                <span className="text-primary text-base">{suffix}</span>
              </p>
              <p className="text-white/35 text-xs font-body">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT IMAGE PANEL (desktop only, ENHANCED) ── */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%] pointer-events-none">
        <img
          src={heroBg}
          alt="Firewood grilled kebab"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Enhanced left-to-right blend with warmer tones */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #0e0d0b 0%, rgba(14,13,11,0.7) 30%, rgba(14,13,11,0.3) 65%, transparent 90%)",
          }}
        />

        {/* Warm glow accent at bottom-right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 70% 90%, hsl(var(--primary) / 0.12) 0%, transparent 65%)",
          }}
        />

        {/* Bottom vignette with warmth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(14,13,11,0.8) 0%, rgba(26,20,16,0.2) 40%, transparent 70%)",
          }}
        />

        {/* Floating signature dish card — ENHANCED */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.55 }}
          className="absolute bottom-12 right-10 rounded-2xl p-5 pointer-events-auto transition-all duration-300 hover:shadow-lg"
          style={{
            background: "rgba(14,13,11,0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 48px rgba(0,0,0,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                background: "hsl(var(--primary) / 0.18)",
                border: "1px solid hsl(var(--primary) / 0.25)",
              }}
            >
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">
                Signature
              </p>
              <p className="text-white text-sm font-semibold">
                Firewood Mixed Grill
              </p>
            </div>
          </div>
          {/* Star rating under */}
          <div
            className="flex items-center gap-1 mt-4 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
            ))}
            <span className="text-white/40 text-[11px] ml-1">Top rated</span>
          </div>
        </motion.div>

        {/* Small "scroll" hint top-right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute top-10 right-10 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
          <span className="text-white/25 text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center mt-1">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
