import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const projects = [
  {
    slug: "ahllc",
    title: "AH LLC",
    category: "Corporate Website",
    description:
      "A modern AI consulting and technology agency website built with Next.js 15.",
    image: "/images/portfolio/ahllc.jpg",
  },
  {
    slug: "bewise-contractors",
    title: "BeWise Contractors",
    category: "Construction",
    description:
      "Lead-generation website for a masonry and home improvement company.",
    image: "/images/portfolio/bewise.jpg",
  },
  {
    slug: "djinnmagic",
    title: "DjinnMagic",
    category: "E-Commerce",
    description:
      "Occult-themed website with custom branding and educational content.",
    image: "/images/portfolio/djinnmagic.jpg",
  },
];

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | AH LLC",
    };
  }

  return {
    title: `${project.title} | AH LLC`,
    description: project.description,
  };
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl">
          <Button asChild variant="ghost">
            <Link href="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>

          <div className="mt-8 max-w-4xl">
            <Badge>{project.category}</Badge>

            <h1 className="mt-4 text-5xl font-black text-white">
              {project.title}
            </h1>

            <p className="mt-6 text-xl text-zinc-400">
              {project.description}
            </p>

            <Card className="mt-10 overflow-hidden rounded-2xl">
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={675}
                priority
                className="h-auto w-full object-cover"
              />
            </Card>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}