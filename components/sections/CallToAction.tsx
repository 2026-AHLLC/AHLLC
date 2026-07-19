"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CallToAction() {
  return (
    <Section
      id="cta"
      spacing="xl"
      background="gradient"
      className="relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[160px]" />

        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-zinc-900/60 p-10 shadow-2xl backdrop-blur-xl md:p-16"
      >
        <div className="text-center">
          <Badge
            variant="gradient"
            className="mb-6"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Let's Build Something Amazing
          </Badge>

          <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Ready to Grow
            <br />
            Your Business?
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
            Whether you're launching a new company, modernizing an
            existing website, implementing AI, or automating your
            business, AH LLC delivers practical technology solutions
            that help businesses operate more efficiently and grow
            with confidence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <Clock3 className="mx-auto h-10 w-10 text-blue-400" />

            <h3 className="mt-4 font-semibold text-white">
              Free Consultation
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Discuss your goals and receive practical recommendations
              tailored to your business.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />

            <h3 className="mt-4 font-semibold text-white">
              Custom Strategy
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Every solution is designed around your objectives,
              workflow, and long-term growth.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-cyan-400" />

            <h3 className="mt-4 font-semibold text-white">
              Long-Term Partnership
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Ongoing support, optimization, and continuous
              improvements as your business evolves.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Button
            asChild
            size="lg"
          >
            <Link href="/contact">
              Schedule a Free Consultation

              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
          >
            <Link href="/free-audit">
              Request a Free AI Audit
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
          <span>✓ No obligation consultation</span>
          <span>✓ Tailored recommendations</span>
          <span>✓ Transparent pricing</span>
          <span>✓ Modern AI solutions</span>
        </div>
      </motion.div>
    </Section>
  );
}