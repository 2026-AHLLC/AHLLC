import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AuditPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  website?: unknown;
  auditFocus?: unknown;
  challenge?: unknown;
  goal?: unknown;
  budget?: unknown;
  timeline?: unknown;
  consent?: unknown;
  companyWebsite?: unknown;
};

const MAX_MESSAGE_LENGTH = 4_000;

function cleanString(value: unknown, maxLength = MAX_MESSAGE_LENGTH) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayValue(value: string) {
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    route: "/api/free-audit",
    configured: Boolean(
      process.env.RESEND_API_KEY &&
        process.env.RESEND_FROM_EMAIL &&
        process.env.CONTACT_TO_EMAIL,
    ),
  });
}

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const contactEmail = process.env.CONTACT_TO_EMAIL;

    if (!resendApiKey || !fromEmail || !contactEmail) {
      console.error(
        "Free audit email environment variables are missing.",
      );

      return NextResponse.json(
        {
          error:
            "The audit service is temporarily unavailable. Please contact AH LLC directly.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as AuditPayload;

    // Honeypot field: silently accept likely bot submissions.
    if (cleanString(body.companyWebsite, 200)) {
      return NextResponse.json({ success: true });
    }

    const name = cleanString(body.name, 120);
    const email = cleanString(body.email, 254).toLowerCase();
    const phone = cleanString(body.phone, 50);
    const company = cleanString(body.company, 160);
    const website = cleanString(body.website, 500);
    const auditFocus = cleanString(body.auditFocus, 100);
    const challenge = cleanString(body.challenge);
    const goal = cleanString(body.goal);
    const budget = cleanString(body.budget, 100);
    const timeline = cleanString(body.timeline, 100);
    const consent = body.consent === true;

    if (
      !name ||
      !email ||
      !company ||
      !auditFocus ||
      !challenge ||
      !goal ||
      !timeline
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!consent) {
      return NextResponse.json(
        {
          error:
            "Please confirm that AH LLC may contact you about your audit.",
        },
        { status: 400 },
      );
    }

    if (website) {
      try {
        const parsed = new URL(website);

        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Unsupported website protocol.");
        }
      } catch {
        return NextResponse.json(
          { error: "Please enter a valid website address." },
          { status: 400 },
        );
      }
    }

    const resend = new Resend(resendApiKey);

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone || "Not provided"),
      company: escapeHtml(company),
      website: escapeHtml(website || "Not provided"),
      auditFocus: escapeHtml(displayValue(auditFocus)),
      challenge: escapeHtml(challenge).replaceAll("\n", "<br />"),
      goal: escapeHtml(goal).replaceAll("\n", "<br />"),
      budget: escapeHtml(
        budget ? displayValue(budget) : "Not provided",
      ),
      timeline: escapeHtml(displayValue(timeline)),
    };

    const result = await resend.emails.send({
      from: fromEmail,
      to: [contactEmail],
      replyTo: email,
      subject: `Free Audit Request — ${company}`,
      html: `
        <div style="background:#09090b;padding:32px;font-family:Arial,sans-serif;color:#f4f4f5">
          <div style="max-width:720px;margin:0 auto;overflow:hidden;border:1px solid #27272a;border-radius:18px;background:#18181b">
            <div style="padding:28px;background:linear-gradient(135deg,#0e7490,#2563eb)">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#cffafe">
                AH LLC
              </p>
              <h1 style="margin:0;font-size:26px;color:#ffffff">
                New free audit request
              </h1>
            </div>

            <div style="padding:28px">
              <table role="presentation" style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="width:170px;padding:10px 0;color:#a1a1aa">Name</td>
                  <td style="padding:10px 0;color:#ffffff">${safe.name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#a1a1aa">Email</td>
                  <td style="padding:10px 0">
                    <a href="mailto:${safe.email}" style="color:#67e8f9">${safe.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#a1a1aa">Phone</td>
                  <td style="padding:10px 0;color:#ffffff">${safe.phone}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#a1a1aa">Company</td>
                  <td style="padding:10px 0;color:#ffffff">${safe.company}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#a1a1aa">Website</td>
                  <td style="padding:10px 0;color:#ffffff">${safe.website}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#a1a1aa">Audit focus</td>
                  <td style="padding:10px 0;color:#ffffff">${safe.auditFocus}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#a1a1aa">Budget</td>
                  <td style="padding:10px 0;color:#ffffff">${safe.budget}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#a1a1aa">Timeline</td>
                  <td style="padding:10px 0;color:#ffffff">${safe.timeline}</td>
                </tr>
              </table>

              <div style="margin-top:24px;padding:20px;border-radius:12px;background:#09090b">
                <h2 style="margin:0 0 10px;font-size:16px;color:#67e8f9">
                  Biggest challenge
                </h2>
                <p style="margin:0;line-height:1.7;color:#e4e4e7">${safe.challenge}</p>
              </div>

              <div style="margin-top:16px;padding:20px;border-radius:12px;background:#09090b">
                <h2 style="margin:0 0 10px;font-size:16px;color:#67e8f9">
                  Desired result
                </h2>
                <p style="margin:0;line-height:1.7;color:#e4e4e7">${safe.goal}</p>
              </div>
            </div>
          </div>
        </div>
      `,
      text: [
        "New AH LLC free audit request",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Company: ${company}`,
        `Website: ${website || "Not provided"}`,
        `Audit focus: ${displayValue(auditFocus)}`,
        `Budget: ${budget ? displayValue(budget) : "Not provided"}`,
        `Timeline: ${displayValue(timeline)}`,
        "",
        "Biggest challenge:",
        challenge,
        "",
        "Desired result:",
        goal,
      ].join("\n"),
    });

    if (result.error) {
      console.error("Resend free audit error:", result.error);

      return NextResponse.json(
        {
          error:
            "Your request could not be sent. Please try again shortly.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/free-audit failed:", error);

    return NextResponse.json(
      {
        error:
          "Your audit request could not be submitted. Please try again.",
      },
      { status: 500 },
    );
  }
}
