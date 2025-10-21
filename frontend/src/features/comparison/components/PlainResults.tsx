'use client'

import type { PlainResultV2 } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PlainResultsProps {
  results: PlainResultV2
}

export function PlainResults({ results }: PlainResultsProps) {
  return (
    <div className="space-y-8">
      {results.blocks.map((block) => (
        <Card key={block.key}>
          <CardHeader>
            <CardTitle>{block.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banque</TableHead>
                  <TableHead className="text-right">Valeur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {block.rows.map((row) => (
                  <TableRow key={row.bank_id}>
                    <TableCell>{results.banks[row.bank_id]?.name ?? 'N/A'}</TableCell>
                    <TableCell className="text-right">{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
