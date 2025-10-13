import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Bank } from '../api';
import { Building2 } from 'lucide-react';

interface BankListProps {
  banks: Bank[];
}

export const BankList = ({ banks }: BankListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {banks.map(bank => (
        <Link to={`/banks/${bank.id}`} key={bank.id} className="block hover:scale-105 transition-transform duration-200">
          <Card className="h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{bank.name}</CardTitle>
              {/* Placeholder for logo */}
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {bank.description || 'Aucune description disponible.'}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};