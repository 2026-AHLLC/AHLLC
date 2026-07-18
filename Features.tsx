"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  TrendingUp,
  Clock3,
  ShieldCheck,
  Cpu,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-First Strategy",
    description:
      "We don't bolt AI onto old marketing. We build intelligent systems from the ground up to increase efficiency, improve customer experience, and accelerate growth.",
  },
  {
    icon: TrendingUp,
    title: "Built for Revenue",
    description:
      "Every website, campaign, and automation is designed around one objective—helping your business generate more qualified leads and increase revenue.",
  },
  {
    icon: Clock3,
    title: "Save Hundreds of Hours",
    description:
      "Automate repetitive administrative work so your team can spend more time serving customers and closing sales.",
  },
  {
    icon: Cpu,
    title: "Intelligent Automation",
    description:
      "Connect your CRM, website, email, scheduling, and internal workflows into one streamlined business operating system.",
  },
  {
    icon: ShieldCheck,
    title: "Long-Term Partnership",
    description:
      "Technology changes quickly. We continuously optimize your marketing, SEO, AI, and automation so your business keeps improving.",
  },
  {
    icon: Rocket,
    title: "Scalable Growth",
    description:
      "Whether you're a local contractor or a growing company, our systems scale with your business without rebuilding everything from scratch.",
  },
];

export default function Features() {
  return (
    <section className="relative py-32">

      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          className="mx-auto max-w-3xl text-center"
        >

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">

            Why AH LLC

          </span>

          <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">

            We Build
            <br />

            Growth Systems

          </h2>

          <p className="mt-8 text-xl leading-8 text-zinc-400">

            Most agencies sell individual services.

            <br />

            We build complete business systems that continuously
            generate leads, automate work, and create measurable growth.

          </p>

        </motion.div>

        {/* Grid */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * .08,
                  duration: .45,
                }}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_45px_rgba(59,130,246,.15)]"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500">

                  <Icon className="h-8 w-8 text-white" />

                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">

                  {feature.title}

                </h3>

                <p className="mt-5 leading-7 text-zinc-400">

                  {feature.description}

                </p>

              </motion.div>

            );

          })}

        </div>

        {/* Process */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-28 rounded-[32px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl"
        >

          <div className="text-center">

            <h3 className="text-3xl font-bold text-white">

              Our Growth Process

            </h3>

            <p className="mt-4 text-zinc-400">

              A simple framework that turns visitors into customers.

            </p>

          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-5">

            {[
              "Discover",
              "Plan",
              "Build",
              "Launch",
              "Optimize",
            ].map((step, index) => (

              <div
                key={step}
                className="text-center"
              >

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-2xl font-bold text-white">

                  {index + 1}

                </div>

                <h4 className="mt-6 text-xl font-semibold text-white">

                  {step}

                </h4>

                <p className="mt-3 text-sm leading-6 text-zinc-500">

                  {
                    [
                      "Understand your goals and current challenges.",
                      "Develop a customized AI-powered growth strategy.",
                      "Build websites, automation, and marketing assets.",
                      "Deploy your systems and monitor performance.",
                      "Continuously improve using data and AI insights.",
                    ][index]
                  }

                </p>

              </div>

            ))}

          </div>

        </motion.div>

      </div>

    </section>
  );
}
