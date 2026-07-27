"use client";

import { FormEvent, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
        },
      );

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setIsEmailSent(true);
    } catch (error) {
      console.error("Password reset request error:", error);

      setErrorMessage(
        "We could not send the password reset email. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isEmailSent) {
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

        <Card className="relative z-10 w-full max-w-md border-border/60 bg-card/95 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-5 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <CheckCircle2
                aria-hidden="true"
                className="size-7 text-primary"
              />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl">
                Check your email
              </CardTitle>

              <CardDescription className="text-sm leading-relaxed sm:text-base">
                If an AH LLC account exists for{" "}
                <span className="font-medium text-foreground">{email}</span>, a
                password reset link has been sent.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              Open the email and follow the secure link to create a new
              password. The email may take a few minutes to arrive.
            </p>

            <Button asChild className="h-11 w-full">
              <Link href={"/login" as Route}>Return to login</Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={() => {
                setIsEmailSent(false);
                setErrorMessage("");
              }}
            >
              Try another email
            </Button>
          </CardContent>

          <CardFooter className="justify-center border-t border-border/60 pt-6">
            <p className="text-center text-xs text-muted-foreground">
              Check your spam or junk folder if you do not see the message.
            </p>
          </CardFooter>
        </Card>
      </main>
    );
  }

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

      <Card className="relative z-10 w-full max-w-md border-border/60 bg-card/95 shadow-2xl backdrop-blur">
        <CardHeader className="space-y-4 text-center">
          <Link
            href={"/" as Route}
            className="mx-auto inline-flex items-center gap-3"
            aria-label="Return to AH LLC homepage"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
              <span className="text-sm font-bold tracking-tight">AH</span>
            </div>

            <span className="text-xl font-bold tracking-tight">AH LLC</span>
          </Link>

          <div className="space-y-2">
            <CardTitle className="text-2xl sm:text-3xl">
              Reset your password
            </CardTitle>

            <CardDescription className="text-sm leading-relaxed sm:text-base">
              Enter the email address associated with your AH LLC account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {errorMessage ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {errorMessage}
              </div>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    aria-hidden="true"
                    className="mr-2 size-4 animate-spin"
                  />
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-border/60 pt-6">
          <Link
            href={"/login" as Route}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to login
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            For security, AH LLC does not reveal whether an email address is
            registered.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}