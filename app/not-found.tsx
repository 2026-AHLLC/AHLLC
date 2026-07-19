import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="text-center">
        <h1 className="text-8xl font-black text-white">
          404
        </h1>

        <h2 className="mt-6 text-3xl font-bold text-white">
          Page Not Found
        </h2>

        <p className="mt-4 text-zinc-400">
          The page you're looking for doesn't exist.
        </p>

        <Button asChild className="mt-8">
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
