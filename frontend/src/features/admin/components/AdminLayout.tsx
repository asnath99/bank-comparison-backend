import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Wallet,
  CreditCard,
  Package,
  Users,
  BarChart3,
  Activity,
  Sparkles,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

const AdminLayout = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gradient-to-b from-gray-50 to-white md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-6">
            <NavLink to="/admin" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </NavLink>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto px-3 py-4">
            <nav className="space-y-1">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord
              </NavLink>

              <div className="pt-4 pb-2">
                <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Gestion Bancaire
                </div>
              </div>

              <NavLink
                to="/admin/banks"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Building2 className="h-4 w-4" />
                Banques
              </NavLink>

              <NavLink
                to="/admin/accounts"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Wallet className="h-4 w-4" />
                Comptes
              </NavLink>

              <NavLink
                to="/admin/cards"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <CreditCard className="h-4 w-4" />
                Cartes
              </NavLink>

              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Package className="h-4 w-4" />
                Produits
              </NavLink>

              <div className="pt-4 pb-2">
                <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Moteur de Comparaison
                </div>
              </div>

              <NavLink
                to="/admin/criteria"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-pink-50 text-pink-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <BarChart3 className="h-4 w-4" />
                Critères
              </NavLink>

              <NavLink
                to="/admin/rules"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Activity className="h-4 w-4" />
                Règles
              </NavLink>

              <div className="pt-4 pb-2">
                <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </div>
              </div>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Users className="h-4 w-4" />
                Utilisateurs
              </NavLink>
            </nav>
          </div>

          {/* Footer with Logout */}
          <div className="mt-auto p-4 border-t">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3 text-gray-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Header content placeholder */}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
