import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  FolderKanban,
  Mail,
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
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Clients | AH LLC Admin",
  description: "Review AH LLC client accounts and assigned projects.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type ProfileRole = "client" | "staff" | "admin";

type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  role: ProfileRole;
  created_at: string;
};

type ProjectRecord = {
  id: string;
  client_id: string;
  status: string;
};

export default async function AdminClientsPage() {
  const supabase = await createClient();

  const [profilesResult, projectsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `
          id,
          full_name,
          company_name,
          phone,
          role,
          created_at
        `,
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("projects")
      .select("id, client_id, status"),
  ]);

  if (profilesResult.error) {
    console.error("Unable to load admin client profiles:", profilesResult.error);

    return <ClientsErrorState />;
  }

  if (projectsResult.error) {
    console.error("Unable to load client project totals:", projectsResult.error);
  }

  const profiles = (profilesResult.data ?? []) as Profile[];
  const projects = projectsResult.error
    ? []
    : ((projectsResult.data ?? []) as ProjectRecord[]);

  const projectCounts = new Map<string, number>();
  const activeProjectCounts = new Map<string, number>();

  for (const project of projects) {
    projectCounts.set(
      project.client_id,
      (projectCounts.get(project.client_id) ?? 0) + 1,
    );

    if (
      ["planned", "in_progress", "waiting_on_client", "review"].includes(
        project.status,
      )
    ) {
      activeProjectCounts.set(
        project.client_id,
        (activeProjectCounts.get(project.client_id) ?? 0) + 1,
      );
    }
  }

  const clientCount = profiles.filter(
    (profile) => profile.role === "client",
  ).length;

  const staffCount = profiles.filter(
    (profile) => profile.role === "staff",
  ).length;

  const adminCount = profiles.filter(
    (profile) => profile.role === "admin",
  ).length;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Users aria-hidden="true" className="size-3.5" />
            Account administration
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Review portal accounts and see how many projects are assigned to
            each client, staff member, or administrator.
          </p>
        </div>

        <Button asChild>
          <Link href={"/admin/projects/new" as Route}>
            <FolderKanban aria-hidden="true" className="mr-2 size-4" />
            Assign a project
          </Link>
        </Button>
      </section>

      <section
        aria-label="Account totals"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="Client accounts"
          value={clientCount}
          description="External client profiles"
          icon={Users}
        />

        <SummaryCard
          title="Staff accounts"
          value={staffCount}
          description="Internal team profiles"
          icon={UserRound}
        />

        <SummaryCard
          title="Administrators"
          value={adminCount}
          description="Admin-level profiles"
          icon={ShieldCheck}
        />

        <SummaryCard
          title="All profiles"
          value={profiles.length}
          description="Total portal profiles"
          icon={Building2}
        />
      </section>

      <section aria-labelledby="account-list-heading">
        <div className="mb-4">
          <h2
            id="account-list-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Portal accounts
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Profiles connected to Supabase authentication users.
          </p>
        </div>

        {profiles.length === 0 ? (
          <Card className="border-border/70">
            <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <Users
                aria-hidden="true"
                className="size-8 text-muted-foreground"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No profiles were found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Add a user through Supabase Authentication and create a matching
                row in the profiles table.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {profiles.map((profile) => (
              <ClientCard
                key={profile.id}
                profile={profile}
                projectCount={projectCounts.get(profile.id) ?? 0}
                activeProjectCount={
                  activeProjectCounts.get(profile.id) ?? 0
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ClientCard({
  profile,
  projectCount,
  activeProjectCount,
}: {
  profile: Profile;
  projectCount: number;
  activeProjectCount: number;
}) {
  const displayName =
    profile.company_name?.trim() ||
    profile.full_name?.trim() ||
    "Unnamed account";

  const secondaryName =
    profile.company_name?.trim() && profile.full_name?.trim()
      ? profile.full_name.trim()
      : null;

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
              {profile.company_name ? (
                <Building2 aria-hidden="true" className="size-5" />
              ) : (
                <UserRound aria-hidden="true" className="size-5" />
              )}
            </div>

            <div className="min-w-0">
              <CardTitle className="truncate text-lg">
                {displayName}
              </CardTitle>

              {secondaryName ? (
                <CardDescription className="mt-1 truncate">
                  {secondaryName}
                </CardDescription>
              ) : null}
            </div>
          </div>

          <RoleBadge role={profile.role} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">All projects</p>
            <p className="mt-1 text-2xl font-bold">{projectCount}</p>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Active projects</p>
            <p className="mt-1 text-2xl font-bold">
              {activeProjectCount}
            </p>
          </div>
        </div>

        {profile.phone ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail aria-hidden="true" className="size-4" />
            <span>{profile.phone}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-4">
          <p className="text-xs text-muted-foreground">
            Added {formatDate(profile.created_at)}
          </p>

          <Button asChild variant="outline" size="sm">
            <Link
              href={
                `/admin/projects/new?clientId=${profile.id}` as Route
              }
            >
              Assign project
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RoleBadge({ role }: { role: ProfileRole }) {
  const labels: Record<ProfileRole, string> = {
    client: "Client",
    staff: "Staff",
    admin: "Admin",
  };

  return (
    <span className="inline-flex shrink-0 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium">
      {labels[role]}
    </span>
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

        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ClientsErrorState() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Clients</h1>

      <Card className="border-destructive/30">
        <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
          <AlertCircle
            aria-hidden="true"
            className="size-8 text-destructive"
          />

          <h2 className="mt-4 text-lg font-semibold">
            Client accounts unavailable
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The profiles table could not be read. Verify the administrator Row
            Level Security policies and try again.
          </p>

          <Button asChild variant="outline" className="mt-6">
            <Link href={"/admin" as Route}>Return to admin dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
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