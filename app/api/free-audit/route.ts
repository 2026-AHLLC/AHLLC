import OpenAI from "openai";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
};

type AuditImpact = "High" | "Medium" | "Low";

type AuditOpportunity = {
  title: string;
  impact: AuditImpact;
  finding: string;
  recommendation: string;
};

type AuditReport = {
  overallScore: number;
  summary: string;
  strengths: string[];
  opportunities: AuditOpportunity[];
  quickWins: string[];
  aiAutomationIdeas: string[];
  nextStep: string;
  disclaimer: string;
};

const AUDIT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    overallScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    summary: {
      type: "string",
      minLength: 1,
    },
    strengths: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: {
        type: "string",
        minLength: 1,
      },
    },
    opportunities: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: {
            type: "string",
            minLength: 1,
          },
          impact: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
          finding: {
            type: "string",
            minLength: 1,
          },
          recommendation: {
            type: "string",
            minLength: 1,
          },
        },
        required: [
          "title",
          "impact",
          "finding",
          "recommendation",
        ],
      },
    },
    quickWins: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "string",
        minLength: 1,
      },
    },
    aiAutomationIdeas: {
      type: "array",
      minItems: 2,
      maxItems: 5,
      items: {
        type: "string",
        minLength: 1,
      },
    },
    nextStep: {
      type: "string",
      minLength: 1,
    },
    disclaimer: {
      type: "string",
      minLength: 1,
    },
  },
  required: [
    "overallScore",
    "summary",
    "strengths",
    "opportunities",
    "quickWins",
    "aiAutomationIdeas",
    "nextStep",
    "disclaimer",
  ],
} as const;

function clean(value: unknown, maxLength = 4_000): string {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function displayValue(value: string): string {
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeWebsite(value: string): string {
  if (!value) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;

  return new URL(withProtocol).toString();
}

function isPrivateHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();

  if (
    normalized === "localhost" ||
    normalized.endsWith(".local") ||
    normalized === "0.0.0.0" ||
    normalized === "::1"
  ) {
    return true;
  }

  const match = normalized.match(
    /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
  );

  if (!match) {
    return false;
  }

  const octets = match.slice(1).map(Number);

  if (octets.some((octet) => octet < 0 || octet > 255)) {
    return true;
  }

  const [first, second] = octets;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12_000);
}

async function getHomepageText(website: string): Promise<string> {
  if (!website) {
    return "";
  }

  try {
    const url = new URL(website);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }

    if (isPrivateHostname(url.hostname)) {
      return "";
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "AHLLC-AuditBot/1.0 (+https://ahllc.biz)",
          Accept: "text/html,application/xhtml+xml",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return "";
      }

      const contentType =
        response.headers.get("content-type") ?? "";

      if (!contentType.includes("text/html")) {
        return "";
      }

      const html = (await response.text()).slice(0, 250_000);
      return stripHtml(html);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.warn("Homepage fetch failed:", error);
    return "";
  }
}

function isAuditImpact(value: unknown): value is AuditImpact {
  return (
    value === "High" ||
    value === "Medium" ||
    value === "Low"
  );
}

function assertAuditReport(value: unknown): AuditReport {
  if (!value || typeof value !== "object") {
    throw new Error("OpenAI returned an invalid audit object.");
  }

  const report = value as Record<string, unknown>;

  if (
    !Number.isInteger(report.overallScore) ||
    Number(report.overallScore) < 0 ||
    Number(report.overallScore) > 100
  ) {
    throw new Error("OpenAI returned an invalid overall score.");
  }

  if (
    typeof report.summary !== "string" ||
    typeof report.nextStep !== "string" ||
    typeof report.disclaimer !== "string"
  ) {
    throw new Error("OpenAI returned incomplete audit text.");
  }

  const strengths = report.strengths;
  const quickWins = report.quickWins;
  const aiAutomationIdeas = report.aiAutomationIdeas;
  const opportunities = report.opportunities;

  if (
    !Array.isArray(strengths) ||
    !strengths.every((item) => typeof item === "string") ||
    !Array.isArray(quickWins) ||
    !quickWins.every((item) => typeof item === "string") ||
    !Array.isArray(aiAutomationIdeas) ||
    !aiAutomationIdeas.every((item) => typeof item === "string") ||
    !Array.isArray(opportunities)
  ) {
    throw new Error("OpenAI returned invalid audit lists.");
  }

  const normalizedOpportunities: AuditOpportunity[] =
    opportunities.map((item) => {
      if (!item || typeof item !== "object") {
        throw new Error(
          "OpenAI returned an invalid opportunity.",
        );
      }

      const opportunity = item as Record<string, unknown>;

      if (
        typeof opportunity.title !== "string" ||
        !isAuditImpact(opportunity.impact) ||
        typeof opportunity.finding !== "string" ||
        typeof opportunity.recommendation !== "string"
      ) {
        throw new Error(
          "OpenAI returned an incomplete opportunity.",
        );
      }

      return {
        title: opportunity.title,
        impact: opportunity.impact,
        finding: opportunity.finding,
        recommendation: opportunity.recommendation,
      };
    });

  return {
    overallScore: Number(report.overallScore),
    summary: report.summary,
    strengths,
    opportunities: normalizedOpportunities,
    quickWins,
    aiAutomationIdeas,
    nextStep: report.nextStep,
    disclaimer: report.disclaimer,
  };
}

function createLeadEmailHtml({
  name,
  email,
  phone,
  company,
  website,
  auditFocus,
  challenge,
  goal,
  budget,
  timeline,
  report,
}: {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  auditFocus: string;
  challenge: string;
  goal: string;
  budget: string;
  timeline: string;
  report: AuditReport;
}): string {
  const list = (items: string[]) =>
    items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

  const opportunities = report.opportunities
    .map(
      (item) => `
        <div style="margin:14px 0;padding:16px;background:#09090b;border:1px solid #27272a;border-radius:12px;">
          <p style="margin:0 0 8px;color:#67e8f9;font-weight:700;">
            ${escapeHtml(item.title)} · ${escapeHtml(item.impact)} impact
          </p>
          <p style="margin:0 0 10px;color:#d4d4d8;line-height:1.6;">
            ${escapeHtml(item.finding)}
          </p>
          <p style="margin:0;color:#f4f4f5;line-height:1.6;">
            <strong>Recommendation:</strong>
            ${escapeHtml(item.recommendation)}
          </p>
        </div>
      `,
    )
    .join("");

  return `
    <div style="background:#09090b;color:#f4f4f5;padding:32px;font-family:Arial,sans-serif;">
      <div style="max-width:760px;margin:0 auto;background:#18181b;border:1px solid #27272a;border-radius:18px;overflow:hidden;">
        <div style="padding:28px;background:linear-gradient(135deg,#0e7490,#2563eb);">
          <p style="margin:0 0 8px;color:#cffafe;font-size:12px;text-transform:uppercase;letter-spacing:.14em;">
            AH LLC
          </p>
          <h1 style="margin:0;color:#fff;font-size:26px;">New AI audit lead</h1>
        </div>

        <div style="padding:28px;">
          <p><strong>${escapeHtml(name)}</strong> from <strong>${escapeHtml(company)}</strong></p>
          <p>
            <a href="mailto:${escapeHtml(email)}" style="color:#67e8f9;">${escapeHtml(email)}</a>
            ${phone ? ` · ${escapeHtml(phone)}` : ""}
          </p>
          <p>${website ? escapeHtml(website) : "No website provided"}</p>

          <div style="margin-top:20px;padding:18px;background:#09090b;border-radius:12px;">
            <p><strong>Audit focus:</strong> ${escapeHtml(displayValue(auditFocus))}</p>
            <p><strong>Budget:</strong> ${escapeHtml(budget ? displayValue(budget) : "Not provided")}</p>
            <p><strong>Timeline:</strong> ${escapeHtml(displayValue(timeline))}</p>
            <p><strong>Challenge:</strong> ${escapeHtml(challenge)}</p>
            <p><strong>Goal:</strong> ${escapeHtml(goal)}</p>
          </div>

          <div style="margin-top:24px;padding:22px;background:#111827;border-radius:14px;">
            <p style="margin:0;color:#67e8f9;font-size:13px;text-transform:uppercase;letter-spacing:.12em;">
              Instant AI audit
            </p>
            <h2 style="margin:8px 0 0;color:#fff;font-size:26px;">
              Overall score: ${report.overallScore}/100
            </h2>
            <p style="color:#d4d4d8;line-height:1.7;">${escapeHtml(report.summary)}</p>

            <h3>Strengths</h3>
            <ul style="color:#d4d4d8;line-height:1.8;">${list(report.strengths)}</ul>

            <h3>Priority opportunities</h3>
            ${opportunities}

            <h3>Quick wins</h3>
            <ul style="color:#d4d4d8;line-height:1.8;">${list(report.quickWins)}</ul>

            <h3>AI and automation opportunities</h3>
            <ul style="color:#d4d4d8;line-height:1.8;">${list(report.aiAutomationIdeas)}</ul>

            <h3>Recommended next step</h3>
            <p style="color:#d4d4d8;line-height:1.7;">${escapeHtml(report.nextStep)}</p>

            <p style="margin-top:24px;color:#71717a;font-size:12px;line-height:1.6;">
              ${escapeHtml(report.disclaimer)}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function sendLeadEmail({
  name,
  email,
  phone,
  company,
  website,
  auditFocus,
  challenge,
  goal,
  budget,
  timeline,
  report,
}: {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  auditFocus: string;
  challenge: string;
  goal: string;
  budget: string;
  timeline: string;
  report: AuditReport;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    console.warn(
      "Audit generated, but Resend environment variables are incomplete.",
    );
    return;
  }

  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `AI Audit Lead — ${company} — ${report.overallScore}/100`,
    html: createLeadEmailHtml({
      name,
      email,
      phone,
      company,
      website,
      auditFocus,
      challenge,
      goal,
      budget,
      timeline,
      report,
    }),
    text: [
      "New AH LLC AI audit lead",
      "",
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Website: ${website || "Not provided"}`,
      `Audit focus: ${displayValue(auditFocus)}`,
      `Budget: ${budget ? displayValue(budget) : "Not provided"}`,
      `Timeline: ${displayValue(timeline)}`,
      "",
      `Challenge: ${challenge}`,
      "",
      `Goal: ${goal}`,
      "",
      `Audit score: ${report.overallScore}/100`,
      "",
      report.summary,
      "",
      "Priority opportunities:",
      ...report.opportunities.map(
        (item, index) =>
          `${index + 1}. ${item.title} (${item.impact})\nFinding: ${item.finding}\nRecommendation: ${item.recommendation}`,
      ),
      "",
      `Recommended next step: ${report.nextStep}`,
    ].join("\n"),
  });

  if (result.error) {
    console.error("Audit lead email failed:", result.error);
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    route: "/api/free-audit",
    configured: {
      openai: Boolean(process.env.OPENAI_API_KEY),
      email: Boolean(
        process.env.RESEND_API_KEY &&
          process.env.RESEND_FROM_EMAIL &&
          process.env.CONTACT_TO_EMAIL,
      ),
    },
  });
}

export async function POST(request: Request) {
  try {
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (!openAiApiKey) {
      return NextResponse.json(
        {
          error:
            "The instant audit service is temporarily unavailable.",
        },
        {
          status: 503,
        },
      );
    }

    let body: AuditPayload;

    try {
      body = (await request.json()) as AuditPayload;
    } catch {
      return NextResponse.json(
        {
          error: "The request body must be valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 50);
    const company = clean(body.company, 160);
    const rawWebsite = clean(body.website, 500);
    const auditFocus = clean(body.auditFocus, 100);
    const challenge = clean(body.challenge);
    const goal = clean(body.goal);
    const budget = clean(body.budget, 100);
    const timeline = clean(body.timeline, 100);
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
        {
          error: "Please complete all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    if (!consent) {
      return NextResponse.json(
        {
          error:
            "Please confirm that AH LLC may contact you about your audit.",
        },
        {
          status: 400,
        },
      );
    }

    let website = "";

    if (rawWebsite) {
      try {
        website = normalizeWebsite(rawWebsite);
        const url = new URL(website);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Unsupported protocol.");
        }

        if (isPrivateHostname(url.hostname)) {
          throw new Error("Private hostname.");
        }
      } catch {
        return NextResponse.json(
          {
            error:
              "Please enter a valid public website address.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const homepageText = await getHomepageText(website);

    const openai = new OpenAI({
      apiKey: openAiApiKey,
    });

    const response = await openai.responses.create({
      model:
        process.env.OPENAI_AUDIT_MODEL ??
        "gpt-5-mini",

      instructions: `
You are a senior business-growth, website-conversion, SEO, AI, and automation consultant for AH LLC.

Create a practical preliminary audit using the visitor's submitted information and any supplied public homepage text.

Rules:
- Never invent analytics, rankings, speed scores, revenue, conversion rates, guarantees, clients, or technical defects.
- Clearly distinguish direct observations from reasonable inferences.
- Do not claim that you tested analytics, security, accessibility, rankings, page speed, or backend systems.
- Keep recommendations specific, concise, and useful.
- Treat the score as a preliminary growth-readiness and opportunity score, not a certified technical score.
- Use plain business language.
- Keep the entire report concise enough to fit comfortably within the response limit.
      `.trim(),

      input: `
BUSINESS SUBMISSION

Name: ${name}
Company: ${company}
Website: ${website || "Not provided"}
Audit focus: ${displayValue(auditFocus)}
Biggest challenge: ${challenge}
Desired result: ${goal}
Budget: ${budget ? displayValue(budget) : "Not provided"}
Timeline: ${displayValue(timeline)}

PUBLIC HOMEPAGE TEXT

${
  homepageText ||
  "Homepage content was unavailable. Base the audit only on the visitor submission and explicitly acknowledge that limitation."
}
      `.trim(),

      text: {
        format: {
          type: "json_schema",
          name: "audit_report",
          strict: true,
          schema: AUDIT_SCHEMA,
        },
      },

      max_output_tokens: 4_000,
      store: false,
    });

    if (response.status === "incomplete") {
      console.error(
        "OpenAI response incomplete:",
        response.incomplete_details,
      );

      throw new Error(
        "The audit response was interrupted before completion. Please try again.",
      );
    }

    if (!response.output_text) {
      throw new Error(
        "OpenAI returned an empty audit response.",
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(response.output_text) as unknown;
    } catch (error) {
      console.error(
        "Structured audit output could not be parsed:",
        {
          error,
          status: response.status,
          incompleteDetails: response.incomplete_details,
          outputLength: response.output_text.length,
          outputPreview: response.output_text.slice(0, 500),
        },
      );

      throw new Error(
        "The audit response was not valid structured data. Please try again.",
      );
    }

    const report = assertAuditReport(parsed);

    await sendLeadEmail({
      name,
      email,
      phone,
      company,
      website,
      auditFocus,
      challenge,
      goal,
      budget,
      timeline,
      report,
    });

await supabase.from("audit_leads").insert({
  name,
  email,
  phone,
  company,
  website,
  audit_focus: auditFocus,
  challenge,
  goal,
  budget,
  timeline,
  overall_score: report.overallScore,
  report,
});







    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("POST /api/free-audit failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "The instant audit could not be generated.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}
