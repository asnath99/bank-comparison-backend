import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <div className="text-6xl">🧭</div>
        <h1 className="text-2xl font-bold">Page introuvable (404)</h1>
        <p className="text-gray-600">
          Oups… La page demandée n’existe pas ou a été déplacée.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="px-4 py-2 rounded-xl bg-black text-white">Accueil</Link>
          <Link to="/compare" className="px-4 py-2 rounded-xl border">Comparer des offres</Link>
        </div>
      </div>
    </div>
  );
}
