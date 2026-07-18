"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  CalendarDays,
  BrainCircuit,
} from "lucide-react";

const questions = [
  "How can AI help my business?",
  "Can AI answer my phones?",
  "How much does a new website cost?",
  "Can AI schedule appointments?",
  "How can I rank higher on Google?",
];

const capabilities = [
  "Answers customer questions instantly",
  "Books appointments automatically",
  "Qualifies new leads",
  "Collects customer information",
  "Operates 24 hours a day",
  "Connects with your CRM",
];

export default function AIConsultant() {
  return (
    <section className="relative py-32 overflow-hidden">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .55 }}
          >
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              AI Consultant
            </span>

            <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">

              Your Smartest
              <br />

              Employee Never
              <br />

              Sleeps

            </h2>

            <p className="mt-8 text-xl leading-8 text-zinc-400">

              Imagine having an AI team member that answers questions,
              qualifies prospects, schedules appointments, and helps
              customers 24 hours a day.

            </p>

            <div className="mt-10 space-y-5">

              {capabilities.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >

                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />

                  <span className="text-lg text-zinc-300">

                    {item}

                  </span>

                </div>

              ))}

            </div>

            <Link
              href="/contact"
              className="mt-12 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
            >
              Build My AI Employee

              <ArrowRight className="h-5 w-5" />
            </Link>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, scale: .95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: .6 }}
          >

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">

              {/* Header */}

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">

                  <Bot className="h-7 w-7 text-white" />

                </div>

                <div>

                  <div className="font-bold text-white">

                    AH AI Consultant

                  </div>

                  <div className="text-sm text-emerald-400">

                    ● Online Now

                  </div>

                </div>

              </div>

              {/* Intro */}

              <div className="mt-8 rounded-2xl bg-zinc-900/70 p-6">

                <div className="flex gap-4">

                  <Sparkles className="mt-1 h-5 w-5 text-blue-400" />

                  <div className="text-zinc-300 leading-7">

                    Hello! I'm the AH AI Consultant.

                    I can answer questions about websites,
                    automation, AI employees, SEO,
                    pricing, and growing your business.

                  </div>

                </div>

              </div>

              {/* Questions */}

              <div className="mt-8 space-y-4">

                {questions.map((question) => (

                  <button
                    key={question}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/60 p-5 text-left transition hover:border-blue-500/40 hover:bg-zinc-900"
                  >

                    <div className="flex items-center gap-4">

                      <MessageSquare className="h-5 w-5 text-blue-400" />

                      <span className="text-white">

                        {question}

                      </span>

                    </div>

                    <ArrowRight className="h-5 w-5 text-zinc-500" />

                  </button>

                ))}

              </div>

              {/* Bottom cards */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-gradient-to-br from-blue-600/15 to-cyan-500/10 p-6">

                  <BrainCircuit className="h-7 w-7 text-blue-400" />

                  <div className="mt-4 text-lg font-semibold text-white">

                    AI Powered

                  </div>

                  <div className="mt-2 text-sm leading-6 text-zinc-400">

                    GPT-powered responses customized
                    for your business.

                  </div>

                </div>

                <div className="rounded-2xl bg-gradient-to-br from-violet-600/15 to-fuchsia-500/10 p-6">

                  <CalendarDays className="h-7 w-7 text-violet-400" />

                  <div className="mt-4 text-lg font-semibold text-white">

                    Appointment Booking

                  </div>

                  <div className="mt-2 text-sm leading-6 text-zinc-400">

                    Instantly schedules consultations
                    without human intervention.

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}
