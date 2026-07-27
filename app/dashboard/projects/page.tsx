import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FolderKanban,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Projects | AH LLC Client Portal",
  description: "View and track your active AH LLC projects.",
  robots: {
    index: false,
    follow: false,
  },
};

const projectSummary = [
  {
    title: "Active",
    value: "0",
    description: "Projects currently underway",
    icon: CircleDashed,
  },
  {
    title: "Waiting on you",
    value: "0",
    description: "Items requiring your input",
    icon: Clock3,
  },
  {
    title: "Completed",
    value: "0",
    description: "Finished AH LLC projects",
    icon: CheckCircle2,
  },
] as const;

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <FolderKanban aria-hidden="true" className="size-3.5" />
            Client projects
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Review project progress, upcoming milestones, requested materials,
            and recent updates from AH LLC.
          </p>
        </div>

        <Button asChild>
          <Link href={"/contact" as Route}>
            <Plus aria-hidden="true" className="mr-2 size-4" />
            Start a project
          </Link>
        </Button>
      </section>

      <section
        aria-label="Project summary"
        className="grid gap-4 md:grid-cols-3"
      >
        {projectSummary.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="border-border/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>

                <Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold tracking-tight">{item.value}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section aria-labelledby="active-projects-heading">
        <div className="mb-4">
          <h2
            id="active-projects-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Your projects
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Projects assigned to your AH LLC account will appear here.
          </p>
        </div>

        <Card className="border-border/70">
          <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted/50">
              <FolderKanban
                aria-hidden="true"
                className="size-7 text-muted-foreground"
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No projects have been added
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              When AH LLC creates or assigns a project to your account, its
              progress, timeline, deliverables, and updates will appear here.
            </p>

            <Button asChild variant="outline" className="mt-6">
              <Link href={"/contact" as Route}>
                Discuss a new project
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}