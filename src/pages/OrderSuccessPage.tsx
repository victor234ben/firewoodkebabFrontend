import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  Loader2,
  ArrowLeft,
  Mail,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

interface OrderData {
  id: string;
  orderNumber: string;
  total: number;
  totalWithTip: number;
  guestToken?: string;
  guestEmail?: string;
  paymentMethod: string;
}

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [countdown, setCountdown] = useState(8);
  const [copied, setCopied] = useState(false);

  const orderData: OrderData | null = location.state?.order;

  // Redirect if no order data
  useEffect(() => {
    if (!orderData) {
      navigate('/', { replace: true });
      return;
    }
  }, [orderData, navigate]);

  // Auto-redirect countdown for guests
  useEffect(() => {
    if (!user && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (!user && countdown === 0) {
      navigate('/', { replace: true });
    }
  }, [countdown, user, navigate]);

  const handleCopyTrackingLink = () => {
    if (orderData?.guestToken) {
      const link = `${window.location.origin}/track/${orderData.guestToken}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Tracking link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!orderData) {
    return (
      <main className="pt-25 section-padding flex justify-center items-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  const isGuest = !user;
  const trackingLink = orderData.guestToken
    ? `${window.location.origin}/track/${orderData.guestToken}`
    : null;

  return (
    <main className="pt-25 section-padding pb-20">
      <div className="container-wide max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your order. We've received it and are preparing your meal.
          </p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-2xl font-bold text-foreground font-mono">
                {orderData.orderNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-primary">
                ${orderData.totalWithTip.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium text-foreground capitalize">
                {orderData.paymentMethod === 'stripe'
                  ? 'Card Payment'
                  : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-amber-600">Pending Confirmation</span>
            </div>
          </div>
        </motion.div>

        {/* Guest Tracking Section */}
        {isGuest && trackingLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-8"
          >
            <div className="flex gap-3 mb-4">
              <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Track Your Order Anytime
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use the link below to check your order status, even after you close
                  this page.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 border border-primary/10 flex items-center justify-between gap-3">
              <code className="text-xs text-primary/80 break-all">
                {trackingLink}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyTrackingLink}
                className="flex-shrink-0"
              >
                <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`} />
              </Button>
            </div>

            <Link to={trackingLink}>
              <Button className="w-full gap-2 mb-3">
                <Package className="w-4 h-4" />
                View Live Tracking
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Confirmation Email Section */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-8 mb-8"
          >
            <div className="flex gap-3 mb-3">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">
                  Confirmation Email Sent
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              We've sent an order confirmation and tracking link to{' '}
              <span className="font-medium text-foreground">
                {orderData.guestEmail}
              </span>
            </p>
          </motion.div>
        )}

        {/* Auth User Section */}
        {!isGuest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <Link to="/account#orders">
              <Button className="w-full gap-2" size="lg">
                <Package className="w-4 h-4" />
                View All Orders
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full gap-2" size="lg">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Guest Auto-Redirect CTA */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting to home in {countdown}s...
            </p>
            <Link to="/">
              <Button variant="ghost" size="sm">
                Go Home Now
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default OrderSuccessPage;