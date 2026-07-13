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
                  <span className="font-bold text-sm shrink-0">
                    {formatPrice(item.itemTotal)}
                  </span>
                </div>

                {item.variants && item.variants.length > 0 && (
                  <div className="text-xs text-muted-foreground mb-2">
                    {item.variants.map((v, i) => (
                      <span key={i}>
                        {v.selectedOption}
                        {i < item.variants!.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-secondary rounded-full p-1 border border-border h-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-background"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-bold text-xs w-4 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-background"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-secondary/30 border-t border-border">
        <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
          <span>Estimated Subtotal</span>
          <span className="font-medium text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">
          * Final pricing will be confirmed by our team after reviewing your request details.
        </p>
      </div>
    </div>
  );
};

export default CateringSummary;
