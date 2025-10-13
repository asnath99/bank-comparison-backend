import { useQuery } from '@tanstack/react-query';
import { getBanks } from './api';

export function useBanks() {
  return useQuery({ 
    queryKey: ['banks'], 
    queryFn: getBanks, 
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}
