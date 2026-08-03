"use client";

import { useState } from "react";
import type { Route } from "next";
import { Loader2, LogIn } from "lucide-react";

import { login } from "@/app/actions/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  redirectTo?: Route;
};

export function LoginForm({
  redirectTo = "/dashboard",
}: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setPending(true);

    const formData = new FormData(
      event.currentTarget,
    );

    formData.set(
      "redirectTo",
      redirectTo,
    );

    try {
      const result = await login(
        null,
        formData,
      );

      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error,
      );

      setError(
        "Unable to sign in. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">
          Email address
        </Label>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>

        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2
              aria-hidden="true"
              className="mr-2 size-4 animate-spin"
            />
            Signing in...
          </>
        ) : (
          <>
            <LogIn
              aria-hidden="true"
              className="mr-2 size-4"
            />
            Sign in
          </>
        )}
      </Button>
    </form>
  );
}