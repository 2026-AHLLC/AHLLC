import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FileText,
  FolderKanban,
  Gauge,
  Home,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";

import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
};

const navigation = [
  {
    title: "Overview",
    href: "/admin",
    icon: Gauge,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FileText,
  },
] as const;

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?redirectTo=/admin");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, company_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Unable to load administrator profile:", profileError);
    redirect("/dashboard");
  }

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const metadataFullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  const displayName =
    profile.full_name?.trim() ||
    metadataFullName ||
    user.email?.split("@")[0] ||
    "Administrator";

  const organizationName =
    profile.company_name?.trim() || "AH LLC";

  const initials = getInitials(displayName, user.email);

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-5">
            <Link
              href={"/admin" as Route}
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="AH LLC administration dashboard"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </div>

              <div className="hidden min-w-0 sm:block">
                <p className="truncate font-bold leading-none tracking-tight">
                  {organizationName}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Administration
                </p>
              </div>
            </Link>

            <div className="hidden h-6 w-px bg-border lg:block" />

            <p className="hidden truncate text-sm text-muted-foreground lg:block">
              Manage clients, projects, documents, and portal activity
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
            >
              <Link href={"/dashboard" as Route}>
                <Home aria-hidden="true" className="mr-2 size-4" />
                Client dashboard
              </Link>
            </Button>

            <div className="hidden max-w-56 text-right sm:block">
              <p className="truncate text-sm font-medium">{displayName}</p>

              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>

            <div
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold"
            >
              {initials}
            </div>

            <form action={logout}>
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
              aria-label="Admin navigation"
              className="flex-1 space-y-1 p-4"
            >
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border/70 p-4">
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />

                  <p className="text-sm font-semibold">
                    Administrator access
                  </p>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Changes made here can affect projects, files, and information
                  shown in client portals.
                </p>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                >
                  <Link href={"/dashboard" as Route}>
                    <Home aria-hidden="true" className="mr-2 size-4" />
                    View client portal
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <nav
            aria-label="Mobile admin navigation"
            className="overflow-x-auto border-b border-border/70 bg-background px-4 lg:hidden"
          >
            <div className="flex min-w-max gap-1 py-2">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    {item.title}
                  </Link>
                );
              })}

              <Link
                href={"/dashboard" as Route}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Home aria-hidden="true" className="size-4 shrink-0" />
                Client portal
              </Link>
            </div>
          </nav>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string, email?: string) {
  const normalizedName = name.trim();

  if (normalizedName) {
    return normalizedName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }