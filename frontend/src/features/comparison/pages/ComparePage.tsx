import { useNavigate } from 'react-router-dom';
import ComparisonForm, { type FormState } from '../components/ComparisonForm';

function toSearchParamsFromState(s: FormState): string {
  const params = new URLSearchParams();
  params.set('banks', s.bankIds === 'ALL' ? 'ALL' : s.bankIds.join(','));
  if (s.accountType) params.set('accountType', s.accountType);
  if (s.criteria?.length) params.set('criteria', s.criteria.join(','));
  if (s.budgets && Object.keys(s.budgets).length) params.set('budgets', JSON.stringify(s.budgets));
  return params.toString();
}

export function ComparePage() {
  const navigate = useNavigate();

  const onSubmit = (state: FormState) => {
    // le premier critère coché reste le principal, mais la page résultats gère tout
    const qs = toSearchParamsFromState(state);
    navigate(`/results?${qs}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configurer la comparaison</h1>
      </div>
      <ComparisonForm onSubmit={onSubmit} />
    </div>
  );
}