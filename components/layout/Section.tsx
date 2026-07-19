import * as React from "react";

import { cn } from "@/lib/utils";
import Container from "@/components/layout/Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  container?: boolean;
  containerClassName?: string;
  as?: React.ElementType;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "none" | "default" | "muted" | "gradient";
}

const spacingClasses = {
  none: "",
  sm: "py-12",
  md: "py-20",
  lg: "py-28",
  xl: "py-36",
};

const backgroundClasses = {
  none: "",
  default: "bg-zinc-950",
  muted: "bg-zinc-900/40",
  gradient:
    "bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950",
};

export default function Section({
  as: Component = "section",
  id,
  className,
  children,
  container = true,
  containerClassName,
  spacing = "lg",
  background = "none",
  ...props
}: SectionProps) {
  return (
    <Component
      id={id}
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
      {...props}
    >
      {container ? (
        <Container className={containerClassName}>
          {children}
        </Container>
      ) : (
        children
      )}
    </Component>
  );
}