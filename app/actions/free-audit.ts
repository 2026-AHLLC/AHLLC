"use server";

import { Resend } from "resend";

export type FreeAuditState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    email?: string;
    website?: string;
    business?: string;
    goals?: string;
  };
};

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

export async function submitFreeAudit(
  _previousState: FreeAuditState,
  formData: FormData
): Promise<FreeAuditState> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail =
      process.env.CONTACT_TO_EMAIL || "email@alibabas.com";

    if (!apiKey || !fromEmail) {
      console.error(
        "Missing RESEND_API_KEY or RESEND_FROM_EMAIL environment variable."
      );

      return {
        success: false,
        message:
          "The free-audit form is temporarily unavailable. Please email us directly.",
      };
    }

    // Honeypot field. Real users should leave this empty.
    const companyWebsite = getText(formData, "companyWebsite", 200);

    if (companyWebsite) {
      return {
        success: true,
        message: "Your free audit request has been received.",
      };
    }

    const name = getText(formData, "name", 100);
    const email = getText(formData, "email", 254).toLowerCase();
    const phone = getText(formData, "phone", 40);
    const business = getText(formData, "business", 150);
    const website = getText(formData, "website", 300);
    const service = getText(formData, "service", 150);
    const goals = getText(formData, "goals", 5000);

    const errors: FreeAuditState["errors"] = {};

    if (name.length < 2) {
      errors.name = "Please enter your full name.";
    }

    if (!emailPattern.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (business.length < 2) {
      errors.business = "Please enter your business name.";
    }

    if (website && !/^https?:\/\/.+/i.test(website)) {
      errors.website =
        "Please include the full website address, beginning with http:// or https://.";
    }

    if (goals.length < 10) {
      errors.goals =
        "Please tell us a little more about what you want to improve.";
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the highlighted fields.",
        errors,
      };
    }

    const resend = new Resend(apiKey);

    const subject = business
      ? `New free audit request: ${business}`
      : `New free audit request from ${name}`;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject,
      text: [
        "New AH LLC free-audit request",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Business: ${business}`,
        `Website: ${website || "Not provided"}`,
        `Service of interest: ${service || "Not specified"}`,
        "",
        "Goals and challenges:",
        goals,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#18181b">
          <h1 style="font-size:24px;margin-bottom:24px">
            New AH LLC free-audit request
          </h1>

          <table style="width:100%;border-collapse:collapse">
            <tbody>
              <tr>
                <td style="padding:8px 0;font-weight:700">Name</td>
                <td style="padding:8px 0">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700">Email</td>
                <td style="padding:8px 0">${escapeHtml(email)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700">Phone</td>
                <td style="padding:8px 0">${escapeHtml(
                  phone || "Not provided"
                )}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700">Business</td>
                <td style="padding:8px 0">${escapeHtml(business)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700">Website</td>
                <td style="padding:8px 0">${escapeHtml(
                  website || "Not provided"
                )}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700">
                  Service of interest
                </td>
                <td style="padding:8px 0">${escapeHtml(
                  service || "Not specified"
                )}</td>
              </tr>
            </tbody>
          </table>

          <h2 style="font-size:18px;margin-top:28px">
            Goals and challenges
          </h2>

          <p style="white-space:pre-wrap;line-height:1.6">
            ${escapeHtml(goals)}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend free-audit error:", error);

      return {
        success: false,
        message:
          "Your request could not be sent. Please try again or email us directly.",
      };
    }

    return {
      success: true,
      message:
        "Thank you. Your free audit request has been sent successfully.",
    };
  } catch (error) {
    console.error("Free-audit action error:", error);

    return {
      success: false,
      message:
        "Your request could not be sent. Please try again or email us directly.",
    };
  }
}
