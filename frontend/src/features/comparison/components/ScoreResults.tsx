import { useMemo } from 'react';
import type { CriteriaKey, Bank } from '../types';
import { formatAmount } from '../utils';

const LABEL: Record<CriteriaKey, string> = {
  account_monthly_fee: 'Frais mensuels',
  card_annual_fee: 'Frais carte',
};

type PerCriterion = {
  score?: number | string;
  value?: number | string;
  display?: string;     // ex: "2 500 FCFA"
  notes?: string[];     // ou chaîne unique, qu’on normalise en tableau
};

type ScoreItem = {
  bank: Bank;
  score?: number | string; // 0..100 ou '—'
  perCriteria: Record<CriteriaKey, PerCriterion>;
};

type ScoreResponse = {
  ranking?: ScoreItem[] | { items?: ScoreItem[] } | unknown;
};

// Normalise le payload vers ScoreItem[]
function normalizeRanking(resp: ScoreResponse | any): ScoreItem[] {
  const raw: unknown =
    Array.isArray(resp?.ranking) ? resp?.ranking :
    Array.isArray(resp?.ranking?.items) ? resp?.ranking?.items :
    [];

  if (!Array.isArray(raw)) return [];

  return raw.map((it: any, idx: number): ScoreItem => {
    const bank: Bank =
      it?.bank ??
      it?.bankInfo ??
      { id: (typeof it?.id === 'number' ? it.id : idx), name: it?.name ?? '—' };

    // perCriteria alias
    const per = (it?.perCriteria ?? it?.per_criteria ?? {}) as Record<string, PerCriterion>;

    // Normalise notes en tableau 
    const perCriteria = Object.fromEntries(
      Object.entries(per).map(([k, v]) => {
        const notes = Array.isArray(v?.notes)
          ? v?.notes
          : v?.notes != null
            ? [String(v?.notes)]
            : [];
        return [k, { ...v, notes }];
      })
    ) as Record<CriteriaKey, PerCriterion>;

    return {
      bank,
      score: it?.score,
      perCriteria,
    };
  });
}

export default function ScoreResults({
  response,
  criteria,
  sort = 'desc', // 'none' | 'asc' | 'desc'
}: {
  response: ScoreResponse;
  criteria: CriteriaKey[];
  sort?: 'none' | 'asc' | 'desc';
}) {
  const ranking = useMemo(() => normalizeRanking(response), [response]);

  // Tri optionnel par score global (numériques d'abord, puis non-numériques)
  const ranked = useMemo(() => {
    if (sort === 'none') return ranking;
    const dir = sort === 'asc' ? 1 : -1;
    return [...ranking].sort((a, b) => {
      const an = typeof a.score === 'number' ? a.score : Number.NEGATIVE_INFINITY;
      const bn = typeof b.score === 'number' ? b.score : Number.NEGATIVE_INFINITY;
      return (bn - an) * (dir === -1 ? 1 : -1);
    });
  }, [ranking, sort]);

  if (ranked.length === 0) {
    return <div className="text-sm text-gray-500">Aucun score à afficher.</div>;
  }

  return (
    <div className="space-y-4">
      {ranked.map((item, idx) => {
        const bank = item.bank ?? { id: idx, name: '—' };
        const isNum = typeof item.score === 'number';
        const overall = isNum ? Math.round(item.score as number) : (item.score ?? '—');

        return (
          <div key={bank.id ?? idx} className="p-4 bg-white rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{bank.name}</div>
              <div className="text-sm">
                Score global :{' '}
                <span className="inline-block px-2 py-0.5 rounded bg-gray-900 text-white">
                  {overall}{isNum ? '/100' : ''}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {criteria.map((ck) => {
                const c = item.perCriteria?.[ck] ?? {};
                // (A noter que les scores ne doivent pas être montré au client servent juste pour le classement)
                const isCNum = typeof c.score === 'number';
                const cScore = isCNum ? Math.round(c.score as number) : c.score ?? '—';

                // display préférentiel, sinon formatage value si number
                const display =
                  c.display ??
                  (typeof c.value === 'number'
                    ? formatAmount(c.value as number)
                    : typeof c.value === 'string'
                      ? c.value
                      : undefined);

                const notes = Array.isArray(c.notes) ? c.notes : [];

                return (
                  <div key={ck} className="p-3 border rounded-xl">
                    <div className="font-medium">{LABEL[ck]}</div>
                    <div className="mt-1">
                      Score : <b>{cScore}</b>{isCNum ? '/100' : ''}
                    </div>
                    {display && <div className="text-gray-700">Valeur : {display}</div>}
                    {notes.length > 0 && (
                      <ul className="list-disc pl-4 text-gray-600 mt-1">
                        {notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
