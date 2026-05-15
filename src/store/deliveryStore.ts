import { create } from "zustand";
import { LocationData, DeliveryValidationResponse } from "@/types";

interface DeliveryStore {
  // State
  locationData: LocationData | null;
  isValidating: boolean;
  validationError: string | null;

  // Actions
  setLocationData: (data: LocationData) => void;
  setIsValidating: (isValidating: boolean) => void;
  setValidationError: (error: string | null) => void;
  clearLocationData: () => void;
  updateDeliveryInfo: (deliveryInfo: DeliveryValidationResponse) => void;

  // Computed
  isLocationValidated: () => boolean;
  getDeliveryFee: () => number;
  getDeliveryETA: () => { min: number; max: number } | null;
  getMinimumOrder: () => number;
}

export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  locationData: null,
  isValidating: false,
  validationError: null,

  setLocationData: (data) => {
    set({ locationData: data, validationError: null });
    // Persist to localStorage
    localStorage.setItem("locationData", JSON.stringify(data));
  },

  setIsValidating: (isValidating) => set({ isValidating }),

  setValidationError: (error) => set({ validationError: error }),

  clearLocationData: () => {
    set({ locationData: null, validationError: null });
    localStorage.removeItem("locationData");
  },

  updateDeliveryInfo: (deliveryInfo) => {
    const current = get().locationData;
    if (current) {
      const updated = { ...current, deliveryInfo, isValidated: true };
      set({ locationData: updated });
      localStorage.setItem("locationData", JSON.stringify(updated));
    }
  },

  isLocationValidated: () => {
    const { locationData } = get();
    return locationData?.isValidated ?? false;
  },

  getDeliveryFee: () => {
    const { locationData } = get();
    return locationData?.deliveryInfo?.deliveryFee ?? 0;
  },

  getDeliveryETA: () => {
    const { locationData } = get();
    if (
      locationData?.deliveryInfo?.estimatedDeliveryTimeMin &&
      locationData?.deliveryInfo?.estimatedDeliveryTimeMax
    ) {
      return {
        min: locationData.deliveryInfo.estimatedDeliveryTimeMin,
        max: locationData.deliveryInfo.estimatedDeliveryTimeMax,
      };
    }
    return null;
  },

  getMinimumOrder: () => {
    const { locationData } = get();
    return locationData?.deliveryInfo?.minimumOrder ?? 0;
  },
}));

// Initialize from localStorage on app load
export const initializeDeliveryStore = () => {
  const stored = localStorage.getItem("locationData");
  if (stored) {
    try {
      const locationData = JSON.parse(stored);
      useDeliveryStore.setState({ locationData });
    } catch (error) {
      console.warn("Failed to restore location data from localStorage");
    }
  }
};