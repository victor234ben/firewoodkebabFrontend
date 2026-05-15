import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, Plus, Filter, Flame, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useDebounce } from "@/hooks/useUtilHooks";
import { useCategories, useMenuItems } from "@/hooks/useApi";
import { formatPrice } from "@/utils/helpers";
import { DIETARY_FILTERS } from "@/utils/constants";
import type { MenuItem, Category } from "@/types";
import { toast } from "sonner";
import MenuItemModal from "@/components/menu/MenuItemModal";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDietary, setActiveDietary] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const addItem = useCartStore((s) => s.addItem);

  const { data: apiCategories } = useCategories();
  const { data: apiMenuData, isLoading: menuLoading } = useMenuItems({
    category: activeCategory !== "all" ? activeCategory : undefined,
    search: debouncedSearch || undefined,
    dietary: activeDietary.length > 0 ? activeDietary.join(",") : undefined,
    page,
    limit: 20,
  });

  const categories = apiCategories ?? [];
  const pagination = apiMenuData?.pagination;

  const filteredItems = useMemo(() => {
    const menuItems: MenuItem[] = apiMenuData?.items ?? [];
    return menuItems;
  }, [apiMenuData]);

  const handleQuickAdd = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedItem(item);
    } else {
      addItem({
        menuItemId: item._id,
        name: item.name,
        quantity: 1,
        price: item.price,
        image: item.image,
      });
      toast.success(`${item.name} added to cart!`);
    }
  };

  const toggleDietary = (value: string) => {
    setActiveDietary((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    );
    setPage(1);
  };
  

  return (
    <div
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── HERO SECTION (ENHANCED) ── */}
      <div
        className="relative pt-40 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
        }}
      >
        {/* Flame glow - more prominent */}
        <div
          className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 65%)",
          }}
        />

        {/* Accent flame glow (left side, subtle) */}
        <div
          className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="container-wide relative z-10">
          {/* Eyebrow - more premium */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="block w-12 h-px"
              style={{ background: "hsl(var(--primary))" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{
                color: "hsl(var(--primary))",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.1em",
              }}
            >
              ✦ Firewood Kebab Menu
            </span>
          </div>

          {/* Main heading - bolder, larger */}
          <h1
            className="font-display font-black text-white leading-tight mb-4"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Our Menu
          </h1>

          {/* Subheading - more descriptive */}
          <p
            className="max-w-lg"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "1.05rem",
              lineHeight: "1.6",
            }}
          >
            Flame-kissed perfection. Each dish crafted with premium ingredients
            and slow-fired to bring out authentic flavors.
          </p>
        </div>
      </div>

      {/* ── FILTERS SECTION (ENHANCED) ── */}
      <div
        className="sticky top-16 md:top-20 z-30 py-5"
        style={{
          background: "rgba(14, 13, 11, 0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <div className="container-wide flex flex-col gap-4">
          {/* Search - more prominent */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
            <input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-10 py-3.5 rounded-xl text-sm outline-none transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.7)";
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px hsl(var(--primary) / 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Category pills - enhanced */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[{ _id: "all", name: "All" }, ...categories].map((cat) => {
              const isActive = activeCategory === cat._id;
              return (
                <motion.button
                  key={cat._id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveCategory(cat._id);
                    setPage(1);
                  }}
                  className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 relative"
                  style={
                    isActive
                      ? {
                          background: "hsl(var(--primary))",
                          color: "#fff",
                          boxShadow: "0 4px 16px hsl(var(--primary) / 0.45)",
                        }
                      : {
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.7)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.15)";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.12)";
                    }
                  }}
                >
                  {cat.name}
                </motion.button>
              );
            })}
          </div>

          {/* Dietary filters - better organized */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter
              className="w-4 h-4 shrink-0"
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Filter by:
            </span>
            {DIETARY_FILTERS.map((filter) => {
              const isActive = activeDietary.includes(filter.value);
              return (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDietary(filter.value)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                  style={
                    isActive
                      ? {
                          background: "hsl(var(--primary) / 0.25)",
                          border: "1.5px solid hsl(var(--primary) / 0.8)",
                          color: "hsl(var(--primary))",
                        }
                      : {
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.5)",
                        }
                  }
                >
                  {filter.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RESULTS SECTION ── */}
      <div className="container-wide py-12">
        {/* Count */}
        {!menuLoading && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm mb-8 font-medium"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {pagination
              ? `${pagination.total} items found`
              : `${filteredItems.length} items found`}
            {activeDietary.length > 0 && (
              <span style={{ color: "hsl(var(--primary))" }}>
                {" "}
                • {activeDietary.length} filter
                {activeDietary.length > 1 ? "s" : ""} applied
              </span>
            )}
          </motion.p>
        )}

        {menuLoading ? (
          <div className="flex items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2
                className="w-10 h-10"
                style={{ color: "hsl(var(--primary))" }}
              />
            </motion.div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: Math.min(i * 0.05, 0.35),
                      duration: 0.4,
                    }}
                    className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "var(--shadow-card)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 20px 40px rgba(255,128,0,0.15)";
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.borderColor =
                        "hsl(var(--primary) / 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "var(--shadow-card)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "hsl(var(--border))";
                    }}
                  >
                    {/* Image with premium overlay */}
                    <Link
                      to={`/menu/${item._id}`}
                      className="block aspect-[3/2] relative overflow-hidden group/image"
                      // style={{
                      //   background: "linear-gradient(135deg, #1c1a16, #0e0d0b)",
                      // }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full bg-none object-cover transition-transform duration-700 group-hover:scale-115"
                        />
                      )}

                      {/* Premium overlay gradient (bottom) */}
                      {/* <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.6) 100%)",
                          opacity: 0.8,
                        }}
                      /> */}

                      {/* Badge group - top right */}
                      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        {/* Spicy badge - enhanced */}
                        {item.isSpicy && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-full px-3 py-1.5 backdrop-blur-md"
                            style={{
                              background: "rgba(239,68,68,0.2)",
                              border: "1px solid rgba(239,68,68,0.5)",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <Flame
                              className="w-3.5 h-3.5"
                              style={{ color: "#ff6b6b" }}
                            />
                            <span
                              className="text-xs font-semibold"
                              style={{ color: "#ff6b6b" }}
                            >
                              Spicy
                            </span>
                          </motion.div>
                        )}

                        {/* Special/Featured badge */}
                        {item.isFeatured && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 }}
                            className="rounded-full px-3 py-1.5 backdrop-blur-md"
                            style={{
                              background: "rgba(251,146,60,0.2)",
                              border: "1px solid rgba(251,146,60,0.5)",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <span
                              className="text-xs font-bold"
                              style={{ color: "#fb923c" }}
                            >
                              ⭐ Featured
                            </span>
                          </motion.div>
                        )}
                      </div>

                      {/* Sold out overlay */}
                      <AnimatePresence>
                        {!item.isAvailable && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "rgba(0,0,0,0.7)" }}
                          >
                            <span
                              className="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur"
                              style={{
                                background: "rgba(239,68,68,0.2)",
                                border: "1px solid rgba(239,68,68,0.6)",
                                color: "#fca5a5",
                              }}
                            >
                              Sold Out
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>

                    {/* Card body - enhanced spacing */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Category + Rating row */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                          style={{
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          {item.categoryName}
                        </span>
                        {item.averageRating > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Star
                              className="w-3.5 h-3.5"
                              style={{
                                fill: "hsl(var(--warm-gold))",
                                color: "hsl(var(--warm-gold))",
                              }}
                            />
                            <span
                              className="text-xs font-bold"
                              style={{ color: "hsl(var(--foreground))" }}
                            >
                              {item.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Name - premium typography */}
                      <h3
                        className="font-display font-bold text-base leading-snug mb-2.5 transition-colors duration-300 group-hover:text-primary line-clamp-2"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-xs leading-relaxed line-clamp-2 flex-1 mb-5"
                        style={{
                          color: "hsl(var(--muted-foreground))",
                        }}
                      >
                        {item.description}
                      </p>

                      {/* Price + Add Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span
                            className="font-black text-xl"
                            style={{ color: "hsl(var(--primary))" }}
                          >
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        {/* Add to cart button - premium round style */}
                        <motion.button
                          disabled={!item.isAvailable}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(item);
                          }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`Add ${item.name} to cart`}
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: "hsl(var(--primary))",
                            color: "#fff",
                            boxShadow: "0 4px 12px hsl(var(--primary) / 0.4)",
                          }}
                          onMouseEnter={(e) => {
                            if (item.isAvailable) {
                              e.currentTarget.style.boxShadow =
                                "0 6px 20px hsl(var(--primary) / 0.6)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (item.isAvailable) {
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px hsl(var(--primary) / 0.4)";
                            }
                          }}
                        >
                          <Plus className="w-5 h-5" strokeWidth={3} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination - enhanced */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-4 mt-16"
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full px-6 font-semibold transition-all"
                >
                  ← Previous
                </Button>
                <div
                  className="px-6 py-2 rounded-full font-semibold"
                  style={{
                    background: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full px-6 font-semibold transition-all"
                >
                  Next →
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Empty state */}
        {filteredItems.length === 0 && !menuLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-28"
          >
            <p className="text-6xl mb-6">🍖</p>
            <p
              className="font-display text-2xl font-bold mb-3"
              style={{ color: "hsl(var(--foreground))" }}
            >
              No items found
            </p>
            <p
              className="text-sm max-w-sm mx-auto"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Try adjusting your filters or search term. Our chef might be
              taking a break from the grill!
            </p>
          </motion.div>
        )}
      </div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default MenuPage;
