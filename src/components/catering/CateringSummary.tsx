import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/utils/helpers";
import { useCateringStore } from "@/store/cateringStore";

export const CateringSummary = () => {
  const { items, removeItem, getSubtotal, getItemCount } = useCateringStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <div className="text-gray-900 rounded-[10px] border-t-[3px] border-dashed border-[#C9A24B] relative pt-[26px] px-5 pb-5 before:content-[''] before:absolute before:-top-[11px] before:left-1/2 before:-translate-x-1/2 before:w-[34px] before:h-[14px] before:bg-[#2B221B] before:rounded-sm shadow-md" style={{ backgroundColor: "#F6F0E4" }}>
      <div className="flex justify-between items-baseline mb-[14px]">
        <h4 className="font-display text-[16px] m-0 font-bold">Your ticket</h4>
        <span className="font-mono text-[11.5px] text-gray-500">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div>
        {items.length === 0 ? (
          <p className="text-[13px] text-gray-500 leading-[1.6] py-2.5 m-0">
            Nothing on the ticket yet — add a dish from the menu to get started.
          </p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                  className="flex items-baseline gap-[6px] font-mono text-[12.5px] mb-[10px]"
                >
                  <span className="shrink text-gray-900 min-w-0 truncate pr-2">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-gray-900">
                    &times;<span className="inline-block ml-0.5">{item.quantity}</span>
                  </span>
                  <span className="flex-1 border-b border-dotted border-gray-400 mb-1 mx-2 min-w-[20px]"></span>
                  <span className="shrink-0 text-[#7A2A11] font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-gray-500 cursor-pointer font-body text-[11px] underline ml-[6px] bg-transparent border-none p-0 hover:text-primary transition-colors"
                  >
                    remove
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex justify-between border-t border-[rgba(36,28,22,0.15)] mt-1.5 pt-3 font-mono text-[13px] font-semibold text-gray-900">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      )}

      <p className="text-[11px] text-gray-500 italic mt-[14px] leading-[1.5] m-0">
        A dedicated catering manager will follow up with final pricing based on your guest count.
      </p>
    </div>
  );
};

export default CateringSummary;
