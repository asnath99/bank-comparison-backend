import { api } from '@/lib/axios';

export type BankAccount = {
  id: number;
  bank_id: number;
  type: string;
  monthly_fee: string;                   
  monthly_fee_is_ttc: boolean;
//   has_variable_fees: boolean;
//   variable_fee_rules: any;
//   currency: string;                       
  currency_display: string;               
//   currency_code: string;                   
   notes: string;

//   Bank: {                                 
//     id: number;
//     name: string;
//     logo_url: string;
//   };
};


type ApiListResponse<T> = { success: boolean; data: T[]; count?: number };
type ApiItemResponse<T> = { success: boolean; data: T };

export async function getAllAccountTypes(bankIds: number[] | 'ALL' | []): Promise<string[]> {
  const params: Record<string, string> = {};
  if (Array.isArray(bankIds) && bankIds.length > 0) {
    params.bankIds = bankIds.join(',');
  }
  const { data } = await api.get<ApiListResponse<string>>('/bank-accounts', {
    params
  });
  return data.data ?? [];
}

export async function getBankAccountsByBank(bankId: string): Promise<BankAccount[]> {
  const { data } = await api.get<ApiListResponse<BankAccount>>(`/banks/${bankId}/bank-accounts`);
  return data.data;
}

export async function getBankAccountsById(id: string): Promise<BankAccount> {
  const { data } = await api.get<ApiItemResponse<BankAccount>>(`/bank-accounts/${id}`);
  return data.data;
}


