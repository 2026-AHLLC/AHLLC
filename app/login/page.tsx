import type { Metadata, Route } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Client Login | AH LLC",
  description:
    "Sign in to the secure AH LLC client portal to access projects, documents, consultations, and support.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_45%)]"
      />

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <Card className="relative z-10 w-full max-w-md border-border/60 bg-card/95 shadow-2xl backdrop-blur">
        <CardHeader className="space-y-5 text-center">
          <Link
            href={"/" as Route}
            className="mx-auto inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Return to the AH LLC homepage"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
              <span className="text-sm font-bold tracking-tight">AH</span>
            </div>

            <div className="text-left">
              <span className="block text-xl font-bold leading-none tracking-tight">
                AH LLC
              </span>

              <span className="mt-1 block text-xs text-muted-foreground">
                Client Portal
              </span>
            </div>
          </Link>

          <div className="space-y-2">
            <CardTitle className="text-2xl tracking-tight sm:text-3xl">
              Welcome back
            </CardTitle>

            <CardDescription className="text-sm leading-relaxed sm:text-base">
              Sign in to access your projects, documents, consultations, and
              support.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-border/60 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need access to the client portal?{" "}
            <Link
              href={"/contact" as Route}
              className="font-medium text-foreground underline-offset-4 transition hover:text-primary hover:underline"
            >
              Contact AH LLC
            </Link>
          </p>

          <p className="text-xs leading-relaxed text-muted-foreground">
            This portal is restricted to authorized AH LLC clients and
            administrators.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}