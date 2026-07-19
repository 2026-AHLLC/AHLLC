
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getText(
  formData: FormData,
  field: string,
  maxLength: number
): string {
  const value = formData.get(field);

  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail =
      process.env.CONTACT_TO_EMAIL ||
      "johnegan2025@gmail.com";

    if (!apiKey || !fromEmail) {
  return NextResponse.json(
    {
      success: false,
      message: `Missing: apiKey=${!!apiKey}, fromEmail=${!!fromEmail}`,
    },
    { status: 500 }
  );
}





    const formData = await request.formData();

    const honeypot = getText(
      formData,
      "website",
      200
    );

    if (honeypot) {
      return NextResponse.json({
        success: true,
        message: "Your message has been sent.",
      });
    }

    const name = getText(formData, "name", 100);
    const company = getText(
      formData,
      "company",
      120
    );
    const email = getText(
      formData,
      "email",
      254
    ).toLowerCase();
    const phone = getText(formData, "phone", 40);
    const service = getText(
      formData,
      "service",
      150
    );
    const message = getText(
      formData,
      "message",
      5000
    );

    if (
      name.length < 2 ||
      !emailPattern.test(email) ||
      service.length < 2 ||
      message.length < 10
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all required fields correctly.",
        },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `New AH LLC inquiry: ${service}`,
      text: [
        "New AH LLC contact-form submission",
        "",
        `Name: ${name}`,
        `Company: ${company || "Not provided"}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Service: ${service}`,
        "",
        "Project details:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#18181b">
          <h1 style="font-size:24px;margin-bottom:24px">
            New AH LLC inquiry
          </h1>

          <table style="width:100%;border-collapse:collapse">
            <tbody>
              <tr>
                <td style="padding:8px 0;font-weight:700">
                  Name
                </td>
                <td style="padding:8px 0">
                  ${escapeHtml(name)}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;font-weight:700">
                  Company
                </td>
                <td style="padding:8px 0">
                  ${escapeHtml(
                    company || "Not provided"
                  )}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;font-weight:700">
                  Email
                </td>
                <td style="padding:8px 0">
                  ${escapeHtml(email)}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;font-weight:700">
                  Phone
                </td>
                <td style="padding:8px 0">
                  ${escapeHtml(
                    phone || "Not provided"
                  )}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;font-weight:700">
                  Service
                </td>
                <td style="padding:8px 0">
                  ${escapeHtml(service)}
                </td>
              </tr>
            </tbody>
          </table>

          <h2 style="font-size:18px;margin-top:28px">
            Project details
          </h2>

          <p style="white-space:pre-wrap;line-height:1.6">
            ${escapeHtml(message)}
          </p>
        </div>
      `,
    });

   if (error) {
  console.error("Resend error:", error);

  return NextResponse.json(
    {
      success: false,
      message: JSON.stringify(error),
    },
    { status: 502 }
  );
}

    return NextResponse.json({
      success: true,
      message: "Your message has been sent.",
    });
  } catch (error) {
    console.error("Contact route error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Your message could not be sent. Please try again.",
      },
      { status: 500 }
    );
  }
}