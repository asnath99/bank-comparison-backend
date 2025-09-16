import { useMemo } from 'react';
import type { CriteriaKey } from '../types';

type Selection = {
  bankIds: number[] | 'ALL';
  accountType?: string;
  criteria: CriteriaKey[];
  budgets: Partial<Record<CriteriaKey, number | undefined>>;
};

const CRITERIA_LABELS: Record<CriteriaKey, string> = {
  account_monthly_fee: 'Frais mensuels',
  card_annual_fee: 'Frais carte',
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('fr-FR').format(v) + ' FCFA';

// règle: > 0 ⇒ budget valide (0 est ignoré)
const isValidBudget = (v: unknown): v is number =>
  typeof v === 'number' && v > 0;

export default function ResultsSummaryBar({ selection }: { selection: Selection }) {
  // Budgets valides, ordonnés comme les critères sélectionnés (puis le reste)
  const budgetEntries = useMemo(() => {
    const entries = Object.entries(selection.budgets ?? {}) as Array<[CriteriaKey, number | undefined]>;
    const valid = entries.filter(([, value]) => isValidBudget(value));

    // trie d’abord selon l’ordre des critères sélectionnés
    const order = new Map<CriteriaKey, number>(
      selection.criteria.map((k, i) => [k, i])
    );
    valid.sort(([a], [b]) => {
      const ia = order.has(a) ? (order.get(a) as number) : Number.POSITIVE_INFINITY;
      const ib = order.has(b) ? (order.get(b) as number) : Number.POSITIVE_INFINITY;
      return ia - ib;
    });

    return valid; // Array<[CriteriaKey, number]>
  }, [selection.budgets, selection.criteria]);

  const hasValidBudgets = budgetEntries.length > 0;

  const banksChip =
    selection.bankIds === 'ALL'
      ? 'Toutes'
      : String(selection.bankIds.length);

  const criteriaText =
    selection.criteria.length > 0
      ? selection.criteria.map((c) => CRITERIA_LABELS[c]).join(' + ')
      : '—';

  return (
    <div className="p-4 bg-white rounded-2xl border shadow-sm">
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="px-2 py-1 rounded-full bg-gray-100">
          Banques : <b>{banksChip}</b>
        </div>

        {selection.accountType && (
          <div className="px-2 py-1 rounded-full bg-gray-100">
            Type de compte : <b>{selection.accountType}</b>
          </div>
        )}

        <div className="px-2 py-1 rounded-full bg-gray-100">
          Critères : <b>{criteriaText}</b>
        </div>

        {hasValidBudgets ? (
          <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            Budgets:
            {budgetEntries.map(([k, v]) => (
              <span key={k} className="ml-1">
                {CRITERIA_LABELS[k]} : <b>{formatCurrency(v!)}</b>
              </span>
            ))}
          </div>
        ) : (
          <div className="px-2 py-1 rounded-full bg-green-100 text-green-800">
            <b>Sans contrainte de budget</b>
          </div>
        )}
      </div>
    </div>
  );
}
