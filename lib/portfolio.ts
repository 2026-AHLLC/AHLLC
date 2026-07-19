export interface PortfolioProject {
  slug: string;
  title: string;
  category: string;
  description: string;
  hero: string;
  technologies: string[];
  problem: string;
  solution: string;
  results: string[];
}

import ahllc from "@/content/portfolio/ah-llc";
import bewise from "@/content/portfolio/bewise-contractors";


export const portfolio = [
  ahllc,

];

export function getProject(slug: string) {
  return portfolio.find((p) => p.slug === slug);
}