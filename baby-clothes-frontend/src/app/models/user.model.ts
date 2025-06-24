export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRegistration {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  id?: number;
}