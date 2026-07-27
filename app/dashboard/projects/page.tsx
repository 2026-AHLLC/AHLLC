import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FolderKanban,
  PauseCircle,
  Plus,
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
  title: "Projects | AH LLC Client Portal",
  description: "View and track your active AH LLC projects.",
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

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <ProjectErrorState message="We could not verify your client account." />
    );
  }

  const {
    data,
    error: projectsError,
  } = await supabase
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
    .order("created_at", { ascending: false });

  if (projectsError) {
    console.error("Unable to load client projects:", projectsError);

    return (
      <ProjectErrorState message="We could not load your projects. Please try again later." />
    );
  }

  const projects = (data ?? []) as Project[];

  const activeProjects = projects.filter((project) =>
    ["planned", "in_progress", "review"].includes(project.status),
  ).length;

  const waitingOnClient = projects.filter(
    (project) => project.status === "waiting_on_client",
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  ).length;

  const projectSummary = [
    {
      title: "Active",
      value: activeProjects,
      description: "Projects currently underway",
      icon: CircleDashed,
    },
    {
      title: "Waiting on you",
      value: waitingOnClient,
      description: "Items requiring your input",
      icon: Clock3,
    },
    {
      title: "Completed",
      value: completedProjects,
      description: "Finished AH LLC projects",
      icon: CheckCircle2,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <FolderKanban aria-hidden="true" className="size-3.5" />
            Client projects
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Review project progress, upcoming milestones, requested materials,
            and recent updates from AH LLC.
          </p>
        </div>

        <Button asChild>
          <Link href={"/contact" as Route}>
            <Plus aria-hidden="true" className="mr-2 size-4" />
            Start a project
          </Link>
        </Button>
      </section>

      <section
        aria-label="Project summary"
        className="grid gap-4 md:grid-cols-3"
      >
        {projectSummary.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="border-border/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>

                <Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold tracking-tight">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section aria-labelledby="active-projects-heading">
        <div className="mb-4">
          <h2
            id="active-projects-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Your projects
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Projects assigned to your AH LLC account.
          </p>
        </div>

        {projects.length === 0 ? (
          <EmptyProjectsState />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status] ?? statusConfig.planned;
  const StatusIcon = status.icon;
  const progress = Math.min(Math.max(project.progress ?? 0, 0), 100);

  return (
    <Card className="overflow-hidden border-border/70">
      <CardHeader className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <CardTitle className="text-lg leading-tight">
              {project.title}
            </CardTitle>

            {project.description ? (
              <CardDescription className="mt-2 line-clamp-3 leading-relaxed">
                {project.description}
              </CardDescription>
            ) : (
              <CardDescription className="mt-2">
                No project description has been added.
              </CardDescription>
            )}
          </div>

          <div
            className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            <StatusIcon aria-hidden="true" className="size-3.5" />
            {status.label}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-semibold">{progress}%</span>
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
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <ProjectDate
            label="Start date"
            value={project.start_date}
          />

          <ProjectDate
            label="Due date"
            value={project.due_date}
          />
        </div>

        {project.status === "waiting_on_client" ? (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            AH LLC is waiting for information, approval, or materials from you.
          </div>
        ) : null}
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

function EmptyProjectsState() {
  return (
    <Card className="border-border/70">
      <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-14 text-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted/50">
          <FolderKanban
            aria-hidden="true"
            className="size-7 text-muted-foreground"
          />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          No projects have been added
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          When AH LLC assigns a project to your account, its progress,
          timeline, deliverables, and updates will appear here.
        </p>

        <Button asChild variant="outline" className="mt-6">
          <Link href={"/contact" as Route}>
            Discuss a new project
            <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ProjectErrorState({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <FolderKanban aria-hidden="true" className="size-3.5" />
          Client projects
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      </section>

      <Card className="border-destructive/30">
        <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
            <AlertCircle
              aria-hidden="true"
              className="size-6 text-destructive"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Projects unavailable
          </h2>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>

          <Button asChild variant="outline" className="mt-6">
            <Link href={"/dashboard" as Route}>
              Return to dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
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