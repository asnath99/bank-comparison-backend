import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ScoreResponse, CriteriaKey } from "../types";
import { Trophy } from "lucide-react";

interface ScoreResultsProps {
  response: ScoreResponse;
  criteria: CriteriaKey[];
}

const ScoreResults = ({ response }: ScoreResultsProps) => {
  const { ranking, criteria_used } = response;

  const getCriteriaLabel = (key: string) => {
    return criteria_used.find(c => c.key === key)?.label || key;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Classement par Score</h2>
      {ranking.map((item, index) => (
        <Card key={item.bank.id} className={index === 0 ? "border-primary border-2" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">#{index + 1}</span>
              <CardTitle className="text-2xl">{item.bank.name}</CardTitle>
            </div>
            {index === 0 && <Trophy className="w-8 h-8 text-primary" />}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold">{item.score.toFixed(0)}</span>
              <div className="w-full space-y-2">
                <p className="text-sm text-muted-foreground">Score global sur 100</p>
                <Progress value={item.score} />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold">Détail par critère :</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.perCriteria.map(pc => (
                  <div key={pc.key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{getCriteriaLabel(pc.key)}</span>
                      <span className="text-sm font-medium">{pc.score.toFixed(0)}/100</span>
                    </div>
                    <Progress value={pc.score} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScoreResults;