import type { Metadata, Route } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  LifeBuoy,
  MessageSquareText,
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
import { sendNewSupportRequestEmail } from "@/lib/email/support-notifications";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Support | AH LLC Client Portal",
  description:
    "Submit and review support requests through the AH LLC client portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type SupportPageProps = {
  searchParams: Promise<{
    submitted?: string;
    error?: string;
  }>;
};

type Project = {
  id: string;
  title: string;
};

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

const supportStatusLabels: Record<SupportStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

const supportStatusStyles: Record<SupportStatus, string> = {
  open: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  in_progress:
    "border-amber-500/30 bg-amber-500/10 text-amber-300",
  resolved:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  closed: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
};

const supportPriorityStyles: Record<SupportPriority, string> = {
  low: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  normal: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  urgent:
    "border-destructive/30 bg-destructive/10 text-destructive",
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
        "Enter a subject and message.",
      )}` as Route,
    );
  }

  if (subject.length > 200) {
    redirect(
      `/dashboard/support?error=${encodeURIComponent(
        "The subject must be 200 characters or fewer.",
      )}` as Route,
    );
  }

  if (message.length > 10000) {
    redirect(
      `/dashboard/support?error=${encodeURIComponent(
        "The message must be 10,000 characters or fewer.",
      )}` as Route,
    );
  }

  let validatedProjectId: string | null = null;

  if (projectId) {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("client_id", user.id)
      .maybeSingle();

    if (projectError) {
      console.error(
        "Unable to validate support request project:",
        projectError,
      );

      redirect(
        `/dashboard/support?error=${encodeURIComponent(
          "The selected project could not be verified.",
        )}` as Route,
      );
    }

    if (!project) {
      redirect(
        `/dashboard/support?error=${encodeURIComponent(
          "The selected project is not available to your account.",
        )}` as Route,
      );
    }

    validatedProjectId = project.id;
  }

  const { data: supportRequest, error: insertError } = await supabase
    .from("support_requests")
    .insert({
      client_id: user.id,
      project_id: validatedProjectId,
      subject,
      message,
      priority,
      status: "open",
    })
    .select("id")
    .single();

  if (insertError || !supportRequest) {
    console.error("Unable to create support request:", insertError);

    redirect(
      `/dashboard/support?error=${encodeURIComponent(
        "Your support request could not be submitted.",
      )}` as Route,
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, company_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Unable to load profile for support notification:",
      profileError,
    );
  }

  const clientName =
    profile?.company_name?.trim() ||
    profile?.full_name?.trim() ||
    user.email?.split("@")[0] ||
    "AH LLC Client";

  try {
    await sendNewSupportRequestEmail({
      requestId: supportRequest.id,
      clientName,
      clientEmail: user.email ?? null,
      subject,
      message,
      priority,
    });
  } } catch (emailError) {
  console.error(
    "Support request admin notification failed:",
    emailError instanceof Error
      ? {
          name: emailError.name,
          message: emailError.message,
          stack: emailError.stack,
        }
      : emailError,
  );
}

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/support");
  revalidatePath("/admin");
  revalidatePath("/admin/support");

  redirect("/dashboard/support?submitted=1");
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
    redirect("/login?redirectTo=/dashboard/support");
  }

  const [projectsResult, supportResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title")
      .eq("client_id", user.id)
      .order("updated_at", { ascending: false }),

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
      .order("updated_at", { ascending: false }),
  ]);

  if (projectsResult.error) {
    console.error(
      "Unable to load support form projects:",
      projectsResult.error,
    );
  }

  if (supportResult.error) {
    console.error(
      "Unable to load client support requests:",
      supportResult.error,
    );
  }

  const projects = projectsResult.error
    ? []
    : ((projectsResult.data ?? []) as Project[]);

  const supportRequests = supportResult.error
    ? []
    : ((supportResult.data ?? []) as SupportRequest[]);

  const projectMap = new Map(
    projects.map((project) => [project.id, project.title]),
  );

  const openRequests = supportRequests.filter((request) =>
    ["open", "in_progress"].includes(request.status),
  ).length;

  const resolvedRequests = supportRequests.filter(
    (request) => request.status === "resolved",
  ).length;

  const urgentRequests = supportRequests.filter(
    (request) =>
      request.priority === "urgent" &&
      ["open", "in_progress"].includes(request.status),
  ).length;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-background p-6 shadow-sm sm:p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_42%)]"
        />

        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <LifeBuoy aria-hidden="true" className="size-3.5" />
            AH LLC Client Support
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Support
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Submit a request, track its status, and review responses from
            AH LLC.
          </p>
        </div>
      </section>

      {query.submitted === "1" ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <span>
            Your support request was submitted successfully. AH LLC has
            been notified.
          </span>
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

      {supportResult.error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <span>
            Your existing support requests could not be loaded. You may
            still submit a new request below.
          </span>
        </div>
      ) : null}

      <section
        aria-label="Support request summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="All requests"
          value={supportRequests.length}
          description="Requests submitted"
          icon={MessageSquareText}
        />

        <SummaryCard
          title="Open requests"
          value={openRequests}
          description="Currently active"
          icon={Clock3}
        />

        <SummaryCard
          title="Resolved"
          value={resolvedRequests}
          description="Requests completed"
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Urgent"
          value={urgentRequests}
          description="Urgent active requests"
          icon={AlertCircle}
          emphasize={urgentRequests > 0}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="h-fit border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus aria-hidden="true" className="size-5" />
              New support request
            </CardTitle>

            <CardDescription>
              Describe the issue or request and AH LLC will respond
              through your client portal.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={createSupportRequest} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>

                <Input
                  id="subject"
                  name="subject"
                  placeholder="Briefly describe your request"
                  maxLength={200}
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
                  <option value="">General support</option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-muted-foreground">
                  Select a project only when the request relates to
                  specific work.
                </p>
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

                <p className="text-xs text-muted-foreground">
                  Use urgent only for time-sensitive issues that
                  materially affect active work.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>

                <textarea
                  id="message"
                  name="message"
                  rows={8}
                  maxLength={10000}
                  required
                  placeholder="Include the relevant details, expected result, and any error message you received."
                  className="flex min-h-40 w-full resize-y rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <Button type="submit" className="w-full">
                <Send aria-hidden="true" className="mr-2 size-4" />
                Submit request
              </Button>
            </form>
          </CardContent>
        </Card>

        <section aria-labelledby="support-history-heading">
          <div className="mb-4">
            <h2
              id="support-history-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Support history
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review the status and latest response for each request.
            </p>
          </div>

          {supportResult.error ? (
            <Card className="border-destructive/30">
              <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                <AlertCircle
                  aria-hidden="true"
                  className="size-8 text-destructive"
                />

                <h3 className="mt-4 text-lg font-semibold">
                  Support history unavailable
                </h3>

                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Your previous requests could not be loaded. Refresh the
                  page or try again later.
                </p>
              </CardContent>
            </Card>
          ) : supportRequests.length === 0 ? (
            <EmptySupportState />
          ) : (
            <div className="space-y-4">
              {supportRequests.map((request) => (
                <SupportRequestCard
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
        </section>
      </section>
    </div>
  );
}

function SupportRequestCard({
  request,
  projectTitle,
}: {
  request: SupportRequest;
  projectTitle: string | null;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <CardTitle className="text-base">
              {request.subject}
            </CardTitle>

            <CardDescription className="mt-2">
              Submitted {formatDateTime(request.created_at)}
              {projectTitle ? ` · ${projectTitle}` : " · General support"}
            </CardDescription>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                supportPriorityStyles[request.priority]
              }`}
            >
              {capitalize(request.priority)}
            </span>

            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                supportStatusStyles[request.status]
              }`}
            >
              {supportStatusLabels[request.status]}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your message
          </p>

          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {request.message}
          </p>
        </div>

        {request.admin_response ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <LifeBuoy
                aria-hidden="true"
                className="size-4 text-primary"
              />

              <p className="text-sm font-semibold">
                Response from AH LLC
              </p>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {request.admin_response}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Clock3
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />

              <p className="text-sm text-muted-foreground">
                AH LLC has received this request. A response will appear
                here when available.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>
            Last updated {formatDateTime(request.updated_at)}
          </span>

          {request.project_id ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={"/dashboard/projects" as Route}>
                View projects
                <ArrowRight
                  aria-hidden="true"
                  className="ml-2 size-4"
                />
              </Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  emphasize = false,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof LifeBuoy;
  emphasize?: boolean;
}) {
  return (
    <Card
      className={
        emphasize
          ? "border-destructive/40 bg-destructive/5"
          : "border-border/70"
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
              : "size-4 text-muted-foreground"
          }
        />
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{value}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptySupportState() {
  return (
    <Card className="border-border/70">
      <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted/50">
          <LifeBuoy
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          No support requests
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Submit your first request using the form. New requests and
          responses from AH LLC will appear here.
        </p>
      </CardContent>
    </Card>
  );
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}