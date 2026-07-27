import type { Metadata, Route } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  LifeBuoy,
  Phone,
  Save,
  ShieldCheck,
  Upload,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Client Details | AH LLC Admin",
  description:
    "Review and manage an AH LLC client profile, projects, documents, and support activity.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type ClientPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

type ProfileRole = "client" | "staff" | "admin";

type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
};

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
  status: ProjectStatus;
  progress: number;
  due_date: string | null;
  updated_at: string;
};

type ClientDocument = {
  id: string;
  title: string;
  category: string;
  file_name: string;
  created_at: string;
};

type SupportStatus = "open" | "in_progress" | "resolved" | "closed";

type SupportPriority = "low" | "normal" | "high" | "urgent";

type SupportRequest = {
  id: string;
  subject: string;
  status: SupportStatus;
  priority: SupportPriority;
  updated_at: string;
};

const roleLabels: Record<ProfileRole, string> = {
  client: "Client",
  staff: "Staff",
  admin: "Administrator",
};

const projectStatusLabels: Record<ProjectStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  waiting_on_client: "Waiting on client",
  review: "In review",
  completed: "Completed",
  paused: "Paused",
};

const supportStatusLabels: Record<SupportStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

async function updateClientProfile(formData: FormData) {
  "use server";

  const supabase = await createClient();
  await requireAdmin(supabase);

  const id = getString(formData, "id");
  const fullName = getString(formData, "full_name");
  const companyName = getString(formData, "company_name");
  const phone = getString(formData, "phone");
  const requestedRole = getString(formData, "role");

  const role: ProfileRole = ["client", "staff", "admin"].includes(
    requestedRole,
  )
    ? (requestedRole as ProfileRole)
    : "client";

  if (!id) {
    redirect("/admin/clients");
  }

  if (!fullName && !companyName) {
    redirect(
      `/admin/clients/${id}?error=${encodeURIComponent(
        "Enter a full name or company name.",
      )}` as Route,
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      company_name: companyName || null,
      phone: phone || null,
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Unable to update client profile:", error);

    redirect(
      `/admin/clients/${id}?error=${encodeURIComponent(
        "The client profile could not be updated.",
      )}` as Route,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/dashboard", "layout");

  redirect(`/admin/clients/${id}?saved=1` as Route);
}

export default async function AdminClientDetailPage({
  params,
  searchParams,
}: ClientPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const [
    profileResult,
    projectsResult,
    documentsResult,
    supportResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `
          id,
          full_name,
          company_name,
          phone,
          role,
          created_at,
          updated_at
        `,
      )
      .eq("id", id)
      .maybeSingle(),

    supabase
      .from("projects")
      .select(
        `
          id,
          title,
          status,
          progress,
          due_date,
          updated_at
        `,
      )
      .eq("client_id", id)
      .order("updated_at", { ascending: false }),

    supabase
      .from("client_documents")
      .select(
        `
          id,
          title,
          category,
          file_name,
          created_at
        `,
      )
      .eq("client_id", id)
      .order("created_at", { ascending: false }),

    supabase
      .from("support_requests")
      .select(
        `
          id,
          subject,
          status,
          priority,
          updated_at
        `,
      )
      .eq("client_id", id)
      .order("updated_at", { ascending: false }),
  ]);

  if (profileResult.error) {
    console.error("Unable to load client profile:", profileResult.error);
    notFound();
  }

  if (!profileResult.data) {
    notFound();
  }

  if (projectsResult.error) {
    console.error("Unable to load client projects:", projectsResult.error);
  }

  if (documentsResult.error) {
    console.error("Unable to load client documents:", documentsResult.error);
  }

  if (supportResult.error) {
    console.error(
      "Unable to load client support requests:",
      supportResult.error,
    );
  }

  const profile = profileResult.data as Profile;

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
    profile.company_name?.trim() ||
    profile.full_name?.trim() ||
    "Unnamed account";

  const secondaryName =
    profile.company_name?.trim() && profile.full_name?.trim()
      ? profile.full_name.trim()
      : null;

  const activeProjects = projects.filter((project) =>
    [
      "planned",
      "in_progress",
      "waiting_on_client",
      "review",
    ].includes(project.status),
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  ).length;

  const openSupportRequests = supportRequests.filter((request) =>
    ["open", "in_progress"].includes(request.status),
  ).length;

  const hasRelatedDataError =
    Boolean(projectsResult.error) ||
    Boolean(documentsResult.error) ||
    Boolean(supportResult.error);

  return (
    <div className="space-y-8">
      <section>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-3 mb-4"
        >
          <Link href={"/admin/clients" as Route}>
            <ArrowLeft aria-hidden="true" className="mr-2 size-4" />
            Back to clients
          </Link>
        </Button>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/50">
              {profile.company_name ? (
                <Building2 aria-hidden="true" className="size-6" />
              ) : (
                <UserRound aria-hidden="true" className="size-6" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {displayName}
                </h1>

                <RoleBadge role={profile.role} />
              </div>

              {secondaryName ? (
                <p className="mt-2 text-base text-muted-foreground">
                  {secondaryName}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {profile.phone ? (
                  <span className="inline-flex items-center gap-2">
                    <Phone aria-hidden="true" className="size-4" />
                    {profile.phone}
                  </span>
                ) : null}

                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-4"
                  />
                  Added {formatDate(profile.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link
                href={
                  `/admin/documents/new?clientId=${profile.id}` as Route
                }
              >
                <Upload aria-hidden="true" className="mr-2 size-4" />
                Upload document
              </Link>
            </Button>

            <Button asChild>
              <Link
                href={
                  `/admin/projects/new?clientId=${profile.id}` as Route
                }
              >
                <FolderKanban
                  aria-hidden="true"
                  className="mr-2 size-4"
                />
                Create project
              </Link>
            </Button>
          </div>
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

          <span>The client profile was updated successfully.</span>
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

      {hasRelatedDataError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <span>
            Some related client activity could not be loaded. Verify the
            administrator Row Level Security policies.
          </span>
        </div>
      ) : null}

      <section
        aria-label="Client account summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        <SummaryCard
          title="All projects"
          value={projects.length}
          description="Projects assigned"
          icon={FolderKanban}
        />

        <SummaryCard
          title="Active projects"
          value={activeProjects}
          description="Projects underway"
          icon={Clock3}
        />

        <SummaryCard
          title="Completed"
          value={completedProjects}
          description="Finished projects"
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Documents"
          value={documents.length}
          description="Files available"
          icon={FileText}
        />

        <SummaryCard
          title="Open support"
          value={openSupportRequests}
          description="Requests needing action"
          icon={LifeBuoy}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound aria-hidden="true" className="size-5" />
              Profile information
            </CardTitle>

            <CardDescription>
              Update the account information and administrative role.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              action={updateClientProfile}
              className="space-y-5"
            >
              <input type="hidden" name="id" value={profile.id} />

              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>

                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile.full_name ?? ""}
                  placeholder="Client’s full name"
                  maxLength={160}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company name</Label>

                <Input
                  id="company_name"
                  name="company_name"
                  defaultValue={profile.company_name ?? ""}
                  placeholder="Company or organization"
                  maxLength={160}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone ?? ""}
                  placeholder="Client phone number"
                  maxLength={40}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Portal role</Label>

                <select
                  id="role"
                  name="role"
                  defaultValue={profile.role}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="client">Client</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Administrator</option>
                </select>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Administrator access permits entry to all admin routes.
                  Assign this role carefully.
                </p>
              </div>

              <Button type="submit" className="w-full">
                <Save aria-hidden="true" className="mr-2 size-4" />
                Save profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ProjectsPanel
  projects={projects.slice(0, 5)}
  clientId={profile.id}
/>

          <DocumentsPanel documents={documents.slice(0, 5)} />

          <SupportPanel requests={supportRequests.slice(0, 5)} />
        </div>
      </section>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck aria-hidden="true" className="size-5" />
            Account record
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
          <InformationItem
            label="Profile ID"
            value={profile.id}
            monospace
          />

          <InformationItem
            label="Account created"
            value={formatDateTime(profile.created_at)}
          />

          <InformationItem
            label="Profile updated"
            value={formatDateTime(profile.updated_at)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectsPanel({
  projects,
  clientId,
}: {
  projects: Project[];
  clientId: string;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">Recent projects</CardTitle>

          <CardDescription className="mt-2">
            Projects assigned to this account.
          </CardDescription>
        </div>

        <FolderKanban
          aria-hidden="true"
          className="size-5 text-muted-foreground"
        />
      </CardHeader>

      <CardContent>
        {projects.length === 0 ? (
          <EmptyPanelMessage message="No projects are assigned to this account." />
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const progress = normalizeProgress(project.progress);

              return (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}` as Route}
                  className="group block border-b border-border/70 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                        {project.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {projectStatusLabels[project.status]}
                        {project.due_date
                          ? ` · Due ${formatDate(project.due_date)}`
                          : " · No due date"}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold">
                      {progress}%
                    </span>
                  </div>

                  <div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
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
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline" size="sm">
            <Link href={"/admin/projects" as Route}>
              All projects
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link
              href={`/admin/projects/new?clientId=${clientId}` as Route}
            >
              Create project
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentsPanel({
  documents,
}: {
  documents: ClientDocument[];
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">Recent documents</CardTitle>

          <CardDescription className="mt-2">
            Files shared through this client portal.
          </CardDescription>
        </div>

        <FileText
          aria-hidden="true"
          className="size-5 text-muted-foreground"
        />
      </CardHeader>

      <CardContent>
        {documents.length === 0 ? (
          <EmptyPanelMessage message="No documents have been uploaded for this account." />
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-start justify-between gap-4 border-b border-border/70 pb-4 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {document.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {document.file_name}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs capitalize text-muted-foreground">
                    {document.category.replaceAll("_", " ")}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(document.created_at)}
                  </p>
                </div>
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
          <Link href={"/admin/documents" as Route}>
            View all documents
            <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function SupportPanel({
  requests,
}: {
  requests: SupportRequest[];
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">Support activity</CardTitle>

          <CardDescription className="mt-2">
            Recent support requests from this account.
          </CardDescription>
        </div>

        <LifeBuoy
          aria-hidden="true"
          className="size-5 text-muted-foreground"
        />
      </CardHeader>

      <CardContent>
        {requests.length === 0 ? (
          <EmptyPanelMessage message="No support requests have been submitted." />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
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
                    {supportStatusLabels[request.status]}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={
                      request.priority === "urgent"
                        ? "rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                        : "rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium capitalize"
                    }
                  >
                    {request.priority}
                  </span>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(request.updated_at)}
                  </p>
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
          <Link href={"/admin/support" as Route}>
            View all support
            <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
        </Button>
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
  icon: typeof FolderKanban;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <Icon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
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

function RoleBadge({ role }: { role: ProfileRole }) {
  return (
    <span className="inline-flex shrink-0 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium">
      {roleLabels[role]}
    </span>
  );
}

function InformationItem({
  label,
  value,
  monospace = false,
}: {
  label: string;
  value: string;
  monospace?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>

      <p
        className={
          monospace
            ? "mt-1 break-all font-mono text-xs"
            : "mt-1 font-medium"
        }
      >
        {value}
      </p>
    </div>
  );
}

function EmptyPanelMessage({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
      {message}
    </p>
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
    redirect("/login?redirectTo=/admin/clients");
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