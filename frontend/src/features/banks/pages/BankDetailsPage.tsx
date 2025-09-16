import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useBank } from '../hooks/useBanks';

import { useBankAccounts } from '@/features/bank-accounts/hooks/useBankAccounts';
import { AccountList } from '@/features/bank-accounts/components/AccountList';
import type { BankAccount } from '@/features/bank-accounts/api';

import { useBankCards } from '@/features/bank-cards/hooks/useBankCards';
import { CardList } from '@/features/bank-cards/components/cardList';
import type { BankCard } from '@/features/bank-cards/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  ArrowUpDown, 
  Loader2, 
  AlertCircle, 
  CreditCard, 
  Building2, 
  ArrowLeft,
  Landmark 
} from 'lucide-react';

export function BankDetailsPage() {
  const { id } = useParams();
  const { data: bank, isLoading: bankLoading, error: bankError } = useBank(id);

  // Récupération brute des comptes et cartes
  const { data: rawAccounts, isLoading: accLoading, error: accError } = useBankAccounts(id);
  const { data: rawCards, isLoading: cardLoading, error: cardError } = useBankCards(id);

  // État pour basculer entre comptes et cartes
  const [viewMode, setViewMode] = useState<'accounts' | 'cards'>('accounts');

  // États UI pour comptes
  const [accQuery, setAccQuery] = useState('');
  const [accOrder, setAccOrder] = useState<'asc' | 'desc'>('asc');

  // États UI pour cartes
  const [cardQuery, setCardQuery] = useState('');
  const [cardOrder, setCardOrder] = useState<'asc' | 'desc'>('asc');

  // Filtre + tri côté client comptes
  const accounts: BankAccount[] = useMemo(() => {
    const list = Array.isArray(rawAccounts) ? rawAccounts : [];
    const q = accQuery.trim().toLowerCase();

    const filtered = q
      ? list.filter(a =>
          (a.type?.toLowerCase().includes(q)) ||
          (a.notes?.toLowerCase().includes(q))
        )
      : list;

    const sorted = [...filtered].sort((a, b) => {
      const an = (a.type ?? '').toLowerCase();
      const bn = (b.type ?? '').toLowerCase();
      return accOrder === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an);
    });

    return sorted;
  }, [rawAccounts, accQuery, accOrder]);

  // Filtre + tri côté client cartes
  const cards: BankCard[] = useMemo(() => {
    const list = Array.isArray(rawCards) ? rawCards : [];
    const q = cardQuery.trim().toLowerCase();

    const filtered = q
      ? list.filter(a =>
          (a.card_type?.toLowerCase().includes(q)) ||
          (a.notes?.toLowerCase().includes(q))
        )
      : list;

    const sorted = [...filtered].sort((a, b) => {
      const an = (a.card_type ?? '').toLowerCase();
      const bn = (b.card_type ?? '').toLowerCase();
      return cardOrder === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an);
    });

    return sorted;
  }, [rawCards, cardQuery, cardOrder]);

  // Gestion des états de chargement et d'erreur
  if (!id) return <div>Identifiant manquant.</div>;
  
  if (bankLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Chargement de la banque…</span>
            </div>
      </div>
    
    );
  }
  
  if (bankError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur de chargement de la banque. Veuillez réessayer.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!bank) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Banque introuvable.
        </AlertDescription>
      </Alert>
    );
  }

  // Variables pour l'affichage conditionnel selon le mode
  const isAccountsMode = viewMode === 'accounts';
  const currentQuery = isAccountsMode ? accQuery : cardQuery;
  const setCurrentQuery = isAccountsMode ? setAccQuery : setCardQuery;
  const currentOrder = isAccountsMode ? accOrder : cardOrder;
  const setCurrentOrder = isAccountsMode ? setAccOrder : setCardOrder;
  const currentItems = isAccountsMode ? accounts : cards;
  const currentLoading = isAccountsMode ? accLoading : cardLoading;
  const currentError = isAccountsMode ? accError : cardError;

  return (
    
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Navigation de retour */}
      <nav>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/banks" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste des banques
          </Link>
        </Button>
      </nav>

      {/* Header de la banque */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Landmark className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-foreground">
                {bank.name}
              </CardTitle>
              {bank.description && (
                <p className="text-muted-foreground mt-1">{bank.description}</p>
              )}
            </div>

            {/* Compteurs */}
            <div className="flex gap-3">
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                {Array.isArray(rawAccounts) ? rawAccounts.length : 0} compte{rawAccounts?.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CreditCard className="h-3 w-3" />
                {Array.isArray(rawCards) ? rawCards.length : 0} carte{rawCards?.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Section principale avec basculement */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-xl flex items-center gap-2">
              {isAccountsMode ? (
                <>
                  <Building2 className="h-5 w-5" />
                  Comptes Bancaires
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Cartes Bancaires
                </>
              )}
            </CardTitle>

            {/* Boutons de basculement */}
            <div className="flex items-center gap-2">
              <Button
                variant={isAccountsMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('accounts')}
                className="gap-2"
              >
                <Building2 className="h-4 w-4" />
                Comptes
                <Badge variant={isAccountsMode ? 'secondary' : 'outline'} className="ml-1">
                  {accounts.length}
                </Badge>
              </Button>
              <Button
                variant={!isAccountsMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Cartes
                <Badge variant={!isAccountsMode ? 'secondary' : 'outline'} className="ml-1">
                  {cards.length}
                </Badge>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Barre de recherche et tri */}
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="sr-only">
                Rechercher {isAccountsMode ? 'un compte' : 'une carte'}
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  id="search"
                  type="search"
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  placeholder={`Rechercher ${isAccountsMode ? 'un compte' : 'une carte'} (type, notes)…`}
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="default"
              onClick={() => setCurrentOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
              className="gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Trier {currentOrder === 'asc' ? 'A→Z' : 'Z→A'}
            </Button>
          </div>

          {/* Contenu conditionnel */}
          {currentLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Chargement des {isAccountsMode ? 'comptes' : 'cartes'}…</span>
              </div>
            </div>
          ) : currentError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erreur de chargement des {isAccountsMode ? 'comptes' : 'cartes'}. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          ) : currentItems.length === 0 && currentQuery ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Aucun{isAccountsMode ? ' compte trouvé' : 'e carte trouvée'} pour "{currentQuery}".
              </AlertDescription>
            </Alert>
          ) : currentItems.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Aucun{isAccountsMode ? ' compte disponible' : 'e carte disponible'} pour cette banque.
              </AlertDescription>
            </Alert>
          ) : (
            <div>
              {isAccountsMode ? (
                <AccountList items={accounts} />
              ) : (
                <CardList items={cards} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}