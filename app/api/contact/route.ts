
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();

  const data = {
    name: form.get("name"),
    company: form.get("company"),
    email: form.get("email"),
    phone: form.get("phone"),
    service: form.get("service"),
    message: form.get("message"),
  };

  console.log(data);

  return NextResponse.redirect(new URL("/contact?success=1", req.url));
}