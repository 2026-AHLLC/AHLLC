"use client";

import Link from "next/link";
import {
  Bot,
  Globe,
  Search,
  Code2,
  Workflow,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

import Section from "@/components/layout/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    icon: Bot,
    title: "AI Consulting",
    description:
      "Deploy AI assistants, chatbots, workflow automation, and intelligent business solutions that save time and increase revenue.",
  },
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Fast, responsive websites built with modern technology, optimized for conversions and long-term growth.",
  },
  {
    icon: Search,
    title: "SEO & Local Search",
    description:
      "Increase visibility on Google with technical SEO, local optimization, and content strategies that attract qualified customers.",
  },
  {
    icon: Workflow,
    title: "Business Automation",
    description:
      "Automate repetitive tasks, customer follow-up, lead qualification, scheduling, and internal operations.",
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Tailor-made web applications, dashboards, portals, and internal business tools designed around your workflow.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Marketing systems that combine AI, SEO, advertising, content, and analytics to generate measurable business growth.",
  },
];

export default function Services() {
  return (
    <Section
      id="services"
      spacing="xl"
      background="default"
    >
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <Badge
          variant="gradient"
          className="mb-5"
        >
          Our Services
        </Badge>

        <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
          Everything You Need
          <br />
          to Grow Your Business
        </h2>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          AH LLC combines artificial intelligence, software development,
          automation, and digital marketing into a single growth platform
          built for modern businesses.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
            >
              <Card
                variant="feature"
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-zinc-900/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-zinc-900"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                  <Icon className="h-8 w-8 text-blue-400" />
                </div>

                <h3 className="text-2xl font-bold text-white">
                  {service.title}
                </h3>

                <p className="mt-4 flex-grow leading-7 text-zinc-400">
                  {service.description}
                </p>

                <Link
                  href="/services"
                  className="mt-8 inline-flex items-center gap-2 font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  Learn More

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-20 text-center">
        <Button
          asChild
          size="lg"
        >
          <Link href="/services">
            View All Services

            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}