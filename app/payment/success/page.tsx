import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment to AH LLC was completed successfully.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-20 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-900 p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
          <CheckCircle2
            className="h-9 w-9 text-emerald-400"
            aria-hidden="true"
          />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Payment successful
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to AH LLC.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-zinc-300">
          Your payment has been received. Complete the next step so we
          can begin preparing your project.
        </p>

        <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
          <ClipboardList
            className="mx-auto h-7 w-7 text-cyan-400"
            aria-hidden="true"
          />

          <h2 className="mt-3 text-xl font-semibold">
            Schedule your kickoff call
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-400">
            Choose a convenient time to review your goals, requirements,
            timeline, and next steps.
          </p>

          <a
            href="https://cal.com/john-egan-2025/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300"
          >
            Schedule Your Kickoff Call
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <Link
          href="/"
          className="mt-7 inline-flex items-center justify-center text-sm font-semibold text-zinc-400 transition hover:text-white"
        >
          Return to AH LLC
        </Link>
      </section>
    </main>
  );
}