import apiClient from './client';
import { User, PublicUserDTO } from '@/types';

export const userApi = {
  getPublicProfile: async (id: number): Promise<PublicUserDTO> => {
    const response = await apiClient.get<PublicUserDTO>(`/api/users/${id}/public`);
    return response.data;
  },

  getMyProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/users/myprofile');
    return response.data;
  },

  getUserProfile: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/api/users/${id}`);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/api/users');
    return response.data;
  },

  promoteToAdmin: async (userId: number): Promise<void> => {
    await apiClient.post(`/api/admin/users/${userId}/promote`);
  },

  demoteToSeller: async (userId: number): Promise<void> => {
    await apiClient.post(`/api/admin/users/${userId}/demote`);
  },

  updateMyProfile: async (data: { firstname: string; lastname: string; email: string; cityId: number }): Promise<User> => {
    const response = await apiClient.put<User>('/api/users/myprofile', data);
    return response.data;
  },

  updatePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.put('/api/users/myprofile/password', data);
  },

  deleteMyAccount: async (): Promise<void> => {
    await apiClient.delete('/api/users/myprofile');
  },
};