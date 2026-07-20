import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Audit Request Received",
  description:
    "Your AH LLC free business audit request has been received.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FreeAuditSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-20 text-white">
      <section className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-8 text-center shadow-2xl sm:p-12">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400" />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
          <CheckCircle2
            className="h-9 w-9 text-emerald-400"
            aria-hidden="true"
          />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Request received
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Your free audit is now in the review queue.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-zinc-300">
          AH LLC will review your submission and identify the strongest
          opportunities for improving your website, marketing,
          automation, and growth systems.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <Clock3
              className="h-5 w-5 text-cyan-400"
              aria-hidden="true"
            />

            <h2 className="mt-4 font-semibold">What happens next</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              We will review your request and contact you with the
              recommended next step.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <Mail
              className="h-5 w-5 text-cyan-400"
              aria-hidden="true"
            />

            <h2 className="mt-4 font-semibold">Watch your inbox</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Most qualified audit requests receive a response within
              one business day.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
          <CalendarDays
            className="mx-auto h-7 w-7 text-cyan-400"
            aria-hidden="true"
          />

          <h2 className="mt-3 text-xl font-semibold">
            Ready to discuss your opportunities?
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-400">
            Reserve a free 30-minute strategy call to discuss your
            goals and determine the best next step for your business.
          </p>

          <a
            href="https://cal.com/john-egan-2025/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Book Your Free 30-Minute Strategy Call
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Return home
          </Link>

          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            View our work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}