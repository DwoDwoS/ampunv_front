import apiClient from './client';
import { Image, ImageUploadResponse } from '@/types';

export const imageApi = {
  upload: async (file: File, furnitureId: number, altText?: string): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('furniture_id', furnitureId.toString());
    if (altText) {
      formData.append('alt_text', altText);
    }

    const response = await apiClient.post<ImageUploadResponse>('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getByFurniture: async (furnitureId: number): Promise<Image[]> => {
    const response = await apiClient.get<Image[]>(`/api/images/furniture/${furnitureId}`);
    return response.data;
  },

  getPrimaryImage: async (furnitureId: number): Promise<Image | null> => {
    try {
      const response = await apiClient.get<Image>(`/api/images/furniture/${furnitureId}/primary`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  setPrimary: async (imageId: number, furnitureId: number): Promise<void> => {
    await apiClient.put(`/api/images/${imageId}/set-primary?furniture_id=${furnitureId}`);
  },

  delete: async (imageId: number): Promise<void> => {
    await apiClient.delete(`/api/images/${imageId}`);
  },
};