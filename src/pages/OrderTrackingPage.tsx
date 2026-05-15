import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrder, useOrderTracking } from "@/hooks/useApi";
import { useOrderSocket } from "@/hooks/useSocket";
import { formatPrice } from "@/utils/helpers";
import { STORE_PHONE } from "@/utils/constants";
import type { OrderStatus } from "@/types";
import { useSettingsStore } from "@/store/settingsStore";

const STEPS = [
  {
    key: "confirmed",
    label: "Confirmed",
    icon: CheckCircle2,
    description: "Your order has been confirmed",
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: ChefHat,
    description: "Our chefs are preparing your food",
  },
  {
    key: "out_for_delivery",
    label: "On the Way",
    icon: Truck,
    description: "Your order is on its way",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: PackageCheck,
    description: "Enjoy your meal!",
  },
];

const STATUS_TO_STEP: Record<string, number> = {
  pending: 0,
  confirmed: 0,
  preparing: 1,
  out_for_delivery: 2,
  delivered: 3,
  cancelled: -1,
  failed: -1,
};

const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useOrder(id || "");
  const { data: trackingData } = useOrderTracking(id || "");

  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleStatusChange = useCallback(
    (data: { status: string; estimatedTime?: number }) => {
      console.log("[OrderTracking] Status changed:", data);
      setLiveStatus(data.status);
      if (data.estimatedTime) setEstimatedTime(data.estimatedTime);
      setLastUpdate(new Date());
    },
    [],
  );

  useOrderSocket(id, handleStatusChange);
  const { restaurant } = useSettingsStore();

  const currentStatus =
    liveStatus || trackingData?.status || order?.status || "pending";
  const currentStep = STATUS_TO_STEP[currentStatus] ?? 0;
  const currentStepData = STEPS[Math.max(0, currentStep)] || STEPS[0];
  const etaMinutes =
    estimatedTime ||
    (trackingData?.estimatedDeliveryTime
      ? parseTimeToMinutes(trackingData.estimatedDeliveryTime)
      : null);

  if (orderError) {
    return (
      <main className="pt-25 section-padding flex items-center justify-center min-h-[70vh]">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Order Not Found
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn't find this order. Please check the order number and try
            again.
          </p>
          <Link to="/account#orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (orderLoading) {
    return (
      <main className="pt-25 section-padding flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading your order...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-25 section-padding pb-12">
      <div className="container-wide max-w-2xl mx-auto">
        {/* Back Button */}
        <Link to="/account#orders" className="mb-6 inline-flex">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {order?.orderNumber || `ORD-${id?.slice(-6).toUpperCase()}`}
          </h1>
        </motion.div>

        {/* Current Status Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-card to-secondary/20 rounded-2xl p-8 border border-border shadow-lg mb-8 text-center"
        >
          <currentStepData.icon
            className={`w-16 h-16 mx-auto mb-4 transition-colors ${
              currentStep === 3 ? "text-green-500" : "text-primary"
            }`}
          />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            {currentStepData.description}
          </h2>

          {/* ETA Display */}
          {/* {currentStep < 3 && currentStep >= 0 && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-4 py-2 px-4 bg-primary/5 rounded-lg mx-auto">
              <Clock className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-medium">
                {etaMinutes
                  ? `Estimated: ~${etaMinutes} minutes`
                  : "Calculating ETA..."}
              </span>
            </div>
          )} */}

          {/* Note from driver/staff (if exists) */}
          {getLatestNote(trackingData, currentStatus) && (
            <div
              className="mt-4 p-3 rounded-lg"
              style={{
                background: "hsl(var(--primary) / 0.1)",
                border: "1px solid hsl(var(--primary) / 0.3)",
              }}
            >
              <p className="text-sm text-foreground italic">
                💬 {getLatestNote(trackingData, currentStatus)}
              </p>
            </div>
          )}

          {/* Last Update Timestamp */}
          {lastUpdate && (
            <p className="text-xs text-muted-foreground mt-3">
              Last updated: {lastUpdate.toLocaleTimeString("en-NG")}
            </p>
          )}
        </motion.div>

        {/* Progress Stepper */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div
                key={step.key}
                className="flex flex-col items-center flex-1 relative"
              >
                {i > 0 && (
                  <div
                    className={`absolute top-4 h-0.5 transition-all duration-500 ${
                      i <= currentStep ? "bg-primary" : "bg-border"
                    }`}
                    style={{ width: "100%", left: "-50%" }}
                  />
                )}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    i < currentStep
                      ? "bg-primary text-primary-foreground"
                      : i === currentStep
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium text-center ${
                    i <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details (Collapsible) */}
        <div className="bg-card rounded-2xl border border-border shadow-lg mb-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full p-6 hover:bg-secondary/30 transition-colors"
          >
            <h3 className="font-display font-semibold text-foreground">
              Order Details
            </h3>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {showDetails && order && (
            <div className="px-6 pb-6 space-y-4 text-sm border-t border-border pt-4">
              {/* Items */}
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Items</h4>
                {order.items?.map((item: any) => (
                  <div key={item._id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.quantity}× {item.menuItemName}
                    </span>
                    <span className="text-foreground font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-foreground">
                    {formatPrice(order.deliveryFee)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div className="border-t border-border pt-3">
                  <h4 className="font-medium text-foreground mb-1">
                    Delivery Address
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.street}
                    <br />
                    {order.deliveryAddress.zipCode
                      ? ` ${order.deliveryAddress.zipCode}`
                      : ""}
                  </p>
                </div>
              )}

              {/* Special Instructions */}
              {order.specialInstructions && (
                <div className="border-t border-border pt-3">
                  <h4 className="font-medium text-foreground mb-1">
                    Special Instructions
                  </h4>
                  <p className="text-sm text-muted-foreground italic">
                    {order.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {showDetails && !order && (
            <div className="px-6 pb-6 text-sm text-muted-foreground border-t border-border pt-4">
              Loading order details...
            </div>
          )}
        </div>

        {/* Review Prompt (if delivered) */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent rounded-2xl p-6 text-center mb-8"
          >
            <h3 className="font-display font-semibold text-accent-foreground mb-2">
              How was your meal?
            </h3>
            <p className="text-sm text-accent-foreground/80 mb-4">
              We'd love to hear your feedback!
            </p>
            <Link to="/account">
              <Button>Leave a Review</Button>
            </Link>
          </motion.div>
        )}

        {/* Support Section */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Need help with your order?
          </p>
          <a href={`tel:${restaurant.phone}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Call Support
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
};
function getLatestNote(
  trackingData: any,
  currentStatus: string,
): string | null {
  if (!trackingData?.statusHistory) return null;

  // Find the latest status entry matching current status that has a note
  const latestStatusWithNote = trackingData.statusHistory.findLast(
    (entry: any) => entry.status === currentStatus && entry.note,
  );

  return latestStatusWithNote?.note || null;
}
function parseTimeToMinutes(timeString: string | Date | null): number | null {
  if (!timeString) return null;

  if (typeof timeString === "string") {
    const match = timeString.match(/(\d+)\s*(?:minute|min)?s?/i);
    return match ? parseInt(match[1]) : null;
  }

  if (timeString instanceof Date) {
    const now = new Date();
    const diffMs = timeString.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffMs / 60000));
  }

  return null;
}

export default OrderTrackingPage;
