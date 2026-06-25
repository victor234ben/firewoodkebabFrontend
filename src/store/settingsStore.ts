import { create } from "zustand";
import { persist } from "zustand/middleware";
import { settingsAPI } from "@/services/api/settings";

interface RestaurantInfo {
  name?: string;
  logo?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: {
    [day: string]: {
      open: boolean;
      startTime: string;
      endTime: string;
    };
  };
  website?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface SettingsStore {
  restaurant: RestaurantInfo;
  isLoading: boolean;
  hasFetched: boolean;
  fetchedAt?: number;
  fetch: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      restaurant: {},
      isLoading: false,
      hasFetched: false,

      fetch: async () => {
        const SETTINGS_TTL = 30 * 60 * 1000; // 30 min
        const { hasFetched, fetchedAt } = get();
        if (hasFetched && fetchedAt && Date.now() - fetchedAt < SETTINGS_TTL) return;

        set({ isLoading: true });
        try {
          const { data } = await settingsAPI.getPublic();
          set({
            restaurant: data.data.restaurant ?? {},
            hasFetched: true,
            fetchedAt: Date.now(),
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        restaurant: state.restaurant,
        hasFetched: state.hasFetched,
        fetchedAt: state.fetchedAt,
      }),
    },
  ),
);
