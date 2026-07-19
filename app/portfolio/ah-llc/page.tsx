import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Globe2,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "AH LLC | Portfolio",
  description:
    "See how AH LLC built a modern AI, automation, SEO, website development, and digital marketing platform designed to generate qualified business leads.",
  alternates: {
    canonical: "/portfolio/ah-llc",
  },
  openGraph: {
    title: "AH LLC | Portfolio",
    description:
      "A modern digital agency platform built around AI consulting, automation, SEO, web development, and lead generation.",
    url: "/portfolio/ah-llc",
    siteName: "AH LLC",
    type: "website",
  },
};

const services = [
  {
    icon: Globe2,
    title: "Website Development",
    description:
      "A fast, responsive Next.js website designed to communicate AH LLC's services clearly and convert visitors into qualified inquiries.",
  },
  {
    icon: Search,
    title: "SEO",
    description:
      "Technical SEO, metadata, structured content, sitemap support, and search-focused service pages built for long-term visibility.",
  },
  {
    icon: BrainCircuit,
    title: "AI Consulting",
    description:
      "Practical AI implementation guidance for businesses that want to improve productivity, marketing, customer service, and operations.",
  },
  {
    icon: Workflow,
    title: "Business Automation",
    description:
      "Automated lead capture, contact routing, follow-up workflows, booking systems, and operational processes.",
  },
  {
    icon: Bot,
    title: "AI Lead Qualification",
    description:
      "A conversational AI assistant designed to understand visitor needs, collect project details, and guide qualified leads toward contact or booking.",
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Custom tools, applications, integrations, and business systems built around specific operational requirements.",
  },
];

const objectives = [
  "Present multiple technical and marketing services under one coherent brand",
  "Create a premium, credible digital presence for small-business decision makers",
  "Build clear conversion paths for contact forms and consultation booking",
  "Support future expansion into AI chat, automation, portfolio content, and custom software",
];

const results = [
  "A responsive, production-ready website built with Next.js and TypeScript",
  "Dedicated service pages for AI, automation, SEO, marketing, software, and web development",
  "A scalable portfolio structure for publishing future case studies",
  "A functioning Resend-powered contact form with verified email delivery",
  "A foundation for calendar booking and AI lead qualification",
  "Search-friendly metadata, sitemap, robots, and structured content",
];

const stack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Resend",
  "OpenAI API",
  "Vercel",
];

export default function AHLLCPortfolioPage() {
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
                AH LLC
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
                A modern AI, automation, website development, SEO, and digital
                marketing platform designed to generate qualified business
                leads.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Start a Similar Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://ahllc.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit Live Website
                    <Globe2 className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Industry", "Digital Services"],
                  ["Audience", "Small Businesses"],
                  ["Platform", "Next.js"],
                  ["Primary Goal", "Lead Generation"],
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-violet-500/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                      Digital Growth Platform
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-white">
                      AI • Automation • Growth
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                    <Sparkles className="h-7 w-7 text-blue-400" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  {[
                    {
                      icon: BrainCircuit,
                      label: "AI Consulting",
                    },
                    {
                      icon: Workflow,
                      label: "Business Automation",
                    },
                    {
                      icon: Globe2,
                      label: "Website Development",
                    },
                    {
                      icon: Search,
                      label: "SEO and Digital Marketing",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05]">
                          <Icon className="h-5 w-5 text-blue-400" />
                        </div>

                        <p className="font-semibold text-white">{item.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />

                    <p className="font-semibold text-white">
                      Production-ready infrastructure
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Secure server-side forms, Vercel deployment, verified email
                    delivery, and scalable application architecture.
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
                Turn a broad range of digital services into one clear offer
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                AH LLC needed a website that could present several related
                services without confusing visitors. The site had to explain
                AI consulting, automation, SEO, web development, marketing, and
                custom software in a way that felt unified and credible.
              </p>

              <p className="mt-5 text-lg leading-8 text-zinc-400">
                The platform also needed to support contact capture,
                consultation booking, portfolio publishing, search visibility,
                and future AI-powered lead qualification.
              </p>
            </div>

            <Card variant="feature" className="rounded-3xl p-8">
              <Layers3 className="h-10 w-10 text-blue-400" />

              <h3 className="mt-6 text-2xl font-bold text-white">
                Project objectives
              </h3>

              <div className="mt-6 space-y-4">
                {objectives.map((objective) => (
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
            <Badge variant="gradient" className="mb-5">
              What We Built
            </Badge>

            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              One integrated digital growth system
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Each section of the platform was designed to reinforce AH LLC's
              positioning and move visitors toward a clear next step.
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                    <Icon className="h-6 w-6 text-blue-400" />
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Technology stack
              </p>

              <h2 className="mt-5 text-3xl font-bold text-white">
                Built with a modern production stack
              </h2>

              <div className="mt-8 flex flex-wrap gap-3">
                {stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-4">
                  <BarChart3 className="mt-1 h-6 w-6 shrink-0 text-blue-400" />

                  <div>
                    <p className="font-semibold text-white">
                      Designed for measurable growth
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      The architecture supports analytics, conversion tracking,
                      campaign landing pages, portfolio expansion, and future
                      CRM integration.
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
                A scalable foundation for lead generation
              </h2>

              <div className="mt-8 space-y-5">
                {results.map((result) => (
                  <div key={result} className="flex gap-4">
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </span>

                    <p className="text-lg leading-7 text-zinc-300">{result}</p>
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
                value: "6",
                label: "Core service categories",
              },
              {
                value: "1",
                label: "Unified digital platform",
              },
              {
                value: "24/7",
                label: "Online lead capture",
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

        <Section background="gradient" spacing="xl">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              Build With AH LLC
            </Badge>

            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Need a website, automation system, or AI solution built around
              your business?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              AH LLC creates practical digital systems that help businesses
              communicate more clearly, operate more efficiently, and generate
              better opportunities.
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