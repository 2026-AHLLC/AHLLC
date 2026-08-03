import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";

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

import { sendClientOnboardingEmail } from "@/lib/email/client-onboarding";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create Client | AH LLC Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function createClientAccount(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user: adminUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !adminUser) {
    redirect("/login?redirectTo=/admin/clients/new");
  }

  const fullName = getString(formData, "full_name");
  const companyName = getString(formData, "company_name");
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!fullName || !email || !password) {
    redirect(
      "/admin/clients/new?error=Missing required fields" as Route,
    );
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile) {
    redirect(
      "/admin/clients/new?error=Client already exists" as Route,
    );
  }

  const {
    data: createdUser,
    error: createUserError,
  } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

  if (createUserError || !createdUser.user) {
    console.error(
      "Unable to create client auth user:",
      createUserError,
    );

    redirect(
      `/admin/clients/new?error=${encodeURIComponent(
        createUserError?.message ||
          "Unable to create account",
      )}` as Route,
    );
  }

  const clientId = createdUser.user.id;

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: clientId,
      full_name: fullName,
      company_name: companyName || null,
      email,
      role: "client",
    });

  if (profileError) {
    console.error(
      "Unable to create client profile:",
      profileError,
    );

    redirect(
      `/admin/clients/new?error=${encodeURIComponent(
        profileError.message,
      )}` as Route,
    );
  }

  try {
    await sendClientOnboardingEmail({
      clientName: companyName || fullName,
      clientEmail: email,
      temporaryPassword: password,
    });
  } catch (emailError) {
    console.error(
      "Client created but onboarding email failed:",
      emailError,
    );
  }

  redirect("/admin/clients?created=1");
}

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost">
          <Link href="/admin/clients">
            <ArrowLeft className="mr-2 size-4" />
            Back to clients
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl border-border/70">
        <CardHeader>
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
            <UserPlus className="size-6 text-primary" />
          </div>

          <CardTitle>Create Client Account</CardTitle>

          <CardDescription>
            Create a secure AH LLC client portal account and send a
            welcome email automatically.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {params.error ? (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {params.error}
            </div>
          ) : null}

          <form action={createClientAccount} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full name
              </Label>

              <Input
                id="full_name"
                name="full_name"
                placeholder="John Smith"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">
                Company name
              </Label>

              <Input
                id="company_name"
                name="company_name"
                placeholder="Example Company LLC"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email address
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="client@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Temporary password
              </Label>

              <Input
                id="password"
                name="password"
                type="text"
                placeholder="Generate secure password"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 size-4" />
              Create Client Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function getString(
  formData: FormData,
  key: string,
) {
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}