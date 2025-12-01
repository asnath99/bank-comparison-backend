import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchBanks, postComparison } from './api';
import type{ ComparisonRequest, ComparisonResponse } from './types';

export function useBanks() {
  return useQuery({ queryKey: ['banks'], queryFn: fetchBanks, staleTime: 5 * 60 * 1000 });
}

export function useComparison() {
  return useMutation<ComparisonResponse, Error, ComparisonRequest>({
    mutationFn: postComparison,
  });
}