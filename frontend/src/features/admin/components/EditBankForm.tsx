import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AdminBank } from '../types';

const bankFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  country: z.string().length(2, { message: 'Country must be a 2-letter code.' }),
  website: z.string().url({ message: 'Please enter a valid URL.' }),
  description: z.string().optional(),
});

export type BankFormValues = z.infer<typeof bankFormSchema>;

interface EditBankFormProps {
  bank: AdminBank;
  onSubmit: (values: BankFormValues) => void;
  isSubmitting: boolean;
}

export const EditBankForm = ({ bank, onSubmit, isSubmitting }: EditBankFormProps) => {
  const form = useForm<BankFormValues>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      name: bank.name,
      country: bank.country,
      website: bank.website,
      description: bank.description || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Nom de la banque</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code du pays</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Code pays ISO 3166-1 alpha-2.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Web</FormLabel>
              <FormControl>
                <Input {...field} />
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
                  placeholder="Une courte description de la banque."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </form>
    </Form>
  );
};
