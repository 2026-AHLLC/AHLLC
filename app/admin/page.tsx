import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FileText,
  FolderKanban,
  LifeBuoy,
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
  description:
    "Manage AH LLC clients, projects, documents, and support requests.",
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

type SupportStatus = "open" | "in_progress" | "resolved" | "closed";

type SupportPriority = "low" | "normal" | "high" | "urgent";

type Project = {
  id: string;
  client_id: string;
  title: string;
  status: ProjectStatus;
  progress: number;
  updated_at: string;
};

type ClientDocument = {
  id: string;
  client_id: string;
  title: string;
  category: string;
  created_at: string;
};

type SupportRequest = {
  id: string;
  client_id: string;
  subject: string;
  status: SupportStatus;
  priority: SupportPriority;
  updated_at: string;
};

type ClientProfile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
};

type RecentActivity =
  | {
      id: string;
      type: "project";
      title: string;
      description: string;
      timestamp: string;
      href: Route;
    }
  | {
      id: string;
      type: "document";
      title: string;
      description: string;
      timestamp: string;
      href: Route;
    }
  | {
      id: string;
      type: "support";
      title: string;
      description: string;
      timestamp: string;
      href: Route;
    };

const quickActions = [
  {
    title: "Create project",
    description:
      "Assign a new project to a client account and configure its status.",
    href: "/admin/projects/new",
    icon: FolderKanban,
  },
  {
    title: "Upload document",
    description:
      "Share a secure report, proposal, invoice, or deliverable.",
    href: "/admin/documents/new",
    icon: FileText,
  },
  {
    title: "Manage clients",
    description:
      "Review client profiles and the work assigned to each account.",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Review support",
    description:
      "Respond to client questions and manage open support requests.",
    href: "/admin/support",
    icon: LifeBuoy,
  },
] as const;

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    profilesResult,
    projectsResult,
    documentsResult,
    supportResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, company_name, role")
      .order("created_at", { ascending: false }),

    supabase
      .from("projects")
      .select(
        `
          id,
          client_id,
          title,
          status,
          progress,
          updated_at
        `,
      )
      .order("updated_at", { ascending: false }),

    supabase
      .from("client_documents")
      .select(
        `
          id,
          client_id,
          title,
          category,
          created_at
        `,
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("support_requests")
      .select(
        `
          id,
          client_id,
          subject,
          status,
          priority,
          updated_at
        `,
      )
      .order("updated_at", { ascending: false }),
  ]);

  if (profilesResult.error) {
    console.error(
      "Unable to load admin profiles:",
      profilesResult.error,
    );
  }

  if (projectsResult.error) {
    console.error(
      "Unable to load admin projects:",
      projectsResult.error,
    );
  }

  if (documentsResult.error) {
    console.error(
      "Unable to load admin documents:",
      documentsResult.error,
    );
  }

  if (supportResult.error) {
    console.error(
      "Unable to load admin support requests:",
      supportResult.error,
    );
  }

  const profiles = profilesResult.error
    ? []
    : ((profilesResult.data ?? []) as ClientProfile[]);

  const projects = projectsResult.error
    ? []
    : ((projectsResult.data ?? []) as Project[]);

  const documents = documentsResult.error
    ? []
    : ((documentsResult.data ?? []) as ClientDocument[]);

  const supportRequests = supportResult.error
    ? []
    : ((supportResult.data ?? []) as SupportRequest[]);

  const profileMap = new Map(
    profiles.map((profile) => [profile.id, profile]),
  );

  const clientCount = profiles.filter(
    (profile) => profile.role === "client",
  ).length;

  const activeProjects = projects.filter((project) =>
    ["planned", "in_progress", "waiting_on_client", "review"].includes(
      project.status,
    ),
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  ).length;

  const openSupportRequests = supportRequests.filter((request) =>
    ["open", "in_progress"].includes(request.status),
  ).length;

  const urgentSupportRequests = supportRequests.filter(
    (request) =>
      request.priority === "urgent" &&
      ["open", "in_progress"].includes(request.status),
  ).length;

  const hasQueryError =
    Boolean(profilesResult.error) ||
    Boolean(projectsResult.error) ||
    Boolean(documentsResult.error) ||
    Boolean(supportResult.error);

  const recentActivity = buildRecentActivity({
    projects,
    documents,
    supportRequests,
    profileMap,
  }).slice(0, 8);

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
              Manage client accounts, projects, private documents, and support
              activity from one secure administration portal.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href={"/admin/documents/new" as Route}>
                <FileText aria-hidden="true" className="mr-2 size-4" />
                Upload document
              </Link>
            </Button>

            <Button asChild>
              <Link href={"/admin/projects/new" as Route}>
                <Plus aria-hidden="true" className="mr-2 size-4" />
                New project
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {hasQueryError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <p>
            Some administrative information could not be loaded. Verify your
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
            Live activity across AH LLC client portals.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <SummaryCard
            title="Clients"
            value={clientCount}
            description="Client accounts"
            icon={Users}
            href="/admin/clients"
          />

          <SummaryCard
            title="Active projects"
            value={activeProjects}
            description="Projects underway"
            icon={FolderKanban}
            href="/admin/projects"
          />

          <SummaryCard
            title="Completed"
            value={completedProjects}
            description="Finished projects"
            icon={CheckCircle2}
            href="/admin/projects"
          />

          <SummaryCard
            title="Documents"
            value={documents.length}
            description="Files uploaded"
            icon={FileText}
            href="/admin/documents"
          />

          <SummaryCard
            title="Open support"
            value={openSupportRequests}
            description="Requests requiring action"
            icon={LifeBuoy}
            href="/admin/support"
          />

          <SummaryCard
            title="Urgent"
            value={urgentSupportRequests}
            description="Urgent open requests"
            icon={AlertCircle}
            href="/admin/support"
            emphasize={urgentSupportRequests > 0}
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

          <p className="mt-1 text-sm text-muted-foreground">
            Common administrative workflows.
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
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                      <Icon aria-hidden="true" className="size-5" />
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

      <section aria-labelledby="recent-activity-heading">
        <div className="mb-4">
          <h2
            id="recent-activity-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Recent activity
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The latest project, document, and support activity.
          </p>
        </div>

        {recentActivity.length === 0 ? (
          <EmptyActivityState />
        ) : (
          <Card className="overflow-hidden border-border/70">
            <CardContent className="p-0">
              <div className="divide-y divide-border/70">
                {recentActivity.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <RecentProjectsPanel projects={projects.slice(0, 5)} />

        <SupportAttentionPanel
          requests={supportRequests
            .filter((request) =>
              ["open", "in_progress"].includes(request.status),
            )
            .slice(0, 5)}
          profileMap={profileMap}
        />
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  href,
  emphasize = false,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof Users;
  href: Route;
  emphasize?: boolean;
}) {
  return (
    <Link href={href} className="block">
      <Card
        className={
          emphasize
            ? "group h-full border-destructive/40 bg-destructive/5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            : "group h-full border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        }
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>

          <Icon
            aria-hidden="true"
            className={
              emphasize
                ? "size-4 text-destructive"
                : "size-4 text-muted-foreground transition-colors group-hover:text-foreground"
            }
          />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold tracking-tight">{value}</p>

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{description}</p>

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

function ActivityRow({ activity }: { activity: RecentActivity }) {
  const config = {
    project: {
      icon: FolderKanban,
      label: "Project",
    },
    document: {
      icon: FileText,
      label: "Document",
    },
    support: {
      icon: LifeBuoy,
      label: "Support",
    },
  }[activity.type];

  const Icon = config.icon;

  return (
    <Link
      href={activity.href}
      className="group flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
          <Icon aria-hidden="true" className="size-4" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{activity.title}</p>

            <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
              {config.label}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {activity.description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 pl-14 sm:pl-0">
        <span className="text-xs text-muted-foreground">
          {formatDateTime(activity.timestamp)}
        </span>

        <ArrowRight
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
        />
      </div>
    </Link>
  );
}

function RecentProjectsPanel({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">
            Recently updated projects
          </CardTitle>

          <CardDescription className="mt-2">
            The latest activity across client projects.
          </CardDescription>
        </div>

        <FolderKanban
          aria-hidden="true"
          className="size-5 text-muted-foreground"
        />
      </CardHeader>

      <CardContent>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No projects have been created.
          </p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}` as Route}
                className="group block border-b border-border/70 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {project.title}
                    </p>

                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                      {project.status.replaceAll("_", " ")}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold">
                    {normalizeProgress(project.progress)}%
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${normalizeProgress(project.progress)}%`,
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-5 w-full"
        >
          <Link href={"/admin/projects" as Route}>
            View all projects
            <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function SupportAttentionPanel({
  requests,
  profileMap,
}: {
  requests: SupportRequest[];
  profileMap: Map<string, ClientProfile>;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">
            Support requiring attention
          </CardTitle>

          <CardDescription className="mt-2">
            Open and in-progress client requests.
          </CardDescription>
        </div>

        <LifeBuoy
          aria-hidden="true"
          className="size-5 text-muted-foreground"
        />
      </CardHeader>

      <CardContent>
        {requests.length === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center text-center">
            <CheckCircle2
              aria-hidden="true"
              className="size-7 text-muted-foreground"
            />

            <p className="mt-3 text-sm font-medium">
              No support requests need attention
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              All current requests are resolved or closed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const profile = profileMap.get(request.client_id);

              const clientName =
                profile?.company_name?.trim() ||
                profile?.full_name?.trim() ||
                "Unknown client";

              return (
                <Link
                  key={request.id}
                  href={`/admin/support/${request.id}` as Route}
                  className="group flex items-start justify-between gap-4 border-b border-border/70 pb-4 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {request.subject}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {clientName}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={
                        request.priority === "urgent"
                          ? "rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                          : "rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium capitalize"
                      }
                    >
                      {request.priority}
                    </span>

                    <span className="text-xs capitalize text-muted-foreground">
                      {request.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-5 w-full"
        >
          <Link href={"/admin/support" as Route}>
            View all support requests
            <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyActivityState() {
  return (
    <Card className="border-border/70">
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
        <CircleDashed
          aria-hidden="true"
          className="size-9 text-muted-foreground"
        />

        <h3 className="mt-4 text-lg font-semibold">
          No recent activity
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          New projects, uploaded documents, and client support requests will
          appear here.
        </p>
      </CardContent>
    </Card>
  );
}

function buildRecentActivity({
  projects,
  documents,
  supportRequests,
  profileMap,
}: {
  projects: Project[];
  documents: ClientDocument[];
  supportRequests: SupportRequest[];
  profileMap: Map<string, ClientProfile>;
}): RecentActivity[] {
  const projectActivity: RecentActivity[] = projects.map((project) => {
    const profile = profileMap.get(project.client_id);
    const clientName = getClientName(profile);

    return {
      id: `project-${project.id}`,
      type: "project",
      title: project.title,
      description: `${clientName} · ${formatStatus(project.status)} · ${normalizeProgress(
        project.progress,
      )}% complete`,
      timestamp: project.updated_at,
      href: `/admin/projects/${project.id}` as Route,
    };
  });

  const documentActivity: RecentActivity[] = documents.map((document) => {
    const profile = profileMap.get(document.client_id);
    const clientName = getClientName(profile);

    return {
      id: `document-${document.id}`,
      type: "document",
      title: document.title,
      description: `${clientName} · ${document.category.replaceAll(
        "_",
        " ",
      )}`,
      timestamp: document.created_at,
      href: "/admin/documents",
    };
  });

  const supportActivity: RecentActivity[] = supportRequests.map((request) => {
    const profile = profileMap.get(request.client_id);
    const clientName = getClientName(profile);

    return {
      id: `support-${request.id}`,
      type: "support",
      title: request.subject,
      description: `${clientName} · ${request.priority} priority · ${request.status.replaceAll(
        "_",
        " ",
      )}`,
      timestamp: request.updated_at,
      href: `/admin/support/${request.id}` as Route,
    };
  });

  return [
    ...projectActivity,
    ...documentActivity,
    ...supportActivity,
  ].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime(),
  );
}

function getClientName(profile?: ClientProfile) {
  return (
    profile?.company_name?.trim() ||
    profile?.full_name?.trim() ||
    "Unknown client"
  );
}

function formatStatus(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    planned: "Planned",
    in_progress: "In progress",
    waiting_on_client: "Waiting on client",
    review: "In review",
    completed: "Completed",
    paused: "Paused",
  };

  return labels[status];
}

function normalizeProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(value), 0), 100);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}