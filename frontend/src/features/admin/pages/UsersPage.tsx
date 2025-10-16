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

import { AddUserForm } from '../components/AddUserForm'
import { ConfirmationDialog } from '../components/ConfirmationDialog'
import type { UserFormValues } from '../components/AddUserForm'
import { 
  createAdminUser, 
  deactivateAdminUser, 
  getAdminUsers, 
  permanentlyDeleteAdminUser, 
  reactivateAdminUser 
} from '../api'
import type { AdminUser } from '../types'

const columnHelper = createColumnHelper<AdminUser>()

const UsersPage = () => {
  const [isAddUserOpen, setAddUserOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null)

  const queryClient = useQueryClient()

  const { data: users, isLoading, error } = useQuery({ 
    queryKey: ['adminUsers'], 
    queryFn: getAdminUsers 
  })

  const { mutate: addUser, isPending: isAddingUser } = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      setAddUserOpen(false)
    },
  })

  const { mutate: toggleUserStatus } = useMutation({
    mutationFn: (user: AdminUser) => 
      user.is_active ? deactivateAdminUser(user.id) : reactivateAdminUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })

  const { mutate: permanentDeleteUser, isPending: isDeletingPermanently } = useMutation({
    mutationFn: permanentlyDeleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      setDeletingUser(null)
    },
  })

  const handleAddUserSubmit = (values: UserFormValues) => addUser(values)

  const columns = useMemo<ColumnDef<AdminUser, any>[]>(
    () => [
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('role', { header: 'Rôle' }),
      columnHelper.accessor('is_active', {
        header: 'Statut',
        cell: ({ getValue }) => {
          const isActive = getValue()
          return <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Actif' : 'Inactif'}</Badge>
        },
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
              <DropdownMenuItem onClick={() => toggleUserStatus(row.original)}>
                {row.original.is_active ? 'Désactiver' : 'Activer'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => setDeletingUser(row.original)}>
                Supprimer définitivement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [toggleUserStatus]
  )

  if (isLoading) return <div>Chargement des utilisateurs...</div>
  if (error) return <div>Erreur lors de la récupération des utilisateurs: {error.message}</div>

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4"/>Ajouter un utilisateur</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour ajouter un nouvel utilisateur.
              </DialogDescription>
            </DialogHeader>
            <AddUserForm onSubmit={handleAddUserSubmit} isSubmitting={isAddingUser} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={users ?? []} />

      {deletingUser && (
        <ConfirmationDialog
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={() => permanentDeleteUser(deletingUser.id)}
          title="Êtes-vous absolument certain ?"
          description={`Cette action est irréversible. Cela supprimera définitivement l\'utilisateur "${deletingUser.email}".`}
          isConfirming={isDeletingPermanently}
          confirmText="Oui, supprimer définitivement"
        />
      )}
    </div>
  )
}

export default UsersPage