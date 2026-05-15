import client from './client';
import type { CreateReviewDTO } from '@/types';

export const reviewsAPI = {
  create: (data: CreateReviewDTO) => client.post('/reviews', data),
  getByOrder: (orderId: string) => client.get(`/reviews/order/${orderId}`),
  getByItem: (itemId: string, params?: { page?: number; limit?: number; sort?: string }) =>
    client.get(`/reviews/item/${itemId}`, { params }),
  update: (id: string, data: Partial<CreateReviewDTO>) => client.put(`/reviews/${id}`, data),
  delete: (id: string) => client.delete(`/reviews/${id}`),
  markHelpful: (id: string) => client.post(`/reviews/${id}/helpful`),
};
