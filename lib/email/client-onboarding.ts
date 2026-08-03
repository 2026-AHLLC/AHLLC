// lib/email/client-onboarding.ts

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ahllc.mobi";

type ClientOnboardingEmailInput = {
  clientName: string;
  clientEmail: string;
  temporaryPassword?: string;
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

export async function sendClientOnboardingEmail({
  clientName,
  clientEmail,
  temporaryPassword,
}: ClientOnboardingEmailInput) {
  requireEmailConfiguration();

  const resend = getResend();

  const loginUrl = `${siteUrl}/login`;

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail!,
      to: [clientEmail],
      subject: "Welcome to your AH LLC Client Portal",
      html: `
<!doctype html>
<html lang="en">
<body style="margin:0;background:#09090b;font-family:Arial,sans-serif;color:#ffffff;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 16px;">

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
max-width:620px;
background:#111113;
border:1px solid #27272a;
border-radius:16px;
overflow:hidden;
"
>

<tr>
<td style="padding:36px;">

<p style="
margin:0 0 12px;
font-size:13px;
font-weight:700;
letter-spacing:2px;
color:#d4af37;
">
AH LLC
</p>

<h1 style="
margin:0 0 24px;
font-size:30px;
line-height:1.25;
">
Welcome to your client portal
</h1>


<p style="
font-size:16px;
line-height:1.6;
color:#d4d4d8;
">
Hello ${escapeHtml(clientName)},
</p>


<p style="
font-size:16px;
line-height:1.6;
color:#d4d4d8;
">
Your AH LLC client portal has been created.
You now have secure access to your projects,
documents, consultations, and support requests.
</p>


<div style="
margin:28px 0;
padding:22px;
background:#18181b;
border-radius:12px;
border:1px solid #27272a;
">

<p style="margin:0 0 12px;font-weight:700;">
Your portal includes:
</p>

<ul style="
margin:0;
padding-left:20px;
color:#d4d4d8;
line-height:1.8;
">

<li>Project updates and milestones</li>
<li>Secure document access</li>
<li>Support request tracking</li>
<li>Consultation scheduling</li>

</ul>

</div>


${
  temporaryPassword
    ? `
<div style="
margin:24px 0;
padding:18px;
background:#27272a;
border-radius:10px;
">

<p style="margin:0 0 8px;font-weight:700;">
Temporary login credentials
</p>

<p style="margin:0;">
Password:
<strong>${escapeHtml(temporaryPassword)}</strong>
</p>

</div>
`
    : ""
}


<a
href="${loginUrl}"
style="
display:inline-block;
padding:14px 24px;
background:#2563eb;
color:#ffffff;
text-decoration:none;
border-radius:10px;
font-weight:700;
"
>
Open Client Portal
</a>


<p style="
margin-top:32px;
font-size:14px;
line-height:1.6;
color:#a1a1aa;
">
If you have questions, simply reply to this email and the AH LLC team
will assist you.
</p>


<p style="
margin-top:28px;
font-size:13px;
color:#71717a;
">
AH LLC<br/>
AI • Automation • Growth
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
      text: `
Welcome to your AH LLC Client Portal

Hello ${clientName},

Your AH LLC client portal has been created.

Access your portal:
${loginUrl}

You can:
- View projects
- Access documents
- Track support requests
- Schedule consultations

AH LLC
AI • Automation • Growth
`,
    },
    {
      idempotencyKey: `client-onboarding-${clientEmail}`,
    },
  );

  if (error) {
    throw new Error(
      `Client onboarding email failed: ${error.message}`,
    );
  }

  return data;
}