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
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface Furniture {
  id: number;
  title: string;
  description: string;
  price: number;
  furnitureTypeId: number;
  materialId?: number;
  colorId?: number;
  cityId: number;
  condition: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  sellerId: number;
  createdAt: string;
  updatedAt: string;
}