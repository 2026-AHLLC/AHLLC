import type { Metadata, Route } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  Clock3,
  LifeBuoy,
  MessageCircleMore,
  Plus,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Support | AH LLC Client Portal",
  description: "Create and review AH LLC client support requests.",
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
  project_id: string | null;
  subject: string;
  message: string;
  status: SupportStatus;
  priority: SupportPriority;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
};

type Project = {
  id: string;
  title: string;
};

type SupportPageProps = {
  searchParams: Promise<{
    created?: string;
    error?: string;
  }>;
};

const statusConfig: Record<
  SupportStatus,
  {
    label: string;
    className: string;
  }
> = {
  open: {
    label: "Open",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  in_progress: {
    label: "In progress",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  resolved: {
    label: "Resolved",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  closed: {
    label: "Closed",
    className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  },
};

const priorityLabels: Record<SupportPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

async function createSupportRequest(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?redirectTo=/dashboard/support");
  }

  const subject = getString(formData, "subject");
  const message = getString(formData, "message");
  const projectId = getString(formData, "project_id");
  const requestedPriority = getString(formData, "priority");

  const priority: SupportPriority = [
    "low",
    "normal",
    "high",
    "urgent",
  ].includes(requestedPriority)
    ? (requestedPriority as SupportPriority)
    : "normal";

  if (!subject || !message) {
    redirect(
      `/dashboard/support?error=${encodeURIComponent(
        "Enter a subject and describe how AH LLC can help.",
      )}` as Route,
    );
  }

  if (projectId) {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("client_id", user.id)
      .maybeSingle();

    if (projectError || !project) {
      redirect(
        `/dashboard/support?error=${encodeURIComponent(
          "The selected project could not be verified.",
        )}` as Route,
      );
    }
  }

  const { error } = await supabase.from("support_requests").insert({
    client_id: user.id,
    project_id: projectId || null,
    subject,
    message,
    priority,
    status: "open",
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Unable to create support request:", error);

    redirect(
      `/dashboard/support?error=${encodeURIComponent(
        "Your support request could not be submitted. Please try again.",
      )}` as Route,
    );
  }

  revalidatePath("/dashboard/support");
  revalidatePath("/dashboard");
  revalidatePath("/admin/support");

  redirect("/dashboard/support?created=1");
}

export default async function DashboardSupportPage({
  searchParams,
}: SupportPageProps) {
  const query = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <SupportErrorState message="We could not verify your client account." />
    );
  }

  const [requestsResult, projectsResult] = await Promise.all([
    supabase
      .from("support_requests")
      .select(
        `
          id,
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
      .eq("client_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("projects")
      .select("id, title")
      .eq("client_id", user.id)
      .order("title", { ascending: true }),
  ]);

  if (requestsResult.error) {
    console.error(
      "Unable to load client support requests:",
      requestsResult.error,
    );

    return (
      <SupportErrorState message="We could not load your support requests." />
    );
  }

  if (projectsResult.error) {
    console.error(
      "Unable to load projects for support request:",
      projectsResult.error,
    );
  }

  const requests = (requestsResult.data ?? []) as SupportRequest[];
  const projects = projectsResult.error
    ? []
    : ((projectsResult.data ?? []) as Project[]);

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

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <LifeBuoy aria-hidden="true" className="size-3.5" />
          Client support
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Support</h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Submit project questions, report technical issues, and review
          responses from AH LLC.
        </p>
      </section>

      {query.created === "1" ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <span>Your support request was submitted successfully.</span>
        </div>
      ) : null}

      {query.error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <span>{query.error}</span>
        </div>
      ) : null}

      <section
        aria-label="Support summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="All requests"
          value={requests.length}
          description="Total support requests"
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
          description="Currently being handled"
          icon={Clock3}
        />

        <SummaryCard
          title="Resolved"
          value={resolvedCount}
          description="Completed requests"
          icon={CheckCircle2}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus aria-hidden="true" className="size-5" />
              New support request
            </CardTitle>

            <CardDescription>
              Provide enough detail for AH LLC to review and respond.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={createSupportRequest} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>

                <Input
                  id="subject"
                  name="subject"
                  placeholder="Example: Website form is not submitting"
                  maxLength={160}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_id">Related project</Label>

                <select
                  id="project_id"
                  name="project_id"
                  defaultValue=""
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">General support request</option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>

                <select
                  id="priority"
                  name="priority"
                  defaultValue="normal"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>

                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  placeholder="Describe the issue, question, or requested assistance."
                  className="flex min-h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send aria-hidden="true" className="mr-2 size-4" />
                Submit request
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Your requests
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review request status and responses from AH LLC.
            </p>
          </div>

          {requests.length === 0 ? (
            <EmptySupportState />
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <ClientSupportCard
                  key={request.id}
                  request={request}
                  projectTitle={
                    request.project_id
                      ? projectMap.get(request.project_id) ?? null
                      : null
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ClientSupportCard({
  request,
  projectTitle,
}: {
  request: SupportRequest;
  projectTitle: string | null;
}) {
  const status = statusConfig[request.status] ?? statusConfig.open;

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <CardTitle className="text-base">{request.subject}</CardTitle>

            <CardDescription className="mt-2">
              Submitted {formatDateTime(request.created_at)}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>

            <span className="inline-flex rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium">
              {priorityLabels[request.priority]} priority
            </span>
          </div>
        </div>

        {projectTitle ? (
          <p className="text-xs font-medium text-muted-foreground">
            Project: {projectTitle}
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your message
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {request.message}
          </p>
        </div>

        {request.admin_response ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              AH LLC response
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {request.admin_response}
            </p>

            <p className="mt-3 text-xs text-muted-foreground">
              Updated {formatDateTime(request.updated_at)}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">
              AH LLC has not added a response yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
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
          Your submitted questions and AH LLC responses will appear here.
        </p>
      </CardContent>
    </Card>
  );
}

function SupportErrorState({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Support</h1>

      <Card className="border-destructive/30">
        <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
          <AlertCircle
            aria-hidden="true"
            className="size-8 text-destructive"
          />

          <h2 className="mt-4 text-lg font-semibold">
            Support unavailable
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
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

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
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