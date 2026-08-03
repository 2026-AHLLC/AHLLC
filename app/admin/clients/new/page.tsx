// app/admin/clients/new/page.tsx

import type { Metadata, Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Resend } from "resend";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClient } from "@/lib/supabase/server";
import { sendClientOnboardingEmail } from "@/lib/email/client-onboarding";

export const metadata: Metadata = {
  title: "Create Client | AH LLC Admin",
  robots: {
    index: false,
    follow: false,
  },
};


async function createClientAccount(
  formData: FormData,
) {
  "use server";


  const supabase = await createClient();


  const {
    data: {
      user: adminUser,
    },
  } = await supabase.auth.getUser();


  if (!adminUser) {
    redirect("/login");
  }


  const fullName =
    getString(formData, "full_name");

  const companyName =
    getString(formData, "company_name");

  const email =
    getString(formData, "email");

  const password =
    getString(formData, "password");


  if (
    !fullName ||
    !email ||
    !password
  ) {
    redirect(
      "/admin/clients/new?error=Missing required fields" as Route,
    );
  }


  const {
    data: existingClient,
  } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();


  if (existingClient) {
    redirect(
      "/admin/clients/new?error=Client already exists" as Route,
    );
  }


  const {
    data: createdUser,
    error: userError,
  } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });


  if (
    userError ||
    !createdUser.user
  ) {
    redirect(
      `/admin/clients/new?error=${encodeURIComponent(
        userError?.message ||
          "Unable to create account",
      )}` as Route,
    );
  }


  const clientId =
    createdUser.user.id;


  const {
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .insert({
        id: clientId,
        full_name: fullName,
        company_name:
          companyName || null,
        email,
        role: "client",
        is_active: true,
      });


  if (profileError) {
    redirect(
      `/admin/clients/new?error=${encodeURIComponent(
        profileError.message,
      )}` as Route,
    );
  }


  /*
    Add client to Resend Audience
  */

  try {
    const resend =
      new Resend(
        process.env.RESEND_API_KEY,
      );


    const audienceId =
      process.env.RESEND_AUDIENCE_ID;


    if (
      audienceId
    ) {
      await resend.contacts.create({
        audienceId,
        email,
        firstName:
          fullName.split(" ")[0],
        unsubscribed: false,
      });
    }

  } catch (error) {

    console.error(
      "Resend contact creation failed:",
      error,
    );

  }



  /*
    Send onboarding email
  */

  try {

    await sendClientOnboardingEmail({
      clientName:
        companyName ||
        fullName,
      clientEmail:
        email,
      temporaryPassword:
        password,
    });


  } catch(error){

    console.error(
      "Welcome email failed:",
      error,
    );

  }



  redirect(
    "/admin/clients?created=1",
  );
}



export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {

  const params =
    await searchParams;


  return (

    <div className="space-y-8">


      <Button
        asChild
        variant="ghost"
      >

        <Link href="/admin/clients">

          <ArrowLeft className="mr-2 size-4"/>

          Back to clients

        </Link>

      </Button>



      <Card className="max-w-2xl">


        <CardHeader>

          <div className="flex size-12 items-center justify-center rounded-xl border">

            <UserPlus className="size-6"/>

          </div>


          <CardTitle>
            Create Client Account
          </CardTitle>


          <CardDescription>
            Create a portal account,
            add the client to your email
            audience, and send onboarding.
          </CardDescription>


        </CardHeader>



        <CardContent>


          {params.error ? (

            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm">

              {params.error}

            </div>

          ) : null}



          <form
            action={createClientAccount}
            className="space-y-5"
          >


            <div>
              <Label>
                Full Name
              </Label>

              <Input
                name="full_name"
                required
              />

            </div>



            <div>
              <Label>
                Company
              </Label>

              <Input
                name="company_name"
              />

            </div>



            <div>
              <Label>
                Email
              </Label>

              <Input
                name="email"
                type="email"
                required
              />

            </div>



            <div>
              <Label>
                Temporary Password
              </Label>

              <Input
                name="password"
                required
              />

            </div>



            <Button
              className="w-full"
              type="submit"
            >

              <UserPlus className="mr-2 size-4"/>

              Create Client

            </Button>


          </form>


        </CardContent>


      </Card>


    </div>

  );
}



function getString(
  formData: FormData,
  key: string,
) {

  const value =
    formData.get(key);


  return typeof value === "string"
    ? value.trim()
    : "";

}