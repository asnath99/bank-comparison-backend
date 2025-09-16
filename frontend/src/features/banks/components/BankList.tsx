import { Link } from 'react-router-dom';
import type { Bank } from '../api';

export function BankList({ banks }: { banks: Bank[] }) {
  if (!banks.length) return <div>Aucune banque trouvée.</div>;

  return (
    <ul className="divide-y bg-white rounded-lg border">
      {banks.map((b) => (
        <li key={b.id} className="p-3 flex items-center gap-3">
          <div className="h-8 w-8 flex items-center justify-center overflow-hidden rounded bg-gray-100">
            {b.logo_url ? (
              <img
                src={b.logo_url}
                alt={`Logo ${b.name}`}
                className="h-8 w-8 object-contain"
                loading="lazy"
              />
            ) : (
              <span className="text-xs text-gray-500">—</span>
            )}
          </div>

          <div className="min-w-0">
            <Link to={`/banks/${b.id}`} className="font-medium underline decoration-transparent hover:decoration-inherit">
              {b.name}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
