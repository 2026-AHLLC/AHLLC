import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-zinc-700 bg-zinc-800 text-zinc-100",

        secondary:
          "border-zinc-600 bg-zinc-900 text-zinc-300",

        outline:
          "border-zinc-600 bg-transparent text-zinc-200",

        success:
          "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",

        warning:
          "border-amber-500/40 bg-amber-500/15 text-amber-400",

        destructive:
          "border-red-500/40 bg-red-500/15 text-red-400",

        info:
          "border-blue-500/40 bg-blue-500/15 text-blue-400",

        purple:
          "border-violet-500/40 bg-violet-500/15 text-violet-400",

        gradient:
          "border-transparent bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white",

        featured:
          "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",

        ai:
          "border-cyan-400/40 bg-cyan-500/15 text-cyan-300",

        new:
          "border-green-500/40 bg-green-500/15 text-green-300",

        live:
          "border-red-500/40 bg-red-500/15 text-red-300 animate-pulse",
      },

      size: {
        sm: "px-2 py-0.5 text-[10px]",

        default: "px-3 py-1 text-xs",

        lg: "px-4 py-1.5 text-sm",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant,
  size,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
