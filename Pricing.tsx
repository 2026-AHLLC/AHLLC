"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    badge: "",
    price: "Starting at",
    amount: "$499",
    period: "/month",
    description:
      "Ideal for small businesses ready to establish a stronger online presence.",
    features: [
      "Professional website",
      "Website hosting",
      "SSL security",
      "Basic Local SEO",
      "Google Business Profile support",
      "Monthly updates",
      "Email support",
    ],
    button: "Get Started",
    featured: false,
  },
  {
    name: "Growth",
    badge: "Most Popular",
    price: "Starting at",
    amount: "$999",
    period: "/month",
    description:
      "Everything needed to automate lead generation and accelerate business growth.",
    features: [
      "Everything in Starter",
      "AI Receptionist",
      "AI Lead Qualification",
      "Business Automation",
      "Local SEO Campaign",
      "Monthly Analytics",
      "Priority Support",
      "Strategy Sessions",
    ],
    button: "Grow My Business",
    featured: true,
  },
  {
    name: "Enterprise",
    badge: "",
    price: "Custom",
    amount: "Let's Talk",
    period: "",
    description:
      "Tailored AI systems, custom software, automation, and enterprise consulting.",
    features: [
      "Custom AI Employees",
      "Voice AI",
      "CRM Integration",
      "Custom Dashboards",
      "Advanced Automation",
      "API Development",
      "Dedicated Consultant",
      "Ongoing Optimization",
    ],
    button: "Request Proposal",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section className="relative py-32">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Pricing
          </span>

          <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">
            Simple Plans
            <br />
            Built For Growth
          </h2>

          <p className="mt-8 text-xl leading-8 text-zinc-400">
            Choose a starting point that fits your business today.
            As your company grows, your AI systems can grow with you.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {plans.map((plan, index) => (

            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
                duration: 0.45,
              }}
              className={`relative rounded-[32px] border p-10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                plan.featured
                  ? "border-blue-500 bg-gradient-to-b from-blue-600/15 to-violet-600/10 shadow-[0_0_60px_rgba(59,130,246,.18)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >

              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center gap-3">

                <Sparkles className="h-6 w-6 text-blue-400" />

                <h3 className="text-2xl font-bold text-white">
                  {plan.name}
                </h3>

              </div>

              <div className="mt-8 text-zinc-400">
                {plan.price}
              </div>

              <div className="mt-3 flex items-end gap-2">

                <span className="text-5xl font-black text-white">
                  {plan.amount}
                </span>

                <span className="pb-2 text-zinc-500">
                  {plan.period}
                </span>

              </div>

              <p className="mt-6 leading-7 text-zinc-400">
                {plan.description}
              </p>

              <div className="mt-10 space-y-4">

                {plan.features.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >

                    <Check className="h-5 w-5 text-emerald-400" />

                    <span className="text-zinc-300">
                      {feature}
                    </span>

                  </div>

                ))}

              </div>

              <Link
                href="/contact"
                className={`mt-10 flex items-center justify-center gap-3 rounded-full px-8 py-4 font-semibold transition ${
                  plan.featured
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-105"
                    : "border border-white/15 text-white hover:border-blue-500 hover:bg-white/5"
                }`}
              >
                {plan.button}

                <ArrowRight className="h-5 w-5" />

              </Link>

            </motion.div>

          ))}

        </div>

        {/* FAQ Banner */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[36px] border border-white/10 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-cyan-500/10 p-12 text-center"
        >

          <h3 className="text-3xl font-bold text-white">
            Need Something More Custom?
          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Every business is unique. We build custom AI employees,
            websites, automation platforms, integrations, and digital
            growth systems tailored to your specific goals.
          </p>

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >
            Schedule a Strategy Call

            <ArrowRight className="h-5 w-5" />
          </Link>

        </motion.div>

      </div>

    </section>
  );
}
