import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Adebayo K.",
    initials: "AK",
    rating: 5,
    comment:
      "Best firewood kebab I've had outside of a proper grill house. Delivery was fast and everything arrived piping hot.",
    date: "2 days ago",
    dish: "Firewood Mixed Grill",
  },
  {
    name: "Fatima O.",
    initials: "FO",
    rating: 5,
    comment:
      "Amazing flavors — you can actually taste the wood smoke. Ordered twice in one week already.",
    date: "1 week ago",
    dish: "Lamb Kofta Platter",
  },
  {
    name: "Chidi N.",
    initials: "CN",
    rating: 5,
    comment:
      "Great portions, excellent taste. The catering option for our office event was a massive hit.",
    date: "2 weeks ago",
    dish: "Catering Package",
  },
];

const AGGREGATE = { rating: 4.9, count: "2,000+" };

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  AK: { bg: "hsl(var(--primary) / 0.18)", text: "hsl(var(--primary))" },
  FO: { bg: "hsl(40 95% 75% / 0.2)", text: "hsl(40 95% 50%)" },
  CN: { bg: "hsl(150 70% 50% / 0.15)", text: "hsl(150 70% 45%)" },
};

const StarRow = ({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) => {
  const cls = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cls}
          style={
            i < rating
              ? {
                  fill: "hsl(var(--warm-gold))",
                  color: "hsl(var(--warm-gold))",
                }
              : { color: "hsl(var(--muted-foreground))", opacity: 0.3 }
          }
        />
      ))}
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Subtle glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 120% 50% at 50% 50%, hsl(var(--primary) / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
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
              Reviews
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <h2
                className="font-display font-bold leading-tight mb-3"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                What Our Customers Say
              </h2>
              <p
                className="text-sm"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Real reviews from real food lovers
              </p>
            </div>

            {/* Aggregate rating badge — refined */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-5 px-7 py-5 rounded-2xl shrink-0 self-start md:self-auto transition-all duration-300"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                boxShadow: "var(--shadow-card)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-elevated)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
            >
              <div>
                <p
                  className="font-display font-bold leading-none mb-1.5"
                  style={{
                    fontSize: "2.25rem",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {AGGREGATE.rating}
                </p>
                <StarRow rating={5} size="sm" />
              </div>
              <div
                className="w-px self-stretch"
                style={{ background: "hsl(var(--border))" }}
              />
              <div>
                <p
                  className="font-bold text-xl leading-none mb-1"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {AGGREGATE.count}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  happy orders
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => {
            const avatarStyle = AVATAR_COLORS[review.initials] ?? {
              bg: "hsl(var(--muted))",
              text: "hsl(var(--muted-foreground))",
            };

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
                className="flex flex-col rounded-2xl p-7 relative overflow-hidden transition-all duration-300"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "var(--shadow-card)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-elevated)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor =
                    "hsl(var(--primary) / 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "hsl(var(--border))";
                }}
              >
                {/* Decorative quote icon — top right, warmer */}
                <div className="absolute top-5 right-6 opacity-[0.08] pointer-events-none select-none">
                  <Quote
                    className="w-16 h-16"
                    style={{ color: "hsl(var(--primary))" }}
                  />
                </div>

                {/* Stars */}
                <StarRow rating={review.rating} />

                {/* Comment — more vertical space */}
                <p
                  className="text-sm leading-loose flex-1 mt-5 mb-6 relative z-10"
                  style={{ color: "hsl(var(--foreground) / 0.78)" }}
                >
                  "{review.comment}"
                </p>

                {/* Dish tag — warmer styling */}
                <div
                  className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full self-start mb-5 transition-all duration-300"
                  style={{
                    background: "hsl(var(--primary) / 0.12)",
                    color: "hsl(var(--primary))",
                    fontFamily: "var(--font-body)",
                    border: "1px solid hsl(var(--primary) / 0.15)",
                  }}
                >
                  {review.dish}
                </div>

                {/* Reviewer */}
                <div
                  className="flex items-center justify-between pt-5"
                  style={{ borderTop: "1px solid hsl(var(--border))" }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar — polished */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300"
                      style={{
                        background: avatarStyle.bg,
                        color: avatarStyle.text,
                        border: `1px solid ${avatarStyle.bg}`,
                      }}
                    >
                      {review.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-none mb-0.5">
                        {review.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Verified Order
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {review.date}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
