import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame } from "lucide-react";
import type { MenuItem } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { useCateringStore } from "@/store/cateringStore";

interface CateringItemCardProps {
  item: MenuItem;
}

const CateringItemCard = ({ item }: CateringItemCardProps) => {
  const storeItems = useCateringStore((s) => s.items);
  const addItem = useCateringStore((s) => s.addItem);
  const updateQuantity = useCateringStore((s) => s.updateQuantity);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const cartItem = storeItems.find((i) => i.menuItemId === item._id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      menuItemId: item._id,
      name: item.name,
      quantity: 1,
      price: item.price || 0,
      image: item.image,
      variants: []
    });
  };

  const handleUpdateQty = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + delta);
    }
  };

  return (
    <>
      <div 
        className="bg-card border border-border rounded-xl overflow-hidden transition-colors flex flex-row sm:flex-col h-full"
      >
        <div 
          className="w-[96px] h-auto sm:w-full sm:h-[118px] relative bg-gradient-to-br from-secondary to-muted cursor-pointer shrink-0"
          onClick={() => {
            if(item.image) setIsImageModalOpen(true);
          }}
        >
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-35" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 12h18M6 9l-3 3 3 3M18 9l3 3-3 3"/></svg>
          )}
          {item.isSpicy && (
            <div className="absolute top-2 right-2 z-10 bg-red-500/20 backdrop-blur-md rounded-full p-1 border border-red-500/50">
              <Flame className="w-3 h-3 text-red-400" />
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
          <h3 className="font-display font-semibold text-[15.5px] text-foreground mb-1 leading-[1.3] line-clamp-2">
            {item.name}
          </h3>
          <p className="text-[12.5px] text-muted-foreground leading-[1.5] mb-[14px] line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="font-mono text-[13.5px] font-semibold text-[hsl(var(--warm-gold))]">
              {formatPrice(item.price)}
            </span>
            
            {cartItem ? (
              <div className="flex items-center gap-[10px] bg-primary rounded-full px-1.5 py-1">
                <button 
                  onClick={(e) => handleUpdateQty(e, -1)}
                  className="w-[22px] h-[22px] rounded-full border-none bg-white/20 text-white cursor-pointer text-[14px] leading-none flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  −
                </button>
                <span className="text-white text-[13px] font-mono min-w-[12px] text-center">
                  {cartItem.quantity}
                </span>
                <button 
                  onClick={(e) => handleUpdateQty(e, 1)}
                  className="w-[22px] h-[22px] rounded-full border-none bg-white/20 text-white cursor-pointer text-[14px] leading-none flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-[30px] h-[30px] rounded-full border border-border bg-transparent text-foreground cursor-pointer text-[16px] leading-none flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isImageModalOpen && item.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); setIsImageModalOpen(false); }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[85vh] rounded-[var(--concept-radius)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CateringItemCard;
