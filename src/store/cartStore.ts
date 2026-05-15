import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Coupon, Address } from "@/types";
import { cartAPI } from "@/services/api/cart";
import { settingsAPI } from "@/services/api/settings";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  deliveryType: "delivery" | "collection";
  deliveryAddress: Address | null;
  isCartOpen: boolean;
  deliveryFee: number | null;
  deliverySettingsLoaded: boolean;
  cartId: string | null;
  skipNextSync: boolean;

  addItem: (item: Omit<CartItem, "id" | "itemTotal">) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  setDeliveryType: (type: "delivery" | "collection") => void;
  setDeliveryAddress: (address: Address | null) => void;
  setCartOpen: (open: boolean) => void;

  // SYNC METHODS
  syncFromServer: () => Promise<void>;
  migrateGuestCart: (mergedCart: any) => void;
  loadDeliverySettings: () => Promise<void>;
  setCartId: (cartId: string | null) => void;
  setSkipNextSync: (skip: boolean) => void;

  // GETTERS
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const isLoggedIn = () => useAuthStore.getState().isAuthenticated();

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      deliveryType: "delivery",
      deliveryAddress: null,
      isCartOpen: false,
      deliveryFee: null,
      deliverySettingsLoaded: false,
      cartId: null,
      skipNextSync: false,

      addItem: async (item) => {
        try {
          const items = get().items;
          const existingIndex = items.findIndex(
            (i) =>
              i.menuItemId === item.menuItemId &&
              JSON.stringify(i.variants) === JSON.stringify(item.variants),
          );

          if (existingIndex >= 0) {
            const updated = [...items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + item.quantity,
              itemTotal:
                (updated[existingIndex].quantity + item.quantity) *
                updated[existingIndex].price,
            };
            set({ items: updated });
          } else {
            const variantCost =
              item.variants?.reduce((s, v) => s + v.additionalPrice, 0) || 0;
            const newItem: CartItem = {
              ...item,
              id: `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              itemTotal: item.quantity * (item.price + variantCost),
            };
            set({ items: [...items, newItem] });
          }

          console.debug(`Added item to cart: ${item.menuItemId}`);

          const { data } = await cartAPI.addItem({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            variants: item.variants,
            notes: item.notes,
            cartId: !isLoggedIn() ? get().cartId || undefined : undefined,
          });

          if (data.data.cartId && !isLoggedIn()) {
            set({ cartId: data.data.cartId });
            localStorage.setItem("cartId", data.data.cartId);
            console.debug(`CartId updated: ${data.data.cartId}`);
          }

          set({
            items: data.data.items || [],
            coupon: data.data.coupon ?? null,
          });
        } catch (error: any) {
          console.error("Failed to add item:", error);
          toast.error("Failed to add item to cart. Trying again...");
        }
      },

      updateQuantity: async (id, quantity) => {
        try {
          if (quantity <= 0) {
            await get().removeItem(id);
            return;
          }

          set({
            items: get().items.map((item) =>
              item.id === id
                ? { ...item, quantity, itemTotal: quantity * item.price }
                : item,
            ),
          });

          console.debug(`Updated item quantity: ${id} → ${quantity}`);

          const { data } = await cartAPI.updateItem(
            id,
            quantity,
            !isLoggedIn() ? get().cartId || undefined : undefined,
          );
          set({
            items: data.data.items || [],
            coupon: data.data.coupon ?? null,
          });
        } catch (error: any) {
          console.error("Failed to update quantity:", error);
          toast.error("Failed to update cart");
        }
      },

      removeItem: async (id) => {
        try {
          set({ items: get().items.filter((i) => i.id !== id) });

          console.debug(`Removed item: ${id}`);

          const { data } = await cartAPI.removeItem(
            id,
            !isLoggedIn() ? get().cartId || undefined : undefined,
          );
          set({
            items: data.data.items || [],
            coupon: data.data.coupon ?? null,
          });
        } catch (error: any) {
          console.error("Failed to remove item:", error);
          toast.error("Failed to remove item");
        }
      },

      clearCart: async () => {
        try {
          // 1. Clear Zustand state immediately
          set({ items: [], coupon: null });

          // 2. Flag to skip the next syncFromServer()
          set({ skipNextSync: true });

          console.debug("Cleared cart");

          // This ensures both user AND guest carts are deleted from MongoDB
          try {
            await cartAPI.clearCart();
            console.info("Backend cart cleared successfully");
          } catch (error) {
            // Even if logged out, try to clear the cart via guest route
            // The backend handles it gracefully
            console.warn("Backend cart clear failed (may be guest):", error);
          }
        } catch (error: any) {
          console.error("Failed to clear cart:", error);
          toast.error("Failed to clear cart");
        }
      },

      applyCoupon: async (code) => {
        try {
          const { data } = await cartAPI.applyCoupon(
            code,
            !isLoggedIn() ? get().cartId || undefined : undefined,
          );
          set({ coupon: data.data.coupon, items: data.data.items });
          toast.success("Coupon applied!");

          console.info(`Coupon applied: ${code}`);
        } catch (error: any) {
          const msg = error?.response?.data?.message || "Invalid coupon";
          toast.error(msg);
          console.warn(`Coupon application failed: ${msg}`);
        }
      },

      removeCoupon: async () => {
        try {
          set({ coupon: null });

          if (isLoggedIn()) {
            const { data } = await cartAPI.removeCoupon(
              !isLoggedIn() ? get().cartId || undefined : undefined,
            );
            set({ items: data.data.items || [] });
          }

          console.debug("Coupon removed");
        } catch (error: any) {
          console.error("Failed to remove coupon:", error);
          toast.error("Failed to remove coupon");
        }
      },

      setCoupon: (coupon) => set({ coupon }),
      setDeliveryType: (deliveryType) => set({ deliveryType }),
      setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
      setCartOpen: (isCartOpen) => set({ isCartOpen }),
      setCartId: (cartId) => set({ cartId }),
      setSkipNextSync: (skip) => set({ skipNextSync: skip }),

      syncFromServer: async () => {
        if (get().skipNextSync) {
          console.debug("Skipping syncFromServer (post-order)");
          set({ skipNextSync: false });
          return;
        }

        if (!isLoggedIn()) return;

        try {
          const { data } = await cartAPI.getCart();
          set({
            items: data.data.items ?? [],
            coupon: data.data.coupon ?? null,
            cartId: null,
          });

          console.info(
            `Cart synced from server: ${data.data.items?.length || 0} items`,
          );
        } catch (error: any) {
          console.error("Failed to sync cart:", error);
          toast.error("Failed to load cart");
        }
      },

      migrateGuestCart: (mergedCart: any) => {
        try {
          set({
            items: mergedCart.items || [],
            coupon: mergedCart.coupon || null,
            cartId: null,
          });

          console.info(
            `Guest cart migrated: ${mergedCart.items?.length || 0} items`,
          );
        } catch (error: any) {
          console.error("Failed to update store with migrated cart:", error);
        }
      },

      loadDeliverySettings: async () => {
        try {
          const response = await settingsAPI.getDeliverySettings();

          const flatFee =
            response.zone?.deliveryFee ??
            response.globalDefaults?.minOrderAmount ??
            500;

          console.log("Loaded delivery settings:", response);

          set({
            deliveryFee: flatFee,
            deliverySettingsLoaded: true,
          });
        } catch (error: any) {
          console.error("Failed to load delivery settings:", error);
          set({
            deliveryFee: 500,
            deliverySettingsLoaded: true,
          });
        }
      },

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.itemTotal, 0),

      getDeliveryFee: () => {
        if (get().deliveryType === "collection") return 0;
        return get().deliveryFee ?? 0;
      },

      getDiscount: () => {
        const coupon = get().coupon;
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();
        if (coupon.type === "percentage")
          return Math.round(subtotal * (coupon.value / 100));
        return coupon.value;
      },

      getTotal: () =>
        get().getSubtotal() + get().getDeliveryFee() - get().getDiscount(),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        deliveryType: state.deliveryType,
        cartId: state.cartId,
      }),
    },
  ),
);
