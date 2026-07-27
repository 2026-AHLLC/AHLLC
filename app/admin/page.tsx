import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FolderKanban,
  Plus,
  ShieldCheck,
  Users,
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
  title: "Admin Dashboard | AH LLC",
  description: "Manage AH LLC clients and projects.",
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

type RecentProject = {
  id: string;
  title: string;
  status: ProjectStatus;
  progress: number;
  updated_at: string;
  client_id: string;
};

type ClientProfile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
};

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    profilesResult,
    projectsResult,
    recentProjectsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, company_name, role")
      .eq("role", "client"),

    supabase
      .from("projects")
      .select("id, status"),

    supabase
      .from("projects")
      .select(
        `
          id,
          title,
          status,
          progress,
          updated_at,
          client_id
        `,
      )
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  if (profilesResult.error) {
    console.error("Unable to load admin client count:", profilesResult.error);
  }

  if (projectsResult.error) {
    console.error("Unable to load admin project count:", projectsResult.error);
  }

  if (recentProjectsResult.error) {
    console.error(
      "Unable to load recent admin projects:",
      recentProjectsResult.error,
    );
  }

  const clients = profilesResult.data ?? [];
  const projects = projectsResult.data ?? [];
  const recentProjects =
    (recentProjectsResult.data ?? []) as RecentProject[];

  const clientIds = Array.from(
    new Set(recentProjects.map((project) => project.client_id)),
  );

  let clientProfiles: ClientProfile[] = [];

  if (clientIds.length > 0) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, company_name")
      .in("id", clientIds);

    if (error) {
      console.error("Unable to load project client profiles:", error);
    } else {
      clientProfiles = data ?? [];
    }
  }

  const profileMap = new Map(
    clientProfiles.map((profile) => [profile.id, profile]),
  );

  const activeProjects = projects.filter((project) =>
    ["planned", "in_progress", "review"].includes(project.status),
  ).length;

  const waitingProjects = projects.filter(
    (project) => project.status === "waiting_on_client",
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  ).length;

  const hasQueryError =
    Boolean(profilesResult.error) || Boolean(projectsResult.error);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-background p-6 shadow-sm sm:p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_42%)]"
        />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              AH LLC Administration
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Admin dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Manage client accounts, monitor projects, update progress, and
              control the information shown in each client portal.
            </p>
          </div>

          <Button asChild>
            <Link href={"/admin/projects/new" as Route}>
              <Plus aria-hidden="true" className="mr-2 size-4" />
              New project
            </Link>
          </Button>
        </div>
      </section>

      {hasQueryError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <p>
            Some administrative totals could not be loaded. Verify your admin
            Row Level Security policies and refresh the page.
          </p>
        </div>
      ) : null}

      <section aria-labelledby="admin-overview">
        <div className="mb-4">
          <h2
            id="admin-overview"
            className="text-xl font-semibold tracking-tight"
          >
            Business overview
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Current client and project activity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            title="Clients"
            value={clients.length}
            description="Client profiles"
            icon={Users}
          />

          <SummaryCard
            title="Active"
            value={activeProjects}
            description="Projects underway"
            icon={FolderKanban}
          />

          <SummaryCard
            title="Waiting"
            value={waitingProjects}
            description="Waiting on clients"
            icon={Clock3}
          />

          <SummaryCard
            title="Completed"
            value={completedProjects}
            description="Finished projects"
            icon={CheckCircle2}
          />

          <SummaryCard
            title="Total"
            value={projects.length}
            description="All projects"
            icon={CircleDashed}
          />
        </div>
      </section>

      <section aria-labelledby="admin-actions">
        <div className="mb-4">
          <h2
            id="admin-actions"
            className="text-xl font-semibold tracking-tight"
          >
            Quick actions
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href={"/admin/projects" as Route}>
            <Card className="group h-full border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                  <FolderKanban aria-hidden="true" className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center justify-between gap-3 text-base">
                    Manage projects

                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </CardTitle>

                  <CardDescription className="mt-2 leading-relaxed">
                    Review every client project, progress level, status, and due
                    date.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href={"/admin/clients" as Route}>
            <Card className="group h-full border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                  <Users aria-hidden="true" className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center justify-between gap-3 text-base">
                    Manage clients

                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </CardTitle>

                  <CardDescription className="mt-2 leading-relaxed">
                    Review client profiles and the projects assigned to each
                    account.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      <section aria-labelledby="recent-admin-projects">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2
              id="recent-admin-projects"
              className="text-xl font-semibold tracking-tight"
            >
              Recently updated projects
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The latest project activity across client accounts.
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href={"/admin/projects" as Route}>
              View all projects
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {recentProjects.length === 0 ? (
          <Card className="border-border/70">
            <CardContent className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
              <FolderKanban
                aria-hidden="true"
                className="size-8 text-muted-foreground"
              />

              <h3 className="mt-4 font-semibold">No projects found</h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Create the first client project to begin tracking activity.
              </p>

              <Button asChild className="mt-6">
                <Link href={"/admin/projects/new" as Route}>
                  Create a project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
            <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.6fr] gap-4 border-b border-border/70 bg-muted/30 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
              <span>Project</span>
              <span>Client</span>
              <span>Status</span>
              <span>Progress</span>
            </div>

            <div className="divide-y divide-border/70">
              {recentProjects.map((project) => {
                const client = profileMap.get(project.client_id);

                return (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}` as Route}
                    className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted/30 md:grid-cols-[1.4fr_1fr_0.8fr_0.6fr] md:items-center md:gap-4"
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Updated {formatDateTime(project.updated_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm">
                        {client?.company_name ||
                          client?.full_name ||
                          "Unassigned client"}
                      </p>
                    </div>

                    <StatusBadge status={project.status} />

                    <div className="text-sm font-semibold">
                      {normalizeProgress(project.progress)}%
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: number;
  description: string;
  icon: typeof Users;
};

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const labels: Record<ProjectStatus, string> = {
    planned: "Planned",
    in_progress: "In progress",
    waiting_on_client: "Waiting",
    review: "Review",
    completed: "Completed",
    paused: "Paused",
  };

  return (
    <span className="inline-flex w-fit rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium">
      {labels[status] ?? "Planned"}
    </span>
  );
}

function normalizeProgress(value: number) {
  return Math.min(Math.max(value ?? 0, 0), 100);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}