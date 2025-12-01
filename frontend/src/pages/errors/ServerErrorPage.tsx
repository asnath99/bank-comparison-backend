import { Link, useLocation } from 'react-router-dom';

export default function ServerErrorPage() {
  const loc = useLocation();
  const trace = (loc.state as any)?.trace as string | undefined;

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <div className="text-6xl">🛠️</div>
        <h1 className="text-2xl font-bold">Erreur serveur (500)</h1>
        <p className="text-gray-600">
          Une erreur est survenue côté serveur. Réessaie plus tard.
        </p>
        {trace && (
          <details className="text-left mx-auto max-w-md text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border">
            <summary className="cursor-pointer">Détails techniques</summary>
            <pre className="whitespace-pre-wrap mt-2">{trace}</pre>
          </details>
        )}
        <div className="flex justify-center gap-3">
          <Link to="/" className="px-4 py-2 rounded-xl bg-black text-white">Accueil</Link>
          <Link to="/compare" className="px-4 py-2 rounded-xl border">Comparer</Link>
        </div>
      </div>
    </div>
  );
}
