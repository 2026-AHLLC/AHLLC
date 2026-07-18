"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Quote,
  Star,
  CheckCircle2,
} from "lucide-react";

const testimonials = [
  {
    company: "Pool Service Company",
    industry: "Home Services",
    quote:
      "Our new website and AI-powered lead capture system made it much easier for customers to request estimates online.",
    result: "Improved lead capture",
  },
  {
    company: "Local Contractor",
    industry: "Construction",
    quote:
      "The redesign gave our business a far more professional image and made it easier for customers to find our services.",
    result: "Stronger online presence",
  },
  {
    company: "Professional Services",
    industry: "Consulting",
    quote:
      "The automation recommendations helped streamline repetitive administrative work and improved our response time.",
    result: "More efficient operations",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Client Feedback
          </span>

          <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">
            Businesses Trust
            <br />
            AH LLC
          </h2>

          <p className="mt-8 text-xl leading-8 text-zinc-400">
            We focus on practical solutions that help businesses
            improve their online presence, automate work, and create
            sustainable growth.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {testimonials.map((item, index) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
                duration: 0.45,
              }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-[0_0_45px_rgba(59,130,246,.15)]"
            >
              <Quote className="h-10 w-10 text-blue-400" />

              <div className="mt-6 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="mt-6 leading-8 text-zinc-300">
                "{item.quote}"
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="font-semibold text-white">
                  {item.company}
                </div>

                <div className="text-sm text-zinc-400">
                  {item.industry}
                </div>

                <div className="mt-4 flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{item.result}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[36px] border border-white/10 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-cyan-500/10 p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-white">
            Ready to Become Our Next Success Story?
          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Whether you need a modern website, AI automation, local SEO,
            or a complete digital growth strategy, AH LLC can help you
            build systems that work around the clock.
          </p>

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >
            Schedule a Free Consultation

            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
