"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  TrendingUp,
  Users,
  Clock3,
  Star,
} from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: 300,
    suffix: "%",
    title: "Potential Lead Growth",
    description:
      "Businesses implementing our AI and marketing systems can dramatically increase qualified leads.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock3,
    value: 24,
    suffix: "/7",
    title: "AI Availability",
    description:
      "Your AI receptionist and automation systems never sleep.",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    title: "Projects Supported",
    description:
      "Experience across websites, automation, SEO, AI, and digital marketing.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    title: "Client Satisfaction",
    description:
      "Built around long-term relationships and measurable business results.",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function Stats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  return (
    <section
      ref={ref}
      className="relative py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Results That Matter
          </span>

          <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">
            Business Growth
            <br />
            You Can Measure
          </h2>

          <p className="mt-8 text-xl leading-8 text-zinc-400">
            We focus on meaningful outcomes that help businesses
            save time, generate more opportunities, and grow
            sustainably with AI.
          </p>
        </motion.div>

        {/* Stats Grid */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.45,
                }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_50px_rgba(59,130,246,.18)]"
              >
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                <div className="mt-8 text-5xl font-black tracking-tight text-white">
                  {inView && (
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                    />
                  )}
                  {stat.suffix}
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {stat.title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}

        </div>

        {/* Bottom Banner */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-24 overflow-hidden rounded-[36px] border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-cyan-500/10"
        >
          <div className="grid gap-10 p-12 lg:grid-cols-3">

            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-blue-300">
                Faster Growth
              </div>

              <div className="mt-3 text-3xl font-bold text-white">
                AI Works While You Sleep
              </div>
            </div>

            <div className="text-zinc-300 leading-8 lg:col-span-2">
              Every missed phone call, unanswered message, delayed
              quote, and forgotten follow-up costs money. Our AI
              systems help capture more opportunities, automate
              repetitive work, and keep your business running around
              the clock.
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
