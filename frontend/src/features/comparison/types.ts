export type CurrencyDisplay = string; // ex: "F CFA", "USD"

export type Bank = { id: number; name: string };

export type ComparisonMode = 'plain' | 'score';
export type Mode = ComparisonMode;

export type CriteriaKey = 'account_monthly_fee' | 'card_annual_fee';

export type Filters = {
  account_monthly_fee?: { type?: string | string[] };
  card_annual_fee?: { type?: string | string[] };
};

export type Budgets = Partial<Record<CriteriaKey, number>>;

export type Selection = {
  bankIds: number[] | 'ALL';
  accountType?: string;
  criteria: CriteriaKey[];
  budgets: Budgets; 
};

export type ComparisonRequest = {
  criteria: CriteriaKey[];
  mode: ComparisonMode;
  bankIds?: number[];
  filters?: Filters;
  budgets?: Budgets; 
};

// Réponses (MVP)
export type PlainRankingItem = {
  bank: Bank;
  value?: number | string | null;
  display?: string;
  currency_display?: CurrencyDisplay;
  available?: boolean;
  notes?: string[];
  excluded?: boolean;
};

export type PlainCriterionBlockV1 = {
  criteria: { key: CriteriaKey; label: string };
  ranking: PlainRankingItem[];
};

export type PlainCriterionBlockV2 = {
  key: CriteriaKey;
  rows: PlainRankingItem[];
  label?: string;
};

export type PlainResponse = {
  mode: 'plain';
  criteria_used: Array<{ key: CriteriaKey; label: string }>;
  per_criterion:
    | Record<CriteriaKey, PlainRankingItem[]>
    | PlainCriterionBlockV1[]
    | PlainCriterionBlockV2[];
  overall_ranking?: Array<{ bank: Bank; value: number | string | null; currency_display?: CurrencyDisplay }>;
  budget_analysis?: {
    within: Bank[];
    over: Array<{ bank: Bank; criterion: CriteriaKey; budget: number; value?: number; overBy?: number }>;
    missing: Array<{ bank: Bank; criterion: CriteriaKey }>;
  };
  explanations?: string;
};

export type ScorePerCriteria = {
  key: CriteriaKey;
  score: number; // /100
  notes?: string[];
};

export type ScoreRankingRow = {
  bank: Bank;
  score: number; // global /100
  perCriteria: ScorePerCriteria[];
  metrics?: Record<string, unknown>;
};

export type ScoreResponse = {
  mode: 'score';
  criteria_used: Array<{ key: CriteriaKey; label: string; weight?: number; critical?: boolean }>;
  ranking: ScoreRankingRow[];
  budget_analysis?: PlainResponse['budget_analysis'];
  explanations?: string;
};

export type ComparisonResponse = PlainResponse | ScoreResponse;
