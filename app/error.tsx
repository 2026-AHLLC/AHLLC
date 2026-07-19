"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-lg text-center">
        <h1 className="mb-4 text-5xl font-bold text-white">
          Something went wrong
        </h1>

        <p className="mb-8 text-zinc-400">
          An unexpected error occurred while loading this page.
        </p>

        <Button onClick={reset}>
          Try Again
        </Button>
      </div>
    </main>
  );
}
