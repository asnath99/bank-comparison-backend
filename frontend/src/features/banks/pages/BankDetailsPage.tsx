'use client'

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBankById } from '../api'
import { getBankAccountsByBank } from '@/features/bank-accounts/api'
import { getBankCardsByBank } from '@/features/bank-cards/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CreditCard, Wallet, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BankDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const { data: bank, isLoading: bankLoading, isError: bankError, error: bankErrorMsg } = useQuery({
    queryKey: ['bank', id],
    queryFn: () => getBankById(id!),
    enabled: !!id,
  })

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['bank-accounts', id],
    queryFn: () => getBankAccountsByBank(id!),
    enabled: !!id,
  })

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ['bank-cards', id],
    queryFn: () => getBankCardsByBank(id!),
    enabled: !!id,
  })

  const isLoading = bankLoading || accountsLoading || cardsLoading

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 max-w-6xl mx-auto">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (bankError) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les détails de la banque: {bankErrorMsg?.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!bank) {
    return null
  }

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/banks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-4 flex-1">
          {bank.logo_url && (
            <img
              src={bank.logo_url}
              alt={`Logo de ${bank.name}`}
              className="h-16 w-16 object-contain rounded-lg border p-2"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{bank.name}</h1>
            {bank.description && (
              <p className="text-lg text-muted-foreground mt-1">{bank.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bank Accounts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Comptes Bancaires
          </CardTitle>
          <CardDescription>
            {accounts?.length ? `${accounts.length} compte(s) disponible(s)` : 'Aucun compte disponible'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accounts && accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((account) => (
                <Link
                  key={account.id}
                  to={`/accounts/${account.id}`}
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{account.type}</h3>
                    <Badge variant="secondary">{account.currency_display}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Frais mensuels:</span>{' '}
                      {account.monthly_fee} {account.monthly_fee_is_ttc ? '(TTC)' : '(HT)'}
                    </p>
                    {account.notes && (
                      <p className="mt-1 text-xs">{account.notes}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun compte bancaire enregistré pour cette banque.</p>
          )}
        </CardContent>
      </Card>

      {/* Bank Cards Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cartes Bancaires
          </CardTitle>
          <CardDescription>
            {cards?.length ? `${cards.length} carte(s) disponible(s)` : 'Aucune carte disponible'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cards && cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card) => (
                <Link
                  key={card.id}
                  to={`/cards/${card.id}`}
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{card.card_type}</h3>
                    <Badge variant="outline">{card.frequency}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Frais:</span>{' '}
                      {card.fee} {card.fee_is_ttc ? '(TTC)' : '(HT)'}
                    </p>
                    {card.notes && (
                      <p className="mt-1 text-xs">{card.notes}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune carte bancaire enregistrée pour cette banque.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
