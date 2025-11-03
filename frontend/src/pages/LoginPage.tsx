import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { loginAdmin } from '@/features/admin/api';
import type { LoginValues } from '@/features/admin/components/LoginForm';
import { LoginForm } from '@/features/admin/components/LoginForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Sparkles, Shield, Lock } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const { mutate: login, isPending, error } = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      setToken(data.token);
      navigate('/admin/dashboard');
    },
  });

  const handleSubmit = (values: LoginValues) => {
    login(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block space-y-8 px-8">
          {/* Logo & Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl group-hover:shadow-2xl transition-shadow">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  ComparBank
                </h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Welcome Text */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Bienvenue sur le
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Panel d'Administration
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Gérez votre plateforme de comparaison bancaire avec des outils puissants et intuitifs.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sécurité Renforcée</h3>
                <p className="text-sm text-gray-600">
                  Authentification sécurisée avec JWT et protection des données
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Accès Contrôlé</h3>
                <p className="text-sm text-gray-600">
                  Gestion des rôles et permissions pour chaque administrateur
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col items-center space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ComparBank
              </h1>
              <p className="text-xs text-gray-600">Admin Dashboard</p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="w-full max-w-md shadow-lg animate-in slide-in-from-top">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Erreur de connexion</AlertTitle>
              <AlertDescription>
                Vos identifiants sont incorrects. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form Card */}
          <div className="w-full max-w-md">
            <LoginForm onSubmit={handleSubmit} isSubmitting={isPending} />
          </div>

          {/* Back to Home Link */}
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
