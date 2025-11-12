export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  cityId: number;
  role: 'SELLER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  cityId: number;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface PublicUserDTO {
  id: number;
  displayName: string;
  cityName: string;
  memberSince: string;
}

export interface Furniture {
  id: number;
  title: string;
  description: string;
  price: number;
  furnitureTypeId: number;
  furnitureTypeName?: string;
  materialId?: number;
  materialName?: string;
  colorId?: number;
  colorName?: string;
  cityId: number;
  cityName?: string;
  condition: string;
  status: 'AVAILABLE' | 'PENDING' | 'SOLD';
  sellerId: number;
  sellerName?: string;
  primaryImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFurnitureRequest {
  title: string;
  description: string;
  price: number;
  furnitureTypeId: number;
  materialId?: number;
  colorId?: number;
  cityId: number;
  condition: string;
}

export interface UpdateFurnitureRequest {
  title?: string;
  description?: string;
  price?: number;
  furnitureTypeId?: number;
  materialId?: number;
  colorId?: number;
  cityId?: number;
  condition?: string;
  status?: 'AVAILABLE' | 'PENDING' | 'SOLD';
}

export interface Image {
  id: number;
  url: string;
  name: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
  furnitureId: number;
}

export interface ImageUploadResponse {
  id: number;
  url: string;
  name: string;
  isPrimary: boolean;
  message: string;
}

export interface City {
  id: number;
  name: string;
  postalCode: string;
  department: string;
}

export interface FurnitureType {
  id: number;
  name: string;
  description?: string;
}

export interface Material {
  id: number;
  name: string;
  description?: string;
}

export interface Color {
  id: number;
  name: string;
  hexCode: string;
  description?: string;
}

export interface ReferenceData {
  furnitureTypes: FurnitureType[];
  materials: Material[];
  colors: Color[];
}