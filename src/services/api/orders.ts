import client from './client';
import type { CreateOrderDTO } from '@/types';

export const ordersAPI = {
  create: (data: CreateOrderDTO) => client.post('/orders/create', data),
  getById: (id: string) => client.get(`/orders/${id}`),
  track: (id: string) => client.get(`/orders/${id}/track`),
  cancel: (id: string, reason: string) => client.put(`/orders/${id}/cancel`, { reason }),
  resendConfirmation: (id: string) => client.post(`/orders/${id}/resend-confirmation`),
  getUserOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    client.get('/orders/user', { params }),
  
};
