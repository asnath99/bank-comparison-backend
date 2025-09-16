/**
 * Composant d'affichage des résultats de comparaison bancaire
 * Gère 2 modes : tri simple (sans budget) et analyse détaillée (avec budgets)
 * Toute la logique est regroupée ici
 */

// src/features/comparison/components/PlainResults.tsx
// Version LITE : tout-en-un, mais découpé par sections internes.
// - Conserve l’UX du composant original (sans budget vs affichage Budget par blocs)
// - Garde des sous-fonctions/"hooks" internes + useMemo pour les calculs
// - Zéro dépendance à des fichiers supplémentaires

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type {
  PlainResponse,
  CriteriaKey,
  PlainRankingItem,
  PlainCriterionBlockV1,
  Bank,
} from '../types';
import { formatAmount } from '../utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Building2, Eye, CheckCircle, AlertTriangle, XCircle, ExternalLink, Wallet, CreditCard, TrendingUp } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────────
  Shared: labels & icons
────────────────────────────────────────────────────────────────────────────── */
const LABEL: Record<CriteriaKey, { label: string; tab: 'accounts' | 'cards'; missingPhrase: string; otherLinkText: string; icon: any }> = {
  account_monthly_fee: { label: 'Compte :', tab: 'accounts', missingPhrase: 'Indisponible', otherLinkText: 'Explorer', icon: Wallet },
  card_annual_fee: { label: 'Carte :', tab: 'cards', missingPhrase: 'Indisponible', otherLinkText: 'Explorer', icon: CreditCard },
};

/* ──────────────────────────────────────────────────────────────────────────────
  Utils (purs) – normalisation budget, index per-bank, liens produits
────────────────────────────────────────────────────────────────────────────── */
function mkBank(x: any): Bank {
  if (!x) return { id: -1, name: '—' } as Bank;
  if (typeof x === 'number') return { id: x, name: `Banque #${x}` } as Bank;
  if ((x as any).id && (x as any).name) return x as Bank;
  if ((x as any).bank && (x as any).bank.id) return (x as any).bank as Bank;
  return { id: (x as any).id ?? -1, name: (x as any).name ?? '—' } as Bank;
}
function mkCrit(x: any): CriteriaKey | undefined {
  return (x?.criterion || x?.key || x?.criteria?.key) as CriteriaKey | undefined;
}

function normalizeBudget(b: any) {
  if (b?.within_budget || b?.over_budget || b?.missing_data) {
    return {
      within: (b.within_budget ?? []).map((w: any) => ({ bank: mkBank(w.bank ?? w), criteria: w.criteria_met ?? w.criteria ?? undefined })),
      over: (b.over_budget ?? []).map((o: any) => ({ bank: mkBank(o.bank ?? o), items: (o.exceeded_criteria ?? []).map((it: any) => ({ criterion: mkCrit(it)!, budget: it.budget, value: it.actual ?? it.value, overBy: it.excess ?? it.overBy })) })),
      missing: (b.missing_data ?? []).map((m: any) => ({ bank: mkBank(m.bank ?? m), criteria: m.missing_criteria ?? [] })),
    } as const;
  }
  if (b?.within && b?.over && b?.missing) return b as any;
  return { within: [], over: [], missing: [] } as const;
}

function buildPerBankIndex(per: PlainResponse['per_criterion']) {
  const idx = new Map<number, Record<CriteriaKey, PlainRankingItem>>();
  if (!per) return idx;
  const add = (crit: CriteriaKey, rows: PlainRankingItem[]) => {
    for (const r of rows ?? []) {
      const id = r.bank.id;
      if (!idx.has(id)) idx.set(id, {} as any);
      (idx.get(id) as any)[crit] = r;
    }
  };
  if (Array.isArray(per) && (per as any)[0]?.criteria) {
    for (const b of per as PlainCriterionBlockV1[]) add(b.criteria.key as CriteriaKey, b.ranking);
  } else if (!Array.isArray(per) && typeof per === 'object') {
    for (const [crit, rows] of Object.entries(per as Record<string, PlainRankingItem[]>)) add(crit as CriteriaKey, rows ?? []);
  }
  return idx;
}

function buildProductLink(
  bankId: number,
  criteria: CriteriaKey,
  row?: PlainRankingItem & { account_id?: number; card_id?: number; product_id?: number; productId?: number; meta?: { account_id?: number; card_id?: number; product_id?: number; productId?: number } }
) {
  const pick = (...xs: Array<number | undefined>) => xs.find((v) => typeof v === 'number');
  const accountPid = pick(row?.account_id, row?.meta?.account_id, criteria === 'account_monthly_fee' ? row?.product_id ?? row?.productId ?? row?.meta?.product_id ?? row?.meta?.productId : undefined);
  const cardPid = pick(row?.card_id, row?.meta?.card_id, criteria === 'card_annual_fee' ? row?.product_id ?? row?.productId ?? row?.meta?.product_id ?? row?.meta?.productId : undefined);
  if (criteria === 'account_monthly_fee') return accountPid ? `/accounts/${accountPid}` : `/banks/${bankId}?tab=accounts`;
  if (criteria === 'card_annual_fee') return cardPid ? `/cards/${cardPid}` : `/banks/${bankId}?tab=cards`;
  return `/banks/${bankId}`;
}

function formatValue(n: any) {
  const num = typeof n === 'number' ? n : Number.isNaN(Number(n)) ? null : Number(n);
  if (num == null) return 'Non communiqué';
  return new Intl.NumberFormat('fr-FR').format(num);
}


function BankLines({ bankId, bankName, criteria, perBankMap, context, overItems }: {
  bankId: number; bankName: string; criteria: CriteriaKey[]; perBankMap: Record<CriteriaKey, PlainRankingItem>; context: 'within'|'over'|'missing'; overItems?: Array<{ criterion: CriteriaKey; overBy?: number }>
}) {
  return (
    <div className="divide-y">
      {criteria.map((ck) => {
        const row = perBankMap[ck];
        const meta = LABEL[ck];
        const Icon = meta.icon;
        const overItem = context === 'over' ? overItems?.find((it) => it.criterion === ck) : null;

        if (!row || row.available === false || row.value == null) {
          return (
            <div key={ck} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 py-3">
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium">{meta.label}</span>
                <span className="text-sm text-muted-foreground">{meta.missingPhrase}</span>
              </div>
              <Button asChild variant="ghost" size="sm" className="shrink-0">
                <Link to={ck === 'account_monthly_fee' ? `/banks/${bankId}?tab=accounts` : `/banks/${bankId}?tab=cards`} state={{ bankId, bankName }}>
                  <ExternalLink className="h-3 w-3 mr-1" />{meta.otherLinkText}
                </Link>
              </Button>
            </div>
          );
        }

        const baseValue = formatValue(row.value);
        const valueNode = overItem && typeof overItem.overBy === 'number' ? (
          <div className="flex items-center gap-1">
            <Badge variant="destructive" className="font-mono">{baseValue}</Badge>
            <span className="text-sm text-destructive">+{formatAmount(overItem.overBy)}</span>
          </div>
        ) : (
          <Badge variant={context === 'within' ? 'default' : 'outline'} className="font-mono">{baseValue}</Badge>
        );

        return (
          <div key={ck} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 py-3">
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium">{meta.label}</span>
              {valueNode}
            </div>
            <Button asChild size="sm" variant="secondary" className="shrink-0">
              <Link to={buildProductLink(bankId, ck, row)} state={{ bankId, bankName }}>
                <Eye className="h-3 w-3 mr-1" />{ck === 'account_monthly_fee' ? 'Voir le compte' : 'Voir la carte'}
              </Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, icon: Icon, tone, count, children }: { title: string; icon: any; tone: 'green'|'amber'|'gray'; count: number; children: React.ReactNode }) {
  const tones: Record<typeof tone, string> = { green: 'border-green-200 bg-green-50', amber: 'border-amber-200 bg-amber-50', gray: 'border-gray-200 bg-gray-50' } as any;
  return (
    <Card className={`${tones[tone]} overflow-hidden rounded-2xl`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-lg text-center">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
          <Badge variant="outline">{count}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}


export default function PlainResults({ response, criteria, accountType }: { response: PlainResponse; criteria: CriteriaKey[]; accountType?: string; }) {
  const budget = useMemo(() => normalizeBudget(response.budget_analysis), [response.budget_analysis]);
  const perBank = useMemo(() => buildPerBankIndex(response.per_criterion), [response.per_criterion]);

  const restrictByType = !!accountType && criteria.includes('account_monthly_fee');
  const isCompatibleBank = (bankId: number) => {
    if (!restrictByType) return true;
    const row = (perBank.get(bankId) ?? ({} as any))['account_monthly_fee'] as PlainRankingItem | undefined;
    return !!row && row.available !== false && row.value != null;
  };

  const hasAnyBudget = (budget.within.length + budget.over.length + budget.missing.length) > 0;

  /* ─────────────── Mode SANS budget : tri sur le critère primaire ─────────────── */
  if (!hasAnyBudget) {
    const primary: CriteriaKey = (response as any)?.criteria_used?.[0]?.key ?? (criteria[0] as CriteriaKey);
    const entriesAll = Array.from(perBank.entries());
    const entries = restrictByType ? entriesAll.filter(([bankId]) => isCompatibleBank(bankId)) : entriesAll;
    const hiddenCount = Math.max(0, entriesAll.length - entries.length);

    entries.sort(([, a], [, b]) => {
      const av = (a?.[primary]?.value as number) ?? Number.POSITIVE_INFINITY;
      const bv = (b?.[primary]?.value as number) ?? Number.POSITIVE_INFINITY;
      const aMissing = a?.[primary]?.value == null;
      const bMissing = b?.[primary]?.value == null;
      if (aMissing && bMissing) return 0;
      if (aMissing) return 1;
      if (bMissing) return -1;
      return (Number(av) || 0) - (Number(bv) || 0);
    });

    return (
      <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {hiddenCount > 0 && restrictByType && (
          <Alert><AlertDescription><strong>{hiddenCount} banque(s)</strong> n'apparaissent pas car elles ne proposent pas le type de compte « <strong>{accountType}</strong> ».</AlertDescription></Alert>
        )}
        <Alert><TrendingUp className="h-4 w-4" /><AlertDescription>Aucun budget défini — classement par prix croissant.</AlertDescription></Alert>
        <div className="space-y-4">
          {entries.map(([bankId, byCrit], index) => {
            const bankName = byCrit[criteria[0]]?.bank?.name || byCrit[primary]?.bank?.name || `Banque #${bankId}`;
            const rankBadge = index === 0 ? (
              <Badge className="bg-amber-500 text-white">🏆 Meilleur prix</Badge>
            ) : index < 3 ? (
              <Badge variant="secondary">#{index + 1}</Badge>
            ) : (
              <Badge variant="outline">#{index + 1}</Badge>
            );
            return (
              <Card key={bankId} className="transition-all hover:shadow-md overflow-hidden rounded-xl flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                      <CardTitle className="text-lg truncate" title={bankName}>{bankName}</CardTitle>
                      {rankBadge}
                    </div>
                    <Button asChild variant="outline" size="sm" className="shrink-0"><Link to={`/banks/${bankId}`}><Eye className="h-4 w-4 mr-1" />Fiche</Link></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <BankLines bankId={bankId} bankName={bankName} criteria={criteria} perBankMap={byCrit as any} context={'within'} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─────────────── Mode AVEC budgets : blocs superposés ─────────────── */
  const within = (budget.within ?? []).filter((w: any) => w && w.bank && isCompatibleBank(w.bank.id));
  const over = (budget.over ?? []).filter((o: any) => o && o.bank && (o.items?.length ?? 0) > 0 && isCompatibleBank(o.bank.id));
  const missing = (budget.missing ?? []).filter((m: any) => m && m.bank && (m.criteria?.length ?? 0) > 0 && isCompatibleBank(m.bank.id));

  const beforeSet = new Set<number>();
  budget.within.forEach((w: any) => beforeSet.add(w.bank.id));
  budget.over.forEach((o: any) => beforeSet.add(o.bank.id));
  budget.missing.forEach((m: any) => beforeSet.add(m.bank.id));
  const afterSet = new Set<number>();
  within.forEach((w: any) => afterSet.add(w.bank.id));
  over.forEach((o: any) => afterSet.add(o.bank.id));
  missing.forEach((m: any) => afterSet.add(m.bank.id));
  const hiddenCount = Math.max(0, beforeSet.size - afterSet.size);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {hiddenCount > 0 && restrictByType && (
        <Alert><AlertDescription><strong>{hiddenCount} banque(s)</strong> n'apparaissent pas car elles ne proposent pas le type de compte « <strong>{accountType}</strong> ».</AlertDescription></Alert>
      )}

      <div className="space-y-6">
        {within.length > 0 && (
          <Section title="Dans le budget" icon={CheckCircle} tone="green" count={within.length}>
            <div className="space-y-4">
              {within.map((w: any) => (
                <Card key={w.bank.id} className="bg-white border-green-100 overflow-hidden rounded-xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <CardTitle className="text-base truncate" title={w.bank.name}>{w.bank.name}</CardTitle>
                      </div>
                      <Button asChild variant="outline" size="sm" className="shrink-0"><Link to={`/banks/${w.bank.id}`}><Eye className="h-3 w-3 mr-1" />Fiche</Link></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BankLines bankId={w.bank.id} bankName={w.bank.name} criteria={criteria} perBankMap={(perBank.get(w.bank.id) ?? ({} as any))} context={'within'} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {over.length > 0 && (
          <Section title="Au-dessus du budget" icon={AlertTriangle} tone="amber" count={over.length}>
            <div className="space-y-4">
              {over.map((o: any) => (
                <Card key={o.bank.id} className="bg-white border-amber-100 overflow-hidden rounded-xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <CardTitle className="text-base truncate" title={o.bank.name}>{o.bank.name}</CardTitle>
                      </div>
                      <Button asChild variant="outline" size="sm" className="shrink-0"><Link to={`/banks/${o.bank.id}`}><Eye className="h-3 w-3 mr-1" />Fiche</Link></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BankLines bankId={o.bank.id} bankName={o.bank.name} criteria={criteria} perBankMap={(perBank.get(o.bank.id) ?? ({} as any))} context={'over'} overItems={o.items as any} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {missing.length > 0 && (
          <Section title="Données manquantes" icon={XCircle} tone="gray" count={missing.length}>
            <div className="space-y-4">
              {missing.map((m: any) => (
                <Card key={m.bank.id} className="bg-white border-gray-100 overflow-hidden rounded-xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <CardTitle className="text-base truncate" title={m.bank.name}>{m.bank.name}</CardTitle>
                      </div>
                      <Button asChild variant="outline" size="sm" className="shrink-0"><Link to={`/banks/${m.bank.id}`}><Eye className="h-3 w-3 mr-1" />Fiche</Link></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BankLines bankId={m.bank.id} bankName={m.bank.name} criteria={criteria} perBankMap={(perBank.get(m.bank.id) ?? ({} as any))} context={'missing'} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}
      </div>

      {within.length === 0 && over.length === 0 && missing.length === 0 && (
        <Alert><AlertDescription>Aucune analyse de budget détaillée disponible pour les critères sélectionnés.</AlertDescription></Alert>
      )}
    </div>
  );
}
