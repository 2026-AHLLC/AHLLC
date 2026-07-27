"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  success: boolean;
  message: string;
};

const DEFAULT_LOGIN_REDIRECT = "/dashboard";
const MINIMUM_PASSWORD_LENGTH = 8;

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getSafeRedirectPath(
  value: string,
  fallback = DEFAULT_LOGIN_REDIRECT,
) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

/**
 * Signs an existing user into AH LLC using email and password.
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

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

/**
 * Signs the current user out and returns them to the login page.
 */
export async function logout() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase logout error:", error.message);
    }
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

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    origin ||
    "http://localhost:3000";

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

  /*
   * Keep this response generic so the application does not reveal
   * whether a particular email address is registered.
   */
  return {
    success: true,
    message:
      "If an account exists for that email address, a password reset link has been sent.",
  };
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

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Supabase password-update error:", error.message);

    return {
      success: false,
      message:
        "We could not update your password. Please request a new reset link and try again.",
    };
  }

  /*
   * Close the temporary recovery session. The user will sign in again
   * with the newly created password.
   */
  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Your password has been updated successfully.",
  };
}