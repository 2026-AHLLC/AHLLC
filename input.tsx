import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full rounded-xl border bg-zinc-900/70 px-4 py-2 text-sm text-white",
          "placeholder:text-zinc-500",
          "transition-all duration-200",
          "outline-none",
          "focus:border-blue-500",
          "focus:ring-2 focus:ring-blue-500/20",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",

          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-zinc-700",

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
