import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  Clock3,
  MessageSquareText,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Consultations | AH LLC Client Portal",
  description: "Schedule and manage AH LLC strategy consultations.",
  robots: {
    index: false,
    follow: false,
  },
};

const bookingUrl = "https://cal.com/john-egan-2025/30min";

const consultationDetails = [
  {
    title: "30-minute session",
    description:
      "Focused time to review your project, business goals, or technical needs.",
    icon: Clock3,
  },
  {
    title: "Video consultation",
    description:
      "Meet remotely from your computer, tablet, or mobile device.",
    icon: Video,
  },
  {
    title: "Action-oriented",
    description:
      "Leave the meeting with clear recommendations and defined next steps.",
    icon: MessageSquareText,
  },
] as const;

export default function ConsultationsPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-background p-6 shadow-sm sm:p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_42%)]"
        />

        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            Strategy sessions
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Book a consultation
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Schedule dedicated time with AH LLC to discuss your project,
            website, automation systems, SEO, marketing, or business growth
            strategy.
          </p>

          <Button asChild size="lg" className="mt-6">
            <a href={bookingUrl} target="_blank" rel="noreferrer">
              View available times
              <ArrowUpRight aria-hidden="true" className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </section>

      <section
        aria-label="Consultation details"
        className="grid gap-4 md:grid-cols-3"
      >
        {consultationDetails.map((detail) => {
          const Icon = detail.icon;

          return (
            <Card key={detail.title} className="border-border/70">
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-muted/50">
                  <Icon aria-hidden="true" className="size-5" />
                </div>

                <CardTitle className="text-base">{detail.title}</CardTitle>

                <CardDescription className="leading-relaxed">
                  {detail.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <section aria-labelledby="upcoming-consultations-heading">
        <div className="mb-4">
          <h2
            id="upcoming-consultations-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Upcoming consultations
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Scheduled meetings associated with your account.
          </p>
        </div>

        <Card className="border-border/70">
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted/50">
              <CalendarCheck2
                aria-hidden="true"
                className="size-7 text-muted-foreground"
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No consultation is currently scheduled
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Use the booking calendar to select an available appointment that
              works for you.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={bookingUrl} target="_blank" rel="noreferrer">
                  Schedule now
                </a>
              </Button>

              <Button asChild variant="outline">
                <Link href={"/dashboard/support" as Route}>
                  Ask a scheduling question
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}