import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  LifeBuoy,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const quickActions = [
  {
    title: "View projects",
    description: "Review the status and progress of your active projects.",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Access documents",
    description: "Open reports, proposals, invoices, and deliverables.",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Book consultation",
    description: "Schedule a strategy call with AH LLC.",
    href: "https://cal.com/john-egan-2025/30min",
    icon: CalendarDays,
    external: true,
  },
  {
    title: "Request support",
    description: "Send a question or request assistance with your project.",
    href: "/dashboard/support",
    icon: LifeBuoy,
  },
] as const;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user?.user_metadata?.name === "string"
        ? user.user_metadata.name
        : user?.email?.split("@")[0] || "Client";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-background p-6 shadow-sm sm:p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_40%)]"
        />

        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles aria-hidden="true" className="size-3.5" />
            AH LLC Client Portal
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {displayName}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Track your projects, access important documents, schedule
            consultations, and communicate with AH LLC from one secure
            dashboard.
          </p>
        </div>
      </section>

      <section aria-labelledby="account-overview">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2
              id="account-overview"
              className="text-xl font-semibold tracking-tight"
            >
              Account overview
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              A summary of your current AH LLC activity.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            title="Active projects"
            value="0"
            description="Projects currently in progress"
            icon={FolderKanban}
          />

          <OverviewCard
            title="Available documents"
            value="0"
            description="Reports and deliverables"
            icon={FileText}
          />

          <OverviewCard
            title="Next consultation"
            value="None"
            description="No consultation currently scheduled"
            icon={CalendarDays}
          />

          <OverviewCard
            title="Open requests"
            value="0"
            description="Support requests awaiting resolution"
            icon={Clock3}
          />
        </div>
      </section>

      <section aria-labelledby="quick-actions">
        <div className="mb-4">
          <h2
            id="quick-actions"
            className="text-xl font-semibold tracking-tight"
          >
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Access the most frequently used client services.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;

            const content = (
              <Card className="group h-full border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60">
                    <Icon
                      aria-hidden="true"
                      className="size-5 text-foreground"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <CardTitle className="flex items-center justify-between gap-3 text-base">
                      {action.title}

                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                      />
                    </CardTitle>

                    <CardDescription className="mt-2 leading-relaxed">
                      {action.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );

            if ("external" in action && action.external) {
              return (
                <a
                  key={action.title}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={action.title}
                href={action.href as Route}
                className="block"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="recent-activity">
        <div className="mb-4">
          <h2
            id="recent-activity"
            className="text-xl font-semibold tracking-tight"
          >
            Recent activity
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Updates related to your projects and account.
          </p>
        </div>

        <Card className="border-border/70">
          <CardContent className="flex min-h-60 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted/50">
              <CheckCircle2
                aria-hidden="true"
                className="size-6 text-muted-foreground"
              />
            </div>

            <h3 className="mt-5 font-semibold">Your dashboard is ready</h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Project updates, documents, consultations, and support activity
              will appear here as they are added to your account.
            </p>

            <Button asChild className="mt-6">
              <Link href={"/contact" as Route}>Start a new project</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

type OverviewCardProps = {
  title: string;
  value: string;
  description: string;
  icon: typeof FolderKanban;
};

function OverviewCard({
  title,
  value,
  description,
  icon: Icon,
}: OverviewCardProps) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}