import { motion } from "framer-motion";
import { Star, Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useMenuItems } from "@/hooks/useApi";
import { formatPrice } from "@/utils/helpers";
import type { MenuItem } from "@/types";
import { toast } from "sonner";
import { Link } from "react-router-dom";

//   Skeleton card shown while loading
const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ border: "1px solid hsl(var(--border))" }}
  >
    <div
      className="aspect-[3/2] animate-pulse"
      style={{ background: "hsl(var(--muted))" }}
    />
    <div className="p-5 space-y-3">
      <div
        className="h-3 w-16 rounded animate-pulse"
        style={{ background: "hsl(var(--muted))" }}
      />
      <div
        className="h-5 w-3/4 rounded animate-pulse"
        style={{ background: "hsl(var(--muted))" }}
      />
      <div
        className="h-3 w-full rounded animate-pulse"
        style={{ background: "hsl(var(--muted))" }}
      />
      <div
        className="h-3 w-2/3 rounded animate-pulse"
        style={{ background: "hsl(var(--muted))" }}
      />
      <div className="flex items-center justify-between pt-2">
        <div
          className="h-6 w-14 rounded animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
        <div
          className="h-9 w-9 rounded-full animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
      </div>
    </div>
  </div>
);

//   Image fallback when item has no image
const ImageFallback = () => (
  <div
    className="w-full h-full flex items-center justify-center"
    style={{
      background: "linear-gradient(135deg, #2a2318 0%, #1a1410 100%)",
    }}
  >
    <Flame
      className="w-12 h-12"
      style={{ color: "hsl(var(--primary) / 0.35)" }}
    />
  </div>
);

//   Main component
const MenuPreview = () => {
  const addItem = useCartStore((s) => s.addItem);
  // Limit to 8 items max — homepage is a showcase, not the full menu
  const { data: menuData, isLoading } = useMenuItems({
    featured: true,
    limit: 8,
  });
  const featuredItems: MenuItem[] = menuData?.items ?? [];

  if (!isLoading && featuredItems.length === 0) return null;

  const handleAdd = (item: MenuItem) => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      quantity: 1,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--gradient-warm)" }}
    >
      {/* Decorative glow in background */}
      {/* <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
        }}
      /> */}

      <div className="container-wide relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
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
              Fresh Daily
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2
                className="font-display font-bold leading-tight mb-3"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Popular Dishes
              </h2>
              <p
                className="text-sm"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Our most loved dishes, prepared fresh daily
              </p>
            </div>
            <Link to="/menu" className="hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 rounded-full px-6"
              >
                View Full Menu →
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Grid — 4 cols on large, 2 on md, 1 on sm. Max 8 items. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredItems.slice(0, 8).map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: Math.min(i * 0.07, 0.42),
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "var(--shadow-card)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-elevated)";
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.borderColor =
                      "hsl(var(--primary) / 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "hsl(var(--border))";
                  }}
                >
                  {/* Image — ENHANCED with overlay gradients */}
                  <Link
                    to={`/menu/${item._id}`}
                    className="block aspect-[4/3] overflow-hidden relative group/img"
                  >
                    {item.image ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                        />
                        {/* Rich gradient overlay — warm at bottom */}
                        {/* <div
                          className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)",
                          }}
                        /> */}
                      </>
                    ) : (
                      <ImageFallback />
                    )}

                    {/* Premium badge — updated styling */}
                    {i < 4 && (
                      <motion.span
                        initial={{ opacity: 0, y: -8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
                        style={{
                          background: "hsl(var(--primary) / 0.95)",
                          color: "#fff",
                          boxShadow: "0 4px 12px hsl(var(--primary) / 0.6)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        🔥 Most Loved
                      </motion.span>
                    )}

                    {/* Unavailable overlay */}
                    {!item.isAvailable && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(0,0,0,0.65)" }}
                      >
                        <span
                          className="text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          Unavailable
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star
                        className="w-3.5 h-3.5 shrink-0"
                        style={{
                          fill: "hsl(var(--warm-gold))",
                          color: "hsl(var(--warm-gold))",
                        }}
                      />
                      <span className="text-xs font-semibold">
                        {item.averageRating}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        ({item.reviewCount})
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-display font-semibold text-base leading-snug mb-2">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-xs leading-relaxed line-clamp-2 flex-1 mb-5"
                      style={{
                        color: "hsl(var(--muted-foreground))",
                        minHeight: "2.5rem",
                      }}
                    >
                      {item.description}
                    </p>

                    {/* Price + Add */}
                    <div className="flex items-center justify-between">
                      <span
                        className="font-bold text-lg transition-colors duration-300"
                        style={{ color: "hsl(var(--primary))" }}
                      >
                        {formatPrice(item.price)}
                      </span>
                      <button
                        disabled={!item.isAvailable}
                        onClick={() => handleAdd(item)}
                        aria-label={`Add ${item.name} to cart`}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: "hsl(var(--primary))",
                          color: "#fff",
                          boxShadow: "0 4px 12px hsl(var(--primary) / 0.4)",
                        }}
                        onMouseEnter={(e) => {
                          if (item.isAvailable) {
                            e.currentTarget.style.transform = "scale(1.15)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 20px hsl(var(--primary) / 0.65)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px hsl(var(--primary) / 0.4)";
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* View All CTA — centered below grid, visible on all sizes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link to="/menu">
            <Button
              size="lg"
              className="rounded-full px-10 font-semibold transition-all duration-300"
              style={{
                background: "hsl(var(--primary))",
                color: "#fff",
                boxShadow: "0 6px 24px hsl(var(--primary) / 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px hsl(var(--primary) / 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 24px hsl(var(--primary) / 0.4)";
              }}
            >
              Explore Full Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuPreview;
