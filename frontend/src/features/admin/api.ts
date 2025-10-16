import type { AdminBank, AdminUser } from './types';
import type { BankFormValues } from './components/AddBankForm';
import type { LoginValues } from './components/LoginForm';
import type { UserFormValues } from './components/AddUserForm';
import { api } from '@/lib/axios';

// Bank Management
export const getAdminBanks = async (): Promise<AdminBank[]> => {
  const response = await api.get('/banks/all/admin');
  return response.data.data;
};

export const createAdminBank = async (bankData: BankFormValues): Promise<AdminBank> => {
  const response = await api.post('/banks', bankData);
  return response.data.data;
};

export const updateAdminBank = async ({ id, ...bankData }: { id: number } & BankFormValues): Promise<AdminBank> => {
  const response = await api.put(`/banks/${id}`, bankData);
  return response.data.data;
};

export const disableAdminBank = async (id: number): Promise<void> => {
  await api.delete(`/banks/${id}`);
};

export const permanentlyDeleteAdminBank = async (id: number): Promise<void> => {
  await api.delete(`/banks/${id}/permanent`);
};

export const deactivateAdminBank = async (id: number): Promise<void> => {
  await api.patch(`/banks/${id}/deactivate`);
};

export const reactivateAdminBank = async (id: number): Promise<void> => {
  await api.patch(`/banks/${id}/reactivate`);
};

export const deactivateAdminUser = async (id: number): Promise<void> => {
  await api.patch(`/admin/users/${id}/deactivate`);
};

// Auth
export const loginAdmin = async (credentials: LoginValues): Promise<{ token: string }> => {
  const response = await api.post('/admin/login', credentials);
  return response.data;
};

// User Management
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await api.get('/admin/users');
  return response.data.data;
};

export const createAdminUser = async (userData: UserFormValues): Promise<AdminUser> => {
  const response = await api.post('/admin/users', userData);
  return response.data.data;
};

export const updateAdminUser = async ({ id, ...userData }: { id: number } & Partial<UserFormValues>): Promise<AdminUser> => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data.data;
};

export const disableAdminUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

export const reactivateAdminUser = async (id: number): Promise<void> => {
  await api.patch(`/admin/users/${id}/reactivate`);
};

export const permanentlyDeleteAdminUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}/permanent`);
};