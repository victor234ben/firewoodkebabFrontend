import { useState } from "react";
import { motion } from "framer-motion";
import { X, Minus, Plus, Star, Flame, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/helpers";
import type { MenuItem } from "@/types";
import { toast } from "sonner";

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

const MenuItemModal = ({ item, onClose }: MenuItemModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, { name: string; additionalPrice: number }>
  >(() => {
    const defaults: Record<string, { name: string; additionalPrice: number }> =
      {};
    item.variants?.forEach((group) => {
      if (group.options.length > 0) {
        defaults[group.groupName] = group.options[0];
      }
    });
    return defaults;
  });
  const [notes, setNotes] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const variantCost = Object.values(selectedVariants).reduce(
    (s, v) => s + v.additionalPrice,
    0,
  );
  const itemTotal = (item.price + variantCost) * quantity;

  const handleAdd = () => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      quantity,
      price: item.price,
      image: item.image,
      variants: Object.entries(selectedVariants).map(([groupName, opt]) => ({
        groupName,
        selectedOption: opt.name,
        additionalPrice: opt.additionalPrice,
      })),
      notes: notes || undefined,
    });
    toast.success(`${item.name} added to cart!`);
    onClose();
  };

  return (
    <>
      {/* Backdrop with blur and dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-4 md:inset-auto md:top-[5%] md:right-[5%] md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-3xl shadow-2xl shadow-orange-500/20 overflow-hidden flex flex-col max-h-[90vh] md:max-h-[95vh] border border-orange-500/20"
      >
        {/* Image Section with Premium Styling */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0 overflow-hidden group">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Premium Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
          
          {/* Close Button - Glassmorphism */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-slate-950/95 hover:border-white/40 transition-all shadow-lg"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>

          {/* Badge Group - Top Left */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {item.isSpicy && (
              <motion.span
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur text-white rounded-full px-3 py-1.5 text-xs font-bold border border-red-400/30 shadow-lg"
              >
                <Flame className="w-4 h-4" />
                Spicy
              </motion.span>
            )}
            {item.averageRating >= 4.5 && (
              <motion.span
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1.5 bg-amber-500/90 backdrop-blur text-white rounded-full px-3 py-1.5 text-xs font-bold border border-amber-400/30 shadow-lg"
              >
                <Star className="w-4 h-4 fill-current" />
                Favorite
              </motion.span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-500/30">
              {item.categoryName}
            </span>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-white">
                {item.averageRating} <span className="text-slate-400">({item.reviewCount})</span>
              </span>
            </div>
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-bold mb-3 text-white bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent"
          >
            {item.name}
          </motion.h2>

          {/* Description */}
          <p className="text-sm md:text-base text-slate-300 mb-4 leading-relaxed font-light">
            {item.description}
          </p>

          {/* Dietary Tags */}
          {item.dietaryTags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {item.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/30 capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent my-6" />

          {/* Variants Section */}
          {item.variants && item.variants.length > 0 && (
            <div className="mb-6">
              {item.variants.map((group) => (
                <div key={group.groupName} className="mb-5">
                  <label className="text-sm font-bold mb-3 block text-white uppercase tracking-widest">
                    {group.groupName}
                  </label>
                  <div className="flex flex-col gap-2.5">
                    {group.options.map((option) => (
                      <motion.button
                        key={option.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [group.groupName]: option,
                          }))
                        }
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          selectedVariants[group.groupName]?.name === option.name
                            ? "border-orange-500 bg-orange-500/15 text-orange-300"
                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-orange-500/40 hover:bg-slate-800"
                        }`}
                      >
                        <span>{option.name}</span>
                        <span className={selectedVariants[group.groupName]?.name === option.name ? "text-orange-400" : "text-slate-500"}>
                          {option.additionalPrice > 0
                            ? `+${formatPrice(option.additionalPrice)}`
                            : "Included"}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="text-sm font-bold mb-3 block text-white uppercase tracking-widest">
              Special Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., No onions, extra spice, well-done..."
              maxLength={200}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all resize-none"
            />
            <span className="text-xs text-slate-500 mt-1 block">
              {notes.length}/200
            </span>
          </div>
        </div>

        {/* Footer - Action Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-orange-500/20 p-6 md:p-8 flex items-center gap-3 md:gap-4 shrink-0 bg-gradient-to-r from-slate-900 to-slate-900/50"
        >
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-xl p-1.5">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-slate-700 flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/50 text-slate-400 hover:text-orange-400 transition-all"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="w-8 text-center font-bold text-white text-lg">
              {quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-slate-700 flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/50 text-slate-400 hover:text-orange-400 transition-all"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
          >
            Add to Cart — {formatPrice(itemTotal)}
          </motion.button>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-10 h-10 md:w-11 md:h-11 rounded-xl border-2 flex items-center justify-center transition-all ${
              isWishlisted
                ? "bg-red-500/20 border-red-500 text-red-500"
                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default MenuItemModal;