import { Link } from 'react-router-dom';

export default function NetworkErrorPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <div className="text-6xl">🌐</div>
        <h1 className="text-2xl font-bold">Connexion ou serveur indisponible</h1>
        <p className="text-gray-600">
          Impossible de contacter le serveur. Vérifie ta connexion ou réessaie plus tard.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-black text-white">
            Réessayer
          </button>
          <Link to="/compare" className="px-4 py-2 rounded-xl border">
            Retour au comparateur
          </Link>
        </div>
      </div>
    </div>
  );
}
