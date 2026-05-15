import client from "./api/client";

export interface Banner {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  _id?: string;
  id?: string;
  code: string;
  type: "fixed_amount" | "percentage";
  value: number;
  description?: string;
  minOrderAmount?: number;
  maxUsagePerUser?: number;
  maxTotalUsage?: number;
  currentUsageCount?: number; G
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const normalizeId = <T extends { _id?: string; id?: string }>(item: T): T => ({
  ...item,
  id: item.id || item._id,
});

export const promotionsAPI = {
  // ── Banners (public) ──────────────────────────────────────
  getBanners: async (): Promise<Banner[]> => {
    const { data } = await client.get("/promotions/banners");
    const raw = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
    return raw.map(normalizeId);
  },

  getBannerById: async (id: string): Promise<Banner> => {
    const { data } = await client.get(`/promotions/banners/${id}`);
    return normalizeId(data?.data ?? data);
  },

  // ── Coupons (public — validate only) ─────────────────────
  validateCoupon: async (
    code: string,
  ): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    const { data } = await client.get(
      `/promotions/coupons/validate/${code.toUpperCase()}`,
    );
    return {
      ...data,
      coupon: data?.coupon ? normalizeId(data.coupon) : undefined,
    };
  },
};