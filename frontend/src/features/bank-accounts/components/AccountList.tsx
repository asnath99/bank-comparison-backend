import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { BankAccount } from '../api';

export function AccountList({ items }: { items: BankAccount[] }) {
  const navigate = useNavigate();
  if (!items.length) return <div>Aucun compte trouvé.</div>;

  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="px-3 py-2">Type de compte</th>
            <th className="px-3 py-2">Frais mensuels</th>
            <th className="px-3 py-2">Devise</th>
            <th className="px-3 py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((account) => {
            const amount =
              typeof account.monthly_fee === 'string' ? Number(account.monthly_fee) : account.monthly_fee;
            const label = account.currency_display ?? '';
            const isCFA = label.toUpperCase().includes('CFA');
            const formatted =
              amount == null || Number.isNaN(amount)
                ? '—'
                : amount.toLocaleString('fr-FR', { maximumFractionDigits: isCFA ? 0 : 2 });

            const go = () => navigate(`/accounts/${account.id}`);

            return (
              <tr
                key={account.id}
                role="link"
                tabIndex={0}
                aria-label={`Ouvrir la fiche du compte ${account.type ?? ''}`}
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
                    <span className="truncate">{account.type ?? '—'}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                  </div>
                </td>
                <td className="px-3 py-2">
                  {formatted}
                  {account.monthly_fee_is_ttc ? (
                    <span className="ml-2 text-xs rounded bg-gray-100 px-2 py-0.5 text-gray-600">TTC</span>
                  ) : null}
                </td>
                <td className="px-3 py-2">{label || '—'}</td>
                <td className="px-3 py-2">
                  <span className="line-clamp-2" title={account.notes ?? ''}>
                    {account.notes || '—'}
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
