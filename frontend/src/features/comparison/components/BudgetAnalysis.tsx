// Version basée sur le schéma strict: within_budget / over_budget / missing_data

import { Link } from 'react-router-dom';
import type { Bank, CriteriaKey } from '../types';
import { formatAmount } from '../utils';

// ───────────────────────────────────────────────────────────────────────────────
// Types – Schéma API strict recommandé côté backend
// ───────────────────────────────────────────────────────────────────────────────
export interface BudgetAnalysisData {
  within_budget?: Array<{
    bank: Bank;
    status?: string;
    criteria?: CriteriaKey[];
  }>;
  over_budget?: Array<{
    bank: Bank;
    exceeded_criteria?: Array<{
      criterion: CriteriaKey;
      budget?: number;
      actual?: number;
      excess?: number; // attention: 0 est une valeur valide
    }>;
  }>;
  missing_data?: Array<{
    bank: Bank;
    missing_criteria: CriteriaKey[];
  }>;
}

// ───────────────────────────────────────────────────────────────────────────────
// Helpers UX – labels & liens selon critère
// ───────────────────────────────────────────────────────────────────────────────
function getCriteriaLabel(criteriaKey: CriteriaKey): string {
  switch (criteriaKey) {
    case 'account_monthly_fee':
      return 'Frais mensuels';
    case 'card_annual_fee':
      return 'Frais carte';
    default:
      return criteriaKey;
  }
}

function getCriteriaLink(bankId: number, criteria: CriteriaKey): { text: string; url: string } {
  switch (criteria) {
    case 'account_monthly_fee':
      return { text: '[voir le compte]', url: `/banks/${bankId}?tab=accounts` };
    case 'card_annual_fee':
      return { text: '[voir la carte]', url: `/banks/${bankId}?tab=cards` };
    default:
      return { text: '[voir détails]', url: `/banks/${bankId}` };
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// UI – sous-composants
// ───────────────────────────────────────────────────────────────────────────────
function BankHeader({ bankId, bankName }: { bankId: number; bankName: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-900">{bankName}</span>
      <Link
        to={`/banks/${bankId}`}
        className="text-blue-600 hover:text-blue-800 text-sm"
        aria-label={`Voir la fiche de ${bankName}`}
      >
        [voir la fiche banque]
      </Link>
    </div>
  );
}

function WithinBudgetSection({ banks }: { banks?: BudgetAnalysisData['within_budget'] }) {
  const items = banks ?? [];
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <h4 className="font-medium text-green-700 flex items-center gap-2">✅ Dans le budget</h4>
      {items.map((item) => (
        <div key={item.bank.id} className="pl-4 space-y-1">
          <BankHeader bankId={item.bank.id} bankName={item.bank.name} />

          {item.status && (
            <div className="pl-4 text-sm text-gray-600">{item.status}</div>
          )}

          {(item.criteria ?? []).length > 0 && (
            <div className="pl-4 space-y-1">
              {(item.criteria ?? []).map((criteria) => {
                const { text, url } = getCriteriaLink(item.bank.id, criteria);
                const label = getCriteriaLabel(criteria);
                return (
                  <div key={`${item.bank.id}-${criteria}`} className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{label} : Dans le budget</span>
                    <Link to={url} className="text-blue-600 hover:text-blue-800" aria-label={`${label} – ${text}`}>
                      {text}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function OverBudgetSection({ banks }: { banks?: BudgetAnalysisData['over_budget'] }) {
  const items = banks ?? [];
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <h4 className="font-medium text-orange-700 flex items-center gap-2">❌ Hors budget</h4>
      {items.map((item) => (
        <div key={item.bank.id} className="pl-4 space-y-1">
          <BankHeader bankId={item.bank.id} bankName={item.bank.name} />

          {(item.exceeded_criteria ?? []).length > 0 && (
            <div className="pl-4 space-y-1">
              {(item.exceeded_criteria ?? []).map((ex, j) => {
                const { text, url } = getCriteriaLink(item.bank.id, ex.criterion);
                const label = getCriteriaLabel(ex.criterion);

                const hasActual = typeof ex.actual === 'number';
                const hasExcess = typeof ex.excess === 'number';
                const detail = hasActual
                  ? hasExcess
                    ? ` (${formatAmount(ex.actual!)}, dépasse de ${formatAmount(ex.excess!)})`
                    : ` (${formatAmount(ex.actual!)})`
                  : '';

                return (
                  <div key={`${item.bank.id}-${ex.criterion}-${j}`} className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{label}{detail}</span>
                    <Link to={url} className="text-blue-600 hover:text-blue-800" aria-label={`${label} – ${text}`}>
                      {text}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function MissingDataSection({ banks }: { banks?: BudgetAnalysisData['missing_data'] }) {
  const items = banks ?? [];
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <h4 className="font-medium text-gray-600 flex items-center gap-2">ℹ️ Données manquantes</h4>
      {items.map((item) => (
        <div key={item.bank.id} className="pl-4 space-y-1">
          <BankHeader bankId={item.bank.id} bankName={item.bank.name} />

          {(item.missing_criteria ?? []).length > 0 && (
            <div className="pl-4 space-y-1">
              {(item.missing_criteria ?? []).map((criteria) => {
                const label = getCriteriaLabel(criteria);
                const specialized = criteria === 'card_annual_fee'
                  ? { text: '[voir offres cartes]', url: `/banks/${item.bank.id}?tab=cards` }
                  : getCriteriaLink(item.bank.id, criteria);
                return (
                  <div key={`${item.bank.id}-${criteria}`} className="flex items-center gap-2 text-sm text-gray-700">
                    <span>Pas de {label.toLowerCase()}</span>
                    <Link to={specialized.url} className="text-blue-600 hover:text-blue-800" aria-label={`${label} – ${specialized.text}`}>
                      {specialized.text}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Composant principal
// ───────────────────────────────────────────────────────────────────────────────
export default function BudgetAnalysis({ data }: { data?: BudgetAnalysisData }) {
  if (!data) {
    return <div className="text-sm text-gray-500 p-4">Aucune analyse de budget fournie par l'API.</div>;
  }

  const within = data.within_budget ?? [];
  const over = data.over_budget ?? [];
  const missing = data.missing_data ?? [];

  if (within.length + over.length + missing.length === 0) {
    let preview = '';
    try { preview = JSON.stringify(data, null, 2).slice(0, 1500); } catch { preview = "Impossible d'afficher l'aperçu"; }
    return (
      <div className="text-sm text-gray-700 p-3 border rounded-lg bg-yellow-50">
        <div className="font-semibold mb-2">Format d'analyse budget non reconnu ou vide.</div>
        <details>
          <summary className="cursor-pointer underline">Voir l'aperçu des données reçues</summary>
          <pre className="mt-2 whitespace-pre-wrap text-xs bg-white p-2 rounded border">{preview}</pre>
        </details>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Analyse Budget</h3>
      <WithinBudgetSection banks={within} />
      <OverBudgetSection banks={over} />
      <MissingDataSection banks={missing} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Usage
// ───────────────────────────────────────────────────────────────────────────────
// import BudgetAnalysis from './BudgetAnalysis';
// <BudgetAnalysis data={response.budget_analysis} />
// Assurez-vous que le backend renvoie les propriétés within_budget/over_budget/missing_data (au pire, vides).
