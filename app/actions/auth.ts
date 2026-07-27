"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  success: boolean;
  message: string;
};

const DEFAULT_LOGIN_REDIRECT: Route = "/dashboard";
const MINIMUM_PASSWORD_LENGTH = 8;

function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getSafeRedirectPath(
  value: string,
  fallback: Route = DEFAULT_LOGIN_REDIRECT,
): Route {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value as Route;
}

/**
 * Signs an existing user in with an email address and password.
 */
export async function login(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");
  const requestedRedirect = getFormValue(formData, "redirectTo");
  const redirectTo = getSafeRedirectPath(requestedRedirect);

  if (!email || !password) {
    return {
      success: false,
      message: "Enter your email address and password.",
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error.message);

      return {
        success: false,
        message:
          error.message === "Invalid login credentials"
            ? "The email address or password is incorrect."
            : "We could not sign you in. Please try again.",
      };
    }
  } catch (error) {
    console.error("Login action error:", error);

    return {
      success: false,
      message:
        "We could not connect to the authentication service. Please try again.",
    };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

/**
 * Signs the current user out and returns them to the login page.
 */
export async function logout(): Promise<never> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase logout error:", error.message);
    }
  } catch (error) {
    console.error("Logout action error:", error);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Sends a password-recovery email.
 */
export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email").toLowerCase();

  if (!email) {
    return {
      success: false,
      message: "Enter the email address associated with your account.",
    };
  }

  try {
    const requestHeaders = await headers();

    const origin =
      requestHeaders.get("origin") ??
      requestHeaders.get("x-forwarded-host") ??
      requestHeaders.get("host");

    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

    if (!siteUrl && origin) {
      const protocol =
        requestHeaders.get("x-forwarded-proto") ??
        (origin.includes("localhost") ? "http" : "https");

      siteUrl = origin.startsWith("http")
        ? origin.replace(/\/$/, "")
        : `${protocol}://${origin}`.replace(/\/$/, "");
    }

    siteUrl ??= "http://localhost:3000";

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    });

    if (error) {
      console.error("Supabase password-reset error:", error.message);

      return {
        success: false,
        message:
          "We could not send the password reset email. Please try again.",
      };
    }

    return {
      success: true,
      message:
        "If an account exists for that email address, a password reset link has been sent.",
    };
  } catch (error) {
    console.error("Password-reset action error:", error);

    return {
      success: false,
      message:
        "We could not send the password reset email. Please try again.",
    };
  }
}

/**
 * Updates the password for a user with an active recovery session.
 */
export async function updatePassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");

  if (password.length < MINIMUM_PASSWORD_LENGTH) {
    return {
      success: false,
      message: `Your password must contain at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "The passwords do not match.",
    };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message:
          "Your password reset session is invalid or has expired. Request a new reset link.",
      };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      console.error(
        "Supabase password-update error:",
        updateError.message,
      );

      return {
        success: false,
        message:
          "We could not update your password. Please request a new reset link and try again.",
      };
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error(
        "Supabase recovery-session sign-out error:",
        signOutError.message,
      );
    }
  } catch (error) {
    console.error("Password-update action error:", error);

    return {
      success: false,
      message:
        "We could not update your password. Please request a new reset link and try again.",
    };
  }

  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Your password has been updated successfully.",
  };
}