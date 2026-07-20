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

import johnnysStudio from "@/content/portfolio/johnnys-studio";
import bewiseContractors from "@/content/portfolio/bewise-contractors";
import suffolkNyPoolServices from "@/content/portfolio/suffolk-ny-pool-services";

export const portfolio = [
  johnnysStudio,
  bewiseContractors,
  suffolkNyPoolServices,
];

export function getProject(slug: string) {
  return portfolio.find((p) => p.slug === slug);
}