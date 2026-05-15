import client from "./client";
import type { DeliveryValidationResponse, DeliveryZone } from "@/types";

export const deliveryAPI = {
  checkAvailability: (data: {
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  }) =>
    client.get<{ data: DeliveryValidationResponse }>("/delivery/check", {
      params: {
        ...(data.zipCode && { zipCode: data.zipCode }),
        ...(data.latitude && { latitude: data.latitude }),
        ...(data.longitude && { longitude: data.longitude }),
      },
    }),

  // Get a specific delivery zone by ID
  getZoneById: (id: string) =>
    client.get<{ data: DeliveryZone }>(`/delivery/zones/${id}`),

  // Get all active delivery zones
  getAllZones: () => client.get<{ data: DeliveryZone[] }>("/delivery/zones"),
};
