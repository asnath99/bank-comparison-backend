import { useQuery } from '@tanstack/react-query';
import { getAllAccountTypes, getBankAccountsByBank, getBankAccountsById} from '../api';

export function useAccountTypes(bankIds: number[] | 'ALL' | []) {
  const key =
    bankIds === 'ALL'
      ? 'ALL'
      : Array.isArray(bankIds)
      ? bankIds.slice().sort((a, b) => a - b).join(',')
      : 'NONE';

  return useQuery<string[]>({
    queryKey: ['account-types', key],
    queryFn: () => getAllAccountTypes(bankIds),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useBankAccounts(bankId: string | undefined) {
  return useQuery({
    queryKey: ['bank-accounts', bankId],
    queryFn: () => getBankAccountsByBank(bankId as string),
    enabled: !!bankId,
  });
}

export function useBankAccount(id: string | undefined) {
  return useQuery({
    queryKey: ['bank-account', id],
    queryFn: () => getBankAccountsById(id as string),
    enabled: !!id, // n’exécute la requête que si id est défini
  });
}