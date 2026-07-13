import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/types";

export interface CateringCartItem {
  id: string; // Unique ID for the cart item
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  notes?: string;
  variants?: {
    groupName: string;
    selectedOption: string;
    additionalPrice: number;
  }[];
  itemTotal: number;
}

interface CateringStore {
  items: CateringCartItem[];
  addItem: (item: Omit<CateringCartItem, "id" | "itemTotal">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCateringStore = create<CateringStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        // Check if identical item (including variants) exists
        const existingIndex = items.findIndex(
          (i) =>
            i.menuItemId === item.menuItemId &&
            JSON.stringify(i.variants) === JSON.stringify(item.variants)
        );

        const variantCost =
          item.variants?.reduce((s, v) => s + v.additionalPrice, 0) || 0;
        const pricePerUnit = item.price + variantCost;

        if (existingIndex >= 0) {
          const updated = [...items];
          const newQty = updated[existingIndex].quantity + item.quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            itemTotal: newQty * pricePerUnit,
          };
          set({ items: updated });
        } else {
          const newItem: CateringCartItem = {
            ...item,
            id: `catering-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            itemTotal: item.quantity * pricePerUnit,
          };
          set({ items: [...items, newItem] });
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.id === id) {
              const variantCost =
                item.variants?.reduce((s, v) => s + v.additionalPrice, 0) || 0;
              const pricePerUnit = item.price + variantCost;
              return {
                ...item,
                quantity,
                itemTotal: quantity * pricePerUnit,
              };
            }
            return item;
          }),
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.itemTotal, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "catering-storage",
    }
  )
);
