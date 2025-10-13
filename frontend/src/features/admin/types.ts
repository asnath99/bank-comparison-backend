export interface AdminBank {
  id: number;
  name: string;
  country: string;
  website: string;
  description: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  role: 'admin' | 'super-admin';
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}