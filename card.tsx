import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "border-zinc-800 bg-zinc-900/60 shadow-lg",

        glass:
          "border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl",

        outline:
          "border-zinc-700 bg-transparent",

        elevated:
          "border-zinc-800 bg-zinc-900 shadow-xl hover:-translate-y-1 hover:shadow-2xl",

        gradient:
          "border-transparent bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-cyan-500/10 backdrop-blur-xl",

        feature:
          "border-zinc-800 bg-zinc-900 hover:border-blue-500/40 hover:shadow-blue-600/10 hover:shadow-xl",

        pricing:
          "border-zinc-800 bg-zinc-900 hover:border-blue-500",

        testimonial:
          "border-zinc-800 bg-zinc-900/80",

        dashboard:
          "border-white/10 bg-white/[0.03] backdrop-blur-xl",
      },

      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },

    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({
          variant,
          padding,
        }),
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2",
      className
    )}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold tracking-tight text-white",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm leading-7 text-zinc-400",
      className
    )}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-6", className)}
    {...props}
  />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-8 flex items-center",
      className
    )}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
