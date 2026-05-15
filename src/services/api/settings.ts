import client from "./client";

interface PaymentOptions {
  tipsEnabled: boolean;
  tipPercentages: number[];
  cashOnDeliveryEnabled: boolean;
  currency: string;
}

interface DeliveryZone {
  name: string;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: { min: number; max: number };
}

export const settingsAPI = {
  getPublic: () => client.get("/settings/public"),

  getDeliverySettings: async (params?: {
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const queryString = new URLSearchParams();
    if (params?.zipCode) queryString.append("zipCode", params.zipCode);
    if (params?.latitude)
      queryString.append("latitude", params.latitude.toString());
    if (params?.longitude)
      queryString.append("longitude", params.longitude.toString());

    const url = `/settings/delivery${queryString.toString() ? `?${queryString}` : ""}`;
    const { data } = await client.get(url);

    return data.data as {
      available: boolean;
      zone: DeliveryZone | null;
      globalDefaults: any;
    };
  },

  getPaymentOptions: async () => {
    const { data } = await client.get("/settings/payment-options");
    return data.data as PaymentOptions;
  },
};
