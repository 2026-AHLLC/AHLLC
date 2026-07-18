"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Globe,
  Search,
  Video,
  PhoneCall,
  Workflow,
  Star,
  Briefcase,
} from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "AI Employees",
    description:
      "Deploy AI assistants that answer questions, qualify leads, schedule appointments, and provide customer support 24/7.",
    href: "/services/ai-employees",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: PhoneCall,
    title: "AI Receptionist",
    description:
      "Never miss another call. Voice AI answers your phones, books appointments, and captures every opportunity.",
    href: "/services/ai-receptionist",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Globe,
    title: "Custom Websites",
    description:
      "Beautiful, lightning-fast websites designed to convert visitors into paying customers.",
    href: "/services/websites",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Search,
    title: "Local SEO",
    description:
      "Increase your visibility on Google Search and Google Maps to generate more local leads.",
    href: "/services/local-seo",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Workflow,
    title: "Business Automation",
    description:
      "Automate repetitive tasks with AI-powered workflows, integrations, and smart business systems.",
    href: "/services/automation",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Video,
    title: "Video Marketing",
    description:
      "Professional video content that builds trust, increases engagement, and drives conversions.",
    href: "/services/video-marketing",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Star,
    title: "Reputation Management",
    description:
      "Generate more five-star reviews, improve online credibility, and strengthen customer trust.",
    href: "/services/reputation",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Briefcase,
    title: "Growth Consulting",
    description:
      "Strategic consulting focused on AI adoption, scalable marketing systems, and sustainable business growth.",
    href: "/services/consulting",
    color: "from-indigo-500 to-blue-500",
  },
];

export default function Services() {
  return (
    <section className="relative py-32">

      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          className="mx-auto max-w-3xl text-center"
        >

          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Services
          </span>

          <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">

            Everything You Need
            <br />

            To Grow Your Business

          </h2>

          <p className="mt-8 text-xl leading-8 text-zinc-400">

            We combine AI, automation, web development,
            marketing, and consulting into one complete
            business growth platform.

          </p>

        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {services.map((service, index) => {

            const Icon = service.icon;

            return (

              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * .08,
                  duration: .45,
                }}
              >

                <Link
                  href={service.href}
                  className="group block h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-white/[0.06] hover:shadow-[0_0_50px_rgba(59,130,246,.15)]"
                >

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color}`}
                  >

                    <Icon className="h-8 w-8 text-white" />

                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-white">

                    {service.title}

                  </h3>

                  <p className="mt-5 leading-7 text-zinc-400">

                    {service.description}

                  </p>

                  <div className="mt-8 flex items-center gap-2 font-semibold text-blue-400 transition group-hover:gap-4">

                    Learn More

                    <ArrowRight className="h-5 w-5" />

                  </div>

                </Link>

              </motion.div>

            );

          })}

        </div>

        {/* Bottom CTA */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[32px] border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-cyan-500/10 p-12 text-center"
        >

          <h3 className="text-3xl font-bold text-white">

            Not Sure Where To Start?

          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">

            Schedule a free strategy session and we'll identify the
            highest-impact opportunities to automate your business,
            generate more leads, and increase revenue.

          </p>

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >

            Get My Free Growth Plan

            <ArrowRight className="h-5 w-5" />

          </Link>

        </motion.div>

      </div>

    </section>
  );
}
