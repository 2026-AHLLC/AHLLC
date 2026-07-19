import Link from "next/link";
import {
  ArrowRight,
  Code2,
  LayoutDashboard,
  Database,
  Cpu,
  Workflow,
  Cloud,
  CheckCircle2,
  Blocks,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Custom Software Development | AH LLC",
  description:
    "Custom software development including web applications, dashboards, client portals, CRM systems, API integrations, and AI-powered business software.",
};

const services = [
  {
    icon: LayoutDashboard,
    title: "Business Dashboards",
    description:
      "Centralize your business data with custom dashboards that provide real-time insights and reporting.",
  },
  {
    icon: Database,
    title: "CRM & Client Portals",
    description:
      "Manage customers, projects, documents, and communications through secure custom portals.",
  },
  {
    icon: Workflow,
    title: "Workflow Systems",
    description:
      "Replace spreadsheets and manual processes with software designed around your business operations.",
  },
  {
    icon: Cpu,
    title: "AI Integration",
    description:
      "Enhance your software with AI assistants, intelligent search, document analysis, and automation.",
  },
  {
    icon: Blocks,
    title: "API Integrations",
    description:
      "Connect accounting, payment processing, CRMs, email platforms, and third-party services into one system.",
  },
  {
    icon: Cloud,
    title: "Cloud Applications",
    description:
      "Secure, scalable cloud-based applications accessible from anywhere with automatic updates.",
  },
];

const benefits = [
  "Built specifically for your business",
  "Scalable as your company grows",
  "Integrates with existing systems",
  "Reduces manual work",
  "Improves team productivity",
  "Provides long-term competitive advantages",
];

export default function CustomSoftwarePage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              Custom Software Development
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Software Built Around
              <br />
              Your Business
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              Off-the-shelf software forces businesses to adapt to
              generic workflows. We build custom software that adapts
              to your business instead—improving efficiency,
              productivity, and long-term growth.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Discuss Your Project
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
              Custom Software Solutions
            </h2>

            <p className="mt-5 text-lg text-zinc-400">
              Every application is designed around your workflow,
              your team, and your business objectives.
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
                Why Choose Custom Software?
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Businesses often outgrow generic software. Custom
                applications eliminate unnecessary features, automate
                repetitive work, and provide tools specifically built
                for your organization.
              </p>

              <div className="mt-8 grid gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-400" />

                    <span className="text-zinc-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Card
              variant="glass"
              className="rounded-3xl p-10"
            >
              <Code2 className="mb-6 h-12 w-12 text-blue-400" />

              <h3 className="text-3xl font-bold text-white">
                Free Software Strategy Session
              </h3>

              <p className="mt-6 leading-8 text-zinc-400">
                We'll review your current systems, identify
                inefficiencies, and recommend a custom software
                solution tailored to your business objectives and
                budget.
              </p>

              <Button
                asChild
                size="lg"
                className="mt-10 w-full"
              >
                <Link href="/contact">
                  Schedule Your Consultation
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