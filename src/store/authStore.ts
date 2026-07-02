import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { authAPI } from "@/services/api/auth";
import { userAPI } from "@/services/api/user";
import { useCartStore } from "./cartStore";
import { cartAPI } from "@/services/api/cart";
import { ordersAPI } from "@/services/api/orders";


interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  isAuthenticated: () => boolean;
  migrateGuestCart: () => Promise<void>;
  claimGuestOrders: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login({ email, password });
          const { user, accessToken, refreshToken } = data.data;

          // Save tokens
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Update auth state
          set({ user, accessToken, refreshToken, isLoading: false });

          console.info(`User logged in: ${user.email}`);

          await get().migrateGuestCart();
          await get().claimGuestOrders();

          // Sync user's cart from server
          await useCartStore.getState().syncFromServer();
        } catch (error) {
          set({ isLoading: false });
          console.error("Login error:", error);
          throw error;
        }
      },

    
      register: async (registerData) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register(registerData);
          const { user, accessToken, refreshToken } = data.data;

          // Save tokens
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Update auth state
          set({ user, accessToken, refreshToken, isLoading: false });

          console.info(`User registered: ${user.email}`);

          await get().migrateGuestCart();
          await get().claimGuestOrders();

          // Sync user's cart from server
          await useCartStore.getState().syncFromServer();
        } catch (error) {
          set({ isLoading: false });
          console.error("Registration error:", error);
          throw error;
        }
      },

 
      logout: () => {
        authAPI
          .logout(localStorage.getItem("refreshToken") || "")
          .catch(() => {});

        // Clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        localStorage.removeItem("cartId");
        console.debug("Cleared guest cartId from localStorage");

        // Clear auth state
        useCartStore.getState().clearCart();
        set({ user: null, accessToken: null, refreshToken: null });

        console.info("User logged out");
      },

 
      updateProfile: async (profileData) => {
        const { data } = await userAPI.updateProfile(profileData);
        set({ user: data.data });
        console.info("Profile updated");
      },

    
      setUser: (user) => set({ user }),
 
      isAuthenticated: () => !!get().accessToken,

      
      migrateGuestCart: async () => {
        try {
          // Get cartId from localStorage (set by frontend during guest browsing)
          const guestCartId = localStorage.getItem("cartId");

          // If no cartId, guest hadn't added items yet
          if (!guestCartId) {
            console.debug("No guest cartId to migrate");
            return;
          }

          console.info(`Migrating guest cart: ${guestCartId}`);

          // Call backend migration endpoint
          // Note: User is already authenticated at this point
          const { data } = await cartAPI.migrateCart(guestCartId);

          console.info(
            `Cart migration successful: ${data.data.items.length} items`,
          );

          // Update Zustand cart store with merged cart
          useCartStore.setState({
            items: data.data.items || [],
            coupon: data.data.coupon || null,
          });

          // Clear guest cartId from localStorage
          localStorage.removeItem("cartId");
          console.debug("Cleared guest cartId after migration");
        } catch (error: any) {
          console.warn("Cart migration failed (non-blocking):", error?.message);

        }
      },

      claimGuestOrders: async () => {
        try {
          const guestOrdersStr = localStorage.getItem("guest_orders");
          if (!guestOrdersStr) {
            console.debug("No guest orders to claim");
            return;
          }

          const parsed = JSON.parse(guestOrdersStr);
          if (!Array.isArray(parsed) || parsed.length === 0) {
            console.debug("Guest orders list is empty");
            return;
          }

          const guestTokens = parsed
            .map((o: any) => o.guestToken)
            .filter((token: string) => !!token);

          if (guestTokens.length === 0) {
            console.debug("No guest tokens found in localStorage orders");
            return;
          }

          console.info(`Claiming guest orders for tokens: ${guestTokens.join(", ")}`);

          await ordersAPI.claimGuestOrders(guestTokens);

          // Once successful, wipe guest_orders from localStorage
          localStorage.removeItem("guest_orders");
          console.info("Guest orders claimed and wiped from localStorage");
        } catch (error: any) {
          console.warn("Guest order claiming failed (non-blocking):", error?.message);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "auth-storage") {
      try {
        const parsed = JSON.parse(event.newValue || "{}");
        const state = parsed?.state;
        const currentAccessToken = useAuthStore.getState().accessToken;

        if (!state || !state.accessToken) {
          // Logout occurred in another tab
          if (currentAccessToken) {
            useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
            useCartStore.getState().clearCart();
          }
        } else {
          // Login/Update occurred in another tab
          if (!currentAccessToken && state.accessToken) {
            useAuthStore.setState({
              user: state.user || null,
              accessToken: state.accessToken || null,
              refreshToken: state.refreshToken || null,
            });
            useCartStore.getState().syncFromServer();
          } else if (state.user) {
            // Profile update sync
            useAuthStore.setState({ user: state.user });
          }
        }
      } catch (e) {
        console.error("Error parsing auth-storage update from other tab:", e);
      }
    }
    if (event.key === "accessToken" && !event.newValue) {
      if (useAuthStore.getState().accessToken) {
        useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
        useCartStore.getState().clearCart();
      }
    }
  });
}
