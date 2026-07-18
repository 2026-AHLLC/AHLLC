"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Bot,
  Globe,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const features = [
  "AI Receptionists",
  "Custom Websites",
  "Local SEO",
  "Business Automation",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-28">

      <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-2 lg:items-center">

        {/* Left Side */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">

            <Sparkles className="h-4 w-4" />

            AI Powered Growth Platform

          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">

            Grow Your
            <br />

            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Business
            </span>

            <br />

            With AI

          </h1>

          <p className="mt-8 max-w-xl text-xl leading-8 text-zinc-300">

            AH LLC helps ambitious businesses generate more leads,
            automate repetitive work, rank higher on Google, and
            convert more visitors into customers.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Get Free Growth Plan

              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/portfolio"
              className="rounded-full border border-white/15 px-8 py-4 font-semibold text-white transition hover:border-blue-500 hover:bg-white/5"
            >
              View Portfolio
            </Link>

          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">

            {features.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-zinc-300"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                {item}

              </div>
            ))}

          </div>

        </motion.div>

        {/* Right Side */}

        <motion.div
          initial={{ opacity: 0, scale: .95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: .2, duration: .7 }}
          className="relative"
        >

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_80px_rgba(59,130,246,.20)] backdrop-blur-xl">

            <div className="mb-8 flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold text-white">

                  AH AI Dashboard

                </h3>

                <p className="text-sm text-zinc-400">

                  Real-time business insights

                </p>

              </div>

              <div className="rounded-xl bg-blue-500/20 p-3">

                <Bot className="h-6 w-6 text-blue-400" />

              </div>

            </div>

            <div className="space-y-5">

              {/* Metric */}

              <Metric
                icon={<Globe className="h-5 w-5" />}
                title="Website Visitors"
                value="+186%"
                color="bg-blue-500"
              />

              <Metric
                icon={<BarChart3 className="h-5 w-5" />}
                title="Qualified Leads"
                value="+312%"
                color="bg-emerald-500"
              />

              <Metric
                icon={<Bot className="h-5 w-5" />}
                title="AI Conversations"
                value="24 / 7"
                color="bg-violet-500"
              />

            </div>

            <div className="mt-10 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-violet-600/10 p-6">

              <div className="text-sm uppercase tracking-widest text-blue-300">

                AI Recommendation

              </div>

              <div className="mt-2 text-lg font-semibold text-white">

                Enable an AI Receptionist to capture every missed phone call
                and automatically schedule appointments.

              </div>

            </div>

          </div>

          {/* Floating Cards */}

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
            className="absolute -left-8 top-20 rounded-2xl border border-white/10 bg-zinc-900/90 p-5 shadow-xl backdrop-blur-xl"
          >

            <div className="text-sm text-zinc-400">

              Monthly Leads

            </div>

            <div className="mt-1 text-3xl font-bold text-emerald-400">

              +148%

            </div>

          </motion.div>

          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
            }}
            className="absolute -right-8 bottom-16 rounded-2xl border border-white/10 bg-zinc-900/90 p-5 shadow-xl backdrop-blur-xl"
          >

            <div className="text-sm text-zinc-400">

              AI Active

            </div>

            <div className="mt-1 font-bold text-blue-300">

              Online 24/7

            </div>

          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}

type MetricProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
};

function Metric({
  icon,
  title,
  value,
  color,
}: MetricProps) {
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-zinc-900/60 p-5">

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>

      <div className="flex-1">

        <div className="text-sm text-zinc-400">

          {title}

        </div>

        <div className="text-2xl font-bold text-white">

          {value}

        </div>

      </div>

    </div>
  );
}
