import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ahllc.mobi";

type NewSupportRequestEmailInput = {
  requestId: string;
  clientName: string;
  clientEmail: string | null;
  subject: string;
  message: string;
  priority: string;
};

type AdminReplyEmailInput = {
  requestId: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  adminResponse: string;
  status: string;
};

function getResend() {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(resendApiKey);
}

function requireEmailConfiguration() {
  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMultilineText(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

export async function sendNewSupportRequestEmail({
  requestId,
  clientName,
  clientEmail,
  subject,
  message,
  priority,
}: NewSupportRequestEmailInput) {
  requireEmailConfiguration();

  if (!adminEmail) {
    throw new Error("ADMIN_NOTIFICATION_EMAIL is not configured.");
  }

  const resend = getResend();
  const requestUrl = `${siteUrl}/admin/support/${requestId}`;

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail!,
      to: [adminEmail],
      replyTo: clientEmail || undefined,
      subject: `[${priority.toUpperCase()}] New support request: ${subject}`,
      html: `
        <!doctype html>
        <html lang="en">
          <body style="margin:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="padding:32px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                    style="max-width:640px;background:#ffffff;border:1px solid #e4e4e7;border-radius:14px;">
                    <tr>
                      <td style="padding:32px;">
                        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#71717a;">
                          AH LLC CLIENT PORTAL
                        </p>

                        <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;">
                          New support request
                        </h1>

                        <p style="margin:0 0 8px;">
                          <strong>Client:</strong> ${escapeHtml(clientName)}
                        </p>

                        ${
                          clientEmail
                            ? `<p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(
                                clientEmail,
                              )}</p>`
                            : ""
                        }

                        <p style="margin:0 0 8px;">
                          <strong>Priority:</strong> ${escapeHtml(priority)}
                        </p>

                        <p style="margin:0 0 20px;">
                          <strong>Subject:</strong> ${escapeHtml(subject)}
                        </p>

                        <div style="padding:18px;background:#f4f4f5;border-radius:10px;line-height:1.6;">
                          ${formatMultilineText(message)}
                        </div>

                        <p style="margin:24px 0 0;">
                          <a
                            href="${requestUrl}"
                            style="display:inline-block;padding:12px 18px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;"
                          >
                            Review support request
                          </a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: [
        "New AH LLC support request",
        "",
        `Client: ${clientName}`,
        clientEmail ? `Email: ${clientEmail}` : "",
        `Priority: ${priority}`,
        `Subject: ${subject}`,
        "",
        message,
        "",
        `Review request: ${requestUrl}`,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      idempotencyKey: `support-created-${requestId}`,
    },
  );

  if (error) {
    throw new Error(`Resend support notification failed: ${error.message}`);
  }

  return data;
}

export async function sendAdminReplyEmail({
  requestId,
  clientName,
  clientEmail,
  subject,
  adminResponse,
  status,
}: AdminReplyEmailInput) {
  requireEmailConfiguration();

  const resend = getResend();
  const requestUrl = `${siteUrl}/dashboard/support`;

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail!,
      to: [clientEmail],
      subject: `Update on your AH LLC support request: ${subject}`,
      html: `
        <!doctype html>
        <html lang="en">
          <body style="margin:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="padding:32px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                    style="max-width:640px;background:#ffffff;border:1px solid #e4e4e7;border-radius:14px;">
                    <tr>
                      <td style="padding:32px;">
                        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#71717a;">
                          AH LLC CLIENT SUPPORT
                        </p>

                        <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;">
                          Your support request was updated
                        </h1>

                        <p style="margin:0 0 16px;">
                          Hello ${escapeHtml(clientName)},
                        </p>

                        <p style="margin:0 0 8px;">
                          <strong>Subject:</strong> ${escapeHtml(subject)}
                        </p>

                        <p style="margin:0 0 20px;">
                          <strong>Status:</strong> ${escapeHtml(status)}
                        </p>

                        <div style="padding:18px;background:#f4f4f5;border-radius:10px;line-height:1.6;">
                          ${formatMultilineText(adminResponse)}
                        </div>

                        <p style="margin:24px 0 0;">
                          <a
                            href="${requestUrl}"
                            style="display:inline-block;padding:12px 18px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;"
                          >
                            Open client support
                          </a>
                        </p>

                        <p style="margin:24px 0 0;font-size:13px;color:#71717a;">
                          You can review the full request and any future updates in your AH LLC client portal.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: [
        `Hello ${clientName},`,
        "",
        "Your AH LLC support request was updated.",
        "",
        `Subject: ${subject}`,
        `Status: ${status}`,
        "",
        adminResponse,
        "",
        `Open client support: ${requestUrl}`,
      ].join("\n"),
    },
    {
      idempotencyKey: `support-reply-${requestId}-${Buffer.from(
        `${status}:${adminResponse}`,
      )
        .toString("base64url")
        .slice(0, 80)}`,
    },
  );

  if (error) {
    throw new Error(`Resend client notification failed: ${error.message}`);
  }

  return data;
}