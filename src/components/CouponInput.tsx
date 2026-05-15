import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, Loader2, X, Check, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface CouponInputProps {
  onApply?: () => void;
  compact?: boolean; // For CartDrawer (minimal)
  detailed?: boolean; // For CheckoutPage (full info)
}

export function CouponInput({
  onApply,
  compact = false,
  detailed = false,
}: CouponInputProps) {
  const { coupon, applyCoupon, removeCoupon, getSubtotal, getDiscount } =
    useCartStore();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(!coupon);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when showing
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleApply = async () => {
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
      setError("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await applyCoupon(trimmedCode);
      setCode("");
      setShowInput(false);
      if (onApply) onApply();
    } catch (err: any) {
      setError(err.message || "Failed to apply coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeCoupon();
      setCode("");
      setShowInput(true);
      setError(null);
    } catch (err: any) {
      toast.error("Failed to remove coupon");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setCode("");
      setError(null);
    }
  };

  // ─── COMPACT MODE (CartDrawer) ───
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 p-3 bg-slate-900/50 rounded-lg border border-orange-500/20"
      >
        {coupon ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-white">
                  {coupon.code}
                </p>
                <p className="text-xs text-emerald-400">
                  {coupon.type === "percentage"
                    ? `${coupon.value}% off`
                    : `$${coupon.value} off`}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {showInput ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Coupon code..."
                  className="h-8 text-xs bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={isLoading || !code.trim()}
                  className="h-8 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.button
                key="toggle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowInput(true)}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                Have a coupon?
              </motion.button>
            )}
          </AnimatePresence>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{error}</p>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // ─── DETAILED MODE (CheckoutPage) ───
  if (detailed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {coupon ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {coupon.code}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {coupon.type === "percentage"
                      ? `${coupon.value}% discount`
                      : `$${coupon.value} off`}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Discount preview */}
            {getDiscount() > 0 && (
              <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                <span className="text-sm text-muted-foreground">You save</span>
                <span className="font-bold text-emerald-400">
                  -${getDiscount().toFixed(2)}
                </span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="w-full text-xs"
            >
              Change Coupon
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <label className="block">
              <span className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Tag
                  className="w-4 h-4"
                  style={{ color: "hsl(var(--primary))" }}
                />
                Have a Coupon?
              </span>
            </label>

            {showInput ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter coupon code"
                    className="rounded-lg h-11 text-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid hsl(var(--border))",
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleApply}
                    disabled={isLoading || !code.trim()}
                    className="h-11 rounded-lg font-semibold"
                    style={{
                      background: isLoading
                        ? "hsl(var(--muted))"
                        : "hsl(var(--primary))",
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </motion.div>
                )}

                <p className="text-xs text-muted-foreground">
                  Press Enter to apply or Escape to cancel
                </p>
              </motion.div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInput(true)}
                className="w-full"
              >
                <Tag className="w-4 h-4 mr-2" />
                Add Coupon Code
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Default: standard mode
  return (
    <div className="space-y-2">
      {coupon ? (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-green-900">
              {coupon.code}
            </p>
            <p className="text-xs text-green-700">
              {coupon.type === "percentage"
                ? `${coupon.value}% off`
                : `$${coupon.value} off`}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Coupon code"
            disabled={isLoading}
          />
          <Button onClick={handleApply} disabled={isLoading || !code.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
          </Button>
        </div>
      )}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
