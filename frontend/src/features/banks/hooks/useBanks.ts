import { useQuery } from '@tanstack/react-query';
import { getBanks } from '../api';
import { getBankById } from '../api';

export function useBanks() {
  return useQuery({ 
    queryKey: ['banks'], 
    queryFn: getBanks 
  });
}

export function useBank(id: string | undefined) {
  return useQuery({
    queryKey: ['bank', id],
    queryFn: () => getBankById(id as string),
    enabled: !!id, // n’exécute la requête que si id est défini
  });
}