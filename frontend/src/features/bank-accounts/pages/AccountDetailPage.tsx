import { Link, useLocation, useParams } from 'react-router-dom';
import { useBankAccount } from '../hooks/useBankAccounts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

function formatMoney(raw: string | number | null | undefined, currency?: string) {
  if (raw == null || raw === '') return 'Non communiqué';
  const n = typeof raw === 'string' ? Number(raw) : raw;
  if (!Number.isFinite(n)) return 'Non communiqué';
  if (n === 0) return 'Gratuit (0)';
  const num = new Intl.NumberFormat('fr-FR').format(n as number);
  return `${num} ${currency || 'FCFA'}`;
}

// hook léger pour récupérer le nom si on ne l'a pas en state
function useBankName(bankId?: number, initial?: string) {
  return useQuery({
    queryKey: ['bank-name', bankId],
    enabled: !!bankId && !initial,
    initialData: initial, // si on a déjà un nom (via state), on l'utilise direct
    queryFn: async () => {
      if (!bankId) return undefined;
      const { data } = await api.get<{ success: boolean; data: { id: number; name: string } }>(
        `/banks/${bankId}`
      );
      return data?.data?.name ?? `Banque #${bankId}`;
    },
  });
}

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = (location.state as { bankId?: number; bankName?: string } | undefined) || {};
  const { data: account, isLoading, isError } = useBankAccount(id);

  const bankId = account?.bank_id ?? state.bankId;
  const { data: bankName } = useBankName(bankId, state.bankName);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !account) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Impossible de charger ce compte.
          <div className="mt-2">
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link to="/banks">Retour aux banques</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const money = formatMoney(account.monthly_fee, account.currency_display);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <CardTitle className="text-xl">
                {bankName ?? (bankId ? `Banque #${bankId}` : 'Banque inconnue')}
              </CardTitle>
              <Badge variant="secondary" className="text-base font-bold">
                {account.type || 'Compte bancaire'}
              </Badge>
            </div>
            {bankId && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/banks/${bankId}?tab=accounts`}>
                  Voir la banque
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">

          <Card>
              <CardContent className="p-4">
                <Label className="text-sm text-muted-foreground">
                  Frais mensuels de tenue de compte
                </Label>
                <div className="text-lg font-semibold mt-1">{money}</div>
              </CardContent>
            </Card>
            <br />

          {account.notes && account.notes.trim() !== '' && (
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Autres Informations
                </Label>
                <p className="text-foreground whitespace-pre-wrap">{account.notes}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}