import { api } from '@/lib/axios';

export type BankCard = {
  id: number;
  bank_id: number;
  card_type: string;
  fee: string;    
  fee_is_ttc: boolean;
  frequency: string; 
  notes: string;              
//   Bank: {                                 
//     id: number;
//     name: string;
//     logo_url: string;
//   };
};


type ApiListResponse<T> = { success: boolean; data: T[]; count?: number };
type ApiItemResponse<T> = { success: boolean; data: T };

export async function getBankCardsByBank(bankId: string): Promise<BankCard[]> {
  const { data } = await api.get<ApiListResponse<BankCard>>(`/bankcards/banks/${bankId}/bank-cards`);
  return data.data;
}


export async function getBankCardsById(id: string): Promise<BankCard> {
  const { data } = await api.get<ApiItemResponse<BankCard>>(`/bankcards/bank-cards/${id}`);
  return data.data;
}
