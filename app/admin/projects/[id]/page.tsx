import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  FolderKanban,
  Save,
  Trash2,
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
  title: "Manage Project | AH LLC Admin",
  description: "Update an AH LLC client project.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

type Project = {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
};

async function updateProject(formData: FormData) {
  "use server";

  const supabase = await createClient();
  await requireAdmin(supabase);

  const id = getString(formData, "id");
  const clientId = getString(formData, "client_id");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const status = getString(formData, "status") || "planned";
  const startDate = getString(formData, "start_date");
  const dueDate = getString(formData, "due_date");
  const progress = normalizeProgress(
    Number(getString(formData, "progress") || "0"),
  );

  if (!id || !clientId || !title) {
    redirect(
      `/admin/projects/${id}?error=${encodeURIComponent(
        "The assigned account and project title are required.",
      )}` as Route,
    );
  }

  const { error } = await supabase
    .from("projects")
    .update({
      client_id: clientId,
      title,
      description: description || null,
      status,
      progress,
      start_date: startDate || null,
      due_date: dueDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Unable to update project:", error);

    redirect(
      `/admin/projects/${id}?error=${encodeURIComponent(
        "The project could not be updated.",
      )}` as Route,
    );
  }

  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath(`/admin/projects/${id}`);

  redirect(`/admin/projects/${id}?saved=1` as Route);
}

async function deleteProject(formData: FormData) {
  "use server";

  const supabase = await createClient();
  await requireAdmin(supabase);

  const id = getString(formData, "id");

  if (!id) {
    redirect("/admin/projects");
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Unable to delete project:", error);

    redirect(
      `/admin/projects/${id}?error=${encodeURIComponent(
        "The project could not be deleted.",
      )}` as Route,
    );
  }

  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard", "layout");

  redirect("/admin/projects");
}

export default async function ManageProjectPage({
  params,
  searchParams,
}: ProjectPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const [projectResult, profilesResult] = await Promise.all([
    supabase
      .from("projects")
      .select(
        `
          id,
          client_id,
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
      .eq("id", id)
      .maybeSingle(),

    supabase
      .from("profiles")
      .select("id, full_name, company_name, role")
      .order("company_name", { ascending: true })
      .order("full_name", { ascending: true }),
  ]);

  if (projectResult.error) {
    console.error("Unable to load project:", projectResult.error);
    notFound();
  }

  if (!projectResult.data) {
    notFound();
  }

  if (profilesResult.error) {
    console.error(
      "Unable to load project account options:",
      profilesResult.error,
    );
  }

  const project = projectResult.data as Project;
  const profiles = profilesResult.error
    ? []
    : ((profilesResult.data ?? []) as Profile[]);

  const assignedProfile = profiles.find(
    (profile) => profile.id === project.client_id,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
          <Link href={"/admin/projects" as Route}>
            <ArrowLeft aria-hidden="true" className="mr-2 size-4" />
            Back to projects
          </Link>
        </Button>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <FolderKanban aria-hidden="true" className="size-3.5" />
          Project administration
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          {project.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <UserRound aria-hidden="true" className="size-4" />
            {assignedProfile
              ? getProfileLabel(assignedProfile)
              : "Unknown account"}
          </span>

          <span>Created {formatDate(project.created_at)}</span>
          <span>Updated {formatDate(project.updated_at)}</span>
        </div>
      </section>

      {query.saved === "1" ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          The project was updated successfully.
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

      <form action={updateProject}>
        <input type="hidden" name="id" value={project.id} />

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Project details</CardTitle>

            <CardDescription>
              Changes are shown in the assigned client portal after the page
              refreshes.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client_id">Assigned account</Label>

              <select
                id="client_id"
                name="client_id"
                defaultValue={project.client_id}
                required
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {getProfileLabel(profile)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Project title</Label>

              <Input
                id="title"
                name="title"
                defaultValue={project.title}
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
                defaultValue={project.description ?? ""}
                className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>

                <select
                  id="status"
                  name="status"
                  defaultValue={project.status}
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
                  defaultValue={normalizeProgress(project.progress)}
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
                    defaultValue={project.start_date ?? ""}
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
                    defaultValue={project.due_date ?? ""}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link href={"/admin/projects" as Route}>Cancel</Link>
              </Button>

              <Button type="submit">
                <Save aria-hidden="true" className="mr-2 size-4" />
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>

          <CardDescription>
            Deleting this project permanently removes it from the assigned
            client portal.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={deleteProject}>
            <input type="hidden" name="id" value={project.id} />

            <Button type="submit" variant="destructive">
              <Trash2 aria-hidden="true" className="mr-2 size-4" />
              Delete project
            </Button>
          </form>
        </CardContent>
      </Card>
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
    redirect("/login?redirectTo=/admin/projects");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
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