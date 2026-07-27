"use client";

import { useFormStatus } from "react-dom";
import { Loader2, LogOut } from "lucide-react";

import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
};

export function LogoutButton({
  variant = "ghost",
  size = "icon",
  showLabel = false,
  className,
}: LogoutButtonProps) {
  return (
    <form action={logout}>
      <LogoutSubmitButton
        variant={variant}
        size={size}
        showLabel={showLabel}
        className={className}
      />
    </form>
  );
}

function LogoutSubmitButton({
  variant,
  size,
  showLabel,
  className,
}: Required<
  Pick<LogoutButtonProps, "variant" | "size" | "showLabel">
> &
  Pick<LogoutButtonProps, "className">) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
      aria-label={pending ? "Signing out" : "Sign out"}
      title={pending ? "Signing out" : "Sign out"}
    >
      {pending ? (
        <Loader2
          aria-hidden="true"
          className="size-4 animate-spin"
        />
      ) : (
        <LogOut aria-hidden="true" className="size-4" />
      )}

      {showLabel ? (
        <span>{pending ? "Signing out..." : "Sign out"}</span>
      ) : null}
    </Button>
  );
}