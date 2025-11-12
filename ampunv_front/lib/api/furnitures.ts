import apiClient from './client';
import { Furniture, CreateFurnitureRequest, UpdateFurnitureRequest } from '@/types';

export const furnitureApi = {
  getAll: async (): Promise<Furniture[]> => {
    const response = await apiClient.get<Furniture[]>('/api/furnitures');
    return response.data;
  },

  getById: async (id: number): Promise<Furniture> => {
    const response = await apiClient.get<Furniture>(`/api/furnitures/${id}`);
    return response.data;
  },

  create: async (data: CreateFurnitureRequest): Promise<Furniture> => {
    const response = await apiClient.post<Furniture>('/api/furnitures', data);
    return response.data;
  },

  getMyFurnitures: async (): Promise<Furniture[]> => {
    const response = await apiClient.get<Furniture[]>('/api/furnitures/my-furnitures');
    return response.data;
  },

  update: async (id: number, data: UpdateFurnitureRequest): Promise<Furniture> => {
    const response = await apiClient.put<Furniture>(`/api/furnitures/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/furnitures/${id}`);
  },

  search: async (keyword: string): Promise<Furniture[]> => {
    const response = await apiClient.get<Furniture[]>(
      `/api/furnitures/search?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },
};