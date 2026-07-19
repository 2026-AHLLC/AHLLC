"use client";

import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Project = {
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
};

const projects: Project[] = [
  {
    title: "AH LLC",
    category: "AI Consulting",
    description:
      "Modern AI consulting and software agency built with Next.js 15.",
    image: "/images/portfolio/ahllc.jpg",
    slug: "ahllc",
  },
  {
    title: "BeWise Contractors",
    category: "Construction",
    description:
      "Lead-generation website for a masonry and home improvement company.",
    image: "/images/portfolio/bewise-contractors.jpg",
    slug: "bewise-contractors",
  },
  {
    title: "Ritual Magick App",
    category: "Spiritual",
    description:
      "Custom branding, website development for an esoteric business.",
    image: "/images/portfolio/ritualmagick-app.jpg",
    slug: "ritualmagick-app",
  },
  {
    title: "Suffolk NY Pool Services",
    category: "Local Business",
    description:
      "Local SEO and lead generation website for a swimming pool company.",
    image: "/images/portfolio/pools.jpg",
    slug: "suffolk-ny-pool-services",
  },
  {
    title: "Johnny's Studio",
    category: "Creative",
    description:
      "Photography, videography, and digital marketing portfolio.",
    image: "/images/portfolio/johnnys-studio.jpg",
    slug: "johnnys-studio",
  },
  
];

export default function Portfolio() {
  return (
    <Section spacing="xl">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Badge variant="gradient">Portfolio</Badge>

          <h2 className="mt-6 text-5xl font-black text-white">
            Recent Projects
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-zinc-400">
            Websites, AI solutions, automation, and digital experiences built
            to help businesses grow.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const href = `/portfolio/${project.slug}` as Route;

            return (
              <Card
                key={project.slug}
                variant="feature"
                className="group overflow-hidden rounded-3xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex h-full flex-col p-8">
                  <Badge>{project.category}</Badge>

                  <h3 className="mt-4 text-2xl font-bold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-4 flex-1 leading-7 text-zinc-400">
                    {project.description}
                  </p>

                  <div className="mt-8">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-2 font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                      View Project
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Section>
  );
}