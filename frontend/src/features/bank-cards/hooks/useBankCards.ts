import { useQuery } from '@tanstack/react-query';
import { getBankCardsByBank } from '../api';
import { getBankCardsById } from '../api';

export function useBankCards(bankId: string | undefined) {
  return useQuery({
    queryKey: ['bank-cards', bankId],
    queryFn: () => getBankCardsByBank(bankId as string),
    enabled: !!bankId,
  });
}

export function useBankCard(id: string | undefined) {
  return useQuery({
    queryKey: ['bank-card', id],
    queryFn: () => getBankCardsById(id as string),
    enabled: !!id, // n’exécute la requête que si id est défini
  });
}
