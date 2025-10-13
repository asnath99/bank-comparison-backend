import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminBank, getAdminBanks, updateAdminBank, disableAdminBank, permanentlyDeleteAdminBank } from '../api';
import { AdminBank } from '../types';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { AddBankForm, BankFormValues } from '../components/AddBankForm';
import { EditBankForm } from '../components/EditBankForm';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

const BankActions = ({ bank, onEdit, onDisable, onPermanentDelete }: { bank: AdminBank, onEdit: () => void, onDisable: () => void, onPermanentDelete: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onEdit}>Modifier</DropdownMenuItem>
        <DropdownMenuItem onClick={onDisable}>
          {bank.is_active ? 'Désactiver' : 'Activer'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={onPermanentDelete}>
          Supprimer définitivement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const BanksPage = () => {
  const [isAddBankOpen, setAddBankOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<AdminBank | null>(null);
  const [deletingBank, setDeletingBank] = useState<AdminBank | null>(null);

  const queryClient = useQueryClient();

  const { data: banks, isLoading, error } = useQuery({
    queryKey: ['adminBanks'],
    queryFn: getAdminBanks,
  });

  const { mutate: addBank, isPending: isAddingBank } = useMutation({
    mutationFn: createAdminBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanks'] });
      setAddBankOpen(false);
    },
  });

  const { mutate: editBank, isPending: isEditingBank } = useMutation({
    mutationFn: updateAdminBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanks'] });
      setEditingBank(null);
    },
  });

  const { mutate: disableBank, isPending: isDisablingBank } = useMutation({
    mutationFn: disableAdminBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanks'] });
    },
  });

  const { mutate: permanentDeleteBank, isPending: isDeletingBank } = useMutation({
    mutationFn: permanentlyDeleteAdminBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBanks'] });
      setDeletingBank(null);
    },
  });

  const handleAddBankSubmit = (values: BankFormValues) => addBank(values);

  const handleEditBankSubmit = (values: BankFormValues) => {
    if (!editingBank) return;
    editBank({ id: editingBank.id, ...values });
  };

  const columns: ColumnDef<AdminBank>[] = useMemo(() => [
    { accessorKey: 'name', header: 'Nom' },
    { accessorKey: 'country', header: 'Pays' },
    {
      accessorKey: 'is_active',
      header: 'Statut',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active');
        return <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Actif' : 'Inactif'}</Badge>;
      },
    },
    { accessorKey: 'website', header: 'Site Web', cell: ({row}) => <a href={row.getValue('website')} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Lien</a> },
    { accessorKey: 'createdAt', header: 'Créé le', cell: ({row}) => new Date(row.getValue('createdAt')).toLocaleDateString() },
    {
      id: 'actions',
      cell: ({ row }) => (
        <BankActions 
          bank={row.original} 
          onEdit={() => setEditingBank(row.original)} 
          onDisable={() => disableBank(row.original.id)}
          onPermanentDelete={() => setDeletingBank(row.original)}
        />
      ),
    },
  ], [disableBank]);

  const table = useReactTable({
    data: banks ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Chargement des banques...</div>;
  if (error) return <div>Erreur lors de la récupération des banques: {error.message}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Banques</h1>
        <Dialog open={isAddBankOpen} onOpenChange={setAddBankOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter une nouvelle banque</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle banque</DialogTitle>
              <DialogDescription>
                Remplissez les détails ci-dessous pour ajouter une nouvelle banque au système.
              </DialogDescription>
            </DialogHeader>
            <AddBankForm onSubmit={handleAddBankSubmit} isSubmitting={isAddingBank} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Bank Dialog */}
      <Dialog open={!!editingBank} onOpenChange={(isOpen) => !isOpen && setEditingBank(null)}>
        {editingBank && (
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
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deletingBank}
        onClose={() => setDeletingBank(null)}
        onConfirm={() => deletingBank && permanentDeleteBank(deletingBank.id)}
        title="Êtes-vous absolument certain ?"
        description={`Cette action est irréversible. Cela supprimera définitivement la banque "${deletingBank?.name}" et toutes ses données associées.`}
        isConfirming={isDeletingBank}
        confirmText="Oui, supprimer définitivement"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BanksPage;
