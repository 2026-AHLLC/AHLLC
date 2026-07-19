import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clapperboard,
  Globe2,
  MonitorSmartphone,
  Palette,
  Play,
  Search,
  Sparkles,
  Video,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Johnny's Studio | AH LLC Portfolio",
  description:
    "See how AH LLC created a polished digital presence for Johnny's Studio, combining videography, photography, web design, and AI-powered marketing.",
};

const services = [
  {
    icon: Video,
    title: "Video Production",
    description:
      "Cinematic promotional content designed for websites, social media, and digital advertising.",
  },
  {
    icon: Camera,
    title: "Photography",
    description:
      "Professional brand, product, event, and lifestyle photography that gives the business a consistent visual identity.",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive Website",
    description:
      "A fast, mobile-first website that presents services clearly and turns visitors into qualified inquiries.",
  },
  {
    icon: Search,
    title: "Local SEO",
    description:
      "Search-focused page structure, metadata, and content built to improve visibility in Long Island and surrounding markets.",
  },
  {
    icon: Sparkles,
    title: "AI Marketing",
    description:
      "AI-assisted content workflows for faster campaign planning, copywriting, repurposing, and lead follow-up.",
  },
  {
    icon: Palette,
    title: "Brand Direction",
    description:
      "A cohesive visual system that connects the studio's photography, video work, website, and promotional materials.",
  },
];

const outcomes = [
  "Clear positioning across videography, photography, web development, and AI marketing",
  "A premium presentation that works across desktop, tablet, and mobile",
  "Stronger calls to action for consultations and project inquiries",
  "A scalable website structure for future portfolio projects and service pages",
];

export default function JohnnysStudioPortfolioPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Badge variant="gradient" className="mb-6">
                Featured Portfolio Project
              </Badge>

              <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
                Johnny&apos;s Studio
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
                A modern creative-services brand combining videography,
                photography, website development, and AI-powered marketing
                under one polished digital experience.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Start a Similar Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <a href="https://johnnys.studio" target="_blank" rel="noreferrer">
                    Visit Website
                    <Globe2 className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Industry", "Creative Services"],
                  ["Location", "Long Island, NY"],
                  ["Platform", "Next.js"],
                  ["Focus", "Lead Generation"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card variant="glass" className="relative overflow-hidden rounded-[2rem] p-3">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-violet-500/20" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950">
                <Image
                  src="/portfolio/project-01.webp"
                  alt="Johnny's Studio website project"
                  width={1200}
                  height={900}
                  priority
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 pt-20">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-950">
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Creative work that converts</p>
                      <p className="text-sm text-zinc-300">Brand, website, content, and marketing</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-5">The Challenge</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-white">
                Turn several creative services into one clear brand
              </h2>
              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Johnny&apos;s Studio needed a digital presence capable of presenting multiple services without feeling fragmented. Visitors had to understand the offer quickly, see the quality of the work, and know exactly how to begin a project.
              </p>
              <p className="mt-5 text-lg leading-8 text-zinc-400">
                AH LLC created a unified experience centered on strong visuals, concise service positioning, responsive design, and direct conversion paths.
              </p>
            </div>

            <Card variant="feature" className="rounded-3xl p-8">
              <Clapperboard className="h-10 w-10 text-blue-400" />
              <h3 className="mt-6 text-2xl font-bold text-white">Project objectives</h3>
              <div className="mt-6 space-y-4">
                {[
                  "Present the studio as a premium, multi-disciplinary creative partner",
                  "Showcase visual work without sacrificing website speed",
                  "Create a clear path from browsing to inquiry",
                  "Build a foundation that can expand as the portfolio grows",
                ].map((objective) => (
                  <div key={objective} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                    <p className="text-zinc-300">{objective}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        <Section spacing="xl" background="muted">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gradient" className="mb-5">What We Delivered</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              One integrated creative growth platform
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Every component was designed to reinforce the same brand and support the same goal: generating better opportunities.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} variant="feature" className="rounded-3xl p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">{service.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">{service.description}</p>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section spacing="xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Card variant="glass" className="rounded-3xl p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Project outcome</p>
              <p className="mt-6 text-3xl font-bold leading-tight text-white">
                A focused creative brand built to showcase work and generate qualified leads.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-3xl font-black text-white">4</p>
                  <p className="mt-1 text-sm text-zinc-400">Core service lines</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-3xl font-black text-white">1</p>
                  <p className="mt-1 text-sm text-zinc-400">Unified brand system</p>
                </div>
              </div>
            </Card>

            <div>
              <Badge variant="outline" className="mb-5">Results</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-white">A stronger foundation for growth</h2>
              <div className="mt-8 space-y-5">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="flex gap-4">
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </span>
                    <p className="text-lg leading-7 text-zinc-300">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section background="gradient" spacing="xl">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">Build With AH LLC</Badge>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Need a website and marketing system that represents your business properly?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Let&apos;s create a polished digital presence that communicates your value, showcases your work, and makes it easier for the right customers to contact you.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/portfolio">View More Projects</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
