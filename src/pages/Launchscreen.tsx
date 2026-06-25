import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import logoWhite from "@/assets/logo_white.png";
import { APP_NAME } from "@/utils/constants";

const PRIMARY = "#e8702a";
const PRIMARY_DIM = "rgba(232,112,42,0.15)";
const PRIMARY_BORDER = "rgba(232,112,42,0.25)";
const BG = "#0e0d0b";
const WHITE_45 = "rgba(255,255,255,0.45)";
const WHITE_08 = "rgba(255,255,255,0.08)";
const WHITE_12 = "rgba(255,255,255,0.12)";

// Particle dots floating up
const FloatingParticle = ({ style }: { style: any }) => (
  <motion.div
    style={{
      position: "absolute",
      width: 3,
      height: 3,
      borderRadius: "50%",
      background: PRIMARY,
      opacity: 0,
      ...style,
    }}
    animate={{
      y: [0, -120],
      opacity: [0, 0.6, 0],
      scale: [1, 0.4],
    }}
    transition={{
      duration: style.duration,
      delay: style.delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const particles = Array.from({ length: 12 }, (_, i) => ({
  left: `${20 + i * 5.5}%`,
  bottom: "10%",
  duration: 2.8 + (i % 4) * 0.6,
  delay: i * 0.35,
}));

export default function LaunchScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        padding: "2rem 1.5rem",
      }}
    >
      {/* ── Ambient glow layers ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 55% at 50% 80%, rgba(232,112,42,0.13) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 50% 35% at 50% 10%, rgba(232,112,42,0.06) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Floating embers ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {particles.map((p, i) => (
          <FloatingParticle key={i} style={p} />
        ))}
      </div>

      {/* ── Top border line ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent, ${WHITE_12}, transparent)`,
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 620,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Flame icon hero */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            marginBottom: 32,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 18px rgba(232,112,42,0.2)",
                "0 0 36px rgba(232,112,42,0.45)",
                "0 0 18px rgba(232,112,42,0.2)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 22,
              background: PRIMARY_DIM,
              border: `1px solid ${PRIMARY_BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
             <img
              src={logoWhite}
              alt={APP_NAME}
              className="h-[84px] w-auto block transition-opacity duration-200"
              height={52}
            />
          </motion.div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ width: 32, height: 1, background: PRIMARY }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: PRIMARY,
            }}
          >
            Coming Soon
          </span>
          <div style={{ width: 32, height: 1, background: PRIMARY }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.05,
            margin: "0 0 20px",
            fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          We're Almost{" "}
          <em style={{ fontStyle: "normal", color: PRIMARY }}>Ready</em>
          <br />
          to Fire It Up.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: WHITE_45,
            maxWidth: 420,
            margin: "0 auto 40px",
          }}
        >
          We're putting the finishing touches on our kitchen. Get ready to experience authentic world cuisine crafted with love and the finest ingredients.
        </motion.p>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.36 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(232,112,42,0.10)",
            border: `1px solid ${PRIMARY_BORDER}`,
            borderRadius: 100,
            padding: "8px 18px",
            marginBottom: 44,
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: PRIMARY,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, color: PRIMARY, fontWeight: 600 }}>
            Opening soon - in progress
          </span>
        </motion.div>

        {/* Static coming soon notice */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.44 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            maxWidth: 320,
            margin: "0 auto",
            padding: "12px 24px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${WHITE_12}`,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <Clock size={16} style={{ color: PRIMARY }} />
          <span>Launch Date to be Announced</span>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{
            height: 1,
            background: `linear-gradient(to right, transparent, ${WHITE_08}, transparent)`,
            margin: "48px auto",
            maxWidth: 320,
          }}
        />

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.68 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {[
            "🔥 Firewood Grilled",
            "🚀 Fast Delivery",
            "🌿 Fresh Daily",
            "🍽️ Catering Available",
          ].map((label) => (
            <span
              key={label}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "7px 16px",
                borderRadius: 100,
                background: WHITE_08,
                border: `1px solid ${WHITE_12}`,
                color: WHITE_45,
                letterSpacing: "0.03em",
              }}
            >
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom footer line ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          position: "absolute",
          bottom: "2rem",
          fontSize: 12,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.05em",
        }}
      >
        © {new Date().getFullYear()} {APP_NAME}. Coming soon.
      </motion.div>
    </div>
  );
}
