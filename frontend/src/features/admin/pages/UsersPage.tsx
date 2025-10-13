import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, createAdminUser, updateAdminUser, disableAdminUser, reactivateAdminUser, permanentlyDeleteAdminUser } from '../api';
import { AdminUser } from '../types';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { AddUserForm, UserFormValues } from '../components/AddUserForm';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

// We won't create a separate EditUserForm, as the fields are simple enough to handle with one form.

const UserActions = ({ user, onDisable, onReactivate, onPermanentDelete }: { user: AdminUser, onDisable: () => void, onReactivate: () => void, onPermanentDelete: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={user.is_active ? onDisable : onReactivate}>
          {user.is_active ? 'Désactiver' : 'Activer'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={onPermanentDelete}>
          Supprimer définitivement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UsersPage = () => {
  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({ queryKey: ['adminUsers'], queryFn: getAdminUsers });

  const { mutate: addUser, isPending: isAddingUser } = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setAddUserOpen(false);
    },
  });

  const { mutate: disableUser } = useMutation({ mutationFn: disableAdminUser, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }) });
  const { mutate: reactivateUser } = useMutation({ mutationFn: reactivateAdminUser, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }) });
  const { mutate: permanentDeleteUser, isPending: isDeletingUser } = useMutation({
    mutationFn: permanentlyDeleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setDeletingUser(null);
    },
  });

  const columns: ColumnDef<AdminUser>[] = useMemo(() => [
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Rôle', cell: ({row}) => <Badge variant="secondary">{row.getValue('role')}</Badge> },
    {
      accessorKey: 'is_active',
      header: 'Statut',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active');
        return <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Actif' : 'Inactif'}</Badge>;
      },
    },
    { accessorKey: 'createdAt', header: 'Créé le', cell: ({row}) => new Date(row.getValue('createdAt')).toLocaleDateString() },
    {
      id: 'actions',
      cell: ({ row }) => (
        <UserActions 
          user={row.original} 
          onDisable={() => disableUser(row.original.id)}
          onReactivate={() => reactivateUser(row.original.id)}
          onPermanentDelete={() => setDeletingUser(row.original)}
        />
      ),
    },
  ], [disableUser, reactivateUser]);

  const table = useReactTable({
    data: users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Chargement des utilisateurs...</div>;
  if (error) return <div>Erreur lors du chargement des utilisateurs: {error.message}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Administrateurs</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un utilisateur</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel administrateur</DialogTitle>
              <DialogDescription>
                Remplissez les détails pour créer un nouvel utilisateur admin.
              </DialogDescription>
            </DialogHeader>
            <AddUserForm onSubmit={addUser} isSubmitting={isAddingUser} />
          </DialogContent>
        </Dialog>
      </div>

      <ConfirmationDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => deletingUser && permanentDeleteUser(deletingUser.id)}
        title="Êtes-vous absolument certain ?"
        description={`Cette action est irréversible. Cela supprimera définitivement l\'utilisateur \"${deletingUser?.email}\".`}
        isConfirming={isDeletingUser}
        confirmText="Oui, supprimer définitivement"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">Aucun utilisateur.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersPage;
