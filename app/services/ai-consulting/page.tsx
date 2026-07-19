import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Clock3,
  MessageSquare,
  Workflow,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "AI Consulting | AH LLC",
  description:
    "AI consulting services including custom AI assistants, workflow automation, ChatGPT integration, and business process optimization.",
};

const services = [
  {
    icon: Bot,
    title: "Custom AI Assistants",
    description:
      "Deploy AI assistants trained specifically for your business, products, services, and workflows.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automate repetitive administrative tasks, lead qualification, customer follow-up, and internal operations.",
  },
  {
    icon: MessageSquare,
    title: "Customer Support AI",
    description:
      "Provide instant answers to customer questions 24/7 while reducing response times.",
  },
  {
    icon: BrainCircuit,
    title: "AI Strategy",
    description:
      "Identify where AI can create measurable improvements in productivity, customer experience, and profitability.",
  },
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description:
      "Use AI to summarize reports, analyze business data, and uncover actionable insights.",
  },
  {
    icon: ShieldCheck,
    title: "Private AI Solutions",
    description:
      "Implement AI securely with solutions tailored to your organization's requirements.",
  },
];

const benefits = [
  "Reduce repetitive work",
  "Improve customer response times",
  "Generate more qualified leads",
  "Increase employee productivity",
  "Automate business workflows",
  "Scale customer support",
];

export default function AIConsultingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              AI Consulting
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Practical Artificial Intelligence
              <br />
              for Real Businesses
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              We help businesses implement AI that solves real problems—
              automating repetitive work, improving customer service,
              increasing productivity, and creating new opportunities for
              growth.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/free-audit">
                  Request an AI Audit
                </Link>
              </Button>
            </div>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white">
              What We Help You Build
            </h2>

            <p className="mt-5 text-lg text-zinc-400">
              Every solution is designed around measurable business outcomes,
              not technology for its own sake.
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
                Why Businesses Invest in AI
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Modern AI is no longer just an experiment. Businesses are
                using it to reduce costs, improve efficiency, and provide
                better customer experiences every day.
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
              <Clock3 className="mb-6 h-12 w-12 text-blue-400" />

              <h3 className="text-3xl font-bold text-white">
                Free AI Strategy Session
              </h3>

              <p className="mt-6 leading-8 text-zinc-400">
                During a consultation we'll review your current processes,
                identify automation opportunities, and recommend practical
                AI solutions that fit your business.
              </p>

              <Button asChild size="lg" className="mt-10 w-full">
                <Link href="/contact">
                  Book Your Consultation
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