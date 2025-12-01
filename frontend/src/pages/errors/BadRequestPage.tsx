import { Link, useLocation } from 'react-router-dom';

export default function BadRequestPage() {
  const loc = useLocation();
  const msg = (loc.state as any)?.message as string | undefined;

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold">Requête invalide (400)</h1>
        <p className="text-gray-600">
          Certains paramètres semblent incorrects.{msg ? ` ${msg}` : ''}
        </p>
        <Link to="/compare" className="px-4 py-2 rounded-xl bg-black text-white">
          Revenir au comparateur
        </Link>
      </div>
    </div>
  );
}
