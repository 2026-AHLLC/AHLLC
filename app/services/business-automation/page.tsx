import Link from "next/link";
import {
  ArrowRight,
  Workflow,
  Bot,
  CalendarClock,
  Mail,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  Cpu,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Business Automation | AH LLC",
  description:
    "Automate repetitive business tasks with AI-powered workflows, CRM integrations, scheduling, lead management, and custom business automation solutions.",
};

const services = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Replace repetitive manual work with automated workflows that run reliably around the clock.",
  },
  {
    icon: Bot,
    title: "AI Assistants",
    description:
      "Deploy AI assistants that answer questions, qualify leads, summarize information, and support your team.",
  },
  {
    icon: CalendarClock,
    title: "Scheduling Automation",
    description:
      "Automatically schedule appointments, send reminders, and reduce no-shows.",
  },
  {
    icon: Mail,
    title: "Email & Follow-Up",
    description:
      "Automatically nurture leads, follow up with customers, and keep communication moving.",
  },
  {
    icon: Database,
    title: "CRM Integration",
    description:
      "Connect your website, CRM, email platform, and business software into one seamless system.",
  },
  {
    icon: FileSpreadsheet,
    title: "Reporting & Dashboards",
    description:
      "Automatically collect business data, generate reports, and monitor key performance metrics.",
  },
];

const benefits = [
  "Reduce repetitive manual work",
  "Respond to customers 24/7",
  "Improve operational efficiency",
  "Reduce costly human errors",
  "Increase qualified leads",
  "Scale your business without adding staff",
];

export default function BusinessAutomationPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <Section spacing="xl" background="gradient">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="gradient" className="mb-6">
              Business Automation
            </Badge>

            <h1 className="text-5xl font-black text-white md:text-6xl">
              Work Smarter.
              <br />
              Automate the Repetitive.
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-zinc-300">
              Business automation helps eliminate repetitive work,
              improve customer response times, and free your team to
              focus on higher-value tasks. We build automation systems
              tailored to the way your business operates.
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
                  Request an Automation Audit
                </Link>
              </Button>
            </div>
          </div>
        </Section>

        <Section spacing="xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white">
              Automation Solutions
            </h2>

            <p className="mt-5 text-lg text-zinc-400">
              We identify repetitive processes and replace them with
              efficient, scalable automation that saves time and
              improves consistency.
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
                Automation That Pays for Itself
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Every hour spent on repetitive work is time that could be
                invested in serving customers, closing sales, or growing
                your business. Automation reduces manual effort while
                improving consistency and responsiveness.
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
              <Cpu className="mb-6 h-12 w-12 text-blue-400" />

              <h3 className="text-3xl font-bold text-white">
                Free Automation Assessment
              </h3>

              <p className="mt-6 leading-8 text-zinc-400">
                We'll review your current workflows, identify bottlenecks,
                estimate time savings, and recommend practical automation
                opportunities tailored to your business.
              </p>

              <Button
                asChild
                size="lg"
                className="mt-10 w-full"
              >
                <Link href="/contact">
                  Schedule Your Assessment
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