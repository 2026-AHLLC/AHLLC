import type { Metadata, Route } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  Download,
  FileArchive,
  FileText,
  FolderOpen,
  Plus,
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
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Documents | AH LLC Admin",
  description: "Manage documents shared with AH LLC clients.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

const STORAGE_BUCKET = "client-documents";

type DocumentCategory =
  | "report"
  | "project_file"
  | "invoice"
  | "proposal"
  | "agreement"
  | "other";

type ClientDocument = {
  id: string;
  client_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  category: DocumentCategory;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
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

type SignedDocument = ClientDocument & {
  signedUrl: string | null;
};

const categoryLabels: Record<DocumentCategory, string> = {
  report: "Report",
  project_file: "Project file",
  invoice: "Invoice",
  proposal: "Proposal",
  agreement: "Agreement",
  other: "Other",
};

async function deleteDocument(formData: FormData) {
  "use server";

  const supabase = await createClient();
  await requireAdmin(supabase);

  const documentId = getString(formData, "document_id");

  if (!documentId) {
    redirect("/admin/documents");
  }

  const { data: document, error: documentError } = await supabase
    .from("client_documents")
    .select("id, file_path")
    .eq("id", documentId)
    .maybeSingle();

  if (documentError || !document) {
    console.error("Unable to locate document:", documentError);

    redirect(
      `/admin/documents?error=${encodeURIComponent(
        "The document could not be found.",
      )}` as Route,
    );
  }

  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([document.file_path]);

  if (storageError) {
    console.error("Unable to delete document file:", storageError);

    redirect(
      `/admin/documents?error=${encodeURIComponent(
        "The file could not be removed from storage.",
      )}` as Route,
    );
  }

  const { error: metadataError } = await supabase
    .from("client_documents")
    .delete()
    .eq("id", documentId);

  if (metadataError) {
    console.error("Unable to delete document metadata:", metadataError);

    redirect(
      `/admin/documents?error=${encodeURIComponent(
        "The document record could not be deleted.",
      )}` as Route,
    );
  }

  revalidatePath("/admin/documents");
  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");

  redirect("/admin/documents?deleted=1");
}

type AdminDocumentsPageProps = {
  searchParams: Promise<{
    error?: string;
    uploaded?: string;
    deleted?: string;
  }>;
};

export default async function AdminDocumentsPage({
  searchParams,
}: AdminDocumentsPageProps) {
  const query = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("client_documents")
    .select(
      `
        id,
        client_id,
        project_id,
        title,
        description,
        category,
        file_path,
        file_name,
        mime_type,
        file_size,
        created_at,
        updated_at
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load admin documents:", error);

    return <DocumentsErrorState />;
  }

  const documents = (data ?? []) as ClientDocument[];

  const clientIds = Array.from(
    new Set(documents.map((document) => document.client_id)),
  );

  const projectIds = Array.from(
    new Set(
      documents
        .map((document) => document.project_id)
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
    console.error("Unable to load document clients:", profilesResult.error);
  }

  if (projectsResult.error) {
    console.error("Unable to load document projects:", projectsResult.error);
  }

  const profiles = (profilesResult.data ?? []) as Profile[];
  const projects = (projectsResult.data ?? []) as Project[];

  const profileMap = new Map(
    profiles.map((profile) => [profile.id, profile]),
  );

  const projectMap = new Map(
    projects.map((project) => [project.id, project]),
  );

  const signedDocuments: SignedDocument[] = await Promise.all(
    documents.map(async (document) => {
      const { data: signedData, error: signedError } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(document.file_path, 60 * 10);

      if (signedError) {
        console.error(
          `Unable to sign document ${document.id}:`,
          signedError,
        );
      }

      return {
        ...document,
        signedUrl: signedData?.signedUrl ?? null,
      };
    }),
  );

  const reports = documents.filter(
    (document) => document.category === "report",
  ).length;

  const projectFiles = documents.filter(
    (document) => document.category === "project_file",
  ).length;

  const businessDocuments = documents.filter((document) =>
    ["invoice", "proposal", "agreement"].includes(document.category),
  ).length;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <FileText aria-hidden="true" className="size-3.5" />
            Document administration
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Client documents
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Upload reports, project files, agreements, proposals, and invoices
            to individual client portals.
          </p>
        </div>

        <Button asChild>
          <Link href={"/admin/documents/new" as Route}>
            <Plus aria-hidden="true" className="mr-2 size-4" />
            Upload document
          </Link>
        </Button>
      </section>

      {query.uploaded === "1" ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          The document was uploaded successfully.
        </div>
      ) : null}

      {query.deleted === "1" ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          The document was deleted successfully.
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
        aria-label="Document totals"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="All documents"
          value={documents.length}
          description="Files shared with clients"
          icon={FileText}
        />

        <SummaryCard
          title="Reports"
          value={reports}
          description="Audits and reports"
          icon={FileText}
        />

        <SummaryCard
          title="Project files"
          value={projectFiles}
          description="Project deliverables"
          icon={FolderOpen}
        />

        <SummaryCard
          title="Business documents"
          value={businessDocuments}
          description="Invoices and agreements"
          icon={FileArchive}
        />
      </section>

      <section aria-labelledby="document-list-heading">
        <div className="mb-4">
          <h2
            id="document-list-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Uploaded documents
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Files currently available through client portals.
          </p>
        </div>

        {signedDocuments.length === 0 ? (
          <EmptyDocumentsState />
        ) : (
          <div className="space-y-4">
            {signedDocuments.map((document) => {
              const profile = profileMap.get(document.client_id);
              const project = document.project_id
                ? projectMap.get(document.project_id)
                : undefined;

              const clientName =
                profile?.company_name?.trim() ||
                profile?.full_name?.trim() ||
                "Unknown client";

              return (
                <Card key={document.id} className="border-border/70">
                  <CardContent className="p-5">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                          <FileText
                            aria-hidden="true"
                            className="size-5"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {document.title}
                            </h3>

                            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium">
                              {categoryLabels[document.category]}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {document.file_name}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound
                                aria-hidden="true"
                                className="size-3.5"
                              />
                              {clientName}
                            </span>

                            {project ? (
                              <span>{project.title}</span>
                            ) : null}

                            <span>{formatFileSize(document.file_size)}</span>
                            <span>{formatDate(document.created_at)}</span>
                          </div>

                          {document.description ? (
                            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                              {document.description}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {document.signedUrl ? (
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={document.signedUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Download
                                aria-hidden="true"
                                className="mr-2 size-4"
                              />
                              Download
                            </a>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            Download unavailable
                          </Button>
                        )}

                        <form action={deleteDocument}>
                          <input
                            type="hidden"
                            name="document_id"
                            value={document.id}
                          />

                          <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2
                              aria-hidden="true"
                              className="mr-2 size-4"
                            />
                            Delete
                          </Button>
                        </form>
                      </div>
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
  icon: typeof FileText;
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

function EmptyDocumentsState() {
  return (
    <Card className="border-border/70">
      <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <FileArchive
          aria-hidden="true"
          className="size-9 text-muted-foreground"
        />

        <h3 className="mt-4 text-lg font-semibold">
          No documents have been uploaded
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Upload a document and assign it to a portal account to make it
          available to that client.
        </p>

        <Button asChild className="mt-6">
          <Link href={"/admin/documents/new" as Route}>
            <Plus aria-hidden="true" className="mr-2 size-4" />
            Upload first document
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function DocumentsErrorState() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Client documents
      </h1>

      <Card className="border-destructive/30">
        <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
          <AlertCircle
            aria-hidden="true"
            className="size-8 text-destructive"
          />

          <h2 className="mt-4 text-lg font-semibold">
            Documents unavailable
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The document records could not be loaded. Verify your database and
            Storage policies.
          </p>

          <Button asChild variant="outline" className="mt-6">
            <Link href={"/admin" as Route}>Return to admin dashboard</Link>
          </Button>
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
    redirect("/login?redirectTo=/admin/documents");
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

function formatFileSize(value: number | null) {
  if (!value || value <= 0) {
    return "Size unavailable";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}