import { Link, useLocation, useParams } from 'react-router-dom';
import { useBankCard } from '../hooks/useBankCards';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = (location.state as { bankId?: number; bankName?: string } | undefined) || {};
  const { data: card, isLoading, isError, error } = useBankCard(id);

  const bankId = card?.bank_id ?? state.bankId;
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

  if (isError || !card) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Impossible de charger cette carte{error instanceof Error ? ` : ${error.message}` : ''}.
          <div className="mt-2">
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link to="/banks">Retour aux banques</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

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
                {card.card_type || 'Carte bancaire'}
              </Badge>
            </div>
            {bankId && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/banks/${bankId}?tab=cards`}>
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
      Frais mensuels de tenue de carte
    </Label>

   {(() => {
  // amount: accepte string | number | null | undefined
  const raw = card.fee as number | string | null | undefined;
  const amount = typeof raw === 'string' ? Number(raw) : raw;
  const isMissing = amount == null || Number.isNaN(amount);

  // Étend localement le type pour lire currency_display si présent
  type WithCurrencyDisplay = typeof card & { currency_display?: string; fee_is_ttc?: boolean };
  const c = (card as WithCurrencyDisplay).currency_display ?? 'FCFA';

  // 0 décimales si CFA/XOF, sinon 2
  const decimals = c.toUpperCase().includes('CFA') ? 0 : 2;

  const formatted = isMissing
    ? '—'
    : amount!.toLocaleString('fr-FR', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      });

  return (
    <div className="text-lg font-semibold mt-1">
      {isMissing ? '—' : `${formatted} ${c}`}
      {!isMissing && (card as WithCurrencyDisplay).fee_is_ttc && (
        <span className="ml-2 text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground">
          TTC
        </span>
      )}
    </div>
  );
})()}
  </CardContent>
</Card>

            <br />

          {card.notes && card.notes.trim() !== '' && (
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Autres Informations
                </Label>
                <p className="text-foreground whitespace-pre-wrap">{card.notes}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}