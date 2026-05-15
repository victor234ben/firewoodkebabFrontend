import { create } from "zustand";
import client from "@/services/api/client";

interface GlobalSeo {
  siteTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleCode?: string;
}

interface SeoStore {
  globalSeo: GlobalSeo | null;
  fetch: () => Promise<void>;
}

export const useSeoStore = create<SeoStore>((set) => ({
  globalSeo: null,
  fetch: async () => {
    try {
      const res = await client.get("/public/seo/global");
      set({ globalSeo: res.data.data });
    } catch {
        set({ globalSeo: null });
    }
  },
}));