import type { Metadata, Route } from "next";
import Link from "next/link";
import {
  CircleUserRound,
  KeyRound,
  Mail,
  ShieldCheck,
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
  title: "Settings | AH LLC Client Portal",
  description: "Review your AH LLC client portal account settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user?.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  const email = user?.email ?? "";

  const accountCreated = user?.created_at
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(user.created_at))
    : "Unavailable";

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <CircleUserRound aria-hidden="true" className="size-3.5" />
          Account settings
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Review your account information, security settings, and client portal
          access.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound aria-hidden="true" className="size-5" />
              Profile information
            </CardTitle>

            <CardDescription>
              Information currently associated with your Supabase account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full name</Label>

              <Input
                id="full-name"
                value={fullName}
                placeholder="No full name has been added"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-email">Email address</Label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="account-email"
                  type="email"
                  value={email}
                  className="pl-10"
                  readOnly
                />
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Profile editing will become available after the client profiles
              table and update action are connected.
            </p>

            <Button asChild variant="outline">
              <Link href={"/dashboard/support" as Route}>
                Request a profile update
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck aria-hidden="true" className="size-5" />
                Account security
              </CardTitle>

              <CardDescription>
                Your dashboard is protected by Supabase authentication.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={"/forgot-password" as Route}>
                  <KeyRound aria-hidden="true" className="mr-2 size-4" />
                  Change password
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Account details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
                <span className="text-muted-foreground">Account type</span>
                <span className="font-medium">Client</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Created</span>
                <span className="text-right font-medium">
                  {accountCreated}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}