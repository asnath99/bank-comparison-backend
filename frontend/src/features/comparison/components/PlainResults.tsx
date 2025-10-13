import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PlainResponse, CriteriaKey } from "../types";

interface PlainResultsProps {
  response: PlainResponse;
  criteria: CriteriaKey[];
  accountType?: string;
}

const PlainResults = ({ response }: PlainResultsProps) => {
  const { per_criterion, criteria_used } = response;

  // We will only render the V2 block format for now
  if (!per_criterion || !Array.isArray(per_criterion) || !('rows' in per_criterion[0])) {
    return <p>Format de données non supporté.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Résultats Détaillés</h2>
      {per_criterion.map(block => (
        <Card key={block.key}>
          <CardHeader>
            <CardTitle>{block.label || block.key}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banque</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {block.rows.map(row => (
                  <TableRow key={row.bank.id}>
                    <TableCell className="font-medium">{row.bank.name}</TableCell>
                    <TableCell>
                      <Badge variant={row.available ? "default" : "destructive"}>
                        {row.available ? 'Oui' : 'Non'}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.display || 'N/A'}</TableCell>
                    <TableCell>{row.notes?.join(', ') || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlainResults;