// app/actions/auth.ts

"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type AuthState = {
  error?: string;
} | null;

function getString(
  formData: FormData,
  key: string,
) {
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function isValidRedirect(
  value: string,
) {
  return (
    value.startsWith("/") &&
    !value.startsWith("//")
  );
}


export async function login(
  _state: AuthState,
  formData: FormData,
) {
  const supabase = await createClient();

  const email = getString(
    formData,
    "email",
  );

  const password = getString(
    formData,
    "password",
  );

  const redirectTo =
    getString(
      formData,
      "redirectTo",
    ) || "/dashboard";


  if (!email || !password) {
    return {
      error:
        "Email and password are required.",
    };
  }


  const {
    error: loginError,
  } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });


  if (loginError) {
    console.error(
      "Login failed:",
      loginError,
    );

    return {
      error:
        "Invalid email or password.",
    };
  }


  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();


  if (!user) {
    return {
      error:
        "Unable to load user account.",
    };
  }


  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select(
        `
        role,
        is_active
        `,
      )
      .eq(
        "id",
        user.id,
      )
      .maybeSingle();


  if (profileError) {
    console.error(
      "Profile lookup failed:",
      profileError,
    );

    await supabase.auth.signOut();

    return {
      error:
        "Unable to load account profile.",
    };
  }


  if (
    profile?.is_active === false
  ) {
    await supabase.auth.signOut();

    redirect(
      "/login?disabled=1" as Route,
    );
  }


  if (
    profile?.role === "admin"
  ) {
    redirect(
      "/admin" as Route,
    );
  }


  if (
    isValidRedirect(
      redirectTo,
    )
  ) {
    redirect(
      redirectTo as Route,
    );
  }


  redirect(
    "/dashboard" as Route,
  );
}


export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect(
    "/login" as Route,
  );
}