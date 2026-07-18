"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

const projects = [
  {
    title: "Pool Services",
    category: "Website • SEO • AI Receptionist",
    image: "/portfolio/pools.jpg",
    results: [
      "Modern responsive website",
      "Google Business optimization",
      "AI appointment booking",
    ],
    href: "/portfolio/pool-services",
  },
  {
    title: "Masonry Contractor",
    category: "Website • Local SEO",
    image: "/portfolio/masonry.jpg",
    results: [
      "Premium contractor branding",
      "Lead generation pages",
      "Higher Google visibility",
    ],
    href: "/portfolio/masonry",
  },
  {
    title: "Law Firm",
    category: "AI Intake • Website",
    image: "/portfolio/law.jpg",
    results: [
      "24/7 AI client intake",
      "Professional redesign",
      "Automated consultation requests",
    ],
    href: "/portfolio/law",
  },
  {
    title: "Restaurant",
    category: "Marketing • Reviews",
    image: "/portfolio/restaurant.jpg",
    results: [
      "Online ordering integration",
      "Review generation",
      "Social media content",
    ],
    href: "/portfolio/restaurant",
  },
  {
    title: "Medical Practice",
    category: "Automation • SEO",
    image: "/portfolio/medical.jpg",
    results: [
      "Appointment automation",
      "Patient information portal",
      "Local search optimization",
    ],
    href: "/portfolio/medical",
  },
  {
    title: "Home Services",
    category: "Growth Platform",
    image: "/portfolio/home-services.jpg",
    results: [
      "AI receptionist",
      "CRM automation",
      "Lead nurturing",
    ],
    href: "/portfolio/home-services",
  },
];

export default function Portfolio() {
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
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            Portfolio
          </span>

          <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">
            Solutions Built
            <br />
            For Real Businesses
          </h2>

          <p className="mt-8 text-xl leading-8 text-zinc-400">
            Every business is different.
            We build custom AI, marketing,
            and web solutions that solve
            real-world problems.
          </p>
        </motion.div>

        {/* Portfolio Grid */}

        <div className="mt-20 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">

          {projects.map((project, index) => (

            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * .08,
                duration: .45,
              }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-[0_0_60px_rgba(59,130,246,.18)]"
            >

              {/* Image */}

              <div className="relative h-64 overflow-hidden">

                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                <div className="absolute left-6 bottom-6">

                  <div className="rounded-full bg-blue-600/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">

                    {project.category}

                  </div>

                </div>

              </div>

              {/* Content */}

              <div className="p-8">

                <h3 className="text-2xl font-bold text-white">
                  {project.title}
                </h3>

                <ul className="mt-6 space-y-3">

                  {project.results.map((item) => (

                    <li
                      key={item}
                      className="flex items-start gap-3 text-zinc-300"
                    >

                      <TrendingUp className="mt-1 h-4 w-4 text-emerald-400" />

                      <span>{item}</span>

                    </li>

                  ))}

                </ul>

                <Link
                  href={project.href}
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-400 transition hover:gap-4"
                >

                  View Case Study

                  <ArrowRight className="h-5 w-5" />

                </Link>

              </div>

            </motion.article>

          ))}

        </div>

        {/* Bottom CTA */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[36px] border border-white/10 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-cyan-500/10 p-12 text-center"
        >

          <ExternalLink className="mx-auto h-12 w-12 text-blue-400" />

          <h3 className="mt-6 text-3xl font-bold text-white">

            Your Business Could Be Next

          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">

            Whether you're a contractor, attorney,
            restaurant, medical practice, or growing
            local business, we can design a custom
            AI-powered growth system tailored to your goals.

          </p>

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >

            Start Your Project

            <ArrowRight className="h-5 w-5" />

          </Link>

        </motion.div>

      </div>

    </section>
  );
}
