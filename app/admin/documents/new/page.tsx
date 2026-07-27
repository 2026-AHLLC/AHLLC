import type { Metadata, Route } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  FileUp,
  Upload,
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
  title: "Upload Document | AH LLC Admin",
  description: "Upload a document to an AH LLC client portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

const STORAGE_BUCKET = "client-documents";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const allowedCategories = [
  "report",
  "project_file",
  "invoice",
  "proposal",
  "agreement",
  "other",
] as const;

type NewDocumentPageProps = {
  searchParams: Promise<{
    clientId?: string;
    projectId?: string;
    error?: string;
  }>;
};

type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
};

type Project = {
  id: string;
  client_id: string;
  title: string;
};

async function uploadDocument(formData: FormData) {
  "use server";

  const supabase = await createClient();
  await requireAdmin(supabase);

  const clientId = getString(formData, "client_id");
  const projectId = getString(formData, "project_id");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const requestedCategory = getString(formData, "category");

  const category = allowedCategories.includes(
    requestedCategory as (typeof allowedCategories)[number],
  )
    ? requestedCategory
    : "other";

  const fileValue = formData.get("file");

  if (
    !clientId ||
    !title ||
    !(fileValue instanceof File) ||
    fileValue.size === 0
  ) {
    redirect(
      `/admin/documents/new?clientId=${clientId}&error=${encodeURIComponent(
        "Select a client, enter a title, and choose a file.",
      )}` as Route,
    );
  }

  if (fileValue.size > MAX_FILE_SIZE) {
    redirect(
      `/admin/documents/new?clientId=${clientId}&error=${encodeURIComponent(
        "The selected file exceeds the 25 MB upload limit.",
      )}` as Route,
    );
  }

  if (projectId) {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, client_id")
      .eq("id", projectId)
      .maybeSingle();

    if (
      projectError ||
      !project ||
      project.client_id !== clientId
    ) {
      redirect(
        `/admin/documents/new?clientId=${clientId}&error=${encodeURIComponent(
          "The selected project does not belong to the selected client.",
        )}` as Route,
      );
    }
  }

  const fileExtension = getFileExtension(fileValue.name);
  const safeFileName = sanitizeFileName(fileValue.name);
  const storageFileName = `${crypto.randomUUID()}${
    fileExtension ? `.${fileExtension}` : ""
  }`;

  const filePath = `${clientId}/${storageFileName}`;
  const fileBuffer = await fileValue.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: fileValue.type || "application/octet-stream",
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Unable to upload document:", uploadError);

    redirect(
      `/admin/documents/new?clientId=${clientId}&error=${encodeURIComponent(
        "The file could not be uploaded. Verify the Storage bucket and policies.",
      )}` as Route,
    );
  }

  const { error: metadataError } = await supabase
    .from("client_documents")
    .insert({
      client_id: clientId,
      project_id: projectId || null,
      title,
      description: description || null,
      category,
      file_path: filePath,
      file_name: safeFileName,
      mime_type: fileValue.type || null,
      file_size: fileValue.size,
      updated_at: new Date().toISOString(),
    });

  if (metadataError) {
    console.error("Unable to save document metadata:", metadataError);

    await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

    redirect(
      `/admin/documents/new?clientId=${clientId}&error=${encodeURIComponent(
        "The file was uploaded, but its database record could not be created.",
      )}` as Route,
    );
  }

  revalidatePath("/admin/documents");
  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");

  redirect("/admin/documents?uploaded=1");
}

export default async function NewDocumentPage({
  searchParams,
}: NewDocumentPageProps) {
  const query = await searchParams;
  const supabase = await createClient();

  const [profilesResult, projectsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, company_name, role")
      .order("company_name", { ascending: true })
      .order("full_name", { ascending: true }),

    supabase
      .from("projects")
      .select("id, client_id, title")
      .order("title", { ascending: true }),
  ]);

  if (profilesResult.error) {
    console.error(
      "Unable to load document profile options:",
      profilesResult.error,
    );
  }

  if (projectsResult.error) {
    console.error(
      "Unable to load document project options:",
      projectsResult.error,
    );
  }

  const profiles = profilesResult.error
    ? []
    : ((profilesResult.data ?? []) as Profile[]);

  const projects = projectsResult.error
    ? []
    : ((projectsResult.data ?? []) as Project[]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4">
          <Link href={"/admin/documents" as Route}>
            <ArrowLeft aria-hidden="true" className="mr-2 size-4" />
            Back to documents
          </Link>
        </Button>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <FileUp aria-hidden="true" className="size-3.5" />
          Secure file upload
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Upload a document
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Upload a private file and assign it to a client account or specific
          project.
        </p>
      </section>

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

      <form action={uploadDocument}>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Document details</CardTitle>

            <CardDescription>
              Files are stored privately and accessed through temporary signed
              download links.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client_id">Assigned account</Label>

              <select
                id="client_id"
                name="client_id"
                defaultValue={query.clientId ?? ""}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_id">Associated project</Label>

              <select
                id="project_id"
                name="project_id"
                defaultValue={query.projectId ?? ""}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">No specific project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>

              <p className="text-xs text-muted-foreground">
                The server verifies that the selected project belongs to the
                selected account.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Document title</Label>

                <Input
                  id="title"
                  name="title"
                  placeholder="Example: July SEO Report"
                  maxLength={160}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>

                <select
                  id="category"
                  name="category"
                  defaultValue="project_file"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="report">Report</option>
                  <option value="project_file">Project file</option>
                  <option value="invoice">Invoice</option>
                  <option value="proposal">Proposal</option>
                  <option value="agreement">Agreement</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>

              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the file and its purpose."
                className="flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File</Label>

              <Input
                id="file"
                name="file"
                type="file"
                required
                className="h-auto cursor-pointer py-2.5"
              />

              <p className="text-xs text-muted-foreground">
                Maximum file size: 25 MB.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link href={"/admin/documents" as Route}>Cancel</Link>
              </Button>

              <Button
                type="submit"
                disabled={profiles.length === 0}
              >
                <Upload aria-hidden="true" className="mr-2 size-4" />
                Upload document
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
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
    redirect("/login?redirectTo=/admin/documents/new");
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

function sanitizeFileName(value: string) {
  return value
    .replace(/[^\w.\-()\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function getFileExtension(value: string) {
  const safeName = sanitizeFileName(value);
  const parts = safeName.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.at(-1)?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
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