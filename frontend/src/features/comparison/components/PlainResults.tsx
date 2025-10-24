'use client'

import type { PlainResponse } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PlainResultsProps {
  results: PlainResponse
}

export function PlainResults({ results }: PlainResultsProps) {
  // Handle the case where results might be undefined or malformed
  if (!results || !results.criteria_used || !results.per_criterion) {
    return (
      <div className="p-4 border rounded-lg text-amber-700 bg-amber-50">
        Aucun résultat de comparaison disponible.
      </div>
    );
  }

  // Transform per_criterion data into an array if it's an object
  const criteriaBlocks = Array.isArray(results.per_criterion)
    ? results.per_criterion
    : Object.entries(results.per_criterion).map(([key, ranking]) => ({
        key,
        label: results.criteria_used.find(c => c.key === key)?.label || key,
        ranking
      }));

  return (
    <div className="space-y-8">
      {criteriaBlocks.map((block: any, idx) => {
        const criterionKey = 'key' in block ? block.key : block.criteria?.key;
        const ranking = 'ranking' in block ? block.ranking : 'rows' in block ? block.rows : [];
        const label = 'label' in block ? block.label : block.criteria?.label || criterionKey;

        return (
          <Card key={criterionKey || idx}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              {ranking && ranking.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banque</TableHead>
                      <TableHead className="text-right">Valeur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ranking.map((item: any, itemIdx: number) => {
                      const bankName = item.bank?.name || 'N/A';
                      const value = item.display || item.value || 'N/A';

                      return (
                        <TableRow key={item.bank?.id || itemIdx}>
                          <TableCell>{bankName}</TableCell>
                          <TableCell className="text-right">{value}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Aucune donnée disponible pour ce critère.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}
