import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing Supabase environment variables.",
        hasUrl: Boolean(supabaseUrl),
        hasServiceRoleKey: Boolean(supabaseKey),
      },
      { status: 500 },
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("audit_leads")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase test failed:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase is connected and audit_leads is accessible.",
      rowsReturned: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Unexpected Supabase test error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Supabase connection error.",
      },
      { status: 500 },
    );
  }
}