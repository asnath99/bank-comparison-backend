import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Selection } from "../types";

interface ResultsSummaryBarProps {
  selection: Selection;
}

const ResultsSummaryBar = ({ selection }: ResultsSummaryBarProps) => {
  const { bankIds, criteria, accountType } = selection;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre sélection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-semibold">Banques</span>
          <Badge variant="secondary">
            {bankIds === 'ALL' ? 'Toutes les banques' : `${bankIds.length} banque(s)`}
          </Badge>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-semibold">Critères</span>
          <div className="flex flex-wrap gap-2">
            {criteria.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
          </div>
        </div>
        {accountType && (
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-semibold">Type de compte</span>
            <Badge variant="secondary">{accountType}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsSummaryBar;