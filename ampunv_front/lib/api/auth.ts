import apiClient from './client';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  checkEmail: async (email: string): Promise<boolean> => {
    const response = await apiClient.get<{ exists: boolean }>(
      `/api/auth/check-email?email=${encodeURIComponent(email)}`
    );
    return response.data.exists;
  },

  saveAuth: (authResponse: AuthResponse): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', authResponse.token);
      localStorage.setItem('user', JSON.stringify({
        id: authResponse.userId,
        email: authResponse.email,
        firstname: authResponse.firstname,
        lastname: authResponse.lastname,
        role: authResponse.role,
      }));
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  getUser: (): any | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      return !!token && !!user;
    }
    return false;
  },

  isAdmin: (): boolean => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.role === 'ADMIN';
      }
    }
    return false;
  },

  isSeller: (): boolean => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.role === 'SELLER' || userData.role === 'ADMIN';
      }
    }
    return false;
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },
};