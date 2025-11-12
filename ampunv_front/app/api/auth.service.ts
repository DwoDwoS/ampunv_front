import axiosInstance from './axios.config';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/app/types';

function extractMessage(err: any): string {
  const server = err?.response?.data;
  if (!server) return err?.message || 'Erreur inconnue';
  if (typeof server === 'object' && server.message) return server.message;
  if (typeof server === 'object') {
    return server.error ? `${server.error}` : JSON.stringify(server);
  }
  return typeof server === 'string' ? server : err?.message || 'Erreur inconnue';
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (err: any) {
      throw new Error(extractMessage(err));
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (err: any) {
      throw new Error(extractMessage(err));
    }
  },

  async checkEmail(email: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get<{ exists: boolean }>('/auth/check-email', {
        params: { email },
      });
      return response.data.exists;
    } catch (err: any) {
      throw new Error(extractMessage(err));
    }
  },

  saveAuth(authData: AuthResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: authData.id,
        email: authData.email,
        firstname: authData.firstname,
        lastname: authData.lastname,
        role: authData.role,
      })
    );
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  },
};