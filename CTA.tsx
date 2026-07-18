"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Phone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const benefits = [
  "Free AI Growth Assessment",
  "Personalized Action Plan",
  "No Obligation Consultation",
  "Clear Pricing & Timeline",
];

export default function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">

      {/* Background Glow */}

      <div className="absolute inset-0 -z-10">

        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[180px]" />

        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      </div>

      <div className="mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, scale: .98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          className="overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-cyan-500/10 backdrop-blur-xl"
        >

          <div className="p-12 md:p-20">

            <div className="mx-auto max-w-4xl text-center">

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-300">

                <Sparkles className="h-4 w-4" />

                Let's Build Something Amazing

              </div>

              <h2 className="mt-8 text-5xl font-black leading-tight text-white md:text-7xl">

                Ready To Grow
                <br />

                Your Business?

              </h2>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-zinc-300">

                Whether you need an AI employee, a modern website,
                automation, better Google rankings, or a complete
                digital growth strategy, AH LLC can help you build
                systems that work around the clock.

              </p>

            </div>

            {/* Benefits */}

            <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">

              {benefits.map((benefit) => (

                <div
                  key={benefit}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >

                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />

                  <span className="text-lg text-white">

                    {benefit}

                  </span>

                </div>

              ))}

            </div>

            {/* Buttons */}

            <div className="mt-14 flex flex-wrap justify-center gap-5">

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-10 py-5 text-lg font-semibold text-white transition hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,.35)]"
              >

                <CalendarDays className="h-5 w-5" />

                Schedule Free Consultation

                <ArrowRight className="h-5 w-5" />

              </Link>

              <Link
                href="tel:+16315551234"
                className="inline-flex items-center gap-3 rounded-full border border-white/15 px-10 py-5 text-lg font-semibold text-white transition hover:border-blue-500 hover:bg-white/5"
              >

                <Phone className="h-5 w-5" />

                Call Now

              </Link>

            </div>

            {/* Bottom Text */}

            <div className="mt-12 text-center">

              <p className="text-zinc-400">

                No pressure.
                No long-term commitment.
                Just practical advice on growing your business with AI.

              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
