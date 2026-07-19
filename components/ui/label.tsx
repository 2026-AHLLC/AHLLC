"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-zinc-100",

        muted: "text-zinc-400",

        primary: "text-blue-400",

        success: "text-emerald-400",

        warning: "text-amber-400",

        destructive: "text-red-400",
      },

      size: {
        sm: "text-xs",

        default: "text-sm",

        lg: "text-base",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<
      typeof LabelPrimitive.Root
    >,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(
  (
    {
      className,
      variant,
      size,
      ...props
    },
    ref
  ) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  )
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
