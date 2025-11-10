import axiosInstance from './axios.config';
import { User } from '@/app/types';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  async promoteToAdmin(userId: number): Promise<void> {
    await axiosInstance.post(`/users/${userId}/promote`);
  },

  async demoteToSeller(userId: number): Promise<void> {
    await axiosInstance.post(`/users/${userId}/demote`);
  },

  async getUserById(userId: number): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/${userId}`);
    return response.data;
  },
};