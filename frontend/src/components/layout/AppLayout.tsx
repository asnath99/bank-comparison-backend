import { Link, NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold">
            {import.meta.env.VITE_APP_NAME || 'App'}
          </Link>

          <nav className="flex gap-4 text-sm">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
              Accueil
            </NavLink>
            <NavLink to="/banks" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
              Banques
            </NavLink>
            <NavLink to="/compare" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
              compare
            </NavLink>
          </nav>
        </div>
      </header>

<main className="flex-1 w-full px-4 py-6">
          <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 h-12 flex items-center text-xs text-gray-500">
          © {new Date().getFullYear()} — Comparateur Bancaire
        </div>
      </footer>
    </div>
  );
}
