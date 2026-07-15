import { motion } from "framer-motion";
import { Star, Plus, Minus, Flame } from "lucide-react";
import type { MenuItem } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { useCateringStore } from "@/store/cateringStore";
import { Button } from "@/components/ui/button";

interface CateringItemCardProps {
  item: MenuItem;
}

const CateringItemCard = ({ item }: CateringItemCardProps) => {
  const storeItems = useCateringStore((s) => s.items);
  const addItem = useCateringStore((s) => s.addItem);
  const removeItem = useCateringStore((s) => s.removeItem);

  // Find if item is already in catering cart (ignoring variants for basic add/remove on card)
  const cartItem = storeItems.find((i) => i.menuItemId === item._id);

  const handleToggleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      removeItem(cartItem.id);
    } else {
      addItem({
        menuItemId: item._id,
        name: item.name,
        quantity: 1,
        price: item.price || 0,
        image: item.image,
        variants: []
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true }}
      className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: "hsl(var(--card))",
        border: cartItem
          ? "2px solid hsl(var(--primary))"
          : "1px solid hsl(var(--border))",
        boxShadow: cartItem
          ? "0 8px 24px hsl(var(--primary)/0.15)"
          : "var(--shadow-card)",
      }}
      onClick={handleToggleSelect}
      onMouseEnter={(e) => {
        if (!cartItem) {
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(255,128,0,0.15)";
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.4)";
        }
      }}
      onMouseLeave={(e) => {
        if (!cartItem) {
          e.currentTarget.style.boxShadow = "var(--shadow-card)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "hsl(var(--border))";
        }
      }}
    >
      {/* Image with premium overlay */}
      <div
        className="aspect-[3/2] overflow-hidden relative group/image"
        style={{
          background: "linear-gradient(135deg, #1c1a16, #0e0d0b)",
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍖
          </div>
        )}



        {item.isSpicy && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 z-10 rounded-full px-3 py-1.5 backdrop-blur-md"
            style={{
              background: "rgba(239,68,68,0.2)",
              border: "1px solid rgba(239,68,68,0.5)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Flame className="w-3.5 h-3.5" style={{ color: "#ff6b6b" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "#ff6b6b" }}
            >
              Spicy
            </span>
          </motion.div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {item.averageRating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Star
                className="w-3.5 h-3.5"
                style={{
                  fill: "hsl(var(--warm-gold))",
                  color: "hsl(var(--warm-gold))",
                }}
              />
              <span className="text-xs font-bold">
                {item.averageRating.toFixed(1)}
              </span>
            </div>
            <span
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              ({item.reviewCount || 0})
            </span>
          </div>
        )}

        <h3 className="font-display font-bold text-base leading-snug mb-2.5 transition-colors group-hover:text-primary line-clamp-2">
          {item.name}
        </h3>

        <p
          className="text-xs leading-relaxed line-clamp-2 flex-1 mb-5"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {item.description}
        </p>

        <div className="flex items-center justify-end mt-auto">
          {cartItem ? (
            <Button
              variant="default"
              className="w-full gap-2 font-bold"
              style={{
                background: "hsl(var(--primary))",
                color: "#fff",
              }}
              onClick={handleToggleSelect}
            >
              Selected
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/50 text-primary hover:bg-primary/10 transition-colors"
              onClick={handleToggleSelect}
            >
              <Plus className="w-4 h-4" />
              Add to Quote
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CateringItemCard;
