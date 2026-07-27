import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CircleHelp,
  Clock3,
  Mail,
  MessageCircleMore,
  MessagesSquare,
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
  title: "Support | AH LLC Client Portal",
  description: "Get project and account support from AH LLC.",
  robots: {
    index: false,
    follow: false,
  },
};

const supportOptions = [
  {
    title: "Project question",
    description:
      "Ask about project status, revisions, materials, timelines, or deliverables.",
    icon: MessagesSquare,
  },
  {
    title: "Technical support",
    description:
      "Report a website, automation, account, or software-related issue.",
    icon: CircleHelp,
  },
  {
    title: "Account assistance",
    description:
      "Get help with portal access, documents, consultations, or account details.",
    icon: MessageCircleMore,
  },
] as const;

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <MessageCircleMore aria-hidden="true" className="size-3.5" />
          Client support
        </div>

        <h1 className="text-3xl font-bold tracking-tight">How can we help?</h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Contact AH LLC for project updates, technical assistance, account
          questions, or help accessing your client materials.
        </p>
      </section>

      <section
        aria-label="Support categories"
        className="grid gap-4 md:grid-cols-3"
      >
        {supportOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Card key={option.title} className="border-border/70">
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-muted/50">
                  <Icon aria-hidden="true" className="size-5" />
                </div>

                <CardTitle className="text-base">{option.title}</CardTitle>

                <CardDescription className="leading-relaxed">
                  {option.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Contact AH LLC</CardTitle>

            <CardDescription>
              Send a message through the main contact page and include the email
              address associated with your client account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button asChild>
              <Link href={"/contact" as Route}>
                Open contact form
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted/50">
              <Mail aria-hidden="true" className="size-5" />
            </div>

            <CardTitle className="pt-2 text-base">Email support</CardTitle>

            <CardDescription className="leading-relaxed">
              Email AH LLC directly for account or project assistance.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <a
              href="mailto:contact@ahllc.mobi"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              contact@ahllc.mobi
            </a>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="support-requests-heading">
        <div className="mb-4">
          <h2
            id="support-requests-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Your support requests
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Track messages and responses associated with your account.
          </p>
        </div>

        <Card className="border-border/70">
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted/50">
              <Clock3
                aria-hidden="true"
                className="size-7 text-muted-foreground"
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No open support requests
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Future support requests and AH LLC responses will appear here
              after the support-request database is connected.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}