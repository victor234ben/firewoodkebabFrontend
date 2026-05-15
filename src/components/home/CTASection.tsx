import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "#0e0d0b" }}
    >
      {/* Warm ambient orange glow — more prominent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, hsl(var(--primary) / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* Top border line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />

      <div className="relative z-10 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Flame icon accent — enhanced glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 mx-auto transition-all duration-300"
            style={{
              background: "hsl(var(--primary) / 0.16)",
              border: "1px solid hsl(var(--primary) / 0.3)",
              boxShadow: "0 0 24px hsl(var(--primary) / 0)",
            }}
            whileHover={{
              boxShadow: "0 0 24px hsl(var(--primary) / 0.4)",
            }}
          >
            <Flame className="w-7 h-7 text-primary" />
          </motion.div>

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="block w-8 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
            <span
              className="text-[11px] font-semibold tracking-[0.22em] uppercase"
              style={{
                color: "hsl(var(--primary))",
                fontFamily: "var(--font-body)",
              }}
            >
              Ready to Order?
            </span>
            <span
              className="block w-8 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
          </div>

          {/* Headline */}
          <h2
            className="font-display font-bold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Hungry? We're
            <br />
            <em className="not-italic" style={{ color: "hsl(var(--primary))" }}>
              already firing up
            </em>{" "}
            the grill.
          </h2>

          {/* Subtext */}
          <p
            className="text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-body)",
            }}
          >
            Order online for delivery or pickup. Freshly grilled, straight to
            your door.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/menu">
              <Button
                size="lg"
                className="px-10 rounded-xl font-semibold text-base transition-all duration-300"
                style={{
                  background: "hsl(var(--primary))",
                  boxShadow: "0 8px 28px hsl(var(--primary) / 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px hsl(var(--primary) / 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px hsl(var(--primary) / 0.4)";
                }}
              >
                Order Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/menu#catering">
              <Button
                size="lg"
                variant="ghost"
                className="px-10 rounded-xl font-semibold text-base transition-all duration-300"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.boxShadow =
                    "0 0 16px hsl(var(--primary) / 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                  e.currentTarget.style.background = "rgba(255,255,255,0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Catering Enquiry
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
