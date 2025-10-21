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
import { MoreHorizontal, PlusCircle, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import axios from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminBanks } from '../api';

interface BankCard {
  id: number;
  bank_id: number;
  card_type: string;
  fee: number;
  frequency: string;
  currency: string;
  is_ttc: boolean;
  createdAt: string;
}

interface CardFormValues {
  bank_id: number;
  card_type: string;
  fee: number;
  frequency: string;
  currency: string;
  is_ttc: boolean;
}

const columnHelper = createColumnHelper<BankCard>();

const CardsPage = () => {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<BankCard | null>(null);
  const [deletingCard, setDeletingCard] = useState<BankCard | null>(null);

  const queryClient = useQueryClient();

  const { data: banks } = useQuery({
    queryKey: ['adminBanks'],
    queryFn: getAdminBanks,
  });

  const { data: cards, isLoading } = useQuery({
    queryKey: ['adminCards'],
    queryFn: async () => {
      const response = await axios.get('/api/bankcards');
      return response.data.data as BankCard[];
    },
  });

  const { mutate: createCard, isPending: isCreating } = useMutation({
    mutationFn: async (values: CardFormValues) => {
      await axios.post('/api/bankcards', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCards'] });
      setAddDialogOpen(false);
    },
  });

  const { mutate: updateCard, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...values }: CardFormValues & { id: number }) => {
      await axios.put(`/api/bankcards/${id}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCards'] });
      setEditingCard(null);
    },
  });

  const { mutate: deleteCard, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/bankcards/${id}/permanent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCards'] });
      setDeletingCard(null);
    },
  });

  const columns = useMemo<ColumnDef<BankCard, any>[]>(
    () => [
      columnHelper.accessor('bank_id', {
        header: 'Banque',
        cell: ({ getValue }) => {
          const bankName = banks?.find(b => b.id === getValue())?.name;
          return <span className="font-medium">{bankName || 'N/A'}</span>;
        },
      }),
      columnHelper.accessor('card_type', {
        header: 'Type de carte',
        cell: ({ getValue }) => (
          <Badge variant="outline" className="font-medium">
            {getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('fee', {
        header: 'Frais',
        cell: ({ getValue, row }) => {
          const fee = getValue();
          const currency = row.original.currency;
          const frequency = row.original.frequency;
          const isTTC = row.original.is_ttc;
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{fee} {currency}</span>
                <Badge variant={isTTC ? 'default' : 'outline'} className="text-xs">
                  {isTTC ? 'TTC' : 'HT'}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                par {frequency === 'an' ? 'an' : 'mois'}
              </div>
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
              <DropdownMenuItem onClick={() => setEditingCard(row.original)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingCard(row.original)}
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

  const CardForm = ({ card, onSubmit, isPending }: {
    card?: BankCard | null;
    onSubmit: (values: CardFormValues) => void;
    isPending: boolean;
  }) => {
    const form = useForm<CardFormValues>({
      defaultValues: card ? {
        bank_id: card.bank_id,
        card_type: card.card_type,
        fee: card.fee,
        frequency: card.frequency,
        currency: card.currency,
        is_ttc: card.is_ttc,
      } : {
        bank_id: 0,
        card_type: '',
        fee: 0,
        frequency: 'an',
        currency: 'F CFA',
        is_ttc: true,
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
            name="card_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de carte</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Visa Classic, MasterCard Gold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant des frais</FormLabel>
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
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fréquence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="an">Annuel</SelectItem>
                      <SelectItem value="mois">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="is_ttc"
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
                      <SelectItem value="true">TTC</SelectItem>
                      <SelectItem value="false">HT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => card ? setEditingCard(null) : setAddDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement...' : card ? 'Mettre à jour' : 'Créer'}
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-purple-600" />
            Cartes Bancaires
          </h1>
          <p className="text-gray-600 mt-2">Gérez les cartes bancaires de toutes les banques</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une carte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une carte bancaire</DialogTitle>
              <DialogDescription>
                Créer un nouveau type de carte pour une banque
              </DialogDescription>
            </DialogHeader>
            <CardForm onSubmit={createCard} isPending={isCreating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <DataTable columns={columns} data={cards || []} />
      )}

      <Dialog open={!!editingCard} onOpenChange={(open) => !open && setEditingCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la carte</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de la carte bancaire
            </DialogDescription>
          </DialogHeader>
          {editingCard && (
            <CardForm
              card={editingCard}
              onSubmit={(values) => updateCard({ id: editingCard.id, ...values })}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={!!deletingCard}
        onClose={() => setDeletingCard(null)}
        onConfirm={() => deletingCard && deleteCard(deletingCard.id)}
        title="Supprimer cette carte ?"
        description="Cette action est irréversible. La carte sera définitivement supprimée."
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default CardsPage;
