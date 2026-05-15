export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  role: "user" | "admin" | "superadmin";
  addresses: Address[];
  isEmailVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  label: string;
  street: string;
  street2?: string;
  zipCode: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  variants?: {
    groupName: string;
    selectedOption: string;
    additionalPrice: number;
  }[];
  itemTotal: number;
  notes?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  coupon: Coupon | null;
  total: number;
  itemCount: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestName?: string;
  items: OrderItem[];
  deliveryType: "delivery" | "collection";
  deliveryAddress?: Omit<Address, "id" | "label" | "isDefault" | "createdAt">;
  estimatedDeliveryTime?: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax?: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  statusHistory: { status: string; updatedAt: string; note?: string }[];
  paymentMethod: "stripe" | "cash";
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  variants?: {
    variantGroup: string;
    selectedOption: string;
    additionalPrice: number;
  }[];
  notes?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";
export type PaymentStatus =
  | "pending"
  | "initiated"
  | "successful"
  | "failed"
  | "refunded";

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  menuItemId?: string;
  rating: number;
  comment: string;
  images?: string[];
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "fixed_amount" | "percentage";
  value: number;
  description?: string;
  minOrderAmount?: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface Notification {
  _id: string;
  type:
    | "order_confirmation"
    | "order_update"
    | "delivery"
    | "review"
    | "promotion";
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface VariantOption {
  _id: string;
  name: string;
  additionalPrice: number;
}

export interface VariantGroup {
  _id: string;
  groupName: string;
  options: VariantOption[];
}

export interface MenuItem {
  _id: string; // ← was `id`, now `_id`
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string; // ← new (flat, not nested object)
  categoryName: string; // ← new (flat, not nested object)
  isAvailable: boolean;
  stock: number; // ← new
  isFeatured: boolean;
  isSpicy: boolean;
  dietaryTags: string[];
  isCatering: boolean;
  averageRating: number;
  reviewCount: number;
  variants: VariantGroup[];
  createdAt: string; // ← new
  updatedAt: string; // ← new
}

export interface ContactInquiryDTO {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface QuoteInquiryDTO {
  name: string;
  email: string;
  phone: string;
  guests: number;
  eventDate: string;
  eventTime: string;
  details: string;
}
