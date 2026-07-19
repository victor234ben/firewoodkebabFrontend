import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, X, Flame } from "lucide-react";
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
    <>
      <div 
        className={`flex items-center gap-4 py-3 group cursor-pointer transition-colors hover:bg-white/5 rounded-xl px-2 w-full max-w-full overflow-hidden ${cartItem ? 'bg-primary/5' : ''}`}
        onClick={handleToggleSelect}
      >
        <div 
          className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-[1.2rem] overflow-hidden relative shadow-md bg-white/5"
          onClick={(e) => {
            e.stopPropagation();
            if(item.image) setIsImageModalOpen(true);
          }}
        >
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🍖</div>
          )}
          {item.isSpicy && (
            <div className="absolute top-1 right-1 z-10 bg-red-500/20 backdrop-blur-md rounded-full p-1 border border-red-500/50">
              <Flame className="w-3 h-3 text-red-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center max-w-full overflow-hidden">
          <div className="flex items-baseline justify-between gap-2 w-full max-w-full">
            <h3 className="font-display font-semibold text-base sm:text-lg text-white truncate shrink-0 max-w-[50%]">
              {item.name}
            </h3>
            
            <div className="flex-1 min-w-[20px] border-b border-white/20 mx-1 relative -top-1" />
            
            <span className="font-display font-semibold text-[hsl(var(--warm-gold))] shrink-0 pl-1">
              {formatPrice(item.price)}
            </span>
          </div>
          
          <p className="text-xs sm:text-sm text-white/60 line-clamp-2 mt-1 pr-2 leading-relaxed">
            {item.description}
          </p>
        </div>
        
        <div className="shrink-0 flex items-center justify-center pl-1 sm:pl-2">
           <button
             className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${
               cartItem 
                 ? 'bg-primary text-white shadow-[0_0_12px_hsl(var(--primary)/0.5)] hover:scale-105' 
                 : 'bg-white text-black shadow-md hover:scale-105'
             }`}
             onClick={handleToggleSelect}
           >
             {cartItem ? <Minus className="w-4 h-4" strokeWidth={3} /> : <Plus className="w-4 h-4" strokeWidth={3} />}
           </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isImageModalOpen && (
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
              className="relative max-w-2xl w-full max-h-[85vh] rounded-3xl overflow-hidden"
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
