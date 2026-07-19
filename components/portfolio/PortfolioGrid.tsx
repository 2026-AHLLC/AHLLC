import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    slug: "ah-llc",
    title: "AH LLC",
    category: "AI Consulting",
    description:
      "Modern AI consulting website built with Next.js and Tailwind CSS.",
  },
  {
    slug: "johnnys-studio",
    title: "Johnny's Studio",
    category: "Creative Studio",
    description:
      "Photography, videography, branding and AI-powered content creation.",
  },
  {
    slug: "bewise-contractors",
    title: "BeWise Contractors",
    category: "Construction",
    description:
      "Lead-generation website for a home improvement contractor.",
  },
  {
    slug: "djinnmagic",
    title: "DJINNMagic",
    category: "Publishing",
    description:
      "Custom branded website with immersive design and digital content.",
  },
  {
    slug: "suffolk-ny-pool-services",
    title: "Suffolk NY Pool Services",
    category: "Local Service Business",
    description:
      "Local SEO website focused on pool maintenance and installations.",
  },
];

export default function PortfolioGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.slug}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8"
          >
            <p className="text-sm uppercase tracking-wide text-blue-400">
              {project.category}
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white">
              {project.title}
            </h3>

            <p className="mt-4 text-zinc-400">
              {project.description}
            </p>

            <Button asChild className="mt-8 w-full">
              <Link href={`/portfolio/${project.slug}`}>
                View Project
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}