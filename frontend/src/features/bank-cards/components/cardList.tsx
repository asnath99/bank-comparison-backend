import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { BankCard } from '../api';

export function CardList({ items }: { items: BankCard[] }) {
  const navigate = useNavigate();
  if (!items.length) return <div>Aucune carte trouvée.</div>;

  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="px-3 py-2">Type de carte</th>
            <th className="px-3 py-2">Frais</th>
            <th className="px-3 py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((card) => {
            const amount = typeof card.fee === 'string' ? Number(card.fee) : card.fee;
            const formatted =
              amount == null || Number.isNaN(amount)
                ? '—'
                : amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

            const go = () => navigate(`/cards/${card.id}`);

            return (
              <tr
                key={card.id}
                role="link"
                tabIndex={0}
                aria-label={`Ouvrir la fiche de la carte ${card.card_type ?? ''}`}
                onClick={go}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    go();
                  }
                }}
                className="border-t cursor-pointer hover:bg-accent/50 focus-visible:outline-none "
              >
                <td className="px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{card.card_type ?? '—'}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                  </div>
                </td>
                <td className="px-3 py-2">
                  {formatted}
                  {card.fee_is_ttc ? (
                    <span className="ml-2 text-xs rounded bg-gray-100 px-2 py-0.5 text-gray-600">TTC</span>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  <span className="line-clamp-2" title={card.notes ?? ''}>
                    {card.notes || '—'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
