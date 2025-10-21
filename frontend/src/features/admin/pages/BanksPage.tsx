'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  createColumnHelper, 
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

import { AddBankForm } from '../components/AddBankForm'
import { EditBankForm } from '../components/EditBankForm'
import { ConfirmationDialog } from '../components/ConfirmationDialog'
import type { BankFormValues } from '../components/AddBankForm'
import { 
  createAdminBank, 
  deactivateAdminBank, 
  getAdminBanks, 
  permanentlyDeleteAdminBank, 
  reactivateAdminBank, 
  updateAdminBank 
} from '../api'
import type { AdminBank } from '../types'

const columnHelper = createColumnHelper<AdminBank>()

const BanksPage = () => {
  const [isAddBankOpen, setAddBankOpen] = useState(false)
  const [editingBank, setEditingBank] = useState<AdminBank | null>(null)
  const [deletingBank, setDeletingBank] = useState<AdminBank | null>(null)

  const queryClient = useQueryClient()

  const { data: banks, isLoading, error } = useQuery({ 
    queryKey: ['adminBanks'], 
    queryFn: getAdminBanks 
  })

  const { mutate: addBank, isPending: isAddingBank } = useMutation({
    mutationFn: createAdminBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanks'] })
      setAddBankOpen(false)
    },
  })

  const { mutate: editBank, isPending: isEditingBank } = useMutation({
    mutationFn: updateAdminBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanks'] })
      setEditingBank(null)
    },
  })

  const { mutate: toggleBankStatus } = useMutation({
    mutationFn: (bank: AdminBank) => 
      bank.is_active ? deactivateAdminBank(bank.id) : reactivateAdminBank(bank.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanks'] })
    },
  })

  const { mutate: permanentDeleteBank, isPending: isDeletingPermanently } = useMutation({
    mutationFn: permanentlyDeleteAdminBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanks'] })
      setDeletingBank(null)
    },
  })

  const handleAddBankSubmit = (values: BankFormValues) => addBank(values)

  const handleEditBankSubmit = (values: BankFormValues) => {
    if (!editingBank) return
    editBank({ id: editingBank.id, ...values })
  }

  const columns = useMemo<ColumnDef<AdminBank, any>[]>(
    () => [
      columnHelper.accessor('name', { header: 'Nom' }),
      columnHelper.accessor('country', { header: 'Pays' }),
      columnHelper.accessor('is_active', {
        header: 'Statut',
        cell: ({ getValue }) => {
          const isActive = getValue()
          return <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Actif' : 'Inactif'}</Badge>
        },
      }),
      columnHelper.accessor('website', { 
        header: 'Site Web', 
        cell: ({ getValue }) => <a href={getValue()} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Lien</a> 
      }),
      columnHelper.accessor('createdAt', { 
        header: 'Créé le', 
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString() 
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditingBank(row.original)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleBankStatus(row.original)}>
                {row.original.is_active ? 'Désactiver' : 'Activer'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => setDeletingBank(row.original)}>
                Supprimer définitivement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [toggleBankStatus]
  )

  if (isLoading) return <div>Chargement des banques...</div>
  if (error) return <div>Erreur lors de la récupération des banques: {error.message}</div>

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des Banques</h1>
        <Dialog open={isAddBankOpen} onOpenChange={setAddBankOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4"/>Ajouter une banque</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle banque</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour ajouter une nouvelle banque.
              </DialogDescription>
            </DialogHeader>
            <AddBankForm onSubmit={handleAddBankSubmit} isSubmitting={isAddingBank} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={banks ?? []} />

      {editingBank && (
        <Dialog open={!!editingBank} onOpenChange={(isOpen) => !isOpen && setEditingBank(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier la banque</DialogTitle>
              <DialogDescription>
                Mettez à jour les détails pour {editingBank.name}.
              </DialogDescription>
            </DialogHeader>
            <EditBankForm 
              bank={editingBank} 
              onSubmit={handleEditBankSubmit} 
              isSubmitting={isEditingBank} 
            />
          </DialogContent>
        </Dialog>
      )}

      {deletingBank && (
        <ConfirmationDialog
          isOpen={!!deletingBank}
          onClose={() => setDeletingBank(null)}
          onConfirm={() => permanentDeleteBank(deletingBank.id)}
          title="Êtes-vous absolument certain ?"
          description={`Cette action est irréversible. Cela supprimera définitivement la banque "${deletingBank.name}" et toutes ses données associées.`}
          isConfirming={isDeletingPermanently}
          confirmText="Oui, supprimer définitivement"
        />
      )}
    </div>
  )
}

export default BanksPage