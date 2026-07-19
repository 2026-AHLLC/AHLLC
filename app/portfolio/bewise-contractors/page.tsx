import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BrickWall,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Construction,
  Hammer,
  HardHat,
  Home,
  MapPin,
  Paintbrush,
  Ruler,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "BeWise Contractors | AH LLC Portfolio",
  description:
    "See how AH LLC created a professional home improvement and masonry website for BeWise Contractors.",
  alternates: {
    canonical: "/portfolio/bewise-contractors",
  },
  openGraph: {
    title: "BeWise Contractors | AH LLC Portfolio",
    description:
      "A modern contractor website built to showcase home improvement, masonry, renovation, and exterior construction services.",
    url: "/portfolio/bewise-contractors",
    siteName: "AH LLC",
    type: "website",
  },
};

const services = [
  {
    icon: Home,
    title: "Home Improvement",
    description:
      "Clear presentation of residential improvement services, including renovations, repairs, upgrades, and property enhancements.",
  },
  {
    icon: BrickWall,
    title: "Masonry Services",
    description:
      "Dedicated positioning for patios, walkways, stoops, retaining walls, pavers, brickwork, and concrete projects.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Responsive layouts and prominent contact actions for homeowners searching for contractors from their phones.",
  },
  {
    icon: Search,
    title: "Local SEO",
    description:
      "Search-focused service content, metadata, and page structure designed to support local contractor visibility.",
  },
  {
    icon: ClipboardCheck,
    title: "Estimate Generation",
    description:
      "Conversion-focused calls to action that guide visitors toward quote requests, consultations, and project discussions.",
  },
  {
    icon: ShieldCheck,
    title: "Trust Positioning",
    description:
      "Professional visual design and clear messaging built to communicate reliability, craftsmanship, and accountability.",
  },
];

const objectives = [
  "Present home improvement and masonry services under one cohesive contractor brand",
  "Build immediate trust with homeowners evaluating local contractors",
  "Make estimate requests simple on desktop and mobile devices",
  "Create a scalable foundation for service pages, project galleries, and local SEO content",
];

const outcomes = [
  "A professional contractor website aligned with the BeWise Contractors brand",
  "Clear service positioning for masonry, renovations, repairs, and exterior improvements",
  "Mobile-friendly calls to action for quote and consultation requests",
  "A structured project portfolio foundation for showcasing completed work",
  "Search-friendly architecture that can expand into service-area landing pages",
  "A modern platform ready for reviews, galleries, lead forms, and future automation",
];

const specialties = [
  {
    icon: BrickWall,
    title: "Patios and Pavers",
  },
  {
    icon: Construction,
    title: "Walkways and Stoops",
  },
  {
    icon: Building2,
    title: "Retaining Walls",
  },
  {
    icon: Hammer,
    title: "Interior Renovations",
  },
  {
    icon: Paintbrush,
    title: "Exterior Improvements",
  },
  {
    icon: Wrench,
    title: "Repairs and Upgrades",
  },
];

const serviceAreas = [
  "Suffolk County",
  "Nassau County",
  "Brookhaven",
  "Smithtown",
  "Islip",
  "Huntington",
  "Babylon",
  "Long Island",
];

const stack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Vercel",
  "Responsive Design",
  "Local SEO",
];

export default function BeWiseContractorsPortfolioPage() {
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
                BeWise Contractors
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
                A professional home improvement and masonry website designed to
                showcase craftsmanship, build homeowner trust, and generate
                qualified project inquiries.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Start a Similar Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link href="/portfolio">View More Projects</Link>
                </Button>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Industry", "Construction"],
                  ["Specialty", "Masonry"],
                  ["Platform", "Next.js"],
                  ["Primary Goal", "Estimate Leads"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {label}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Card
              variant="glass"
              className="relative overflow-hidden rounded-[2rem] p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                      Contractor Growth Platform
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-white">
                      Built right. Presented right.
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                    <HardHat className="h-7 w-7 text-amber-400" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  {[
                    {
                      icon: BrickWall,
                      label: "Masonry and Hardscaping",
                    },
                    {
                      icon: Home,
                      label: "Home Improvement",
                    },
                    {
                      icon: Hammer,
                      label: "Renovations and Repairs",
                    },
                    {
                      icon: ClipboardCheck,
                      label: "Project Estimate Requests",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05]">
                          <Icon className="h-5 w-5 text-amber-400" />
                        </div>

                        <p className="font-semibold text-white">{item.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-5">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-amber-400" />

                    <p className="font-semibold text-white">
                      Designed to communicate quality
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Strong visual hierarchy, clear service descriptions, and
                    conversion-focused paths help homeowners evaluate the
                    company with confidence.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-5">
                The Challenge
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight text-white">
                Turn skilled craftsmanship into a credible digital brand
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Homeowners often compare multiple contractors before requesting
                an estimate. The website needed to establish credibility
                quickly while making the company&apos;s range of services easy
                to understand.
              </p>

              <p className="mt-5 text-lg leading-8 text-zinc-400">
                BeWise Contractors also needed a flexible platform that could
                support project galleries, testimonials, local service pages,
                and future lead-generation campaigns.
              </p>
            </div>

            <Card variant="feature" className="rounded-3xl p-8">
              <Ruler className="h-10 w-10 text-amber-400" />

              <h3 className="mt-6 text-2xl font-bold text-white">
                Project objectives
              </h3>

              <div className="mt-6 space-y-4">
                {objectives.map((objective) => (
                  <div key={objective} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                    <p className="text-zinc-300">{objective}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        <Section spacing="xl" background="muted">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gradient" className="mb-5">
              What We Delivered
            </Badge>

            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              A contractor website designed around trust and action
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-400">
              The website balances strong construction branding with simple
              navigation, clear service information, and direct paths to
              request an estimate.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Card
                  key={service.title}
                  variant="feature"
                  className="rounded-3xl p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                    <Icon className="h-6 w-6 text-amber-400" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-zinc-400">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section spacing="xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Card variant="glass" className="rounded-3xl p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                Core specialties
              </p>

              <h2 className="mt-5 text-3xl font-bold text-white">
                Structured around high-value contractor services
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {specialties.map((specialty) => {
                  const Icon = specialty.icon;

                  return (
                    <div
                      key={specialty.title}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                        <Icon className="h-5 w-5 text-amber-400" />
                      </div>

                      <p className="font-semibold text-white">
                        {specialty.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div>
              <Badge variant="outline" className="mb-5">
                Results
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight text-white">
                A stronger platform for contractor lead generation
              </h2>

              <div className="mt-8 space-y-5">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="flex gap-4">
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </span>

                    <p className="text-lg leading-7 text-zinc-300">
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section spacing="xl" background="muted">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                value: "6+",
                label: "Core service categories",
              },
              {
                value: "8",
                label: "Priority service areas",
              },
              {
                value: "24/7",
                label: "Online estimate availability",
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                variant="feature"
                className="rounded-3xl p-8 text-center"
              >
                <p className="text-5xl font-black text-white">{stat.value}</p>
                <p className="mt-3 text-zinc-400">{stat.label}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section spacing="xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge variant="outline" className="mb-5">
                Local Market Strategy
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight text-white">
                Built to support local search visibility
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                The site structure can expand into location-specific and
                service-specific landing pages, helping BeWise Contractors
                target homeowners throughout Long Island.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <Card variant="feature" className="rounded-3xl p-8">
              <MapPin className="h-10 w-10 text-amber-400" />

              <h3 className="mt-6 text-2xl font-bold text-white">
                Search-ready architecture
              </h3>

              <p className="mt-4 leading-7 text-zinc-400">
                The platform supports future pages for masonry, patios,
                walkways, retaining walls, renovations, repairs, and individual
                service areas.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-4">
                  <Search className="mt-1 h-6 w-6 shrink-0 text-amber-400" />

                  <div>
                    <p className="font-semibold text-white">
                      Built for long-term growth
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Clear URLs, page metadata, structured content, and
                      expandable service sections create a strong foundation
                      for local SEO.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section spacing="xl" background="muted">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-5">
                Technology
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight text-white">
                Modern infrastructure for a growing contractor
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                The platform uses a current production stack while preserving a
                straightforward experience for homeowners.
              </p>
            </div>

            <Card variant="glass" className="rounded-3xl p-8">
              <div className="flex flex-wrap gap-3">
                {stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 border-t border-white/10 pt-8">
                <div className="flex items-start gap-4">
                  <Sparkles className="mt-1 h-6 w-6 shrink-0 text-amber-400" />

                  <div>
                    <p className="font-semibold text-white">
                      Ready for future expansion
                    </p>

                    <p className="mt-3 leading-7 text-zinc-400">
                      The site can grow with before-and-after galleries,
                      customer reviews, online booking, automated follow-up,
                      financing information, and project-specific landing
                      pages.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section background="gradient" spacing="xl">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              Build With AH LLC
            </Badge>

            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Need a contractor website that turns craftsmanship into
              qualified leads?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              AH LLC builds professional websites, local SEO systems, and lead
              generation tools for contractors, home improvement companies,
              and local service businesses.
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
