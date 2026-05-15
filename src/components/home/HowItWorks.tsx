import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Browse\nthe Menu",
    description:
      "Explore our full selection of firewood-grilled dishes, platters, and catering options.",
  },
  {
    num: "02",
    title: "Place\nYour Order",
    description:
      "Customize your meal, choose delivery or pickup, and check out in seconds.",
  },
  {
    num: "03",
    title: "Fresh\nDelivery",
    description:
      "We prep your order fresh and get it to your door hot — usually within 30 minutes.",
  },
  {
    num: "04",
    title: "Enjoy\n& Rate",
    description:
      "Savor every bite. Leave a review and help others discover their next favorite.",
  },
];

const HowItWorks = () => {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: "#0e0d0b" }}
    >
      {/* Subtle gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 0%, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
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
              Simple Process
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2
              className="font-display font-bold text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              From craving to
              <br />
              <em
                className="not-italic"
                style={{ color: "hsl(var(--primary))" }}
              >
                doorstep
              </em>
              , in four steps.
            </h2>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold shrink-0 transition-all duration-300"
              style={{ color: "hsl(var(--primary))" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "hsl(var(--primary))";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              Order Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Steps grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative p-8 md:p-10 group transition-all duration-300"
              style={{ backgroundColor: "#0e0d0b" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0e0d0b";
              }}
            >
              {/* Large step number — decorative background */}
              <div
                className="font-display font-bold leading-none mb-8 select-none transition-colors duration-300"
                style={{
                  fontSize: "clamp(4rem, 7vw, 6rem)",
                  color: "#edededc9",
                  lineHeight: 1,
                }}
              >
                {step.num}
              </div>

              {/* Small orange number label */}
              <div
                className="text-xs font-bold tracking-[0.18em] uppercase mb-3"
                style={{
                  color: "hsl(var(--primary))",
                  fontFamily: "var(--font-body)",
                }}
              >
                Step {step.num}
              </div>

              {/* Title */}
              <h3
                className="font-display font-bold text-white mb-4 leading-tight"
                style={{
                  fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                  whiteSpace: "pre-line",
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.42)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {step.description}
              </p>

              {/* Connector arrow — hidden on last item and mobile */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "#0e0d0b",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <ArrowRight
                    className="w-3 h-3"
                    style={{ color: "hsl(var(--primary))" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
