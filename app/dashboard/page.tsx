import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FileText,
  FolderKanban,
  LifeBuoy,
  PauseCircle,
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

export const metadata: Metadata = {
  title: "Dashboard | AH LLC Client Portal",
  description:
    "Access your AH LLC projects, documents, consultations, and support.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type ProjectStatus =
  | "planned"
  | "in_progress"
  | "waiting_on_client"
  | "review"
  | "completed"
  | "paused";

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

type SupportStatus = "open" | "in_progress" | "resolved" | "closed";

type SupportRequest = {
  id: string;
  subject: string;
  status: SupportStatus;
  priority: string;
  created_at: string;
  updated_at: string;
};

type ClientDocument = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

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
    href: "/dashboard/consultations",
    icon: CalendarDays,
  },
  {
    title: "Request support",
    description: "Submit a question or request assistance with your project.",
    href: "/dashboard/support",
    icon: LifeBuoy,
  },
] as const;

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    icon: typeof CircleDashed;
    className: string;
  }
> = {
  planned: {
    label: "Planned",
    icon: CircleDashed,
    className:
      "border-slate-500/30 bg-slate-500/10 text-slate-300",
  },
  in_progress: {
    label: "In progress",
    icon: Clock3,
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  waiting_on_client: {
    label: "Waiting on you",
    icon: AlertCircle,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  review: {
    label: "In review",
    icon: CircleDashed,
    className:
      "border-violet-500/30 bg-violet-500/10 text-violet-300",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  paused: {
    label: "Paused",
    icon: PauseCircle,
    className:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return <DashboardErrorState />;
  }

  const [projectsResult, documentsResult, supportResult] =
    await Promise.all([
      supabase
        .from("projects")
        .select(
          `
            id,
            title,
            description,
            status,
            progress,
            start_date,
            due_date,
            created_at,
            updated_at
          `,
        )
        .eq("client_id", user.id)
        .order("updated_at", { ascending: false }),

      supabase
        .from("client_documents")
        .select("id, title, category, created_at")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("support_requests")
        .select(
          `
            id,
            subject,
            status,
            priority,
            created_at,
            updated_at
          `,
        )
        .eq("client_id", user.id)
        .order("updated_at", { ascending: false }),
    ]);

  if (projectsResult.error) {
    console.error(
      "Unable to load dashboard projects:",
      projectsResult.error,
    );
  }

  if (documentsResult.error) {
    console.error(
      "Unable to load dashboard documents:",
      documentsResult.error,
    );
  }

  if (supportResult.error) {
    console.error(
      "Unable to load dashboard support requests:",
      supportResult.error,
    );
  }

  const projects = projectsResult.error
    ? []
    : ((projectsResult.data ?? []) as Project[]);

  const documents = documentsResult.error
    ? []
    : ((documentsResult.data ?? []) as ClientDocument[]);

  const supportRequests = supportResult.error
    ? []
    : ((supportResult.data ?? []) as SupportRequest[]);

  const displayName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : typeof user.user_metadata?.name === "string" &&
          user.user_metadata.name.trim()
        ? user.user_metadata.name.trim()
        : user.email?.split("@")[0] || "Client";

  const activeProjects = projects.filter((project) =>
    ["planned", "in_progress", "review"].includes(project.status),
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  ).length;

  const waitingOnClient = projects.filter(
    (project) => project.status === "waiting_on_client",
  ).length;

  const openSupportRequests = supportRequests.filter((request) =>
    ["open", "in_progress"].includes(request.status),
  ).length;

  const recentProjects = projects.slice(0, 3);

  const hasDataError =
    Boolean(projectsResult.error) ||
    Boolean(documentsResult.error) ||
    Boolean(supportResult.error);

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

      {hasDataError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <p>
            Some dashboard information could not be loaded. The available
            sections are still shown below.
          </p>
        </div>
      ) : null}

      <section aria-labelledby="account-overview">
        <div className="mb-4">
          <h2
            id="account-overview"
            className="text-xl font-semibold tracking-tight"
          >
            Account overview
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            A live summary of your AH LLC portal activity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            title="Active projects"
            value={activeProjects}
            description={
              waitingOnClient > 0
                ? `${waitingOnClient} waiting on your input`
                : "Projects currently underway"
            }
            icon={FolderKanban}
            href="/dashboard/projects"
          />

          <OverviewCard
            title="Available documents"
            value={documents.length}
            description="Reports, files, and deliverables"
            icon={FileText}
            href="/dashboard/documents"
          />

          <OverviewCard
            title="Open support requests"
            value={openSupportRequests}
            description="Requests awaiting resolution"
            icon={LifeBuoy}
            href="/dashboard/support"
          />

          <OverviewCard
            title="Completed projects"
            value={completedProjects}
            description="Projects completed by AH LLC"
            icon={CheckCircle2}
            href="/dashboard/projects"
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

            return (
              <Link
                key={action.title}
                href={action.href as Route}
                className="block"
              >
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
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="recent-projects">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2
              id="recent-projects"
              className="text-xl font-semibold tracking-tight"
            >
              Recent projects
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your most recently updated AH LLC projects.
            </p>
          </div>

          {projects.length > 0 ? (
            <Button asChild variant="outline" size="sm">
              <Link href={"/dashboard/projects" as Route}>
                View all projects
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Link>
            </Button>
          ) : null}
        </div>

        {projectsResult.error ? (
          <Card className="border-destructive/30">
            <CardContent className="flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center">
              <AlertCircle
                aria-hidden="true"
                className="size-7 text-destructive"
              />

              <h3 className="mt-4 font-semibold">
                Projects unavailable
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                We could not load your projects. Please refresh the page or
                try again later.
              </p>
            </CardContent>
          </Card>
        ) : recentProjects.length === 0 ? (
          <EmptyProjectsState />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <RecentProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="portal-summary">
        <div className="mb-4">
          <h2
            id="portal-summary"
            className="text-xl font-semibold tracking-tight"
          >
            Portal summary
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Quick access to your latest documents and support activity.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">
                  Latest documents
                </CardTitle>

                <CardDescription className="mt-2">
                  Recently shared files available to your account.
                </CardDescription>
              </div>

              <FileText
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </CardHeader>

            <CardContent>
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No documents have been shared yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.slice(0, 3).map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between gap-4 border-b border-border/70 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {document.title}
                        </p>

                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          {document.category.replaceAll("_", " ")}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(document.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-5 w-full"
              >
                <Link href={"/dashboard/documents" as Route}>
                  View documents
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-2 size-4"
                  />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">
                  Support activity
                </CardTitle>

                <CardDescription className="mt-2">
                  Your latest requests and their current status.
                </CardDescription>
              </div>

              <LifeBuoy
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </CardHeader>

            <CardContent>
              {supportRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No support requests have been submitted.
                </p>
              ) : (
                <div className="space-y-3">
                  {supportRequests.slice(0, 3).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between gap-4 border-b border-border/70 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {request.subject}
                        </p>

                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          {request.status.replaceAll("_", " ")}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(request.updated_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-5 w-full"
              >
                <Link href={"/dashboard/support" as Route}>
                  View support
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-2 size-4"
                  />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

type OverviewCardProps = {
  title: string;
  value: number;
  description: string;
  icon: typeof FolderKanban;
  href: Route;
};

function OverviewCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: OverviewCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="group h-full border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>

          <Icon
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold tracking-tight">{value}</p>

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {description}
            </p>

            <ArrowRight
              aria-hidden="true"
              className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function RecentProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status] ?? statusConfig.planned;
  const StatusIcon = status.icon;
  const progress = normalizeProgress(project.progress);

  return (
    <Card className="flex h-full flex-col border-border/70">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-base leading-snug">
            {project.title}
          </CardTitle>

          <div
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            <StatusIcon aria-hidden="true" className="size-3.5" />
            {status.label}
          </div>
        </div>

        <CardDescription className="line-clamp-2 leading-relaxed">
          {project.description ||
            "No project description has been added."}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label={`${project.title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            Due{" "}
            {project.due_date
              ? formatDate(project.due_date)
              : "date not scheduled"}
          </span>

          <Link
            href={"/dashboard/projects" as Route}
            className="inline-flex items-center gap-1 font-medium text-foreground transition hover:text-primary"
          >
            Details
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyProjectsState() {
  return (
    <Card className="border-border/70">
      <CardContent className="flex min-h-60 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted/50">
          <FolderKanban
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
        </div>

        <h3 className="mt-5 font-semibold">
          No projects have been added
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Projects assigned to your account will appear here with their
          current progress, status, and due dates.
        </p>

        <Button asChild className="mt-6">
          <Link href={"/contact" as Route}>Start a new project</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function DashboardErrorState() {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
          <AlertCircle
            aria-hidden="true"
            className="size-6 text-destructive"
          />
        </div>

        <h1 className="mt-5 text-xl font-semibold">
          Dashboard unavailable
        </h1>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          We could not verify your AH LLC client account. Sign in again to
          continue.
        </p>

        <Button asChild className="mt-6">
          <Link href={"/login" as Route}>Return to login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function normalizeProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(value), 0), 100);
}

function formatDate(value: string) {
  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

  const date = dateOnlyPattern.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}