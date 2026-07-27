"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";

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

const MINIMUM_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  const [sessionError, setSessionError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function verifyRecoverySession() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        if (error || !user) {
          setSessionError(
            "Your password reset link is invalid or has expired. Request a new link to continue.",
          );
        }
      } catch (error) {
        console.error("Password recovery session error:", error);

        if (isMounted) {
          setSessionError(
            "We could not verify your password reset session. Request a new reset link.",
          );
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    void verifyRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      setFormError(
        `Your password must contain at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
      );
      return;
    }

    if (password !== confirmPassword) {
      setFormError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      setIsPasswordUpdated(true);

      // End the temporary recovery session so the user signs in
      // again using the new password.
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Password update error:", error);

      setFormError(
        "We could not update your password. Please try again or request a new reset link.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_45%)]"
        />

        <Card className="relative z-10 w-full max-w-md border-border/60 bg-card/95 shadow-2xl backdrop-blur">
          <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 py-12 text-center">
            <Loader2
              aria-hidden="true"
              className="size-8 animate-spin text-primary"
            />

            <div className="space-y-1">
              <p className="font-medium">Verifying reset link</p>

              <p className="text-sm text-muted-foreground">
                Please wait while we secure your password-reset session.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isPasswordUpdated) {
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
                Password updated
              </CardTitle>

              <CardDescription className="text-sm leading-relaxed sm:text-base">
                Your AH LLC account password has been changed successfully.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Button
              type="button"
              className="h-11 w-full"
              onClick={() => router.replace("/login" as Route)}
            >
              Sign in with your new password
            </Button>
          </CardContent>

          <CardFooter className="justify-center border-t border-border/60 pt-6">
            <p className="text-center text-xs text-muted-foreground">
              Your password-recovery session has been securely closed.
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
              Create a new password
            </CardTitle>

            <CardDescription className="text-sm leading-relaxed sm:text-base">
              Enter a secure new password for your AH LLC account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {sessionError ? (
            <div className="space-y-5">
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive"
              >
                {sessionError}
              </div>

              <Button asChild className="h-11 w-full">
                <Link href={"/forgot-password" as Route}>
                  Request a new reset link
                </Link>
              </Button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>

                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 px-10"
                    minLength={MINIMUM_PASSWORD_LENGTH}
                    required
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="size-4" />
                    ) : (
                      <Eye aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Use at least {MINIMUM_PASSWORD_LENGTH} characters.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Confirm new password
                </Label>

                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />

                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmation ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter the password again"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    className="h-11 px-10"
                    minLength={MINIMUM_PASSWORD_LENGTH}
                    required
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmation((current) => !current)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={
                      showConfirmation
                        ? "Hide password confirmation"
                        : "Show password confirmation"
                    }
                    disabled={isSubmitting}
                  >
                    {showConfirmation ? (
                      <EyeOff aria-hidden="true" className="size-4" />
                    ) : (
                      <Eye aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {formError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive"
                >
                  {formError}
                </div>
              ) : null}

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={
                  isSubmitting ||
                  password.length < MINIMUM_PASSWORD_LENGTH ||
                  !confirmPassword
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      aria-hidden="true"
                      className="mr-2 size-4 animate-spin"
                    />
                    Updating password...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t border-border/60 pt-6">
          <Link
            href={"/login" as Route}
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Return to login
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}