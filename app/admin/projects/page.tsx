import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FolderKanban,
  PauseCircle,
  Plus,
  UserRound,
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
  title: "Manage Projects | AH LLC Admin",
  description: "Review and manage AH LLC client projects.",
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
  client_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

type ClientProfile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
};

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
    className: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  },
  in_progress: {
    label: "In progress",
    icon: Clock3,
    className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  waiting_on_client: {
    label: "Waiting on client",
    icon: AlertCircle,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  review: {
    label: "In review",
    icon: CircleDashed,
    className: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  paused: {
    label: "Paused",
    icon: PauseCircle,
    className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  },
};

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        client_id,
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
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Unable to load admin projects:", error);

    return <ProjectsErrorState />;
  }

  const projects = (data ?? []) as Project[];
  const clientIds = Array.from(
    new Set(projects.map((project) => project.client_id)),
  );

  let clients: ClientProfile[] = [];

  if (clientIds.length > 0) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, company_name")
      .in("id", clientIds);

    if (profileError) {
      console.error("Unable to load project clients:", profileError);
    } else {
      clients = profileData ?? [];
    }
  }

  const clientMap = new Map(
    clients.map((client) => [client.id, client]),
  );

  const activeCount = projects.filter((project) =>
    ["planned", "in_progress", "review"].includes(project.status),
  ).length;

  const waitingCount = projects.filter(
    (project) => project.status === "waiting_on_client",
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "completed",
  ).length;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <FolderKanban aria-hidden="true" className="size-3.5" />
            Project administration
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Manage projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Review projects across all client accounts and manage their
            progress, status, dates, and details.
          </p>
        </div>

        <Button asChild>
          <Link href={"/admin/projects/new" as Route}>
            <Plus aria-hidden="true" className="mr-2 size-4" />
            New project
          </Link>
        </Button>
      </section>

      <section
        aria-label="Project totals"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="Active"
          value={activeCount}
          description="Projects underway"
          icon={FolderKanban}
        />

        <SummaryCard
          title="Waiting"
          value={waitingCount}
          description="Waiting on clients"
          icon={Clock3}
        />

        <SummaryCard
          title="Completed"
          value={completedCount}
          description="Finished projects"
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Total"
          value={projects.length}
          description="All client projects"
          icon={CircleDashed}
        />
      </section>

      <section aria-labelledby="project-list-heading">
        <div className="mb-4">
          <h2
            id="project-list-heading"
            className="text-xl font-semibold tracking-tight"
          >
            All projects
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a project to review or update its information.
          </p>
        </div>

        {projects.length === 0 ? (
          <EmptyProjectsState />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {projects.map((project) => {
              const client = clientMap.get(project.client_id);

              return (
                <AdminProjectCard
                  key={project.id}
                  project={project}
                  client={client}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function AdminProjectCard({
  project,
  client,
}: {
  project: Project;
  client?: ClientProfile;
}) {
  const status = statusConfig[project.status] ?? statusConfig.planned;
  const StatusIcon = status.icon;
  const progress = normalizeProgress(project.progress);

  const clientName =
    client?.company_name?.trim() ||
    client?.full_name?.trim() ||
    "Unknown client";

  return (
    <Card className="overflow-hidden border-border/70">
      <CardHeader className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <CardTitle className="text-lg leading-tight">
              {project.title}
            </CardTitle>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{clientName}</span>
            </div>
          </div>

          <div
            className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            <StatusIcon aria-hidden="true" className="size-3.5" />
            {status.label}
          </div>
        </div>

        <CardDescription className="line-clamp-3 leading-relaxed">
          {project.description || "No project description has been added."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium">Progress</span>
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

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <ProjectDate label="Start date" value={project.start_date} />
          <ProjectDate label="Due date" value={project.due_date} />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-4">
          <p className="text-xs text-muted-foreground">
            Updated {formatDateTime(project.updated_at)}
          </p>

          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/projects/${project.id}` as Route}>
              Manage project
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectDate({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/20 p-3">
      <CalendarDays
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
      />

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-medium">
          {value ? formatDate(value) : "Not scheduled"}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof FolderKanban;
}) {
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

function EmptyProjectsState() {
  return (
    <Card className="border-border/70">
      <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <FolderKanban
          aria-hidden="true"
          className="size-8 text-muted-foreground"
        />

        <h3 className="mt-4 text-lg font-semibold">
          No projects have been created
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Create a project and assign it to a client profile to make it
          available in that client’s portal.
        </p>

        <Button asChild className="mt-6">
          <Link href={"/admin/projects/new" as Route}>
            <Plus aria-hidden="true" className="mr-2 size-4" />
            Create first project
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ProjectsErrorState() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">
          Manage projects
        </h1>
      </section>

      <Card className="border-destructive/30">
        <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
          <AlertCircle
            aria-hidden="true"
            className="size-8 text-destructive"
          />

          <h2 className="mt-4 text-lg font-semibold">
            Projects unavailable
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The project records could not be loaded. Verify your admin Row Level
            Security policies and try again.
          </p>

          <Button asChild variant="outline" className="mt-6">
            <Link href={"/admin" as Route}>Return to admin dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function normalizeProgress(value: number) {
  return Math.min(Math.max(value ?? 0, 0), 100);
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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