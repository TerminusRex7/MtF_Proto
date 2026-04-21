import type { ArchetypeDefinition } from "./types";

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: "stabilist",
    name: "System Optimizing Stabilist",
    short: "Stabilist",
    description: "Believes systems will bend, not break, and the best move is to stay positioned within them.",
    vector: { ifs: 25, toc: 82, du: 28, ai: 35, mrp: 22, ap: 20, co: 60 },
  },
  {
    id: "adapter",
    name: "Strategic Adapter",
    short: "Adapter",
    description: "Sees meaningful change coming, but believes smart repositioning beats dramatic exits.",
    vector: { ifs: 40, toc: 72, du: 45, ai: 55, mrp: 42, ap: 38, co: 58 },
  },
  {
    id: "hedger",
    name: "Financial Hedger",
    short: "Hedger",
    description: "Focused on protecting downside risk, especially around economic instability and market stress.",
    vector: { ifs: 58, toc: 48, du: 62, ai: 52, mrp: 28, ap: 32, co: 42 },
  },
  {
    id: "traditionalist",
    name: "Prepared Traditionalist",
    short: "Traditionalist",
    description: "Values preparation, family, and controlled adaptation more than radical reinvention.",
    vector: { ifs: 55, toc: 38, du: 52, ai: 60, mrp: 22, ap: 58, co: 45 },
  },
  {
    id: "networked_builder",
    name: "Networked Resilience Builder",
    short: "Networked Builder",
    description: "Believes institutions weaken, but trusted networks and cooperative resilience can compensate.",
    vector: { ifs: 70, toc: 60, du: 65, ai: 82, mrp: 48, ap: 62, co: 92 },
  },
  {
    id: "decentralized_builder",
    name: "Decentralized Resilience Builder",
    short: "Decentralized Builder",
    description: "Expects centralized systems to weaken while technology and distributed models create alternatives.",
    vector: { ifs: 76, toc: 88, du: 68, ai: 88, mrp: 54, ap: 66, co: 68 },
  },
  {
    id: "relocator",
    name: "Frontier Relocator",
    short: "Relocator",
    description: "Believes the smartest move is to reposition early before pressure builds.",
    vector: { ifs: 72, toc: 50, du: 64, ai: 92, mrp: 94, ap: 72, co: 58 },
  },
  {
    id: "homesteader",
    name: "Resilient Homesteader",
    short: "Homesteader",
    description: "Wants high control over essentials, lower dependence, and a more grounded form of resilience.",
    vector: { ifs: 82, toc: 30, du: 70, ai: 90, mrp: 68, ap: 95, co: 36 },
  },
  {
    id: "minimalist",
    name: "Collapse Minimalist",
    short: "Minimalist",
    description: "Assumes systems deteriorate and responds by simplifying life and reducing exposure.",
    vector: { ifs: 88, toc: 25, du: 74, ai: 72, mrp: 48, ap: 68, co: 25 },
  },
  {
    id: "waiter",
    name: "Watchful Waiter",
    short: "Waiter",
    description: "Acknowledges risk but does not yet see enough reason to make major changes.",
    vector: { ifs: 52, toc: 45, du: 42, ai: 18, mrp: 18, ap: 20, co: 35 },
  },
];
