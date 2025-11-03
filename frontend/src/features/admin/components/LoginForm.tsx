import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn } from 'lucide-react';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Veuillez saisir une adresse e-mail valide.' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis.' }),
});

export type LoginValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginValues) => void;
  isSubmitting: boolean;
}

export const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
          <LogIn className="w-7 h-7" />
        </div>
        <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Connexion Admin
        </CardTitle>
        <CardDescription className="text-center text-base">
          Connectez-vous pour accéder au panel d'administration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Adresse Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="admin@exemple.com"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Connexion en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
