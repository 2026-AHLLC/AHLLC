import type { ComponentType } from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Globe,
  Search,
  Workflow,
  Code2,
  Megaphone,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import CallToAction from "@/components/sections/CallToAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Business Services | AH LLC",
  description:
    "AI consulting, website development, automation, SEO, software development and digital marketing services.",
};

type Service = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  href: Route;
  description: string;
};

const services: Service[] = [
  {
    title: "AI Consulting",
    icon: Bot,
    href: "/services/ai-consulting",
    description:
      "AI strategy, custom assistants, ChatGPT integrations and workflow automation.",
  },
  {
    title: "Website Development",
    icon: Globe,
    href: "/services/website-development",
    description:
      "Modern, fast, responsive websites designed to convert visitors into customers.",
  },
  {
    title: "SEO & Local Search",
    icon: Search,
    href: "/services/seo",
    description:
      "Technical SEO, local optimization and content strategies that improve rankings.",
  },
  {
    title: "Business Automation",
    icon: Workflow,
    href: "/services/business-automation",
    description:
      "Automate repetitive business tasks and eliminate unnecessary manual work.",
  },
  {
    title: "Custom Software",
    icon: Code2,
    href: "/services/custom-software",
    description:
      "Dashboards, client portals, CRM systems and custom web applications.",
  },
  {
    title: "Digital Marketing",
    icon: Megaphone,
    href: "/services/digital-marketing",
    description:
      "Marketing systems that generate qualified leads and measurable business growth.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              AH LLC Services
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Technology That
              <br />
              Grows Businesses
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              We help businesses modernize with artificial intelligence,
              custom software, high-performance websites, automation,
              search engine optimization, and digital marketing.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/free-audit">
                  Free AI Audit
                </Link>
              </Button>
            </div>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Card
                  key={service.title}
                  variant="feature"
                  className="group rounded-3xl p-8 transition-all hover:-translate-y-2"
                >
                  <Icon className="mb-6 h-10 w-10 text-blue-400" />

                  <h2 className="text-2xl font-bold text-white">
                    {service.title}
                  </h2>

                  <p className="mt-4 leading-7 text-zinc-400">
                    {service.description}
                  </p>

                  <Button
                    asChild
                    variant="ghost"
                    className="mt-8 px-0 text-blue-400 hover:text-blue-300"
                  >
                    <Link href={service.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section spacing="xl" background="muted">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-4xl font-black text-white">
              Why Work With AH LLC?
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              Rather than hiring separate companies for websites, marketing,
              AI, automation, software, and SEO, AH LLC provides one integrated
              technology partner focused on helping your business grow
              efficiently.
            </p>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <Card variant="glass" className="p-8">
                <h3 className="text-xl font-bold text-white">
                  Modern Technology
                </h3>

                <p className="mt-4 text-zinc-400">
                  Built using today&apos;s leading AI and web technologies.
                </p>
              </Card>

              <Card variant="glass" className="p-8">
                <h3 className="text-xl font-bold text-white">
                  Business First
                </h3>

                <p className="mt-4 text-zinc-400">
                  Every recommendation is based on practical business value and
                  measurable results.
                </p>
              </Card>

              <Card variant="glass" className="p-8">
                <h3 className="text-xl font-bold text-white">
                  Long-Term Partnership
                </h3>

                <p className="mt-4 text-zinc-400">
                  Ongoing consulting, support, optimization, and continuous
                  improvement.
                </p>
              </Card>
            </div>
          </div>
        </Section>

        <CallToAction />
      </main>

      <Footer />
    </>
  );
}