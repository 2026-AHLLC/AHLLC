"use client";

import {
  Bot,
  BrainCircuit,
  Database,
  Globe,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import Section from "@/components/layout/Section";

const partners = [
  {
    name: "OpenAI",
    icon: BrainCircuit,
  },
  {
    name: "Next.js",
    icon: Zap,
  },
  {
    name: "Supabase",
    icon: Database,
  },
  {
    name: "Vercel",
    icon: Globe,
  },
  {
    name: "AI Automation",
    icon: Bot,
  },
  {
    name: "Enterprise Security",
    icon: ShieldCheck,
  },
];

export default function TrustedBy() {
  return (
    <Section
      spacing="md"
      background="muted"
      className="border-y border-white/5"
    >
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-zinc-500">
          BUILT WITH MODERN TECHNOLOGY
        </p>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Trusted Technologies for Modern Businesses
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
        {partners.map((partner, index) => {
          const Icon = partner.icon;

          return (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
                duration: 0.4,
              }}
              className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-zinc-900"
            >
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-xl bg-blue-500/10 p-4 transition-colors group-hover:bg-blue-500/20">
                  <Icon className="h-8 w-8 text-blue-400" />
                </div>

                <span className="text-sm font-semibold text-zinc-200">
                  {partner.name}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="mx-auto max-w-3xl text-zinc-400">
          We build scalable websites, AI assistants, business
          automation, and custom software using modern,
          enterprise-grade technologies to help businesses grow
          faster and operate more efficiently.
        </p>
      </div>
    </Section>
  );
}