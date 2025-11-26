import apiClient from './client';
import { City, ReferenceData, FurnitureType, Material, Color } from '@/types';

export const referenceApi = {
  getAll: async (): Promise<ReferenceData> => {
    const [furnitureTypesRes, materialsRes, colorsRes, citiesRes] = await Promise.all([
      apiClient.get<FurnitureType[]>('/api/reference-data/furniture-types'),
      apiClient.get<Material[]>('/api/reference-data/materials'),
      apiClient.get<Color[]>('/api/reference-data/colors'),
      apiClient.get<City[]>('/api/cities'),
    ]);

    return {
      furnitureTypes: furnitureTypesRes.data || [],
      materials: materialsRes.data || [],
      colors: colorsRes.data || [],
      cities: citiesRes.data || [],
    };
  },

  getCities: async (): Promise<City[]> => {
    const response = await apiClient.get<City[]>('/api/cities');
    return response.data || [];
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