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
  }, [query, order]); // (pas de dépendance sur sp pour éviter la boucle)

  // Recherche fluide
  const qDeferred = useDeferredValue(query);

  // Filtre + tri
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

  // Loading
  if (isLoading) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Banques</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Skeleton simple */}
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="p-4">
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
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            Critères
            <Badge variant="destructive" className="text-xs">Au moins un requis</Badge>
          </CardTitle>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Banques</CardTitle>
              {Array.isArray(data) && (
                <Badge variant="secondary" className="mt-2">
                  {filteredSorted.length} banque{filteredSorted.length > 1 ? 's' : ''}
                  {query && ` trouvée${filteredSorted.length > 1 ? 's' : ''}`}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 flex-wrap mb-6">
            {/* Recherche */}
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="sr-only">
                Rechercher une banque
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher par nom de banque…"
                  className="pl-9"
                />
              </div>
            </div>

            {/* Tri */}
            <Button
              variant="outline"
              onClick={() => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              aria-pressed={order === 'desc'}
              className="gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Trier {order === 'asc' ? 'A→Z' : 'Z→A'}
            </Button>
          </div>

          {/* Aucun résultat (avec recherche) */}
          {filteredSorted.length === 0 && query && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Aucune banque trouvée pour “{query}”. Essayez un autre terme.
              </AlertDescription>
            </Alert>
          )}

          {/* Liste */}
          {filteredSorted.length > 0 && <BankList banks={filteredSorted} />}
        </CardContent>
      </Card>
    </div>
  );
}
