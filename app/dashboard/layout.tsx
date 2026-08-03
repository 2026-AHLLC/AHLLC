import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Client Dashboard | AH LLC",
  description:
    "Manage your AH LLC projects, documents, consultations, and support requests.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select(
        `
        role,
        is_active
        `,
      )
      .eq("id", user.id)
      .maybeSingle();

  if (profileError || !profile) {
    console.error(
      "Unable to load dashboard profile:",
      profileError,
    );

    redirect("/login?error=profile");
  }

  if (profile.is_active === false) {
    await supabase.auth.signOut();

    redirect("/login?disabled=1");
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}