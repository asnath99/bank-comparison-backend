import { api } from '@/lib/axios';

export type Bank = { 
    id: number; 
    name: string;
    logo_url?: string | null;
    description?: string | null
};

type ApiListResponse<T> = {success: boolean; data: T[]; count?: number;};
type ApiItemResponse<T> = { success: boolean; data: T };


export async function getBanks(): Promise<Bank[]> {
  const { data } = await api.get<ApiListResponse<Bank>>('/banks'); 
  return data.data;
}

export async function getBankById(id: string): Promise<Bank> {
  const { data } = await api.get<ApiItemResponse<Bank>>(`/banks/${id}`);
  return data.data;
}
