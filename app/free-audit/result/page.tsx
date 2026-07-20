"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Target,
} from "lucide-react";

type AuditReport = {
  overallScore: number;
  summary: string;
  strengths: string[];
  opportunities: Array<{
    title: string;
    impact: "High" | "Medium" | "Low";
    finding: string;
    recommendation: string;
  }>;
  quickWins: string[];
  aiAutomationIdeas: string[];
  nextStep: string;
  disclaimer: string;
};

const STORAGE_KEY = "ahllc-instant-audit-report";
const CALENDAR_URL = "https://cal.com/john-egan-2025/30min";

export default function AuditResultPage() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);

      if (raw) {
        setReport(JSON.parse(raw) as AuditReport);
      }
    } catch {
      setReport(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading your audit…
      </main>
    );
  }

  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <section className="max-w-xl rounded-3xl border border-white/10 bg-zinc-900 p-8 text-center">
          <h1 className="text-3xl font-bold">No audit report found</h1>

          <p className="mt-4 text-zinc-400">
            Generate a new audit to continue.
          </p>

          <Link
            href="/free-audit"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Generate audit
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-zinc-900 p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
            AH LLC instant AI audit
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[180px_1fr] lg:items-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-cyan-400/20 bg-black/30">
              <div className="text-center">
                <div className="text-5xl font-bold text-cyan-400">
                  {report.overallScore}
                </div>

                <div className="text-sm text-zinc-400">out of 100</div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold sm:text-5xl">
                Your preliminary growth audit
              </h1>

              <p className="mt-5 text-lg leading-8 text-zinc-300">
                {report.summary}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <ListCard
            icon={CheckCircle2}
            title="Current strengths"
            items={report.strengths}
          />

          <ListCard
            icon={Lightbulb}
            title="Quick wins"
            items={report.quickWins}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Target
              className="h-6 w-6 text-cyan-400"
              aria-hidden="true"
            />

            <h2 className="text-2xl font-bold">
              Priority opportunities
            </h2>
          </div>

          <div className="mt-6 grid gap-5">
            {report.opportunities.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/20 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {item.impact} impact
                  </span>
                </div>

                <p className="mt-4 leading-7 text-zinc-400">
                  {item.finding}
                </p>

                <p className="mt-4 leading-7 text-zinc-200">
                  <strong>Recommendation:</strong>{" "}
                  {item.recommendation}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Bot
              className="h-6 w-6 text-cyan-400"
              aria-hidden="true"
            />

            <h2 className="text-2xl font-bold">
              AI and automation opportunities
            </h2>
          </div>

          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {report.aiAutomationIdeas.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/20 p-5 leading-7 text-zinc-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center sm:p-10">
          <CalendarDays
            className="mx-auto h-8 w-8 text-cyan-400"
            aria-hidden="true"
          />

          <h2 className="mt-4 text-2xl font-bold">
            Recommended next step
          </h2>

          <p className="mx-auto mt-4 max-w-3xl whitespace-pre-line leading-8 text-zinc-200">
            {report.nextStep}
          </p>

          <div className="mt-7">
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Book Your Free 30-Minute Strategy Call
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
            Choose a convenient time to review your audit, discuss your
            goals, and identify the highest-impact next action.
          </p>
        </section>

        <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-6 text-zinc-600">
          {report.disclaimer}
        </p>
      </div>
    </main>
  );
}

function ListCard({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof CheckCircle2;
  title: string;
  items: string[];
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <Icon
          className="h-6 w-6 text-cyan-400"
          aria-hidden="true"
        />

        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <ul className="mt-6 space-y-4">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex gap-3 text-zinc-300"
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}