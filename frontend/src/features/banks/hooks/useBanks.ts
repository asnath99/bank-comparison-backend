import { useQuery } from '@tanstack/react-query';
import { getBanks, getBankById } from '../api';

export function useBanks() {
  return useQuery({ queryKey: ['banks'], queryFn: getBanks });
}

export function useBank(id: string) {
  return useQuery({ queryKey: ['bank', id], queryFn: () => getBankById(id), enabled: !!id });
}
