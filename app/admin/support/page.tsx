import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Clock3,
  LifeBuoy,
  MessageCircleMore,
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
  title: "Support Requests | AH LLC Admin",
  description: "Manage AH LLC client support requests.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type SupportStatus = "open" | "in_progress" | "resolved" | "closed";
type SupportPriority = "low" | "normal" | "high" | "urgent";

type SupportRequest = {
  id: string;
  client_id: string;
  project_id: string | null;
  subject: string;
  message: string;
  status: SupportStatus;
  priority: SupportPriority;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
};

type Project = {
  id: string;
  title: string;
};

const statusLabels: Record<SupportStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityLabels: Record<SupportPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export default async function AdminSupportPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("support_requests")
    .select(
      `
        id,
        client_id,
        project_id,
        subject,
        message,
        status,
        priority,
        admin_response,
        created_at,
        updated_at
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load admin support requests:", error);

    return <SupportErrorState />;
  }

  const requests = (data ?? []) as SupportRequest[];

  const clientIds = Array.from(
    new Set(requests.map((request) => request.client_id)),
  );

  const projectIds = Array.from(
    new Set(
      requests
        .map((request) => request.project_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const [profilesResult, projectsResult] = await Promise.all([
    clientIds.length > 0
      ? supabase
          .from("profiles")
          .select("id, full_name, company_name")
          .in("id", clientIds)
      : Promise.resolve({ data: [], error: null }),

    projectIds.length > 0
      ? supabase
          .from("projects")
          .select("id, title")
          .in("id", projectIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (profilesResult.error) {
    console.error(
      "Unable to load support request clients:",
      profilesResult.error,
    );
  }

  if (projectsResult.error) {
    console.error(
      "Unable to load support request projects:",
      projectsResult.error,
    );
  }

  const profiles = (profilesResult.data ?? []) as Profile[];
  const projects = (projectsResult.data ?? []) as Project[];

  const profileMap = new Map(
    profiles.map((profile) => [profile.id, profile]),
  );

  const projectMap = new Map(
    projects.map((project) => [project.id, project.title]),
  );

  const openCount = requests.filter(
    (request) => request.status === "open",
  ).length;

  const inProgressCount = requests.filter(
    (request) => request.status === "in_progress",
  ).length;

  const resolvedCount = requests.filter(
    (request) =>
      request.status === "resolved" || request.status === "closed",
  ).length;

  const urgentCount = requests.filter(
    (request) => request.priority === "urgent",
  ).length;

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <LifeBuoy aria-hidden="true" className="size-3.5" />
          Support administration
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Support requests
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Review client questions, update request status, and provide responses
          through the client portal.
        </p>
      </section>

      <section
        aria-label="Support totals"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        <SummaryCard
          title="All requests"
          value={requests.length}
          description="Total submissions"
          icon={MessageCircleMore}
        />

        <SummaryCard
          title="Open"
          value={openCount}
          description="Awaiting review"
          icon={CircleHelp}
        />

        <SummaryCard
          title="In progress"
          value={inProgressCount}
          description="Currently handled"
          icon={Clock3}
        />

        <SummaryCard
          title="Resolved"
          value={resolvedCount}
          description="Completed requests"
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Urgent"
          value={urgentCount}
          description="Urgent priority"
          icon={AlertCircle}
        />
      </section>

      <section aria-labelledby="support-list-heading">
        <div className="mb-4">
          <h2
            id="support-list-heading"
            className="text-xl font-semibold tracking-tight"
          >
            All requests
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a request to review and respond.
          </p>
        </div>

        {requests.length === 0 ? (
          <EmptySupportState />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const profile = profileMap.get(request.client_id);
              const projectTitle = request.project_id
                ? projectMap.get(request.project_id) ?? null
                : null;

              const clientName =
                profile?.company_name?.trim() ||
                profile?.full_name?.trim() ||
                "Unknown client";

              return (
                <Card key={request.id} className="border-border/70">
                  <CardContent className="p-5">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {request.subject}
                          </h3>

                          <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium">
                            {statusLabels[request.status]}
                          </span>

                          <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium">
                            {priorityLabels[request.priority]} priority
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <UserRound
                              aria-hidden="true"
                              className="size-3.5"
                            />
                            {clientName}
                          </span>

                          {projectTitle ? (
                            <span>{projectTitle}</span>
                          ) : null}

                          <span>
                            Submitted {formatDateTime(request.created_at)}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">
                          {request.message}
                        </p>
                      </div>

                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/admin/support/${request.id}` as Route}
                        >
                          Manage request
                          <ArrowRight
                            aria-hidden="true"
                            className="ml-2 size-4"
                          />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
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
  icon: typeof LifeBuoy;
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

function EmptySupportState() {
  return (
    <Card className="border-border/70">
      <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <LifeBuoy
          aria-hidden="true"
          className="size-9 text-muted-foreground"
        />

        <h3 className="mt-4 text-lg font-semibold">
          No support requests
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Client support requests will appear here after they are submitted.
        </p>
      </CardContent>
    </Card>
  );
}

function SupportErrorState() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Support requests
      </h1>

      <Card className="border-destructive/30">
        <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
          <AlertCircle
            aria-hidden="true"
            className="size-8 text-destructive"
          />

          <h2 className="mt-4 text-lg font-semibold">
            Support requests unavailable
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The support request records could not be loaded. Verify your admin
            Row Level Security policies.
          </p>

          <Button asChild variant="outline" className="mt-6">
            <Link href={"/admin" as Route}>
              Return to admin dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
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