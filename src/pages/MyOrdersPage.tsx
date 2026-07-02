import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  ArrowRight,
  Mail,
  LogIn,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/helpers";
import { useGuestOrder } from "@/hooks/useApi";

interface LocalGuestOrder {
  guestToken: string;
  orderNumber: string;
  total: number;
  createdAt: string;
  paymentMethod: string;
}

const GuestOrderRow = ({ orderInfo }: { orderInfo: LocalGuestOrder }) => {
  const { data: liveOrder, isLoading } = useGuestOrder(orderInfo.guestToken);

  const status = liveOrder?.status || "loading";
  const total = liveOrder?.totalWithTip || liveOrder?.total || orderInfo.total;
  const paymentMethod = liveOrder?.paymentMethod || orderInfo.paymentMethod;

  const createdAtVal = liveOrder?.createdAt || orderInfo.createdAt;
  const parsedDate = createdAtVal ? new Date(createdAtVal) : null;
  const isDateValid = parsedDate && !isNaN(parsedDate.getTime());

  const statusColors: Record<string, { bg: string; text: string }> = {
    loading: { bg: "bg-white/5 border-white/10", text: "text-white/50" },
    pending: {
      bg: "bg-amber-500/10 border-amber-500/30",
      text: "text-amber-500",
    },
    confirmed: {
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-500",
    },
    preparing: {
      bg: "bg-purple-500/10 border-purple-500/30",
      text: "text-purple-500",
    },
    out_for_delivery: {
      bg: "bg-indigo-500/10 border-indigo-500/30",
      text: "text-indigo-500",
    },
    delivered: {
      bg: "bg-green-500/10 border-green-500/30",
      text: "text-green-500",
    },
    cancelled: { bg: "bg-red-500/10 border-red-500/30", text: "text-red-500" },
    failed: { bg: "bg-red-500/10 border-red-500/30", text: "text-red-500" },
  };

  const statusStyle = statusColors[status] || statusColors.pending;

  return (
    <div
      className="p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:border-white/20"
      style={{ background: "rgba(255, 255, 255, 0.02)" }}
    >
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-lg font-bold text-white">
            {orderInfo.orderNumber}
          </span>
          {isLoading ? (
            <span className="flex items-center gap-1 text-xs text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              Loading status
            </span>
          ) : (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} capitalize`}
            >
              {status === "out_for_delivery" ? "On the Way" : status}
            </span>
          )}
        </div>
        <p className="text-xs text-white/50">
          {isDateValid ? (
            <>
              Placed on{" "}
              {parsedDate.toLocaleDateString("en-US", { dateStyle: "medium" })}{" "}
              at{" "}
              {parsedDate.toLocaleTimeString("en-US", { timeStyle: "short" })}
            </>
          ) : (
            "Placed recently"
          )}
        </p>

        {/* Items Breakdown */}
        {liveOrder?.items && liveOrder.items.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-2 text-xs text-white/70">
            {liveOrder.items.map((item: any, idx: number) => (
              <span
                key={item._id || idx}
                className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
              >
                {item.quantity}× {item.menuItemName}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:items-end gap-1 text-sm text-white/60">
        <p className="text-xs">
          Payment:{" "}
          <span className="text-white capitalize">
            {paymentMethod === "stripe"
              ? "Card"
              : paymentMethod === "skytab"
                ? "SkyTab"
                : paymentMethod === "cash"
                  ? "Cash"
                  : paymentMethod || "Unknown"}
          </span>
        </p>
        <p className="font-bold text-base text-primary">{formatPrice(total)}</p>
      </div>

      <div className="w-full md:w-auto">
        <Link to={`/track/${orderInfo.guestToken}`}>
          <Button
            size="sm"
            className="w-full md:w-auto rounded-xl gap-2 font-semibold"
          >
            <Clock className="w-4 h-4" />
            Track Live
          </Button>
        </Link>
      </div>
    </div>
  );
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<LocalGuestOrder[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("guest_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const sorted = parsed.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          setOrders(sorted);
        }
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(160deg, #1a1108 0%, #0e0d0b 50%, #1a1208 100%)",
      }}
    >
      {/* Hero Section */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div
          className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 65%)",
          }}
        />
        <div className="container-wide relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <ClipboardList className="w-8 h-8 text-primary" />
            <h1 className="font-display font-black text-white text-3xl md:text-4xl tracking-tight">
              My Orders
            </h1>
          </div>
          <p className="text-white/60">Track and view your recent orders</p>
        </div>
      </section>

      {/* Orders List Section */}
      <section className="py-16">
        <div className="container-wide max-w-3xl mx-auto">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6 py-10"
            >
              {/* Main empty message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">No orders yet</h2>
                <p className="text-white/50 max-w-sm mx-auto text-sm leading-relaxed">
                  Looks like you haven't placed any orders here — or you may be
                  on a different device. Sign in to see your full history.
                </p>
              </div>

              {/* Auth actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-xs mx-auto">
                <Link to="/login" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl gap-2 text-sm border-white/20 hover:bg-white/5 font-semibold text-black"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button className="w-full h-10 rounded-xl gap-2 text-sm font-semibold">
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Quiet email tip */}
              <p className="text-xs text-white/30 flex items-center justify-center gap-1.5 pt-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                Can't find your order? Check your confirmation email for a
                tracking link.
              </p>

              {/* Browse CTA */}
              <div className="pt-6 border-t border-white/5">
                <Link to="/menu">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full px-8 font-semibold text-white/60 hover:text-white"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse Menu
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {orders.map((order) => (
                <GuestOrderRow key={order.guestToken} orderInfo={order} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MyOrdersPage;
