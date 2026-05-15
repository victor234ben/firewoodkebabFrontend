import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuAPI } from "@/services/api/menu";
import { ordersAPI } from "@/services/api/orders";
import { userAPI } from "@/services/api/user";
import { cartAPI } from "@/services/api/cart";
import { paymentAPI } from "@/services/api/payment";
import { reviewsAPI } from "@/services/api/reviews";
import { notificationsAPI } from "@/services/api/notifications";
import { authAPI } from "@/services/api/auth";
import type {
  MenuQueryParams,
  CreateOrderDTO,
  AddressDTO,
  CreateReviewDTO,
  NotificationPrefsDTO,
  InitPaymentDTO,
  ResetPasswordDTO,
  DeliveryValidationResponse,
  checkDeliveryParams,
} from "@/types";
import { Banner, promotionsAPI } from "@/services/promotion";
import { deliveryAPI } from "@/services/api/delivery";
import { settingsAPI } from "@/services/api/settings";
import client from "@/services/api/client";

// ─── MENU ──────────────────────────────────────────
export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await menuAPI.getCategories();
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useMenuItems = (params?: MenuQueryParams) =>
  useQuery({
    queryKey: ["menuItems", params],
    queryFn: async () => {
      const { data } = await menuAPI.getItems(params);
      return { items: data.data.data, pagination: data.data.pagination };
    },
    staleTime: 5 * 60 * 1000,
  });

export const useMenuItem = (id: string) =>
  useQuery({
    queryKey: ["menuItem", id],
    queryFn: async () => {
      const { data } = await menuAPI.getItemById(id);
      return data.data.item;
    },
    enabled: !!id,
  });

export const usePaymentOptions = () =>
  useQuery({
    queryKey: ["payment-options"],
    queryFn: async () => {
      const data = await settingsAPI.getPaymentOptions();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

export const useDeliverySettings = (params?: {
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}) =>
  useQuery({
    queryKey: ["delivery-settings", params],
    queryFn: async () => {
      const data = await settingsAPI.getDeliverySettings(params);
      return data;
    },
    enabled: !!params?.zipCode || (!!params?.latitude && !!params?.longitude),
    retry: 1,
  });

// ─── CART (server-synced) ──────────────────────────
export const useServerCart = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await cartAPI.getCart();
      return data.data;
    },
    staleTime: 60 * 1000,
  });

export const useAddCartItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartAPI.addItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useApplyCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => cartAPI.applyCoupon(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useRemoveCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cartAPI.removeCoupon(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useCheckDelivery = () =>
  useMutation({
    mutationFn: (data: checkDeliveryParams) =>
      deliveryAPI.checkAvailability(data),
  });

export const useValidateCheckout = () =>
  useMutation({
    mutationFn: async (data: {
      subtotal: number;
      deliveryFee: number;
      discount: number;
      tipAmount: number;
      paymentMethod: string;
      hasItems: boolean;
    }) => {
      // Client-side validation
      if (!data.hasItems) {
        throw new Error("Cart is empty");
      }
      if (data.subtotal <= 0) {
        throw new Error("Cart total must be greater than 0");
      }
      if (data.tipAmount < 0) {
        throw new Error("Tip cannot be negative");
      }
      if (data.paymentMethod === "stripe" && data.deliveryFee < 0) {
        throw new Error("Invalid delivery fee");
      }
      return true;
    },
  });
// ─── ORDERS ────────────────────────────────────────
export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrderDTO) => {
      if (!data.deliveryType) {
        throw new Error("Delivery type is required");
      }
      if (data.paymentMethod === "stripe" && !data.guestEmail && !data.userId) {
        throw new Error("Email is required for card payment");
      }
      if ((data.tipAmount ?? 0) < 0) {
        throw new Error("Tip amount cannot be negative");
      }

      return ordersAPI.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
};

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await ordersAPI.getById(id);
      return data.data || null;
    },
    enabled: !!id,
  });

export const useOrderTracking = (id: string) =>
  useQuery({
    queryKey: ["orderTracking", id],

    queryFn: async () => {
      const { data } = await ordersAPI.track(id);
      return data.data;
    },
    enabled: !!id,
    refetchInterval: 15000, // poll every 15s
  });

export const useUserOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) =>
  useQuery({
    queryKey: ["userOrders", params],
    queryFn: async () => {
      const { data } = await ordersAPI.getUserOrders(params);
      console.log("Fetched user orders:", data);
      return { orders: data.data.data, pagination: data.data.pagination };
    },
  });

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ordersAPI.cancel(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userOrders"] }),
  });
};

export const useGuestOrder = (guestToken: string) =>
  useQuery({
    queryKey: ["guestOrder", guestToken],
    queryFn: async () => {
      const { data } = await client.get(`/orders/guest/${guestToken}`);
      return data.data;
    },
    enabled: !!guestToken,
  });

export const useGuestOrderTracking = (guestToken: string) =>
  useQuery({
    queryKey: ["guestOrderTracking", guestToken],
    queryFn: async () => {
      const { data } = await client.get(`/orders/guest/${guestToken}/track`);
      return data.data;
    },
    enabled: !!guestToken,
    refetchInterval: 15000,
  });

// ─── PAYMENT ───────────────────────────────────────
export const useInitPayment = () =>
  useMutation({
    mutationFn: (data: InitPaymentDTO) => paymentAPI.initialize(data),
  });

export const useVerifyPayment = () =>
  useMutation({
    mutationFn: (reference: string) => paymentAPI.verify(reference),
  });

// ─── USER / PROFILE ───────────────────────────────
export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await userAPI.getProfile();
      return data.data.user;
    },
    staleTime: 60 * 1000,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
};
export const useUpdateProfilePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profilePhoto: string) =>
      userAPI.updateProfilePhoto(profilePhoto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
};
export const useAddresses = () =>
  useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await userAPI.getAddresses();
      return data.data;
    },
  });

export const useAddAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressDTO) => userAPI.addAddress(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressDTO }) =>
      userAPI.updateAddress(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userAPI.deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useSetDefaultAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userAPI.setDefaultAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: (password: string) => userAPI.deleteAccount(password),
  });
export const useNotificationPreferences = () =>
  useQuery({
    queryKey: ["notificationPreferences"],
    queryFn: async () => {
      const { data } = await userAPI.getNotificationPreferences();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useUpdateNotificationPreferences = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs: Partial<NotificationPrefsDTO>) =>
      userAPI.updateNotificationPreferences(prefs),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["notificationPreferences"],
      }),
  });
};

export const useDisableAllNotifications = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => userAPI.disableAllNotifications(),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["notificationPreferences"],
      }),
  });
};

export const useEnableAllNotifications = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => userAPI.enableAllNotifications(),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["notificationPreferences"],
      }),
  });
};

// ─── REVIEWS ──────────────────────────────────────
export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewDTO) => reviewsAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userOrders"] }),
  });
};

export const useItemReviews = (
  itemId: string,
  params?: { page?: number; limit?: number; sort?: string },
) =>
  useQuery({
    queryKey: ["itemReviews", itemId, params],
    queryFn: async () => {
      const { data } = await reviewsAPI.getByItem(itemId, params);
      return { reviews: data.data.reviews, pagination: data.pagination };
    },
    enabled: !!itemId,
  });

export const useOrderReviews = (orderId: string) =>
  useQuery({
    queryKey: ["orderReviews", orderId],
    queryFn: async () => {
      const { data } = await reviewsAPI.getByOrder(orderId);
      return data.data;
    },
    enabled: !!orderId,
  });

export const useUpdateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { rating?: number; comment?: string };
    }) => reviewsAPI.update(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["userOrders"] });
      // Invalidate the specific order's reviews so the badge re-fetches
      qc.invalidateQueries({ queryKey: ["orderReviews"] });
    },
  });
};

// ─── NOTIFICATIONS ────────────────────────────────
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) =>
  useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const { data } = await notificationsAPI.getAll(params);
      return {
        notifications: data.data.data,
        pagination: data.data.pagination,
      };
    },
  });

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsAPI.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};

export const useUpdateNotificationPrefs = () =>
  useMutation({
    mutationFn: (prefs: NotificationPrefsDTO) =>
      notificationsAPI.updatePreferences(prefs),
  });

// ─── AUTH (non-store, for one-off actions) ────────
export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPasswordDTO) => authAPI.resetPassword(data),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email: string) => authAPI.forgotPassword(email),
  });

export const useBanners = () =>
  useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: () => promotionsAPI.getBanners(),
    // staleTime: 5 * 60 * 1000, // 5 min — banners don't change frequently
  });

export const useValidateCoupon = (code: string) =>
  useQuery({
    queryKey: ["coupon", "validate", code.toUpperCase()],
    queryFn: () => promotionsAPI.validateCoupon(code),
    enabled: false, // manual trigger via refetch()
    retry: false,
    staleTime: 60 * 1000, // 1 min
  });
