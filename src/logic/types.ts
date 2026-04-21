export type DimensionKey = "ifs" | "toc" | "du" | "ai" | "mrp" | "ap" | "co";

export type DomainKey =
  | "technology"
  | "economy"
  | "governance"
  | "society"
  | "environment"
  | "infrastructure"
  | "human_stability";

export type Values = Record<DimensionKey, number>;

export type DomainState = {
  key: DomainKey;
  selected: boolean;
  risk: number;
  timing: number;
};

export type ArchetypeDefinition = {
  id: string;
  name: string;
  short: string;
  description: string;
  vector: Values;
};
