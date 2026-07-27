"use client";

import { useActionState, useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  login,
  type AuthActionState,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

function getSafeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export function LoginForm() {
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(
    login,
    initialState,
  );

  const redirectTo = getSafeRedirectPath(
    searchParams.get("redirectTo"),
  );

  const callbackError = searchParams.get("error");

  useEffect(() => {
    if (!state.message && !callbackError) {
      return;
    }

    const firstInvalidField = document.querySelector<
      HTMLInputElement
    >('[aria-invalid="true"]');

    firstInvalidField?.focus();
  }, [state.message, callbackError]);

  const errorMessage = state.message || callbackError || "";

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="redirectTo"
        value={redirectTo}
      />

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
            inputMode="email"
            placeholder="you@example.com"
            className="h-11 pl-10"
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={
              errorMessage ? "login-error" : undefined
            }
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Password</Label>

          <Link
            href={"/forgot-password" as Route}
            className="text-sm font-medium text-primary underline-offset-4 transition hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-11 px-10"
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={
              errorMessage ? "login-error" : undefined
            }
            required
            disabled={isPending}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            aria-pressed={showPassword}
            disabled={isPending}
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div
          id="login-error"
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <span>{errorMessage}</span>
        </div>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2
              aria-hidden="true"
              className="mr-2 size-4 animate-spin"
            />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}