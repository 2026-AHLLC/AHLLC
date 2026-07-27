import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  Download,
  FileArchive,
  FileText,
  FolderOpen,
  Search,
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

export const metadata: Metadata = {
  title: "Documents | AH LLC Client Portal",
  description:
    "Access your AH LLC reports, proposals, invoices, and deliverables.",
  robots: {
    index: false,
    follow: false,
  },
};

const documentCategories = [
  {
    title: "Reports",
    description: "Audits, analytics, SEO reports, and performance summaries.",
    count: 0,
    icon: FileText,
  },
  {
    title: "Project files",
    description: "Designs, content, source materials, and final deliverables.",
    count: 0,
    icon: FolderOpen,
  },
  {
    title: "Business documents",
    description: "Proposals, agreements, invoices, and account documents.",
    count: 0,
    icon: FileArchive,
  },
] as const;

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <FileText aria-hidden="true" className="size-3.5" />
          Secure file access
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Access reports, project deliverables, proposals, invoices, and other
          files shared with your AH LLC account.
        </p>
      </section>

      <section aria-label="Search documents">
        <Card className="border-border/70">
          <CardContent className="p-4 sm:p-5">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                type="search"
                placeholder="Search your documents..."
                className="h-11 pl-10"
                disabled
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Document search will become available when files are assigned to
              your account.
            </p>
          </CardContent>
        </Card>
      </section>

      <section
        aria-label="Document categories"
        className="grid gap-4 md:grid-cols-3"
      >
        {documentCategories.map((category) => {
          const Icon = category.icon;

          return (
            <Card key={category.title} className="border-border/70">
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-muted/50">
                  <Icon aria-hidden="true" className="size-5" />
                </div>

                <CardTitle className="flex items-center justify-between gap-3 text-base">
                  {category.title}

                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {category.count}
                  </span>
                </CardTitle>

                <CardDescription className="leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <section aria-labelledby="recent-documents-heading">
        <div className="mb-4">
          <h2
            id="recent-documents-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Recent documents
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The latest files shared with your account.
          </p>
        </div>

        <Card className="border-border/70">
          <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted/50">
              <Download
                aria-hidden="true"
                className="size-7 text-muted-foreground"
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No documents are available
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Files uploaded or shared by AH LLC will appear here with secure
              download access.
            </p>

            <Button asChild variant="outline" className="mt-6">
              <Link href={"/dashboard/support" as Route}>
                Request a document
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}