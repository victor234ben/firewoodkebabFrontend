import client from './client';
import type { InitPaymentDTO } from '@/types';

export const paymentAPI = {
  initialize: (data: InitPaymentDTO) => client.post('/payment/initialize', data),
  verify: (reference: string) => client.post('/payment/verify', { reference }),
  getStatus: (orderId: string) => client.get(`/payment/${orderId}/status`),
};
