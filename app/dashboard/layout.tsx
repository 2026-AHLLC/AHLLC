import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  FileText,
  FolderKanban,
  Gauge,
  HelpCircle,
  LogOut,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type DashboardLayoutProps = {
  children: ReactNode;
};

const navigation = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Consultations",
    href: "/dashboard/consultations",
    icon: CalendarDays,
  },
  {
    title: "Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const displayName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "Client";

  const initials = getInitials(displayName, user.email);

  async function signOut() {
    "use server";

    const supabase = await createClient();

    await supabase.auth.signOut();

    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href={"/" as Route}
              className="inline-flex items-center gap-3"
              aria-label="AH LLC homepage"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
                <span className="text-sm font-bold tracking-tight">AH</span>
              </div>

              <div className="hidden sm:block">
                <p className="font-bold leading-none tracking-tight">AH LLC</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Client Portal
                </p>
              </div>
            </Link>

            <div className="hidden h-6 w-px bg-border lg:block" />

            <p className="hidden text-sm text-muted-foreground lg:block">
              AI • Automation • Growth
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-52 truncate text-sm font-medium">
                {displayName}
              </p>

              <p className="max-w-52 truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>

            <div
              className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold"
              aria-hidden="true"
            >
              {initials}
            </div>

            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut aria-hidden="true" className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-screen-2xl">
        <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-background lg:block">
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
            <nav
              aria-label="Dashboard navigation"
              className="flex-1 space-y-1 p-4"
            >
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border/70 p-4">
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                <p className="text-sm font-semibold">Need assistance?</p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Contact AH LLC for project support or account assistance.
                </p>

                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link href={"/contact" as Route}>Contact support</Link>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <nav
            aria-label="Mobile dashboard navigation"
            className="overflow-x-auto border-b border-border/70 bg-background px-4 lg:hidden"
          >
            <div className="flex min-w-max gap-1 py-2">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </nav>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string, email?: string) {
  if (name && name !== "Client") {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  return email?.charAt(0).toUpperCase() ?? "C";
}