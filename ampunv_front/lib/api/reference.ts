import apiClient from './client';
import { City, ReferenceData, FurnitureType, Material, Color } from '@/types';

export const referenceApi = {
  getAll: async (): Promise<ReferenceData> => {
    const response = await apiClient.get<ReferenceData>('/api/reference-data/all');
    return response.data;
  },

  getCities: async (): Promise<City[]> => {
    const response = await apiClient.get<City[]>('/api/cities');
    return response.data;
  },

  getFurnitureTypes: async (): Promise<FurnitureType[]> => {
    const response = await apiClient.get<FurnitureType[]>('/api/reference-data/furniture-types');
    return response.data;
  },

  getMaterials: async (): Promise<Material[]> => {
    const response = await apiClient.get<Material[]>('/api/reference-data/materials');
    return response.data;
  },

  getColors: async (): Promise<Color[]> => {
    const response = await apiClient.get<Color[]>('/api/reference-data/colors');
    return response.data;
  },
};