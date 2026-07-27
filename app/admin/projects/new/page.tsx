import type { Metadata, Route } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  FolderPlus,
  Save,
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
  title: "New Project | AH LLC Admin",
  description: "Create and assign a new AH LLC client project.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type NewProjectPageProps = {
  searchParams: Promise<{
    clientId?: string;
    error?: string;
  }>;
};

type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
};

async function createProject(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?redirectTo=/admin/projects/new");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const clientId = getString(formData, "client_id");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const status = getString(formData, "status") || "planned";
  const startDate = getString(formData, "start_date");
  const dueDate = getString(formData, "due_date");
  const progress = normalizeProgress(
    Number(getString(formData, "progress") || "0"),
  );

  if (!clientId || !title) {
    redirect(
      `/admin/projects/new?error=${encodeURIComponent(
        "Select a client and enter a project title.",
      )}` as Route,
    );
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      client_id: clientId,
      title,
      description: description || null,
      status,
      progress,
      start_date: startDate || null,
      due_date: dueDate || null,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !project) {
    console.error("Unable to create project:", error);

    redirect(
      `/admin/projects/new?clientId=${clientId}&error=${encodeURIComponent(
        "The project could not be created. Verify your admin database policies.",
      )}` as Route,
    );
  }

  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard", "layout");

  redirect(`/admin/projects/${project.id}` as Route);
}

export default async function NewProjectPage({
  searchParams,
}: NewProjectPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, company_name, role")
    .order("company_name", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Unable to load profiles for project creation:", error);
  }

  const profiles = error ? [] : ((data ?? []) as Profile[]);
  const selectedClientId = params.clientId ?? "";
  const errorMessage = params.error ?? "";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
          <Link href={"/admin/projects" as Route}>
            <ArrowLeft aria-hidden="true" className="mr-2 size-4" />
            Back to projects
          </Link>
        </Button>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <FolderPlus aria-hidden="true" className="size-3.5" />
          Project administration
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Create a project
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Assign a new project to a portal account and configure its initial
          status, progress, and schedule.
        </p>
      </section>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <form action={createProject}>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Project details</CardTitle>

            <CardDescription>
              Required fields are the assigned account and project title.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client_id">Assigned account</Label>

              <select
                id="client_id"
                name="client_id"
                defaultValue={selectedClientId}
                required
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>
                  Select an account
                </option>

                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {getProfileLabel(profile)}
                  </option>
                ))}
              </select>

              {profiles.length === 0 ? (
                <p className="text-xs text-destructive">
                  No profiles are available. Create a profile before assigning
                  a project.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Project title</Label>

              <Input
                id="title"
                name="title"
                placeholder="Example: Website redesign"
                maxLength={160}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>

              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Describe the project scope, goals, and deliverables."
                className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>

                <select
                  id="status"
                  name="status"
                  defaultValue="planned"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In progress</option>
                  <option value="waiting_on_client">
                    Waiting on client
                  </option>
                  <option value="review">In review</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">Progress percentage</Label>

                <Input
                  id="progress"
                  name="progress"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={0}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start date</Label>

                <div className="relative">
                  <CalendarDays
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />

                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due date</Label>

                <div className="relative">
                  <CalendarDays
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />

                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link href={"/admin/projects" as Route}>Cancel</Link>
              </Button>

              <Button
                type="submit"
                disabled={profiles.length === 0}
              >
                <Save aria-hidden="true" className="mr-2 size-4" />
                Create project
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
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

function getProfileLabel(profile: Profile) {
  const identity =
    profile.company_name?.trim() ||
    profile.full_name?.trim() ||
    "Unnamed account";

  return profile.role === "admin"
    ? `${identity} — Administrator`
    : profile.role === "staff"
      ? `${identity} — Staff`
      : identity;
}