import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  AlertCircle,
  Download,
  FileArchive,
  FileText,
  FolderOpen,
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
  title: "Documents | AH LLC Client Portal",
  description:
    "Access reports, project files, agreements, invoices, and deliverables.",
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
  project_id: string | null;
  title: string;
  description: string | null;
  category: DocumentCategory;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
};

type Project = {
  id: string;
  title: string;
};

type SignedDocument = ClientDocument & {
  projectTitle: string | null;
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

export default async function DashboardDocumentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <DocumentsErrorState message="We could not verify your client account." />
    );
  }

  const { data, error } = await supabase
    .from("client_documents")
    .select(
      `
        id,
        project_id,
        title,
        description,
        category,
        file_path,
        file_name,
        mime_type,
        file_size,
        created_at
      `,
    )
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load client documents:", error);

    return (
      <DocumentsErrorState message="We could not load your documents. Please try again later." />
    );
  }

  const documents = (data ?? []) as ClientDocument[];

  const projectIds = Array.from(
    new Set(
      documents
        .map((document) => document.project_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  let projects: Project[] = [];

  if (projectIds.length > 0) {
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id, title")
      .in("id", projectIds);

    if (projectError) {
      console.error(
        "Unable to load document project names:",
        projectError,
      );
    } else {
      projects = (projectData ?? []) as Project[];
    }
  }

  const projectMap = new Map(
    projects.map((project) => [project.id, project.title]),
  );

  const signedDocuments: SignedDocument[] = await Promise.all(
    documents.map(async (document) => {
      const { data: signedData, error: signedError } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(document.file_path, 60 * 10);

      if (signedError) {
        console.error(
          `Unable to create signed URL for ${document.id}:`,
          signedError,
        );
      }

      return {
        ...document,
        projectTitle: document.project_id
          ? projectMap.get(document.project_id) ?? null
          : null,
        signedUrl: signedData?.signedUrl ?? null,
      };
    }),
  );

  const reportCount = documents.filter(
    (document) => document.category === "report",
  ).length;

  const projectFileCount = documents.filter(
    (document) => document.category === "project_file",
  ).length;

  const businessDocumentCount = documents.filter((document) =>
    ["invoice", "proposal", "agreement"].includes(document.category),
  ).length;

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <FileText aria-hidden="true" className="size-3.5" />
          Secure file access
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Access reports, project deliverables, proposals, invoices, agreements,
          and other files shared with your account.
        </p>
      </section>

      <section
        aria-label="Document summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="All documents"
          value={documents.length}
          description="Files available to you"
          icon={FileText}
        />

        <SummaryCard
          title="Reports"
          value={reportCount}
          description="Audits and reports"
          icon={FileText}
        />

        <SummaryCard
          title="Project files"
          value={projectFileCount}
          description="Files and deliverables"
          icon={FolderOpen}
        />

        <SummaryCard
          title="Business documents"
          value={businessDocumentCount}
          description="Invoices and agreements"
          icon={FileArchive}
        />
      </section>

      <section aria-labelledby="available-documents-heading">
        <div className="mb-4">
          <h2
            id="available-documents-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Available documents
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Secure files shared with your AH LLC account.
          </p>
        </div>

        {signedDocuments.length === 0 ? (
          <EmptyDocumentsState />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {signedDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DocumentCard({
  document,
}: {
  document: SignedDocument;
}) {
  return (
    <Card className="flex h-full flex-col border-border/70">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
              <FileText aria-hidden="true" className="size-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="line-clamp-2 text-base leading-snug">
                {document.title}
              </CardTitle>

              <CardDescription className="mt-1 truncate">
                {document.file_name}
              </CardDescription>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium">
            {categoryLabels[document.category]}
          </span>
        </div>

        {document.description ? (
          <CardDescription className="line-clamp-3 leading-relaxed">
            {document.description}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="mt-auto space-y-5">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {document.projectTitle ? (
            <span>{document.projectTitle}</span>
          ) : null}

          <span>{formatFileSize(document.file_size)}</span>
          <span>Added {formatDate(document.created_at)}</span>
        </div>

        {document.signedUrl ? (
          <Button asChild className="w-full">
            <a
              href={document.signedUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Download aria-hidden="true" className="mr-2 size-4" />
              Download document
            </a>
          </Button>
        ) : (
          <Button className="w-full" disabled>
            Download unavailable
          </Button>
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
          No documents are available
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Files uploaded by AH LLC will appear here with secure download
          access.
        </p>

        <Button asChild variant="outline" className="mt-6">
          <Link href={"/dashboard/support" as Route}>
            Request a document
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function DocumentsErrorState({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Documents</h1>

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