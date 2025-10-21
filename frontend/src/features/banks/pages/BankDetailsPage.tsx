'use client'

import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBankById } from '../api'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export function BankDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const { data: bank, isLoading, isError, error } = useQuery({
    queryKey: ['bank', id],
    queryFn: () => getBankById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les détails de la banque: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!bank) {
    return null
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        {bank.logo_url && <img src={bank.logo_url} alt={`Logo de ${bank.name}`} className="h-16 w-16 object-contain rounded-lg" />} 
        <h1 className="text-3xl font-bold">{bank.name}</h1>
      </div>
      {bank.description && <p className="text-lg text-muted-foreground">{bank.description}</p>}
      {/* TODO: Afficher les produits de la banque (comptes, cartes, etc.) */}
    </div>
  )
}
