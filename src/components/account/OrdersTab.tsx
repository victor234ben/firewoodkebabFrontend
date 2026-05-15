import { useState } from 'react';
import {
  Package,
  Star,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Pencil,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/store/cartStore';
import {
  useUserOrders,
  useCreateReview,
  useUpdateReview,
  useOrderReviews,
} from '@/hooks/useApi';
import { formatPrice } from '@/utils/helpers';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { Order } from '@/types';

/* ─── Star Rating Component ─── */
const StarRating = ({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={
            readonly
              ? 'cursor-default'
              : 'cursor-pointer transition-transform hover:scale-110'
          }
        >
          <Star
            className={`${dim} transition-colors ${
              star <= active
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

/* ─── Review Badge ─── */
const ReviewBadge = ({ rating }: { rating: number }) => (
  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
    {rating}/5 reviewed
  </span>
);

/* ─── Inline Review Form ─── */
const ReviewForm = ({
  orderId,
  existingReview,
  onClose,
}: {
  orderId: string;
  existingReview?: { id: string; rating: number; comment: string } | null;
  onClose: () => void;
}) => {
  const isEditing = !!existingReview;
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [comment, setComment] = useState(existingReview?.comment ?? '');

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const isPending = createReview.isPending || updateReview.isPending;

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent',
  };

  const handleSubmit = async () => {
    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }
    try {
      if (isEditing) {
        await updateReview.mutateAsync({
          id: existingReview.id,
          data: { rating, comment },
        });
        toast.success('Review updated!');
      } else {
        await createReview.mutateAsync({ orderId, rating, comment });
        toast.success('Review submitted — thank you!');
      }
      onClose();
    } catch {
      toast.error(
        isEditing ? 'Failed to update review' : 'Failed to submit review',
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="mt-4 p-4 bg-secondary/40 rounded-xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            {isEditing ? 'Edit your review' : 'How was your order?'}
          </p>
          {isEditing && (
            <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">
              Editing
            </span>
          )}
        </div>

        {/* Stars + label */}
        <div className="flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} />
          <span className="text-sm font-medium text-amber-600">
            {ratingLabels[rating]}
          </span>
        </div>

        {/* Comment */}
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience — food quality, delivery, packaging..."
          rows={3}
          className="resize-none text-sm"
        />
        <p className="text-xs text-muted-foreground -mt-2">
          {comment.length < 10
            ? `${10 - comment.length} more characters needed`
            : `${comment.length} characters`}
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isPending || comment.trim().length < 10}
            className="gap-1.5"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            {isEditing ? 'Update Review' : 'Submit Review'}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Single Order Card ─── */
const OrderCard = ({ order }: { order: Order }) => {
  const addItem = useCartStore((s) => s.addItem);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch existing reviews for this order
  const { data: existingReviews, isLoading: reviewsLoading } = useOrderReviews(
    order._id,
  );
  const existingReview = existingReviews?.[0] ?? null;
  const hasReview = !!existingReview;
  const isDelivered = order.status === 'delivered';

  // ✅ Check if order can be tracked
  const isInTransit = [
    'pending',
    'confirmed',
    'preparing',
    'out_for_delivery',
  ].includes(order.status);

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem({
        menuItemId: item.menuItemId,
        name: item.menuItemName,
        quantity: item.quantity,
        price: item.price,
      });
    });
    toast.success('Items added to cart!');
  };

  const handleReviewToggle = () => {
    setShowReviewForm((prev) => !prev);
  };

  const statusColors: Record<string, string> = {
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    preparing: 'bg-violet-50 text-violet-700 border-violet-200',
    out_for_delivery: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-card hover:shadow-sm transition-shadow">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-foreground text-sm">
            {order.orderNumber}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
            statusColors[order.status] ??
            'bg-secondary text-muted-foreground border-border'
          }`}
        >
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Items summary */}
      <p className="text-sm text-muted-foreground mb-1">
        {order.items.map((i) => i.menuItemName).join(', ')}
      </p>
      <p className="text-sm font-semibold text-foreground mb-3">
        {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
        {formatPrice(order.total)}
      </p>

      {/* Review badge if already reviewed */}
      {hasReview && !showReviewForm && (
        <div className="mb-3">
          <ReviewBadge rating={existingReview.rating} />
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
            "{existingReview.comment}"
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* ✅ Track Order - Primary action for in-transit orders */}
        {isInTransit && (
          <a href={`/order/${order._id}/track`} className="flex-1 min-w-fit">
            <Button 
              size="sm" 
              className="w-full gap-1.5 sm:w-auto"
            >
              <Package className="w-3.5 h-3.5" />
              Track Order
              <ArrowRight className="w-3 h-3" />
            </Button>
          </a>
        )}

        {/* Review / Edit Review */}
        {isDelivered && (
          <Button
            size="sm"
            variant={
              showReviewForm ? 'secondary' : hasReview ? 'ghost' : 'outline'
            }
            onClick={handleReviewToggle}
            disabled={reviewsLoading}
            className="gap-1.5"
          >
            {reviewsLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : hasReview ? (
              <Pencil className="w-3.5 h-3.5" />
            ) : (
              <Star className="w-3.5 h-3.5" />
            )}
            {showReviewForm
              ? 'Cancel'
              : hasReview
                ? 'Edit Review'
                : 'Leave a Review'}
            {showReviewForm ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </Button>
        )}

        {/* Reorder */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleReorder}
          className="gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reorder
        </Button>
      </div>

      {/* Inline Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            orderId={order._id}
            existingReview={
              existingReview
                ? {
                    id: existingReview._id ?? existingReview.id,
                    rating: existingReview.rating,
                    comment: existingReview.comment,
                  }
                : null
            }
            onClose={() => setShowReviewForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main OrdersTab ─── */
const OrdersTab = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useUserOrders({
    page,
    limit: 10,
    status: statusFilter || undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">
          Order History
        </h2>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : data?.orders && data.orders.length > 0 ? (
        <>
          <div className="space-y-3">
            {data.orders.map((order: Order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.pagination.hasPrev}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="font-medium text-foreground mb-1">No orders yet</p>
          <p className="text-sm text-muted-foreground mb-5">
            Start ordering from our menu!
          </p>
          <a href="/menu">
            <Button variant="outline">Browse Menu</Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;