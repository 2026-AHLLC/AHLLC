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


export function getProject(slug: string) {
  return portfolio.find((p) => p.slug === slug);
}