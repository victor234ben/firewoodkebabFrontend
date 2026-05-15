import client from './client';
import type { LoginDTO, RegisterDTO, ResetPasswordDTO } from '@/types';

export const authAPI = {
  register: (data: RegisterDTO) => client.post('/auth/register', data),
  login: (data: LoginDTO) => client.post('/auth/login', data),
  logout: (refreshToken?: string) => client.post('/auth/logout', { refreshToken }),
  refreshToken: (refreshToken: string) => client.post('/auth/refresh-token', { refreshToken }),
  forgotPassword: (email: string) => client.post('/auth/forgot-password', { email }),
  resetPassword: (data: ResetPasswordDTO) => client.post('/auth/reset-password', data),
};
