import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  Gauge,
  Globe2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Waves,
  Wrench,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Suffolk NY Pool Services | AH LLC Portfolio",
  description:
    "See how AH LLC created a professional lead-generation website and digital presence for Suffolk NY Pool Services.",
  alternates: {
    canonical: "/portfolio/suffolk-ny-pool-services",
  },
  openGraph: {
    title: "Suffolk NY Pool Services | AH LLC Portfolio",
    description:
      "A responsive service-business website built to generate local pool maintenance and repair leads across Suffolk County, New York.",
    url: "/portfolio/suffolk-ny-pool-services",
    siteName: "AH LLC",
    type: "website",
  },
};

const services = [
  {
    icon: Globe2,
    title: "Service Website",
    description:
      "A modern, mobile-first website designed to explain pool services clearly and make it easy for local customers to request service.",
  },
  {
    icon: Search,
    title: "Local SEO",
    description:
      "Location-focused page structure, metadata, service content, and search-friendly copy targeting Suffolk County homeowners.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimization",
    description:
      "Responsive layouts, prominent contact options, and fast navigation for customers searching from their phones.",
  },
  {
    icon: Droplets,
    title: "Service Positioning",
    description:
      "Clear presentation of weekly maintenance, openings, closings, repairs, cleaning, and related pool services.",
  },
  {
    icon: MapPin,
    title: "Local Market Focus",
    description:
      "Messaging built around Suffolk County service areas, homeowner needs, and seasonal demand.",
  },
  {
    icon: Gauge,
    title: "Lead Generation",
    description:
      "Conversion-focused calls to action that direct visitors toward phone calls, estimates, and service inquiries.",
  },
];

const objectives = [
  "Create a trustworthy local service-business brand",
  "Make pool services easy to understand on desktop and mobile",
  "Improve visibility for Suffolk County pool-service searches",
  "Generate more calls, estimate requests, and recurring maintenance inquiries",
];

const outcomes = [
  "A professional digital presence aligned with the Suffolk NY Pool Services brand",
  "Clear service categories for maintenance, repair, cleaning, openings, and closings",
  "Mobile-friendly calls to action for homeowners searching on the go",
  "Search-focused content built around Suffolk County service demand",
  "A scalable foundation for future service-area and seasonal landing pages",
];

const serviceAreas = [
  "Brookhaven",
  "Smithtown",
  "Islip",
  "Huntington",
  "Babylon",
  "Riverhead",
  "Southampton",
  "East Hampton",
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

export default function SuffolkNYPoolServicesPortfolioPage() {
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
                Suffolk NY Pool Services
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
                A professional local-service website built to help Suffolk
                County homeowners find reliable pool maintenance, cleaning,
                repair, opening, and closing services.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Start a Similar Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link href="/portfolio">
                    View More Projects
                  </Link>
                </Button>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Industry", "Pool Services"],
                  ["Market", "Suffolk County"],
                  ["Platform", "Next.js"],
                  ["Primary Goal", "Local Leads"],
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
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                      Local Service Brand
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-white">
                      Clean pools. Clear service.
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
                    <Waves className="h-7 w-7 text-cyan-400" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  {[
                    {
                      icon: Droplets,
                      label: "Weekly Pool Maintenance",
                    },
                    {
                      icon: Wrench,
                      label: "Pool Equipment Repair",
                    },
                    {
                      icon: Sparkles,
                      label: "Cleaning and Vacuuming",
                    },
                    {
                      icon: ShieldCheck,
                      label: "Seasonal Openings and Closings",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05]">
                          <Icon className="h-5 w-5 text-cyan-400" />
                        </div>

                        <p className="font-semibold text-white">{item.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-cyan-400" />

                    <p className="font-semibold text-white">
                      Built for Suffolk County homeowners
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    The project combines local market positioning with
                    conversion-focused service content and mobile usability.
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
                Build trust quickly in a highly local, seasonal service market
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Pool-service customers often search during urgent or seasonal
                moments: opening the pool, fixing equipment, restoring water
                clarity, or finding dependable weekly maintenance.
              </p>

              <p className="mt-5 text-lg leading-8 text-zinc-400">
                Suffolk NY Pool Services needed a website that communicated
                reliability, service coverage, and clear next steps without
                overwhelming the visitor.
              </p>
            </div>

            <Card variant="feature" className="rounded-3xl p-8">
              <Wrench className="h-10 w-10 text-cyan-400" />

              <h3 className="mt-6 text-2xl font-bold text-white">
                Project objectives
              </h3>

              <div className="mt-6 space-y-4">
                {objectives.map((objective) => (
                  <div key={objective} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

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
              A local-service website designed around real customer behavior
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Every page element was structured to help homeowners understand
              the service, trust the business, and make contact quickly.
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
                    <Icon className="h-6 w-6 text-cyan-400" />
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Service coverage
              </p>

              <h2 className="mt-5 text-3xl font-bold text-white">
                Structured for Suffolk County search demand
              </h2>

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

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-4">
                  <Search className="mt-1 h-6 w-6 shrink-0 text-cyan-400" />

                  <div>
                    <p className="font-semibold text-white">
                      Local SEO foundation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      The site architecture supports future service-area pages,
                      seasonal campaigns, maintenance plans, and location-based
                      search content.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div>
              <Badge variant="outline" className="mb-5">
                Results
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight text-white">
                A stronger foundation for local lead generation
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
                value: "5+",
                label: "Core service categories",
              },
              {
                value: "8",
                label: "Priority Suffolk service areas",
              },
              {
                value: "24/7",
                label: "Online inquiry availability",
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
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-5">
                Technology
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight text-white">
                Modern architecture for a traditional service business
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                The website uses a current production stack while keeping the
                customer experience simple, fast, and focused on contacting the
                business.
              </p>
            </div>

            <Card variant="feature" className="rounded-3xl p-8">
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
                <p className="font-semibold text-white">
                  Built for future growth
                </p>

                <p className="mt-3 leading-7 text-zinc-400">
                  The site can expand with service-area pages, online quote
                  requests, maintenance-plan enrollment, customer reviews,
                  seasonal promotions, and integrated scheduling.
                </p>
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
              Need a local-service website that helps customers find and trust
              your business?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              AH LLC builds professional websites, local SEO systems, and lead
              generation tools for service businesses that want a stronger
              digital presence.
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
