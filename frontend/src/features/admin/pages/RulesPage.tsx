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
import { MoreHorizontal, PlusCircle, Activity, Power, PowerOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import axios from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ComparisonRule {
  id: number;
  name: string;
  description: string | null;
  criteria_key: string;
  rule_definition: Record<string, any>;
  priority: number;
  is_active: boolean;
  createdAt: string;
}

interface RuleFormValues {
  name: string;
  description: string;
  criteria_key: string;
  rule_definition: string;
  priority: number;
  is_active: boolean;
}

const columnHelper = createColumnHelper<ComparisonRule>();

const RulesPage = () => {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ComparisonRule | null>(null);
  const [deletingRule, setDeletingRule] = useState<ComparisonRule | null>(null);

  const queryClient = useQueryClient();

  const { data: criteria } = useQuery({
    queryKey: ['adminCriteria'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/comparison/criteria');
      return response.data.data;
    },
  });

  const { data: rules, isLoading } = useQuery({
    queryKey: ['adminRules'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/comparison/rules');
      return response.data.data as ComparisonRule[];
    },
  });

  const { mutate: createRule, isPending: isCreating } = useMutation({
    mutationFn: async (values: RuleFormValues) => {
      const payload = {
        ...values,
        rule_definition: JSON.parse(values.rule_definition),
      };
      await axios.post('/api/admin/comparison/rules', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRules'] });
      setAddDialogOpen(false);
    },
  });

  const { mutate: updateRule, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...values }: RuleFormValues & { id: number }) => {
      const payload = {
        ...values,
        rule_definition: JSON.parse(values.rule_definition),
      };
      await axios.put(`/api/admin/comparison/rules/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRules'] });
      setEditingRule(null);
    },
  });

  const { mutate: toggleRule } = useMutation({
    mutationFn: async (rule: ComparisonRule) => {
      const endpoint = rule.is_active ? 'deactivate' : 'reactivate';
      await axios.patch(`/api/admin/comparison/rules/${rule.id}/${endpoint}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRules'] });
    },
  });

  const { mutate: deleteRule, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/admin/comparison/rules/${id}/permanent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRules'] });
      setDeletingRule(null);
    },
  });

  const columns = useMemo<ColumnDef<ComparisonRule, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Nom',
        cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
      }),
      columnHelper.accessor('criteria_key', {
        header: 'Critère',
        cell: ({ getValue }) => {
          const criteriaKey = getValue();
          const criteriaLabel = criteria?.find((c: any) => c.key === criteriaKey)?.label;
          return (
            <div>
              <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                {criteriaKey}
              </code>
              {criteriaLabel && (
                <div className="text-xs text-gray-600 mt-1">{criteriaLabel}</div>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('priority', {
        header: 'Priorité',
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="font-mono">
            {getValue()}
          </Badge>
        ),
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
                onClick={() => toggleRule(row.original)}
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
              <DropdownMenuItem onClick={() => setEditingRule(row.original)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingRule(row.original)}
                className="text-red-600"
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [criteria]
  );

  const RuleForm = ({ rule, onSubmit, isPending }: {
    rule?: ComparisonRule | null;
    onSubmit: (values: RuleFormValues) => void;
    isPending: boolean;
  }) => {
    const form = useForm<RuleFormValues>({
      defaultValues: rule ? {
        name: rule.name,
        description: rule.description || '',
        criteria_key: rule.criteria_key,
        rule_definition: JSON.stringify(rule.rule_definition, null, 2),
        priority: rule.priority,
        is_active: rule.is_active,
      } : {
        name: '',
        description: '',
        criteria_key: '',
        rule_definition: JSON.stringify({
          conditions: {
            all: []
          },
          event: {
            type: ''
          }
        }, null, 2),
        priority: 100,
        is_active: true,
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la règle</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Pénalité frais élevés" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Description de la règle et de son comportement"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="criteria_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clé du critère</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="card_annual_fee" />
                </FormControl>
                <FormDescription>
                  Le critère auquel cette règle s'applique
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorité</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Plus le nombre est élevé, plus la règle est prioritaire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <div className="flex items-center gap-2 border rounded-lg p-3">
                    <FormLabel className="text-sm">Règle active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rule_definition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Définition de la règle (JSON Rules Engine)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={JSON.stringify({
                      conditions: {
                        all: [
                          {
                            fact: "value",
                            operator: "greaterThan",
                            value: 10000
                          }
                        ]
                      },
                      event: {
                        type: "penalty",
                        params: {
                          amount: 10
                        }
                      }
                    }, null, 2)}
                    className="font-mono text-sm"
                    rows={12}
                  />
                </FormControl>
                <FormDescription>
                  Configuration JSON pour le moteur de règles (json-rules-engine)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => rule ? setEditingRule(null) : setAddDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement...' : rule ? 'Mettre à jour' : 'Créer'}
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
            <Activity className="h-8 w-8 text-teal-600" />
            Règles de Comparaison
          </h1>
          <p className="text-gray-600 mt-2">Gérez les règles du moteur de comparaison intelligente</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une règle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une règle de comparaison</DialogTitle>
              <DialogDescription>
                Créer une nouvelle règle pour le moteur de comparaison
              </DialogDescription>
            </DialogHeader>
            <RuleForm onSubmit={createRule} isPending={isCreating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <DataTable columns={columns} data={rules || []} />
      )}

      <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la règle</DialogTitle>
            <DialogDescription>
              Mettre à jour la règle de comparaison
            </DialogDescription>
          </DialogHeader>
          {editingRule && (
            <RuleForm
              rule={editingRule}
              onSubmit={(values) => updateRule({ id: editingRule.id, ...values })}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={!!deletingRule}
        onClose={() => setDeletingRule(null)}
        onConfirm={() => deletingRule && deleteRule(deletingRule.id)}
        title="Supprimer cette règle ?"
        description="Cette action est irréversible. La règle sera définitivement supprimée."
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default RulesPage;
