import { Link, NavLink, Outlet } from 'react-router-dom';
import { Sparkles, Building2, BarChart3 } from 'lucide-react';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md group-hover:shadow-lg transition-shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {import.meta.env.VITE_APP_NAME || 'ComparBank'}
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              Accueil
            </NavLink>
            <NavLink
              to="/banks"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Building2 className="w-4 h-4 hidden sm:block" />
              Banques
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
                }`
              }
            >
              <BarChart3 className="w-4 h-4 hidden sm:block" />
              Comparer
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-gray-900">
                  {import.meta.env.VITE_APP_NAME || 'ComparBank'}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Votre comparateur intelligent de frais bancaires au Burkina Faso.
                Trouvez la meilleure offre en quelques clics.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/banks" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Banques
                  </Link>
                </li>
                <li>
                  <Link to="/compare" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Comparer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">À propos</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Service gratuit et indépendant pour vous aider à faire le meilleur choix bancaire.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Comparateur Bancaire. Tous droits réservés.
            </p>
            <p className="text-xs text-gray-500">
              Conçu avec passion au Burkina Faso
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
