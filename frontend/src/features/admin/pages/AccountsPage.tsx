import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import axios from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminBanks } from '../api';

interface BankAccount {
  id: number;
  bank_id: number;
  bank_name?: string;
  account_type: string;
  monthly_fee: number;
  currency: string;
  is_ttc_monthly: boolean;
  createdAt: string;
}

interface AccountFormValues {
  bank_id: number;
  account_type: string;
  monthly_fee: number;
  currency: string;
  is_ttc_monthly: boolean;
}

const columnHelper = createColumnHelper<BankAccount>();

const AccountsPage = () => {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<BankAccount | null>(null);

  const queryClient = useQueryClient();

  const { data: banks } = useQuery({
    queryKey: ['adminBanks'],
    queryFn: getAdminBanks,
  });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['adminAccounts'],
    queryFn: async () => {
      const response = await axios.get('/api/bankaccounts');
      return response.data.data as BankAccount[];
    },
  });

  const { mutate: createAccount, isPending: isCreating } = useMutation({
    mutationFn: async (values: AccountFormValues) => {
      await axios.post('/api/bankaccounts', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
      setAddDialogOpen(false);
    },
  });

  const { mutate: updateAccount, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...values }: AccountFormValues & { id: number }) => {
      await axios.put(`/api/bankaccounts/${id}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
      setEditingAccount(null);
    },
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/bankaccounts/${id}/permanent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
      setDeletingAccount(null);
    },
  });

  const columns = useMemo<ColumnDef<BankAccount, any>[]>(
    () => [
      columnHelper.accessor('bank_name', {
        header: 'Banque',
        cell: ({ row }) => {
          const bankName = banks?.find(b => b.id === row.original.bank_id)?.name;
          return <span className="font-medium">{bankName || 'N/A'}</span>;
        },
      }),
      columnHelper.accessor('account_type', {
        header: 'Type de compte',
      }),
      columnHelper.accessor('monthly_fee', {
        header: 'Frais mensuels',
        cell: ({ getValue, row }) => {
          const fee = getValue();
          const currency = row.original.currency;
          const isTTC = row.original.is_ttc_monthly;
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold">{fee} {currency}</span>
              <Badge variant={isTTC ? 'default' : 'outline'} className="text-xs">
                {isTTC ? 'TTC' : 'HT'}
              </Badge>
            </div>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Créé le',
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString('fr-FR'),
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
              <DropdownMenuItem onClick={() => setEditingAccount(row.original)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingAccount(row.original)}
                className="text-red-600"
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [banks]
  );

  const AccountForm = ({ account, onSubmit, isPending }: {
    account?: BankAccount | null;
    onSubmit: (values: AccountFormValues) => void;
    isPending: boolean;
  }) => {
    const form = useForm<AccountFormValues>({
      defaultValues: account ? {
        bank_id: account.bank_id,
        account_type: account.account_type,
        monthly_fee: account.monthly_fee,
        currency: account.currency,
        is_ttc_monthly: account.is_ttc_monthly,
      } : {
        bank_id: 0,
        account_type: '',
        monthly_fee: 0,
        currency: 'F CFA',
        is_ttc_monthly: true,
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="bank_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banque</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une banque" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {banks?.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id.toString()}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de compte</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Compte Courant" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="monthly_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frais mensuels</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devise</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="F CFA">F CFA</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_ttc_monthly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de frais</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === 'true')}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">TTC (Toutes Taxes Comprises)</SelectItem>
                    <SelectItem value="false">HT (Hors Taxes)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => account ? setEditingAccount(null) : setAddDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement...' : account ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
            <Wallet className="h-8 w-8 text-green-600" />
            Comptes Bancaires
          </h1>
          <p className="text-gray-600 mt-2">Gérez les comptes bancaires de toutes les banques</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un compte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un compte bancaire</DialogTitle>
              <DialogDescription>
                Créer un nouveau type de compte pour une banque
              </DialogDescription>
            </DialogHeader>
            <AccountForm onSubmit={createAccount} isPending={isCreating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <DataTable columns={columns} data={accounts || []} />
      )}

      <Dialog open={!!editingAccount} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le compte</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations du compte bancaire
            </DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <AccountForm
              account={editingAccount}
              onSubmit={(values) => updateAccount({ id: editingAccount.id, ...values })}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        onConfirm={() => deletingAccount && deleteAccount(deletingAccount.id)}
        title="Supprimer ce compte ?"
        description="Cette action est irréversible. Le compte sera définitivement supprimé."
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default AccountsPage;
