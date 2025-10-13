import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBanks } from '../hooks/useBanks';
import { BankList } from '../components/BankList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, AlertCircle } from 'lucide-react';
import type { Bank } from '../api';

export function BanksPage() {
  // Hooks
  const { data, isLoading, isError } = useBanks(); 
  const [sp, setSp] = useSearchParams();

  const [query, setQuery] = useState(sp.get('q') ?? '');
  const [order, setOrder] = useState<'asc' | 'desc'>(
    (sp.get('order') as 'asc' | 'desc') ?? 'asc'
  );

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    next.set('order', order);
    setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, order]);

  const qDeferred = useDeferredValue(query);

  const filteredSorted = useMemo(() => {
    const list: Bank[] = Array.isArray(data) ? data : [];
    const q = qDeferred.trim().toLowerCase();

    const filtered = q
      ? list.filter((b) => b.name?.toLowerCase().includes(q))
      : list;

    const sorted = [...filtered].sort((a, b) => {
      const an = a.name?.toLowerCase() ?? '';
      const bn = b.name?.toLowerCase() ?? '';
      return order === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an);
    });

    return sorted;
  }, [data, qDeferred, order]);

  if (isError) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur de chargement des banques. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Toutes les banques</h1>
          <p className="text-muted-foreground">
            Parcourez la liste des banques disponibles pour la comparaison.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom…"
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Trier {order === 'asc' ? 'A→Z' : 'Z→A'}
          </Button>
        </div>
      </div>

      {/* Bank List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="h-32 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredSorted.length > 0 ? (
        <BankList banks={filteredSorted} />
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucune banque trouvée pour “{query}”. Essayez un autre terme.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
