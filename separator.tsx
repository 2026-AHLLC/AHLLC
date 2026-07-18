"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const separatorVariants = cva(
  "shrink-0",
  {
    variants: {
      variant: {
        default: "bg-zinc-800",

        subtle: "bg-white/5",

        muted: "bg-white/10",

        strong: "bg-white/20",

        primary: "bg-blue-500/40",

        gradient:
          "bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500",
      },

      orientation: {
        horizontal: "h-px w-full",

        vertical: "h-full w-px",
      },
    },

    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
    },
  }
);

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<
      typeof SeparatorPrimitive.Root
    >,
    VariantProps<typeof separatorVariants> {}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      variant,
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({
          orientation,
          variant,
        }),
        className
      )}
      {...props}
    />
  )
);

Separator.displayName =
  SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };
