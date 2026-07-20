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

export const portfolio: PortfolioProject[] = [];

export function getProject(slug: string) {
  return portfolio.find((project) => project.slug === slug);
}