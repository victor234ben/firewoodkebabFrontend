import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/helpers";
import { CouponInput } from "@/components/CouponInput";

const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscount,
    getTotal,
    getItemCount,
  } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Premium Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
              duration: 0.3,
            }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl shadow-orange-500/20 flex flex-col border-l border-orange-500/20"
          >
            {/* Premium Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between px-6 py-5 border-b border-orange-500/20 bg-black"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30"
                >
                  <ShoppingBag className="w-5 h-5 text-orange-400" />
                </motion.div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white">
                    Your Cart
                  </h2>
                  <p className="text-xs text-orange-400/80">
                    {getItemCount()} {getItemCount() === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/50 text-slate-400 hover:text-orange-400 transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Empty Cart State */}
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4"
                >
                  <ShoppingBag className="w-20 h-20 text-orange-500/20 mx-auto" />
                </motion.div>
                <p className="text-lg font-display font-bold text-white mb-2">
                  Your cart is empty
                </p>
                <p className="text-sm text-slate-400 mb-8">
                  Fire up the grill! Add some delicious items to get started.
                </p>
                <Link to="/menu" onClick={() => setCartOpen(false)}>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2">
                    Browse Menu
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02, x: -2 }}
                      className="flex gap-3 p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-md"
                    >
                      {/* Item Image */}
                      {item.image && (
                        <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden group">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate mb-1 group-hover:text-orange-400 transition-colors">
                          {item.name}
                        </h4>

                        {/* Variants Info */}
                        {item.variants && item.variants.length > 0 && (
                          <p className="text-xs text-slate-400 mb-2 line-clamp-1">
                            {item.variants
                              .map((v) => `${v.groupName}: ${v.selectedOption}`)
                              .join(" • ")}
                          </p>
                        )}

                        {/* Quantity Controls & Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-slate-900/50 rounded-lg p-1 border border-slate-700">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/50 text-slate-400 hover:text-orange-400 transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="text-sm font-bold text-white w-5 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/50 text-slate-400 hover:text-orange-400 transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <span className="text-sm font-bold bg-gradient-to-r from-orange-700 to-red-500 bg-clip-text text-transparent">
                            {formatPrice(item.itemTotal)}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Premium Summary Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="border-t border-orange-500/20 p-6 space-y-4 bg-gradient-to-r from-black to-black/90"
                >
                  {/* ✅ COUPON INPUT SECTION */}
                  <CouponInput compact={true} />

                  {/* Summary Lines */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white font-semibold">
                        {formatPrice(getSubtotal())}
                      </span>
                    </div>
                   

                    {/* Discount Badge */}
                    {getDiscount() > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between text-sm p-2.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30"
                      >
                        <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5" />
                          Discount Applied
                        </span>
                        <span className="text-emerald-400 font-bold">
                          -{formatPrice(getDiscount())}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                    <span className="font-display text-white font-bold">
                      Total
                    </span>
                    <span className="text-3xl font-black bg-gradient-to-r from-orange-700 to-red-500 bg-clip-text text-transparent">
                      {formatPrice(getTotal())}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="block mt-6"
                  >
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-6  bg-[#fa7414] text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </motion.button>
                  </Link>

                  {/* Continue Shopping Link */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCartOpen(false)}
                    className="w-full py-3 border-2 border-orange-500/40 text-orange-400 hover:border-orange-500 hover:bg-orange-500/10 font-bold rounded-xl transition-all text-sm uppercase tracking-wide"
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
