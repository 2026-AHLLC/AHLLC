import { Badge } from "@/components/ui/badge";
import Section from "@/components/layout/Section";

export default function PortfolioHero() {
  return (
    <Section spacing="xl" background="gradient">
      <div className="mx-auto max-w-4xl text-center">
        <Badge variant="gradient" className="mb-6">
          Our Portfolio
        </Badge>

        <h1 className="text-5xl font-black text-white md:text-6xl">
          Real Websites.
          <br />
          Real Businesses.
          <br />
          Real Results.
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
          We help businesses grow through AI consulting, website
          development, SEO, automation, digital marketing, and custom
          software solutions.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-4xl font-black text-white">30+</div>
            <p className="mt-2 text-zinc-400">Projects Completed</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-4xl font-black text-white">100%</div>
            <p className="mt-2 text-zinc-400">Custom Solutions</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-4xl font-black text-white">6+</div>
            <p className="mt-2 text-zinc-400">Core Services</p>
          </div>
        </div>
      </div>
    </Section>
  );
}