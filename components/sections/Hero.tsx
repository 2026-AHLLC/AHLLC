\
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Globe, Search, Code2 } from "lucide-react";

const cards = [
  { icon: Bot, title: "AI Automation", text: "Automate repetitive work and save hours every week." },
  { icon: Globe, title: "Modern Websites", text: "Fast, responsive websites built to convert visitors." },
  { icon: Search, title: "SEO Growth", text: "Rank higher and generate qualified leads." },
  { icon: Code2, title: "Custom Software", text: "Tailored tools that fit your business." },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb33,transparent_45%),radial-gradient(circle_at_bottom_left,#06b6d433,transparent_40%)]" />
      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-6 py-24">
        <div className="grid w-full gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
              AI • Automation • Web Development
            </span>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
              AI That <span className="text-cyan-400">Grows</span> Your Business
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              AH LLC helps businesses generate more leads, automate operations,
              improve SEO, and build modern websites that convert visitors into customers.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Get Free Growth Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/portfolio"
                className="inline-flex items-center rounded-lg border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-cyan-400"
              >
                View Portfolio
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 text-sm text-slate-400">
              <div><strong className="text-white">100%</strong> Custom Solutions</div>
              <div><strong className="text-white">AI</strong> Powered</div>
              <div><strong className="text-white">SEO</strong> Focused</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: .95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: .2, duration: .6 }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {cards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur"
              >
                <div className="mb-4 inline-flex rounded-xl bg-cyan-500/10 p-3">
                  <Icon className="h-7 w-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-slate-400">{text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
