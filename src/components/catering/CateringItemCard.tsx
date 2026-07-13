import { motion } from "framer-motion";
import { Star, Plus, Minus, Flame } from "lucide-react";
import type { MenuItem } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { useCateringStore } from "@/store/cateringStore";
import { Button } from "@/components/ui/button";

interface CateringItemCardProps {
  item: MenuItem;
  onQuickAdd: (item: MenuItem) => void;
}

const CateringItemCard = ({ item, onQuickAdd }: CateringItemCardProps) => {
  const storeItems = useCateringStore((s) => s.items);
  const updateQuantity = useCateringStore((s) => s.updateQuantity);
  const removeItem = useCateringStore((s) => s.removeItem);

  // Find if item is already in catering cart (ignoring variants for basic add/remove on card)
  // For precise variant handling, they use the modal.
  const cartItem = storeItems.find((i) => i.menuItemId === item._id);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      onQuickAdd(item);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      } else {
        removeItem(cartItem.id);
      }
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
      onClick={() => onQuickAdd(item)}
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

        <div className="flex items-center justify-between mt-auto">
          <span
            className="font-black text-xl"
            style={{ color: "hsl(var(--primary))" }}
          >
            {formatPrice(item.price)}
          </span>

          {cartItem ? (
            <div className="flex items-center gap-3 bg-secondary rounded-full p-1 border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-background"
                onClick={handleDecrement}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-sm w-4 text-center">
                {cartItem.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-background"
                onClick={handleIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Add ${item.name} to catering`}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: "hsl(var(--primary))",
                color: "#fff",
                boxShadow: "0 4px 12px hsl(var(--primary) / 0.4)",
              }}
              onClick={handleIncrement}
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CateringItemCard;
