import type { Metadata, Route } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  FolderKanban,
  KeyRound,
  Mail,
  MessageSquare,
  Send,
  UserRound,
} from "lucide-react";

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

import { sendClientOnboardingEmail } from "@/lib/email/client-onboarding";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Client Details | AH LLC Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function resendWelcomeEmail(formData: FormData) {
  "use server";

  const id = getString(formData, "id");

  const supabase = await createClient();

  const { data: client } = await supabase
    .from("profiles")
    .select(
      `
      full_name,
      company_name,
      email
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (!client?.email) {
    redirect(
      `/admin/clients/${id}?error=No email address found` as Route,
    );
  }

  await sendClientOnboardingEmail({
    clientName:
      client.company_name ||
      client.full_name ||
      "AH LLC Client",
    clientEmail: client.email,
  });

  revalidatePath(`/admin/clients/${id}`);

  redirect(
    `/admin/clients/${id}?email=sent` as Route,
  );
}

async function updateClient(formData: FormData) {
  "use server";

  const id = getString(formData, "id");

  const supabase = await createClient();

  const fullName = getString(formData, "full_name");
  const companyName = getString(formData, "company_name");
  const email = getString(formData, "email");

  await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      company_name: companyName || null,
      email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath(`/admin/clients/${id}`);

  redirect(
    `/admin/clients/${id}?saved=1` as Route,
  );
}

export default async function ClientDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const [
    profileResult,
    projectsResult,
    documentsResult,
    supportResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        company_name,
        email,
        phone,
        role,
        created_at
        `,
      )
      .eq("id", id)
      .maybeSingle(),

    supabase
      .from("projects")
      .select("id,title,status")
      .eq("client_id", id),

    supabase
      .from("client_documents")
      .select("id")
      .eq("client_id", id),

    supabase
      .from("support_requests")
      .select(
        `
        id,
        subject,
        status
        `,
      )
      .eq("client_id", id),
  ]);

  const client = profileResult.data;

  if (!client) {
    notFound();
  }

  const projects = projectsResult.data ?? [];
  const documents = documentsResult.data ?? [];
  const support = supportResult.data ?? [];

  return (
    <div className="space-y-8">

      <Button asChild variant="ghost">
        <Link href="/admin/clients">
          <ArrowLeft className="mr-2 size-4" />
          Back to Clients
        </Link>
      </Button>


      <section>
        <h1 className="text-3xl font-bold">
          {client.company_name ||
            client.full_name ||
            "Client"}
        </h1>

        <p className="text-muted-foreground">
          Client account management
        </p>
      </section>


      <div className="grid gap-6 lg:grid-cols-3">

        <Card>
          <CardHeader>
            <CardTitle>
              Account Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">

            <p>
              <strong>Email:</strong>{" "}
              {client.email || "Not set"}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {client.role}
            </p>

            <p>
              <strong>Projects:</strong>{" "}
              {projects.length}
            </p>

            <p>
              <strong>Documents:</strong>{" "}
              {documents.length}
            </p>

            <p>
              <strong>Support Requests:</strong>{" "}
              {support.length}
            </p>

          </CardContent>
        </Card>


        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Edit Client
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form
              action={updateClient}
              className="space-y-4"
            >

              <input
                type="hidden"
                name="id"
                value={client.id}
              />

              <div>
                <Label>
                  Name
                </Label>

                <Input
                  name="full_name"
                  defaultValue={
                    client.full_name ?? ""
                  }
                />
              </div>


              <div>
                <Label>
                  Company
                </Label>

                <Input
                  name="company_name"
                  defaultValue={
                    client.company_name ?? ""
                  }
                />
              </div>


              <div>
                <Label>
                  Email
                </Label>

                <Input
                  name="email"
                  type="email"
                  defaultValue={
                    client.email ?? ""
                  }
                />
              </div>


              <Button>
                Save Changes
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>


      <div className="grid gap-6 md:grid-cols-3">

        <Card>
          <FolderKanban className="m-5 size-6" />

          <CardHeader>
            <CardTitle>
              Projects
            </CardTitle>

            <CardDescription>
              {projects.length} active records
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href={`/admin/projects?clientId=${id}`}>
              View Projects
            </Link>
          </CardContent>
        </Card>


        <Card>
          <FileText className="m-5 size-6" />

          <CardHeader>
            <CardTitle>
              Documents
            </CardTitle>

            <CardDescription>
              {documents.length} files
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href={`/admin/documents?clientId=${id}`}>
              View Documents
            </Link>
          </CardContent>
        </Card>


        <Card>
          <MessageSquare className="m-5 size-6" />

          <CardHeader>
            <CardTitle>
              Support
            </CardTitle>

            <CardDescription>
              {support.length} requests
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href={`/admin/support?clientId=${id}`}>
              View Support
            </Link>
          </CardContent>
        </Card>

      </div>


      <Card>
        <CardHeader>
          <CardTitle>
            Client Actions
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form action={resendWelcomeEmail}>

            <input
              type="hidden"
              name="id"
              value={client.id}
            />

            <Button>
              <Send className="mr-2 size-4" />
              Resend Welcome Email
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
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}