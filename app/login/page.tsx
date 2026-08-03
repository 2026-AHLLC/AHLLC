import type { Metadata, Route } from "next";
import Link from "next/link";
import { AlertCircle, LockKeyhole } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login | AH LLC Client Portal",
  description:
    "Secure login for AH LLC clients and administrators.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    disabled?: string;
    error?: string;
    redirectTo?: string;
    message?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  const redirectTo =
    params.redirectTo || "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">

      <Card className="w-full max-w-md border-border/70 shadow-lg">

        <CardHeader className="space-y-4 text-center">

          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
            <LockKeyhole
              aria-hidden="true"
              className="size-7 text-primary"
            />
          </div>


          <div>
            <CardTitle className="text-2xl">
              AH LLC Portal
            </CardTitle>

            <CardDescription className="mt-2">
              Sign in to access your projects,
              documents, and support.
            </CardDescription>
          </div>

        </CardHeader>


        <CardContent className="space-y-5">

          {params.disabled === "1" ? (
            <div
              role="alert"
              className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            >
              <AlertCircle
                aria-hidden="true"
                className="size-5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Account access disabled
                </p>

                <p className="mt-1">
                  Your portal access has been temporarily
                  suspended. Please contact AH LLC for
                  assistance.
                </p>
              </div>
            </div>
          ) : null}


          {params.error === "profile" ? (
            <div
              role="alert"
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200"
            >
              Your account profile could not be loaded.
              Please contact AH LLC support.
            </div>
          ) : null}


          {params.error &&
          params.error !== "profile" &&
          params.disabled !== "1" ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            >
              Unable to sign in. Please check your
              credentials and try again.
            </div>
          ) : null}


          {params.message ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {params.message}
            </div>
          ) : null}


          <LoginForm
            redirectTo={redirectTo as Route}
          />


          <div className="space-y-3 text-center text-sm">

            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>


            <p className="text-muted-foreground">
              Need help accessing your account?
            </p>


            <Link
              href="/contact"
              className="text-primary hover:underline"
            >
              Contact AH LLC Support
            </Link>

          </div>

        </CardContent>

      </Card>

    </main>
  );
}