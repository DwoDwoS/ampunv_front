import apiClient from './client';

export interface ImageUploadResponse {
  id: number;
  url: string;
  name: string;
  isPrimary: boolean;
  message: string;
}

export const imageApi = {
  uploadImageForFurniture: async (
    file: File,
    furnitureId: number,
    altText?: string
  ): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('furniture_id', furnitureId.toString());
    if (altText) {
      formData.append('alt_text', altText);
    }

    try {
      const response = await apiClient.post<ImageUploadResponse>(
        '/api/images/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getImagesByFurniture: async (furnitureId: number) => {
    const response = await apiClient.get(`/api/images/furniture/${furnitureId}`);
    return response.data;
  },

  getPrimaryImage: async (furnitureId: number) => {
    const response = await apiClient.get(`/api/images/furniture/${furnitureId}/primary`);
    return response.data;
  },

  setPrimaryImage: async (imageId: number, furnitureId: number) => {
    const response = await apiClient.put(
      `/api/images/${imageId}/set-primary`,
      null,
      {
        params: { furniture_id: furnitureId },
      }
    );
    return response.data;
  },

  deleteImage: async (imageId: number) => {
    const response = await apiClient.delete(`/api/images/${imageId}`);
    return response.data;
  },
};