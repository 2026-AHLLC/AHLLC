import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500",

        secondary:
          "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",

        outline:
          "border border-zinc-700 bg-transparent hover:bg-zinc-900",

        ghost:
          "hover:bg-zinc-900 hover:text-white",

        destructive:
          "bg-red-600 text-white hover:bg-red-500",

        success:
          "bg-emerald-600 text-white hover:bg-emerald-500",

        gradient:
          "bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white shadow-xl hover:opacity-95",

        link:
          "text-blue-400 underline-offset-4 hover:underline",
      },

      size: {
        sm: "h-9 px-4",

        default: "h-11 px-6",

        lg: "h-14 px-8 text-base",

        xl: "h-16 px-10 text-lg",

        icon: "h-11 w-11 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
          }),
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
