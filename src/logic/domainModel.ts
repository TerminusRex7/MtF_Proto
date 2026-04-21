import type { DomainState, Values } from "./types";

export function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function deriveScoresFromDomains(domains: DomainState[]): Pick<Values, "ifs" | "du" | "toc"> {
  const selected = domains.filter((d) => d.selected);
  const source = selected.length ? selected : domains;

  const avgRisk = source.reduce((sum, d) => sum + d.risk, 0) / source.length;
  const avgTiming = source.reduce((sum, d) => sum + d.timing, 0) / source.length;
  const avgSelectedRisk = selected.length
    ? selected.reduce((sum, d) => sum + d.risk, 0) / selected.length
    : avgRisk;
  const avgSelectedTiming = selected.length
    ? selected.reduce((sum, d) => sum + d.timing, 0) / selected.length
    : avgTiming;
  const tech = domains.find((d) => d.key === "technology");

  return {
    ifs: clamp(avgSelectedRisk),
    du: clamp(avgSelectedTiming * 0.6 + avgTiming * 0.4),
    toc: clamp((tech?.risk ?? 50) * 0.65 + (100 - (tech?.timing ?? 50)) * 0.15 + 20),
  };
}
