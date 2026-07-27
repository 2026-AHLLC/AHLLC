import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderKanban,
  LifeBuoy,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
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
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Clients | AH LLC Admin",
  description:
    "Review AH LLC client accounts, projects, documents, and support activity.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type ClientsPageProps = {
  searchParams: Promise<{
    q?: string;
    role?: string;
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

type Project = {
  id: string;
  client_id: string;
  status: string;
};

type ClientDocument = {
  id: string;
  client_id: string;
};

type SupportRequest = {
  id: string;
  client_id: string;
  status: string;
};

type ClientSummary = Profile & {
  projectCount: number;
  activeProjectCount: number;
  documentCount: number;
  openSupportCount: number;
};

const roleLabels: Record<ProfileRole, string> = {
  client: "Client",
  staff: "Staff",
  admin: "Administrator",
};

const roleStyles: Record<ProfileRole, string> = {
  client:
    "border-blue-500/30 bg-blue-500/10 text-blue-300",
  staff:
    "border-violet-500/30 bg-violet-500/10 text-violet-300",
  admin:
    "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

const activeProjectStatuses = new Set([
  "planned",
  "in_progress",
  "waiting_on_client",
  "review",
]);

const openSupportStatuses = new Set(["open", "in_progress"]);

export default async function AdminClientsPage({
  searchParams,
}: ClientsPageProps) {
  const query = await searchParams;
  const searchTerm = query.q?.trim().toLowerCase() ?? "";
  const roleFilter = normalizeRoleFilter(query.role);

  const supabase = await createClient();

  const [
    profilesResult,
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
      .order("created_at", { ascending: false }),

    supabase
      .from("projects")
      .select("id, client_id, status"),

    supabase
      .from("client_documents")
      .select("id, client_id"),

    supabase
      .from("support_requests")
      .select("id, client_id, status"),
  ]);

  if (profilesResult.error) {
    console.error(
      "Unable to load admin client profiles:",
      profilesResult.error,
    );
  }

  if (projectsResult.error) {
    console.error(
      "Unable to load project counts:",
      projectsResult.error,
    );
  }

  if (documentsResult.error) {
    console.error(
      "Unable to load document counts:",
      documentsResult.error,
    );
  }

  if (supportResult.error) {
    console.error(
      "Unable to load support counts:",
      supportResult.error,
    );
  }

  const profiles = profilesResult.error
    ? []
    : ((profilesResult.data ?? []) as Profile[]);

  const projects = projectsResult.error
    ? []
    : ((projectsResult.data ?? []) as Project[]);

  const documents = documentsResult.error
    ? []
    : ((documentsResult.data ?? []) as ClientDocument[]);

  const supportRequests = supportResult.error
    ? []
    : ((supportResult.data ?? []) as SupportRequest[]);

  const projectCounts = new Map<string, number>();
  const activeProjectCounts = new Map<string, number>();
  const documentCounts = new Map<string, number>();
  const openSupportCounts = new Map<string, number>();

  for (const project of projects) {
    projectCounts.set(
      project.client_id,
      (projectCounts.get(project.client_id) ?? 0) + 1,
    );

    if (activeProjectStatuses.has(project.status)) {
      activeProjectCounts.set(
        project.client_id,
        (activeProjectCounts.get(project.client_id) ?? 0) + 1,
      );
    }
  }

  for (const document of documents) {
    documentCounts.set(
      document.client_id,
      (documentCounts.get(document.client_id) ?? 0) + 1,
    );
  }

  for (const request of supportRequests) {
    if (openSupportStatuses.has(request.status)) {
      openSupportCounts.set(
        request.client_id,
        (openSupportCounts.get(request.client_id) ?? 0) + 1,
      );
    }
  }

  const clients: ClientSummary[] = profiles.map((profile) => ({
    ...profile,
    projectCount: projectCounts.get(profile.id) ?? 0,
    activeProjectCount: activeProjectCounts.get(profile.id) ?? 0,
    documentCount: documentCounts.get(profile.id) ?? 0,
    openSupportCount: openSupportCounts.get(profile.id) ?? 0,
  }));

  const filteredClients = clients.filter((client) => {
    const matchesRole =
      roleFilter === "all" || client.role === roleFilter;

    if (!matchesRole) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    const searchableText = [
      client.full_name,
      client.company_name,
      client.phone,
      client.role,
      client.id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });

  const clientCount = clients.filter(
    (profile) => profile.role === "client",
  ).length;

  const staffCount = clients.filter(
    (profile) => profile.role === "staff",
  ).length;

  const adminCount = clients.filter(
    (profile) => profile.role === "admin",
  ).length;

  const activeClientCount = clients.filter(
    (profile) => profile.activeProjectCount > 0,
  ).length;

  const hasQueryError =
    Boolean(profilesResult.error) ||
    Boolean(projectsResult.error) ||
    Boolean(documentsResult.error) ||
    Boolean(supportResult.error);

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
              <ShieldCheck
                aria-hidden="true"
                className="size-3.5"
              />
              AH LLC Administration
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Clients
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Review account details, assigned projects, secure documents,
              and support activity for every portal user.
            </p>
          </div>

          <Button asChild>
            <Link href={"/admin/projects/new" as Route}>
              <Plus aria-hidden="true" className="mr-2 size-4" />
              Create project
            </Link>
          </Button>
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
            Some client activity could not be loaded. Verify your administrator
            Row Level Security policies and refresh the page.
          </p>
        </div>
      ) : null}

      <section
        aria-label="Client account totals"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="Client accounts"
          value={clientCount}
          description="Standard client users"
          icon={Users}
        />

        <SummaryCard
          title="Active clients"
          value={activeClientCount}
          description="Accounts with active projects"
          icon={FolderKanban}
        />

        <SummaryCard
          title="Staff accounts"
          value={staffCount}
          description="Internal staff users"
          icon={UserRound}
        />

        <SummaryCard
          title="Administrators"
          value={adminCount}
          description="Full administrative access"
          icon={ShieldCheck}
        />
      </section>

      <section aria-labelledby="client-directory-heading">
        <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2
              id="client-directory-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Account directory
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {filteredClients.length}{" "}
              {filteredClients.length === 1 ? "account" : "accounts"} shown.
            </p>
          </div>

          <form
            method="get"
            className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
          >
            <div className="relative min-w-0 sm:w-72">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                type="search"
                name="q"
                defaultValue={query.q ?? ""}
                placeholder="Search clients..."
                className="pl-9"
              />
            </div>

            <select
              name="role"
              defaultValue={roleFilter}
              aria-label="Filter accounts by role"
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All roles</option>
              <option value="client">Clients</option>
              <option value="staff">Staff</option>
              <option value="admin">Administrators</option>
            </select>

            <Button type="submit" variant="outline">
              Apply filters
            </Button>

            {searchTerm || roleFilter !== "all" ? (
              <Button asChild variant="ghost">
                <Link href={"/admin/clients" as Route}>
                  Clear
                </Link>
              </Button>
            ) : null}
          </form>
        </div>

        {profilesResult.error ? (
          <Card className="border-destructive/30">
            <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <AlertCircle
                aria-hidden="true"
                className="size-8 text-destructive"
              />

              <h3 className="mt-4 text-lg font-semibold">
                Client accounts unavailable
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                The client directory could not be loaded. Check the profiles
                table permissions and try again.
              </p>
            </CardContent>
          </Card>
        ) : filteredClients.length === 0 ? (
          <EmptyClientsState
            hasFilters={Boolean(
              searchTerm || roleFilter !== "all",
            )}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ClientCard({ client }: { client: ClientSummary }) {
  const displayName =
    client.company_name?.trim() ||
    client.full_name?.trim() ||
    "Unnamed account";

  const secondaryName =
    client.company_name?.trim() && client.full_name?.trim()
      ? client.full_name.trim()
      : null;

  return (
    <Card className="group flex h-full flex-col border-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
              {client.company_name ? (
                <Building2
                  aria-hidden="true"
                  className="size-5"
                />
              ) : (
                <UserRound
                  aria-hidden="true"
                  className="size-5"
                />
              )}
            </div>

            <div className="min-w-0">
              <CardTitle className="truncate text-base">
                {displayName}
              </CardTitle>

              {secondaryName ? (
                <CardDescription className="mt-1 truncate">
                  {secondaryName}
                </CardDescription>
              ) : (
                <CardDescription className="mt-1">
                  Portal account
                </CardDescription>
              )}
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${
              roleStyles[client.role]
            }`}
          >
            {roleLabels[client.role]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="grid grid-cols-2 gap-3">
          <Metric
            label="Projects"
            value={client.projectCount}
            icon={FolderKanban}
          />

          <Metric
            label="Active"
            value={client.activeProjectCount}
            icon={CheckCircle2}
          />

          <Metric
            label="Documents"
            value={client.documentCount}
            icon={FileText}
          />

          <Metric
            label="Open support"
            value={client.openSupportCount}
            icon={LifeBuoy}
            emphasize={client.openSupportCount > 0}
          />
        </div>

        <div className="mt-5 space-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          {client.phone ? (
            <p className="truncate">
              Phone: {client.phone}
            </p>
          ) : null}

          <p className="inline-flex items-center gap-2">
            <CalendarDays
              aria-hidden="true"
              className="size-3.5"
            />
            Added {formatDate(client.created_at)}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline" size="sm">
            <Link
              href={
                `/admin/documents/new?clientId=${client.id}` as Route
              }
            >
              Upload file
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link
              href={`/admin/clients/${client.id}` as Route}
            >
              View client
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
}

function Metric({
  label,
  value,
  icon: Icon,
  emphasize = false,
}: {
  label: string;
  value: number;
  icon: typeof FolderKanban;
  emphasize?: boolean;
}) {
  return (
    <div
      className={
        emphasize
          ? "rounded-xl border border-destructive/30 bg-destructive/5 p-3"
          : "rounded-xl border border-border/70 bg-muted/20 p-3"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <Icon
          aria-hidden="true"
          className={
            emphasize
              ? "size-3.5 text-destructive"
              : "size-3.5 text-muted-foreground"
          }
        />
      </div>

      <p className="mt-2 text-xl font-bold tracking-tight">
        {value}
      </p>
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
  icon: typeof Users;
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
        <p className="text-3xl font-bold tracking-tight">
          {value}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyClientsState({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <Card className="border-border/70">
      <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted/50">
          <Users
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          {hasFilters
            ? "No matching accounts"
            : "No client accounts found"}
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {hasFilters
            ? "Try changing or clearing the current search and role filters."
            : "New Supabase profile records will appear here once users create or receive portal accounts."}
        </p>

        {hasFilters ? (
          <Button asChild className="mt-6">
            <Link href={"/admin/clients" as Route}>
              Clear filters
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function normalizeRoleFilter(
  value: string | undefined,
): "all" | ProfileRole {
  if (
    value === "client" ||
    value === "staff" ||
    value === "admin"
  ) {
    return value;
  }

  return "all";
}

function formatDate(value: string) {
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