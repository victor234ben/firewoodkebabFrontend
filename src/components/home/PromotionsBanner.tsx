import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { useBanners } from "@/hooks/useApi";

const isActiveBanner = (b) => {
  if (!b.isActive) return false;
  const now = Date.now();
  const start = b.startDate ? new Date(b.startDate).getTime() : 0;
  const end = b.endDate ? new Date(b.endDate).getTime() : Infinity;
  return now >= start && now <= end;
};

// Modal component for full description
const DescriptionModal = ({ banner, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "hsl(var(--card))",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-elevated)",
          border: "1px solid hsl(var(--border))",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
                color: "hsl(var(--foreground))",
                fontFamily: "var(--font-display)",
              }}
            >
              {banner.title}
            </h2>
            <div
              style={{
                display: "inline-block",
                background: "hsl(var(--primary) / 0.12)",
                padding: "6px 12px",
                borderRadius: "8px",
                marginTop: "12px",
                border: "1px solid hsl(var(--primary) / 0.15)",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.12em",
                  color: "hsl(var(--primary))",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-body)",
                }}
              >
                🔥 Special Offer
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              color: "hsl(var(--muted-foreground))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "hsl(var(--foreground))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "hsl(var(--muted-foreground))";
            }}
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Description */}
        <div
          style={{
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              color: "hsl(var(--foreground) / 0.78)",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {banner.description}
          </p>
        </div>

        {/* CTA */}
        {banner.ctaText && (
          <motion.a
            href={banner.ctaLink || "#"}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "10px",
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              width: "fit-content",
              background: "hsl(var(--primary))",
              boxShadow: "0 6px 16px hsl(var(--primary) / 0.4)",
              cursor: "pointer",
              border: "none",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "hsl(var(--primary) / 0.9)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px hsl(var(--primary) / 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "hsl(var(--primary))";
              e.currentTarget.style.boxShadow =
                "0 6px 16px hsl(var(--primary) / 0.4)";
            }}
          >
            {banner.ctaText}
            <ArrowRight size={16} />
          </motion.a>
        )}

        <motion.button
          whileHover={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}
          onClick={onClose}
          style={{
            display: "block",
            marginTop: "1.5rem",
            background: "hsl(var(--muted) / 0.5)",
            border: "1px solid hsl(var(--border))",
            padding: "11px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            color: "hsl(var(--foreground))",
            width: "100%",
            fontFamily: "var(--font-body)",
          }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Truncate description to fit in card
const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const PromoCarousel = () => {
  const { data: banners = [], isLoading } = useBanners();
  const activeBanners = banners || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const autoplayRef = useRef(null);

  const ITEMS_TO_SHOW = 2;
  const AUTOPLAY_DELAY = 6000;
  const BANNER_HEIGHT = 350;

  const maxIndex = Math.max(0, activeBanners.length - ITEMS_TO_SHOW);

  const goNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    resetAutoplay();
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    resetAutoplay();
  };

  const goToIndex = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    resetAutoplay();
  };

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (activeBanners.length > ITEMS_TO_SHOW) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, AUTOPLAY_DELAY);
    }
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [activeBanners.length]);

  if (isLoading || activeBanners.length === 0) return null;

  const totalDots = maxIndex + 1;

  return (
    <>
      <section
        className="section-padding relative overflow-hidden"
        style={{ background: "hsl(var(--background))" }}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 50% at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
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
                Limited Time
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <h2
                  className="font-display font-bold leading-tight mb-3"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  Hot Deals 🔥
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Check out our latest promotions and special offers
                </p>
              </div>

              {/* Navigation Buttons */}
              {activeBanners.length > ITEMS_TO_SHOW && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goPrev}
                    aria-label="Previous promotions"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "hsl(var(--primary) / 0.12)",
                      color: "hsl(var(--primary))",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid hsl(var(--primary) / 0.15)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "hsl(var(--primary) / 0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "hsl(var(--primary) / 0.12)";
                    }}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goNext}
                    aria-label="Next promotions"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "hsl(var(--primary) / 0.12)",
                      color: "hsl(var(--primary))",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid hsl(var(--primary) / 0.15)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "hsl(var(--primary) / 0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "hsl(var(--primary) / 0.12)";
                    }}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Carousel */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "16px",
              marginBottom: "2.5rem",
              boxShadow: "var(--shadow-card)",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                height: `${BANNER_HEIGHT}px`,
                transform: `translateX(-${
                  currentIndex *
                  (100 / ITEMS_TO_SHOW + 20 / activeBanners.length)
                }%)`,
                transition: "transform 0.5s cubic-bezier(0.33, 0, 0.66, 0.33)",
              }}
            >
              {activeBanners.map((banner) => (
                <motion.div
                  key={banner._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  style={{
                    flex: `0 0 calc(${100 / ITEMS_TO_SHOW}% - ${
                      20 / ITEMS_TO_SHOW
                    }px)`,
                    minWidth: 0,
                    height: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "hsl(var(--card))",
                    display: "flex",
                    boxShadow: "var(--shadow-card)",
                    border: "1px solid hsl(var(--border))",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-elevated)";
                    e.currentTarget.style.borderColor =
                      "hsl(var(--primary) / 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                    e.currentTarget.style.borderColor = "hsl(var(--border))";
                  }}
                >
                  {/* LEFT SIDE - CONTENT */}
                  <div
                    style={{
                      flex: "0 0 32%",
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "hsl(var(--card))",
                      zIndex: 3,
                    }}
                  >
                    {/* Top Content */}
                    <div>
                      <div
                        style={{
                          display: "inline-block",
                          background: "hsl(var(--primary) / 0.12)",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          marginBottom: "12px",
                          border: "1px solid hsl(var(--primary) / 0.15)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            letterSpacing: "0.12em",
                            color: "hsl(var(--primary))",
                            textTransform: "uppercase",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          🔥 Promo
                        </span>
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          marginBottom: "10px",
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "hsl(var(--foreground))",
                          lineHeight: "1.3",
                          fontFamily: "var(--font-display)",
                        }}
                        className="line-clamp-2"
                      >
                        {banner.title}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "hsl(var(--muted-foreground))",
                          lineHeight: "1.5",
                        }}
                      >
                        {truncateText(banner.description, 100)}
                      </p>

                      {/* Read More Button */}
                      {banner.description &&
                        banner.description.length > 100 && (
                          <motion.button
                            whileHover={{ x: 4 }}
                            onClick={() => setSelectedBanner(banner)}
                            style={{
                              marginTop: "12px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                              padding: 0,
                              color: "hsl(var(--primary))",
                              transition: "color 0.2s",
                              fontFamily: "var(--font-body)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color =
                                "hsl(var(--primary) / 0.8)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color =
                                "hsl(var(--primary))";
                            }}
                          >
                            Read more →
                          </motion.button>
                        )}
                    </div>

                    {/* CTA Button */}
                    {banner.ctaText && (
                      <motion.a
                        href={banner.ctaLink || "#"}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          color: "white",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "700",
                          width: "fit-content",
                          background: "hsl(var(--primary))",
                          boxShadow: "0 4px 12px hsl(var(--primary) / 0.4)",
                          cursor: "pointer",
                          border: "none",
                          fontFamily: "var(--font-body)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "hsl(var(--primary) / 0.9)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 16px hsl(var(--primary) / 0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "hsl(var(--primary))";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px hsl(var(--primary) / 0.4)";
                        }}
                      >
                        {banner.ctaText}
                        <ArrowRight size={13} />
                      </motion.a>
                    )}
                  </div>

                  {/* RIGHT SIDE - IMAGE */}
                  {banner.image && (
                    <div
                      style={{
                        flex: "1",
                        overflow: "hidden",
                        position: "relative",
                        backgroundColor: "hsl(var(--muted) / 0.5)",
                      }}
                    >
                      <motion.img
                        src={banner.image}
                        alt={banner.title}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Indicator Dots */}
          {activeBanners.length > ITEMS_TO_SHOW && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              {Array.from({ length: totalDots }).map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => goToIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    width: idx === currentIndex ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background:
                      idx === currentIndex
                        ? "hsl(var(--primary))"
                        : "hsl(var(--primary) / 0.2)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (idx !== currentIndex) {
                      e.currentTarget.style.background =
                        "hsl(var(--primary) / 0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (idx !== currentIndex) {
                      e.currentTarget.style.background =
                        "hsl(var(--primary) / 0.2)";
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedBanner && (
        <DescriptionModal
          banner={selectedBanner}
          onClose={() => setSelectedBanner(null)}
        />
      )}
    </>
  );
};

export default PromoCarousel;
