import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl" />

          {/* Spinner */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 backdrop-blur-xl">
            <LoaderCircle className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            AH LLC
          </h2>

          <p className="text-zinc-400">
            Preparing your AI experience...
          </p>
        </div>

        {/* Animated loading dots */}
        <div className="flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
        </div>
      </div>
    </main>
  );
}
