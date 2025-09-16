import { useEffect, useMemo, useState } from 'react';
import { useBanks } from '../hooks';
import type { Budgets, CriteriaKey } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useAccountTypes } from '@/features/bank-accounts/hooks/useBankAccounts';

// Composants shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';

const CRITERIA: { key: CriteriaKey; label: string }[] = [
  { key: 'account_monthly_fee', label: 'Frais mensuels de tenue de compte' },
  { key: 'card_annual_fee', label: 'Frais annuels de carte' },
];

export type FormState = {
  bankIds: number[] | 'ALL';
  accountType?: string;
  criteria: CriteriaKey[];
  budgets: Budgets;
};

const DEFAULT_STATE: FormState = {
  bankIds: [],
  accountType: undefined,
  criteria: ['account_monthly_fee'],
  budgets: {},
};

function parseSearchParams(sp: URLSearchParams): FormState {
  try {
    const bankIdsParam = sp.get('banks');
    const bankIds = bankIdsParam === 'ALL' || !bankIdsParam
      ? []
      : bankIdsParam.split(',').map((x) => Number(x)).filter(Number.isFinite);

    const accountType = sp.get('accountType') ?? undefined;
    const criteria = (sp.get('criteria')?.split(',') as CriteriaKey[] | undefined)?.filter(Boolean) ?? DEFAULT_STATE.criteria;

    const budgetsRaw = sp.get('budgets');
    const budgets: Budgets = budgetsRaw ? JSON.parse(budgetsRaw) : {};

    return { bankIds, accountType, criteria, budgets };
  } catch {
    return DEFAULT_STATE;
  }
}

function toSearchParams(s: FormState): string {
  const params = new URLSearchParams();
  params.set('banks', s.bankIds === 'ALL' ? 'ALL' : (Array.isArray(s.bankIds) ? s.bankIds.join(',') : ''));
  if (s.accountType) params.set('accountType', s.accountType);
  if (s.criteria?.length) params.set('criteria', s.criteria.join(','));
  if (s.budgets && Object.keys(s.budgets).length) params.set('budgets', JSON.stringify(s.budgets));
  return params.toString();
}

export default function ComparisonForm({ onSubmit }: { onSubmit: (state: FormState) => void }) {
  const { data: banks = [], isLoading, isError } = useBanks();

  const [sp, setSp] = useSearchParams();
  const [state, setState] = useState<FormState>(() => parseSearchParams(sp));
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Types de compte dynamiques (dépendent des banques sélectionnées)
  const { data: typesFromApi = [], isLoading: typesLoading, isError: typesError } =
    useAccountTypes(state.bankIds);

  // Options de type (uniquement depuis la BD, triées et sans doublons)
  const accountTypeOptions = useMemo(() => {
    if (typesError || typesFromApi.length === 0) {
      return [];
    }
    const types = (typesFromApi as any[])
    .map((x) =>
      typeof x === 'string' ? x :
      typeof x?.type === 'string' ? x.type :
      typeof x?.name === 'string' ? x.name :
      ''
    )
    .map((s) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(types)).sort((a, b) => a.localeCompare(b, 'fr'));
}, [typesFromApi, typesError]);

  useEffect(() => {
    setSp(toSearchParams(state), { replace: true });

    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, [state, setSp]);

  const allOption = { id: -1, name: 'Toutes les banques' };
// eslint-disable-next-line react-hooks/exhaustive-deps
const bankOptions = useMemo(() => [allOption, ...banks], [banks]);

  const toggleCriteria = (key: CriteriaKey) => {
    setState((prev) => {
      const exists = prev.criteria.includes(key);
      if (exists && prev.criteria.length === 1) return prev; // ne pas retirer le dernier critère
      return { ...prev, criteria: exists ? prev.criteria.filter((k) => k !== key) : [...prev.criteria, key] };
    });
  };

  const setBudget = (key: CriteriaKey, value: string) => {
    const n = Number(value);
    setState((prev) => ({
      ...prev,
      budgets: { ...prev.budgets, [key]: Number.isFinite(n) && n >= 0 ? n : undefined },
    }));
  };

  const handleBankToggle = (bankId: number, isChecked: boolean) => {
    if (bankId === -1) {
      setState((s) => ({ ...s, bankIds: isChecked ? 'ALL' : [] }));
    } else {
      setState((s) => {
        if (s.bankIds === 'ALL') {
          return { ...s, bankIds: isChecked ? [bankId] : [] };
        } else {
          const set = new Set(s.bankIds);
          if (isChecked) set.add(bankId);
          else set.delete(bankId);
          return { ...s, bankIds: Array.from(set) };
        }
      });
    }
  };

  const canSubmit =
    state.criteria.length > 0 &&
    (state.bankIds === 'ALL' || (Array.isArray(state.bankIds) && state.bankIds.length > 0)) &&
    isOnline &&
    !isError;

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Bandeaux d'état (page NetworkErrorPage.tsx prioritaire)*/}
      {!isOnline && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            Mode hors-ligne : certaines actions sont indisponibles.
          </AlertDescription>
        </Alert>
      )}
      
      {isError && isOnline && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Serveur indisponible ou erreur réseau. Réessaie plus tard.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Banques
              <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Chargement des banques...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-auto">
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                  <Checkbox
                    id="bank-all"
                    disabled={isError || !isOnline}
                    checked={state.bankIds === 'ALL'}
                    onCheckedChange={(checked) => handleBankToggle(-1, !!checked)}
                  />
                  <Label 
                    htmlFor="bank-all" 
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {allOption.name}
                  </Label>
                </div>
                
                {bankOptions.slice(1).map((bank) => (
                  <div key={bank.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                    <Checkbox
                      id={`bank-${bank.id}`}
                      checked={state.bankIds !== 'ALL' && Array.isArray(state.bankIds) && state.bankIds.includes(bank.id)}
                      onCheckedChange={(checked) => handleBankToggle(bank.id, !!checked)}
                    />
                    <Label 
                      htmlFor={`bank-${bank.id}`} 
                      className="flex-1 cursor-pointer text-sm"
                    >
                      {bank.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Type de compte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Type de compte
              <Badge variant="secondary" className="text-xs">Facultatif</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {typesLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Chargement des types...</span>
              </div>
            ) : typesError ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Impossible de charger les types de compte depuis le serveur.
                </AlertDescription>
              </Alert>
            ) : accountTypeOptions.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Aucun type de compte trouvé pour les banques sélectionnées.
                </AlertDescription>
              </Alert>
            ) : (
              <Select
                value={state.accountType ?? '__EMPTY__'}
                onValueChange={(value) => setState((s) => ({ 
                  ...s, 
                  accountType: value === '__EMPTY__' ? undefined : value 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de compte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__EMPTY__">(Non spécifié)</SelectItem>
                  {accountTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Critères & Budgets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Critères
            <Badge variant="destructive" className="text-xs">Au moins un requis</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {CRITERIA.map(({ key, label }) => {
              const isSelected = state.criteria.includes(key);
              const isLastSelected = state.criteria.length === 1 && isSelected;

              return (
                <Card key={key} className="border-2">
                  <CardContent className="pt-4">
                    {/* Ligne critère */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id={`criteria-${key}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleCriteria(key)}
                        disabled={isLastSelected}
                      />
                      <Label 
                        htmlFor={`criteria-${key}`} 
                        className={`flex-1 cursor-pointer font-medium ${
                          isLastSelected ? 'text-muted-foreground' : ''
                        }`}
                      >
                        {label}
                      </Label>
                      {isLastSelected && (
                        <Badge variant="outline" className="text-xs">
                          Requis
                        </Badge>
                      )}
                    </div>

                    {/* Ligne budget */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium min-w-[60px]">
                        Budget :
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        className="flex-1"
                        placeholder={
                          isSelected 
                            ? 'Montant en FCFA (facultatif)' 
                            : "Sélectionnez d'abord le critère"
                        }
                        value={isSelected ? (state.budgets[key] ?? '') : ''}
                        onChange={(e) => setBudget(key, e.target.value)}
                        disabled={!isSelected}
                      />
                      <Badge variant="outline" className="text-xs">
                        FCFA
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bouton de soumission */}
      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(state)}
          disabled={!canSubmit}
          size="lg"
          className="px-8"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Voir les résultats
        </Button>
      </div>
    </div>
  );
}