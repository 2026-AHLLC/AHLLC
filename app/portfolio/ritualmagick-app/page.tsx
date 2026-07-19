import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  Globe2,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "RitualMagick.app Portfolio Project | AH LLC",
  description:
    "See how AH LLC designed and developed RitualMagick.app, an AI-assisted ritual and spiritual guidance platform built for a modern, accessible user experience.",
  alternates: {
    canonical: "/portfolio/ritualmagick-app",
  },
  openGraph: {
    title: "RitualMagick.app | AH LLC Portfolio",
    description:
      "An AI-assisted ritual and spiritual guidance platform designed and developed by AH LLC.",
    type: "website",
    url: "/portfolio/ritualmagick-app",
    images: [
      {
        url: "/images/portfolio/ritualmagick-app-og.png",
        width: 1200,
        height: 630,
        alt: "RitualMagick.app portfolio project by AH LLC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RitualMagick.app | AH LLC Portfolio",
    description:
      "An AI-assisted ritual and spiritual guidance platform designed and developed by AH LLC.",
    images: ["/images/portfolio/ritualmagick-app-og.png"],
  },
};

const projectHighlights = [
  "Responsive, mobile-first interface",
  "AI-powered spiritual guidance experience",
  "Clear ritual content architecture",
  "Search-friendly page structure and metadata",
  "Conversion-focused calls to action",
  "Scalable foundation for future tools and content",
];

const services = [
  {
    icon: Globe2,
    title: "Website Development",
    description:
      "A fast, responsive interface designed to present ritual content clearly across desktop, tablet, and mobile devices.",
  },
  {
    icon: Bot,
    title: "AI Integration",
    description:
      "An AI-assisted experience that helps users explore rituals, intentions, symbolism, and spiritual practices conversationally.",
  },
  {
    icon: Sparkles,
    title: "Brand Experience",
    description:
      "A dark, atmospheric visual system that feels mystical while remaining polished, readable, and accessible.",
  },
  {
    icon: ShieldCheck,
    title: "Technical Foundation",
    description:
      "A scalable application structure with optimized metadata, reusable sections, and room for future product expansion.",
  },
];

const stats = [
  { value: "100%", label: "Responsive design" },
  { value: "AI", label: "Guided experience" },
  { value: "SEO", label: "Optimized structure" },
  { value: "24/7", label: "Digital availability" },
];

export default function RitualMagickAppPortfolioPage() {
  const backToPortfolio = "/portfolio" as Route;
  const contactHref = "/contact" as Route;
  const auditHref = "/free-audit" as Route;

  return (
    <main className="min-h-screen bg-[#070608] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(126,34,206,0.28),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.14),transparent_30%),linear-gradient(to_bottom,#0d0911,#070608)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-14">
          <Link
            href={backToPortfolio}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>

          <div className="mt-14 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-200">
                <WandSparkles className="h-4 w-4" />
                AI Web Application
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                RitualMagick
                <span className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
                  .app
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
                A modern spiritual platform combining guided ritual content,
                intuitive design, and AI-assisted exploration in one immersive
                digital experience.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="https://ritualmagick.app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
                >
                  Visit RitualMagick.app
                  <ExternalLink className="h-4 w-4" />
                </a>

                <Link
                  href={contactHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  Start a project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-fuchsia-500/15 blur-3xl" />
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-fuchsia-950/30">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[#151019]">
                  <Image
                    src="/images/portfolio/ritualmagick-app.png"
                    alt="RitualMagick.app website interface"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-fuchsia-300">
              Project overview
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Ancient inspiration. Modern digital execution.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-zinc-300">
            <p>
              RitualMagick.app was created to make ritual practice and spiritual
              exploration easier to navigate for a modern audience. The product
              needed to feel mysterious and immersive without sacrificing
              clarity, trust, or usability.
            </p>
            <p>
              AH LLC developed a focused digital experience that organizes
              spiritual content into approachable paths while creating a strong
              foundation for AI guidance, educational resources, and future
              subscription-based features.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-fuchsia-300">
              What we delivered
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Strategy, design, development, and AI integration
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition hover:-translate-y-1 hover:border-fuchsia-400/25 hover:bg-white/[0.055]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{service.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-fuchsia-300">
              Product goals
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Designed to educate, engage, and grow
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Every design and development decision supports a clearer user
              journey, stronger brand credibility, and a scalable path toward
              new AI-powered spiritual tools.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d0b0f] p-7 sm:p-8">
            <ul className="space-y-5">
              {projectHighlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-300" />
                  <span className="text-zinc-300">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-950/60 via-violet-950/35 to-[#0a090c] px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-fuchsia-200">
                Build your next digital product
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Have an idea that needs strategy, design, and AI?
              </h2>
              <p className="mt-6 text-lg leading-8 text-zinc-300">
                AH LLC builds polished websites, intelligent applications, and
                automation systems that turn ambitious ideas into working
                digital products.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href={auditHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
                >
                  Request a free audit
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={backToPortfolio}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  View more projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
