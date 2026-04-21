import { ARCHETYPES } from "./archetypeDefinitions";
import type { DimensionKey, Values } from "./types";

export const WEIGHTS: Values = {
  ifs: 1.4,
  toc: 1.1,
  du: 1.3,
  ai: 1.4,
  mrp: 1.1,
  ap: 1.2,
  co: 1.0,
};

export function weightedDistance(values: Values, vector: Values): number {
  return Math.sqrt(
    (Object.keys(WEIGHTS) as DimensionKey[]).reduce((sum, key) => {
      const diff = values[key] - vector[key];
      return sum + WEIGHTS[key] * diff * diff;
    }, 0)
  );
}

export function scoreSimilarity(distance: number, maxDistance: number): number {
  return Math.round(Math.max(0, 1 - distance / maxDistance) * 100);
}

export function normalizeTop2Gap(first: number, second: number): number {
  return Math.min(100, Math.round((Math.max(0, second - first) / 60) * 100));
}

export function rankArchetypes(values: Values) {
  const scored = ARCHETYPES
    .map((archetype) => ({
      ...archetype,
      distance: weightedDistance(values, archetype.vector),
    }))
    .sort((a, b) => a.distance - b.distance);

  const maxDistance = Math.sqrt(
    (Object.keys(WEIGHTS) as DimensionKey[]).reduce((sum, key) => sum + WEIGHTS[key] * 100 * 100, 0)
  );

  const primary = scored[0];
  const secondary = scored[1];

  return {
    ranked: scored.map((item) => ({
      ...item,
      match: scoreSimilarity(item.distance, maxDistance),
    })),
    primary: { ...primary, match: scoreSimilarity(primary.distance, maxDistance) },
    secondary: { ...secondary, match: scoreSimilarity(secondary.distance, maxDistance) },
    confidence: normalizeTop2Gap(primary.distance, secondary.distance),
  };
}
