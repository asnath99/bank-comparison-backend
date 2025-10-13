import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/axios';
import { Bank } from '../types';

// Types local to this form
interface Criteria {
  key: string;
  label: string;
  description: string;
}

export interface FormState {
  bankIds: number[] | 'ALL';
  criteria: string[];
  budgets: Record<string, number>;
  accountType?: string;
}

interface ComparisonFormProps {
  onSubmit: (state: FormState) => void;
}

// API Calls
const getPublicBanks = async (): Promise<Bank[]> => {
  const response = await api.get('/banks');
  return response.data.data;
};

const getPublicCriteria = async (): Promise<Criteria[]> => {
  const response = await api.get('/comparison/criteria');
  return response.data.data;
};

const ComparisonForm = ({ onSubmit }: ComparisonFormProps) => {
  const [selectedBankIds, setSelectedBankIds] = useState<number[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<Record<string, number>>({});

  const banksQuery = useQuery({ queryKey: ['publicBanks'], queryFn: getPublicBanks });
  const criteriaQuery = useQuery({ queryKey: ['publicCriteria'], queryFn: getPublicCriteria });

  const handleBankSelect = (bankId: number) => {
    setSelectedBankIds(prev => 
      prev.includes(bankId) ? prev.filter(id => id !== bankId) : [...prev, bankId]
    );
  };

  const handleCriteriaSelect = (criteriaKey: string) => {
    setSelectedCriteria(prev =>
      prev.includes(criteriaKey) ? prev.filter(key => key !== criteriaKey) : [...prev, criteriaKey]
    );
  };

  const handleBudgetChange = (criteriaKey: string, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue >= 0) {
      setBudgets(prev => ({ ...prev, [criteriaKey]: numberValue }));
    } else if (value === '') {
      setBudgets(prev => {
        const newBudgets = { ...prev };
        delete newBudgets[criteriaKey];
        return newBudgets;
      });
    }
  };

  const handleSubmit = () => {
    onSubmit({
      bankIds: selectedBankIds.length > 0 ? selectedBankIds : 'ALL',
      criteria: selectedCriteria,
      budgets,
    });
  };

  if (banksQuery.isLoading || criteriaQuery.isLoading) {
    return <div>Chargement des options de comparaison...</div>;
  }

  if (banksQuery.error || criteriaQuery.error) {
    return <div>Erreur lors du chargement des options.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. Choisissez les banques</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {banksQuery.data?.map(bank => (
            <div key={bank.id} className="flex items-center space-x-2">
              <Checkbox id={`bank-${bank.id}`} onCheckedChange={() => handleBankSelect(bank.id)} />
              <Label htmlFor={`bank-${bank.id}`}>{bank.name}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Choisissez les critères de comparaison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {criteriaQuery.data?.map(c => (
            <div key={c.key} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id={`criteria-${c.key}`} onCheckedChange={() => handleCriteriaSelect(c.key)} />
                <Label htmlFor={`criteria-${c.key}`}>{c.label}</Label>
              </div>
              {selectedCriteria.includes(c.key) && (
                 <div className="pl-6">
                   <Label htmlFor={`budget-${c.key}`} className="text-sm text-muted-foreground">Budget max (optionnel)</Label>
                   <Input 
                     id={`budget-${c.key}`}
                     type="number"
                     placeholder="ex: 5000"
                     className="mt-1 w-full md:w-1/2"
                     onChange={(e) => handleBudgetChange(c.key, e.target.value)}
                   />
                 </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg">Comparer</Button>
      </div>
    </div>
  );
};

export default ComparisonForm;
