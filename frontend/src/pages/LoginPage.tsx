import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { loginAdmin } from '@/features/admin/api';
import { LoginForm, LoginValues } from '@/features/admin/components/LoginForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const { mutate: login, isPending, error } = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      setToken(data.token);
      navigate('/admin/banks'); // Redirect to the admin dashboard
    },
  });

  const handleSubmit = (values: LoginValues) => {
    login(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {error && (
          <Alert variant="destructive" className="w-full max-w-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de connexion</AlertTitle>
            <AlertDescription>
              Vos identifiants sont incorrects. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        )}
        <LoginForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
};

export default LoginPage;
