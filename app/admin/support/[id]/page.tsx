import type { Metadata, Route } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LifeBuoy,
  Save,
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
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Manage Support Request | AH LLC Admin",
  description: "Review and respond to an AH LLC support request.",
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
  phone: string | null;
};

type Project = {
  id: string;
  title: string;
};

type SupportRequestPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

async function updateSupportRequest(formData: FormData) {
  "use server";

  const supabase = await createClient();
  await requireAdmin(supabase);

  const id = getString(formData, "id");
  const requestedStatus = getString(formData, "status");
  const requestedPriority = getString(formData, "priority");
  const adminResponse = getString(formData, "admin_response");

  const status: SupportStatus = [
    "open",
    "in_progress",
    "resolved",
    "closed",
  ].includes(requestedStatus)
    ? (requestedStatus as SupportStatus)
    : "open";

  const priority: SupportPriority = [
    "low",
    "normal",
    "high",
    "urgent",
  ].includes(requestedPriority)
    ? (requestedPriority as SupportPriority)
    : "normal";

  if (!id) {
    redirect("/admin/support");
  }

  const { error } = await supabase
    .from("support_requests")
    .update({
      status,
      priority,
      admin_response: adminResponse || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Unable to update support request:", error);

    redirect(
      `/admin/support/${id}?error=${encodeURIComponent(
        "The support request could not be updated.",
      )}` as Route,
    );
  }

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
  revalidatePath("/dashboard/support");
  revalidatePath("/dashboard");

  redirect(`/admin/support/${id}?saved=1` as Route);
}

export default async function ManageSupportRequestPage({
  params,
  searchParams,
}: SupportRequestPageProps) {
  const { id } = await params;
  const query = await searchParams;
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
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load support request:", error);
    notFound();
  }

  if (!data) {
    notFound();
  }

  const request = data as SupportRequest;

  const [profileResult, projectResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, company_name, phone")
      .eq("id", request.client_id)
      .maybeSingle(),

    request.project_id
      ? supabase
          .from("projects")
          .select("id, title")
          .eq("id", request.project_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (profileResult.error) {
    console.error(
      "Unable to load support request client:",
      profileResult.error,
    );
  }

  if (projectResult.error) {
    console.error(
      "Unable to load support request project:",
      projectResult.error,
    );
  }

  const profile = profileResult.data as Profile | null;
  const project = projectResult.data as Project | null;

  const clientName =
    profile?.company_name?.trim() ||
    profile?.full_name?.trim() ||
    "Unknown client";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
          <Link href={"/admin/support" as Route}>
            <ArrowLeft aria-hidden="true" className="mr-2 size-4" />
            Back to support
          </Link>
        </Button>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <LifeBuoy aria-hidden="true" className="size-3.5" />
          Support administration
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          {request.subject}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <UserRound aria-hidden="true" className="size-4" />
            {clientName}
          </span>

          {project ? <span>Project: {project.title}</span> : null}

          <span>Submitted {formatDateTime(request.created_at)}</span>
        </div>
      </section>

      {query.saved === "1" ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <span>The support request was updated successfully.</span>
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

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-base">
                Request information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <InformationRow label="Client" value={clientName} />

              <InformationRow
                label="Project"
                value={project?.title ?? "General support"}
              />

              <InformationRow
                label="Current status"
                value={formatStatus(request.status)}
              />

              <InformationRow
                label="Priority"
                value={formatPriority(request.priority)}
              />

              <InformationRow
                label="Last updated"
                value={formatDateTime(request.updated_at)}
              />
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Client message</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {request.message}
              </p>
            </CardContent>
          </Card>
        </div>

        <form action={updateSupportRequest}>
          <input type="hidden" name="id" value={request.id} />

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Manage request</CardTitle>

              <CardDescription>
                Update the request status and provide a response that will
                appear in the client portal.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>

                  <select
                    id="status"
                    name="status"
                    defaultValue={request.status}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>

                  <select
                    id="priority"
                    name="priority"
                    defaultValue={request.priority}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_response">Response to client</Label>

                <textarea
                  id="admin_response"
                  name="admin_response"
                  rows={10}
                  defaultValue={request.admin_response ?? ""}
                  placeholder="Write a clear response, update, or resolution for the client."
                  className="flex min-h-56 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <Clock3
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Saving this form updates the response immediately in the
                    assigned client’s support page.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
                <Button asChild type="button" variant="outline">
                  <Link href={"/admin/support" as Route}>Cancel</Link>
                </Button>

                <Button type="submit">
                  <Save aria-hidden="true" className="mr-2 size-4" />
                  Save response
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </section>
    </div>
  );
}

function InformationRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

async function requireAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?redirectTo=/admin/support");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function formatStatus(status: SupportStatus) {
  const labels: Record<SupportStatus, string> = {
    open: "Open",
    in_progress: "In progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  return labels[status];
}

function formatPriority(priority: SupportPriority) {
  const labels: Record<SupportPriority, string> = {
    low: "Low",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
  };

  return labels[priority];
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