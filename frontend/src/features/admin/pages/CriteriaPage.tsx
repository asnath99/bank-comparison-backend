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
import { MoreHorizontal, PlusCircle, BarChart3, Power, PowerOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import axios from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ComparisonCriteria {
  id: number;
  key: string;
  label: string;
  data_mapping: Record<string, any>;
  scoring_strategy: string;
  is_active: boolean;
  createdAt: string;
}

interface CriteriaFormValues {
  key: string;
  label: string;
  data_mapping: string;
  scoring_strategy: string;
  is_active: boolean;
}

const columnHelper = createColumnHelper<ComparisonCriteria>();

const CriteriaPage = () => {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<ComparisonCriteria | null>(null);
  const [deletingCriteria, setDeletingCriteria] = useState<ComparisonCriteria | null>(null);

  const queryClient = useQueryClient();

  const { data: criteria, isLoading } = useQuery({
    queryKey: ['adminCriteria'],
    queryFn: async () => {
      const response = await axios.get('/admin/comparison/criteria');
      return response.data.data as ComparisonCriteria[];
    },
  });

  const { mutate: createCriteria, isPending: isCreating } = useMutation({
    mutationFn: async (values: CriteriaFormValues) => {
      const payload = {
        ...values,
        data_mapping: JSON.parse(values.data_mapping),
      };
      await axios.post('/admin/comparison/criteria', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCriteria'] });
      setAddDialogOpen(false);
    },
  });

  const { mutate: updateCriteria, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...values }: CriteriaFormValues & { id: number }) => {
      const payload = {
        ...values,
        data_mapping: JSON.parse(values.data_mapping),
      };
      await axios.put(`/admin/comparison/criteria/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCriteria'] });
      setEditingCriteria(null);
    },
  });

  const { mutate: toggleCriteria } = useMutation({
    mutationFn: async (criteria: ComparisonCriteria) => {
      const endpoint = criteria.is_active ? 'deactivate' : 'reactivate';
      await axios.patch(`/admin/comparison/criteria/${criteria.id}/${endpoint}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCriteria'] });
    },
  });

  const { mutate: deleteCriteria, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/admin/comparison/criteria/${id}/permanent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCriteria'] });
      setDeletingCriteria(null);
    },
  });

  const columns = useMemo<ColumnDef<ComparisonCriteria, any>[]>(
    () => [
      columnHelper.accessor('key', {
        header: 'Clé',
        cell: ({ getValue }) => (
          <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
            {getValue()}
          </code>
        ),
      }),
      columnHelper.accessor('label', {
        header: 'Label',
        cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
      }),
      columnHelper.accessor('scoring_strategy', {
        header: 'Stratégie',
        cell: ({ getValue }) => {
          const strategy = getValue();
          const variants: Record<string, string> = {
            lower_better: 'secondary',
            higher_better: 'default',
            boolean_positive: 'outline',
            exists: 'outline',
          };
          return (
            <Badge variant={variants[strategy] as any}>
              {strategy}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('is_active', {
        header: 'Statut',
        cell: ({ getValue, row }) => {
          const isActive = getValue();
          return (
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? 'default' : 'outline'}>
                {isActive ? 'Actif' : 'Inactif'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCriteria(row.original)}
                title={isActive ? 'Désactiver' : 'Activer'}
              >
                {isActive ? (
                  <PowerOff className="h-4 w-4 text-gray-600" />
                ) : (
                  <Power className="h-4 w-4 text-green-600" />
                )}
              </Button>
            </div>
          );
        },
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
              <DropdownMenuItem onClick={() => setEditingCriteria(row.original)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingCriteria(row.original)}
                className="text-red-600"
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    []
  );

  const CriteriaForm = ({ criteria, onSubmit, isPending }: {
    criteria?: ComparisonCriteria | null;
    onSubmit: (values: CriteriaFormValues) => void;
    isPending: boolean;
  }) => {
    const form = useForm<CriteriaFormValues>({
      defaultValues: criteria ? {
        key: criteria.key,
        label: criteria.label,
        data_mapping: JSON.stringify(criteria.data_mapping, null, 2),
        scoring_strategy: criteria.scoring_strategy,
        is_active: criteria.is_active,
      } : {
        key: '',
        label: '',
        data_mapping: JSON.stringify({ model: '', field: '' }, null, 2),
        scoring_strategy: 'lower_better',
        is_active: true,
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clé unique</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="card_annual_fee" />
                </FormControl>
                <FormDescription>
                  Identifiant unique du critère (snake_case)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Frais annuels de la carte" />
                </FormControl>
                <FormDescription>
                  Nom affiché du critère
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scoring_strategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stratégie de scoring</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lower_better">Lower Better (moins c'est mieux)</SelectItem>
                    <SelectItem value="higher_better">Higher Better (plus c'est mieux)</SelectItem>
                    <SelectItem value="boolean_positive">Boolean Positive</SelectItem>
                    <SelectItem value="exists">Exists (présence/absence)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_mapping"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mapping des données (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='{"model": "BankCard", "field": "fee", "filters": {"frequency": "an"}}'
                    className="font-mono text-sm"
                    rows={6}
                  />
                </FormControl>
                <FormDescription>
                  Configuration du mapping vers les modèles de données
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Actif</FormLabel>
                  <FormDescription>
                    Le critère est utilisé dans les comparaisons
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => criteria ? setEditingCriteria(null) : setAddDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement...' : criteria ? 'Mettre à jour' : 'Créer'}
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-pink-600" />
            Critères de Comparaison
          </h1>
          <p className="text-gray-600 mt-2">Gérez les critères utilisés pour comparer les banques</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un critère
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un critère de comparaison</DialogTitle>
              <DialogDescription>
                Créer un nouveau critère pour le moteur de comparaison
              </DialogDescription>
            </DialogHeader>
            <CriteriaForm onSubmit={createCriteria} isPending={isCreating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <DataTable columns={columns} data={criteria || []} />
      )}

      <Dialog open={!!editingCriteria} onOpenChange={(open) => !open && setEditingCriteria(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le critère</DialogTitle>
            <DialogDescription>
              Mettre à jour le critère de comparaison
            </DialogDescription>
          </DialogHeader>
          {editingCriteria && (
            <CriteriaForm
              criteria={editingCriteria}
              onSubmit={(values) => updateCriteria({ id: editingCriteria.id, ...values })}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={!!deletingCriteria}
        onClose={() => setDeletingCriteria(null)}
        onConfirm={() => deletingCriteria && deleteCriteria(deletingCriteria.id)}
        title="Supprimer ce critère ?"
        description="Cette action est irréversible. Le critère sera définitivement supprimé."
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default CriteriaPage;
