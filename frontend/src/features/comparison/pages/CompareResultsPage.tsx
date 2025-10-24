import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resolveMode } from '../config';
import { useComparison } from '../hooks';
import type {
  Selection,
  ComparisonRequest,
  CriteriaKey,
  Filters,
  Budgets,
  ComparisonMode,
  ComparisonResponse,
  ScoreResponse,
  PlainResponse,
} from '../types';
import ResultsSummaryBar from '../components/ResultsSummaryBar';
import { PlainResults } from '../components/PlainResults';
import ScoreResults from '../components/ScoreResults';
import UnknownMode from '../components/UnknownMode';

// ─── Type guards ───────────────────────────────────────────────────────────────
function isScoreResponse(r: ComparisonResponse): r is ScoreResponse {
  return r.mode === 'score';
}
function isPlainResponse(r: ComparisonResponse): r is PlainResponse {
  return r.mode === 'plain';
}

function parseParams(sp: URLSearchParams): Selection {
  const bankIdsParam = sp.get('banks');
  const bankIds =
    bankIdsParam === 'ALL' || !bankIdsParam
      ? 'ALL'
      : bankIdsParam.split(',').map(Number).filter(Number.isFinite);

  const accountType = sp.get('accountType') || undefined;

  const criteria =
    (sp.get('criteria')?.split(',') as CriteriaKey[] | undefined)?.filter(Boolean) ??
    ['account_monthly_fee'];

  const budgetsRaw = sp.get('budgets');
  const budgets: Budgets = budgetsRaw ? JSON.parse(budgetsRaw) : {};

  return { bankIds, accountType, criteria, budgets };
}

export default function CompareResultsPage() {
  const [sp] = useSearchParams();
  const selection = useMemo<Selection>(() => parseParams(sp), [sp]);

  // Mode "brut" (URL/env) et mode "effectif" UI
  const { raw: rawMode } = resolveMode(sp);

  const { mutate, data, isPending, isError, error } = useComparison();

  // Serialize complex objects for useEffect dependencies
  const criteriaJson = JSON.stringify(selection.criteria);
  const budgetsJson = JSON.stringify(selection.budgets);

  useEffect(() => {
    let filters: Filters | undefined;
    if (selection.accountType && selection.criteria.includes('account_monthly_fee')) {
      filters = { account_monthly_fee: { type: [selection.accountType] } };
    }

    const hasBudgets =
      !!selection.budgets &&
      Object.values(selection.budgets).some((v) => typeof v === 'number' && Number.isFinite(v));

    const payload: ComparisonRequest = {
      criteria: selection.criteria,
      mode: rawMode as ComparisonMode,
      bankIds: selection.bankIds === 'ALL' ? undefined : selection.bankIds,
      ...(filters ? { filters } : {}),
      ...(hasBudgets ? { budgets: selection.budgets } : {}),
    };

    // eslint-disable-next-line no-console
    if (import.meta.env.DEV) console.debug('POST /comparison payload', payload);
    mutate(payload);
  }, [
    rawMode,
    selection.bankIds,
    selection.accountType,
    criteriaJson,
    budgetsJson,
    mutate,
    selection.criteria,
    selection.budgets,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Résultats de la comparaison</h1>
        {/* <Link to={`/compare?${sp.toString()}`} className="underline">Modifier la sélection</Link> */}
      </div>

      <ResultsSummaryBar selection={selection} />

      <div className="pt-2">
        {isPending && <div className="animate-pulse h-32 bg-gray-100 rounded-2xl" />}
        {isError && (
          <div className="p-4 border rounded-2xl text-red-700 bg-red-50">
            {error?.message ?? 'Erreur inconnue'}
          </div>
        )}

        {data ? (
          isScoreResponse(data) ? (
            <ScoreResults response={data} criteria={selection.criteria as CriteriaKey[]} />
          ) : isPlainResponse(data) ? (
            <PlainResults results={data} />
          ) : (
            <UnknownMode mode={(data as any)?.mode} payload={data} />
          )
        ) : null}
      </div>
    </div>
  );
}
