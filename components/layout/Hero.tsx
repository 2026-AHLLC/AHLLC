"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Bot, Globe } from "lucide-react";
import { motion } from "framer-motion";

import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <Section
      id="hero"
      spacing="xl"
      background="gradient"
      className="relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[140px]" />

        <div className="absolute left-10 top-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative grid items-center gap-16 lg:grid-cols-2">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="gradient"
            className="mb-6"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Powered Business Growth
          </Badge>

          <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-6xl xl:text-7xl">
            Build.
            <br />

            Automate.
            <br />

            Grow.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
            AH LLC helps businesses grow with AI-powered
            websites, intelligent automation, local SEO,
            and custom software designed to generate more
            customers and increase revenue.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
            >
              <Link href="/free-audit">
                Get Your Free AI Audit

                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <Link href="/services">
                Explore Services
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 text-sm text-zinc-400">
            <div>
              <div className="text-3xl font-black text-white">
                24/7
              </div>

              AI Automation
            </div>

            <div>
              <div className="text-3xl font-black text-white">
                SEO
              </div>

              Growth Focused
            </div>

            <div>
              <div className="text-3xl font-black text-white">
                Custom
              </div>

              Software Solutions
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-6">
              <div className="rounded-xl bg-blue-600/20 p-3">
                <Bot className="h-7 w-7 text-blue-400" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  AI Consultant
                </h3>

                <p className="text-sm text-zinc-400">
                  Online • Ready to Help
                </p>
              </div>
            </div>

            <div className="space-y-5 py-8">
              <div className="rounded-2xl bg-zinc-800/70 p-4 text-zinc-300">
                How can AI help my business?
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-white">
                AI can answer customer questions 24/7,
                automate repetitive tasks, improve your
                Google rankings, qualify leads, and help
                your business convert more visitors into
                paying customers.
              </div>
            </div>

            <Button className="w-full">
              Start AI Consultation
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-400">
              <Globe className="h-4 w-4" />

              Available 24 hours a day
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
