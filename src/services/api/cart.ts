import client from "./client";
import type { AddCartItemDTO } from "@/types";

export const cartAPI = {
  getCart: () => client.get("/cart"),
  
  addItem: (data: AddCartItemDTO) => client.post("/cart/add", data),
  
  updateItem: (itemId: string, quantity: number, cartId?: string) =>
    client.put(`/cart/update/${itemId}`, { quantity, cartId }),
  
  removeItem: (itemId: string, cartId?: string) => 
    client.delete(`/cart/remove/${itemId}`, { data: { cartId } }),
  
  applyCoupon: (couponCode: string, cartId?: string) =>
    client.post("/cart/apply-coupon", { couponCode, cartId }),
  
  removeCoupon: (cartId?: string) => 
    client.delete("/cart/remove-coupon", { data: { cartId } }),
  
  clearCart: () => client.delete("/cart/clear"),
  
  migrateCart: async (guestCartId: string) => {
    const response = await client.post("/cart/migrate", {
      guestCartId,
    });
    return response.data;
  },
};