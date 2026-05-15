import client from './client';
import type { MenuQueryParams } from '@/types';

export const menuAPI = {
  getCategories: () => client.get('/menu/categories'),
  getCategoryById: (id: string) => client.get(`/menu/categories/${id}`),
  getItems: (params?: MenuQueryParams) => client.get('/menu/items', { params }),
  getItemById: (id: string) => client.get(`/menu/items/${id}`),
};
