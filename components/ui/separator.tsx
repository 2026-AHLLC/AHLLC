"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const separatorVariants = cva("", {
  variants: {
    variant: {
      default: "bg-border",
      subtle: "bg-zinc-800",
      muted: "bg-zinc-700",
      strong: "bg-zinc-600",
      primary: "bg-blue-500",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      variant,
      orientation = "horizontal",
      decorative = true,
      ...props
    },
    ref
  ) => {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          orientation === "vertical"
            ? "h-full w-px shrink-0"
            : "h-px w-full shrink-0",
          separatorVariants({ variant }),
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };