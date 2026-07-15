import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/utils/helpers";
import { useCateringStore } from "@/store/cateringStore";
import { Trash2, Plus, Minus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CateringSummary = () => {
  const { items, updateQuantity, removeItem, getSubtotal, getItemCount } =
    useCateringStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 text-center border border-border"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Info className="w-5 h-5" />
        </div>
        <h3 className="font-semibold mb-2">Your catering menu is empty</h3>
        <p className="text-sm text-muted-foreground">
          Add items from the menu to build your custom catering quote.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
      }}
    >
      <div className="bg-secondary/50 p-6 border-b border-border">
        <h3 className="font-display font-bold text-lg flex items-center justify-between">
          <span>Quote Summary</span>
          <span className="text-sm font-medium text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </h3>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
              className="flex gap-4 p-3 rounded-xl border border-transparent hover:border-border hover:bg-secondary/20 transition-all mb-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm truncate pr-2">
                    {item.name}
                  </h4>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs">Remove</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-secondary/30 border-t border-border">
        <p className="text-xs text-muted-foreground italic">
          * A dedicated catering manager will reach out to you with pricing details based on your guest count and selected menu items.
        </p>
      </div>
    </div>
  );
};

export default CateringSummary;
