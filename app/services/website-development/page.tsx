import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Smartphone,
  Gauge,
  Search,
  ShieldCheck,
  Code2,
  CheckCircle2,
  MonitorSmartphone,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Website Development | AH LLC",
  description:
    "Professional website design and development using Next.js. Fast, mobile-friendly, SEO-optimized websites built to generate leads and grow your business.",
};

const services = [
  {
    icon: Globe,
    title: "Business Websites",
    description:
      "Modern websites designed to establish credibility and convert visitors into customers.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Optimized for desktop, tablet, and mobile devices to deliver an excellent experience everywhere.",
  },
  {
    icon: Gauge,
    title: "High Performance",
    description:
      "Fast-loading websites built with Next.js for speed, reliability, and better search rankings.",
  },
  {
    icon: Search,
    title: "SEO Ready",
    description:
      "Technical SEO, metadata, structured data, and optimized content architecture from day one.",
  },
  {
    icon: Code2,
    title: "Custom Development",
    description:
      "Tailored features including booking systems, client portals, forms, dashboards, and API integrations.",
  },
  {
    icon: ShieldCheck,
    title: "Maintenance & Support",
    description:
      "Ongoing updates, security monitoring, backups, and performance improvements.",
  },
];

const benefits = [
  "Fast loading performance",
  "Mobile-first responsive design",
  "Built for Google search visibility",
  "Lead generation focused",
  "Easy to maintain and expand",
  "Secure and scalable architecture",
];

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              Website Development
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Websites That Don't Just Look Good—
              <br />
              They Grow Your Business
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              We design and build high-performance websites that are fast,
              secure, mobile-friendly, and optimized to turn visitors into
              customers. Every site is built with long-term growth in mind.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/portfolio">
                  View Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white">
              What We Build
            </h2>

            <p className="mt-5 text-lg text-zinc-400">
              Every website is custom-built around your business goals,
              target audience, and growth strategy.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Card
                  key={service.title}
                  variant="feature"
                  className="rounded-3xl p-8"
                >
                  <Icon className="mb-6 h-10 w-10 text-blue-400" />

                  <h3 className="text-2xl font-bold text-white">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-zinc-400">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section spacing="xl" background="muted">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold text-white">
                Why Modern Websites Matter
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Your website is often the first interaction a customer has
                with your business. A fast, professional, and easy-to-use
                website builds trust, improves search visibility, and
                increases conversions.
              </p>

              <div className="mt-8 grid gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-zinc-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card variant="glass" className="rounded-3xl p-10">
              <MonitorSmartphone className="mb-6 h-12 w-12 text-blue-400" />

              <h3 className="text-3xl font-bold text-white">
                Free Website Review
              </h3>

              <p className="mt-6 leading-8 text-zinc-400">
                Already have a website? We'll review its performance,
                mobile usability, SEO, speed, and conversion potential,
                then provide practical recommendations for improvement.
              </p>

              <Button asChild size="lg" className="mt-10 w-full">
                <Link href="/contact">
                  Request a Website Review
                </Link>
              </Button>
            </Card>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}