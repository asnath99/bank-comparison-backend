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
import { MoreHorizontal, PlusCircle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import axios from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAdminBanks } from '../api';

interface BankProduct {
  id: number;
  bank_id: number;
  product_type: string;
  product_name: string;
  details: Record<string, any>;
  createdAt: string;
}

interface ProductFormValues {
  bank_id: number;
  product_type: string;
  product_name: string;
  details: string;
}

const columnHelper = createColumnHelper<BankProduct>();

const ProductsPage = () => {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BankProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<BankProduct | null>(null);

  const queryClient = useQueryClient();

  const { data: banks } = useQuery({
    queryKey: ['adminBanks'],
    queryFn: getAdminBanks,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const response = await axios.get('/api/bankproducts');
      return response.data.data as BankProduct[];
    },
  });

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const payload = {
        ...values,
        details: JSON.parse(values.details || '{}'),
      };
      await axios.post('/api/bankproducts', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setAddDialogOpen(false);
    },
  });

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...values }: ProductFormValues & { id: number }) => {
      const payload = {
        ...values,
        details: JSON.parse(values.details || '{}'),
      };
      await axios.put(`/api/bankproducts/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setEditingProduct(null);
    },
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/bankproducts/${id}/permanent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setDeletingProduct(null);
    },
  });

  const columns = useMemo<ColumnDef<BankProduct, any>[]>(
    () => [
      columnHelper.accessor('bank_id', {
        header: 'Banque',
        cell: ({ getValue }) => {
          const bankName = banks?.find(b => b.id === getValue())?.name;
          return <span className="font-medium">{bankName || 'N/A'}</span>;
        },
      }),
      columnHelper.accessor('product_type', {
        header: 'Type',
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="font-medium">
            {getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('product_name', {
        header: 'Nom du produit',
      }),
      columnHelper.accessor('details', {
        header: 'Détails',
        cell: ({ getValue }) => {
          const details = getValue();
          const keys = Object.keys(details || {});
          return (
            <div className="text-xs text-gray-600">
              {keys.length > 0 ? `${keys.length} propriété(s)` : 'Aucun détail'}
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
              <DropdownMenuItem onClick={() => setEditingProduct(row.original)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingProduct(row.original)}
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

  const ProductForm = ({ product, onSubmit, isPending }: {
    product?: BankProduct | null;
    onSubmit: (values: ProductFormValues) => void;
    isPending: boolean;
  }) => {
    const form = useForm<ProductFormValues>({
      defaultValues: product ? {
        bank_id: product.bank_id,
        product_type: product.product_type,
        product_name: product.product_name,
        details: JSON.stringify(product.details, null, 2),
      } : {
        bank_id: 0,
        product_type: '',
        product_name: '',
        details: '{}',
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
            name="product_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de produit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="assurance">Assurance</SelectItem>
                    <SelectItem value="credit">Crédit</SelectItem>
                    <SelectItem value="epargne">Épargne</SelectItem>
                    <SelectItem value="virement">Virement</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du produit</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Assurance Vie Premium" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Détails (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='{"taux": "5%", "duree": "12 mois"}'
                    className="font-mono text-sm"
                    rows={6}
                  />
                </FormControl>
                <FormDescription>
                  Format JSON pour les détails du produit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => product ? setEditingProduct(null) : setAddDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Créer'}
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
            <Package className="h-8 w-8 text-orange-600" />
            Produits Bancaires
          </h1>
          <p className="text-gray-600 mt-2">Gérez les produits bancaires (assurances, crédits, épargne, etc.)</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un produit bancaire</DialogTitle>
              <DialogDescription>
                Créer un nouveau produit pour une banque
              </DialogDescription>
            </DialogHeader>
            <ProductForm onSubmit={createProduct} isPending={isCreating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <DataTable columns={columns} data={products || []} />
      )}

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations du produit bancaire
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={(values) => updateProduct({ id: editingProduct.id, ...values })}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deletingProduct && deleteProduct(deletingProduct.id)}
        title="Supprimer ce produit ?"
        description="Cette action est irréversible. Le produit sera définitivement supprimé."
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default ProductsPage;
