import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { authAPI } from "@/services/api/auth";
import { userAPI } from "@/services/api/user";
import { useCartStore } from "./cartStore";
import { cartAPI } from "@/services/api/cart";


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
        set({ user: data.data.user });
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
