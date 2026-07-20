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

type AuditReport = {
  overallScore: number;
  summary: string;
  strengths: string[];
  opportunities: Array<{
    title: string;
    impact: AuditImpact;
    finding: string;
    recommendation: string;
  }>;
  quickWins: string[];
  aiAutomationIdeas: string[];
  nextStep: string;
  disclaimer: string;
};

function clean(value: unknown, maxLength = 4_000): string {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayValue(value: string): string {
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function normalizeImpact(value: unknown): AuditImpact {
  if (value === "High" || value === "Medium" || value === "Low") {
    return value;
  }

  return "Medium";
}

function normalizeStringArray(
  value: unknown,
  maximum = 5,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maximum);
}

function parseJson(text: string): unknown {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start < 0 || end <= start) {
      throw new Error(
        "The AI response did not contain valid JSON.",
      );
    }

    return JSON.parse(
      trimmed.slice(start, end + 1),
    ) as unknown;
  }
}

function normalizeReport(value: unknown): AuditReport {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const parsedScore = Number(source.overallScore);

  const opportunities: AuditReport["opportunities"] =
    Array.isArray(source.opportunities)
      ? source.opportunities
          .filter(
            (item): item is Record<string, unknown> =>
              Boolean(item) && typeof item === "object",
          )
          .map(
            (
              item,
            ): AuditReport["opportunities"][number] => ({
              title:
                typeof item.title === "string"
                  ? item.title.trim()
                  : "Growth opportunity",

              impact: normalizeImpact(item.impact),

              finding:
                typeof item.finding === "string"
                  ? item.finding.trim()
                  : "",

              recommendation:
                typeof item.recommendation === "string"
                  ? item.recommendation.trim()
                  : "",
            }),
          )
          .filter(
            (item) =>
              Boolean(
                item.title &&
                  item.finding &&
                  item.recommendation,
              ),
          )
          .slice(0, 5)
      : [];

  return {
    overallScore: Number.isFinite(parsedScore)
      ? Math.max(
          0,
          Math.min(100, Math.round(parsedScore)),
        )
      : 50,

    summary:
      typeof source.summary === "string" &&
      source.summary.trim()
        ? source.summary.trim()
        : "This preliminary audit identifies practical growth opportunities based on the information provided.",

    strengths: normalizeStringArray(source.strengths, 4),

    opportunities,

    quickWins: normalizeStringArray(source.quickWins, 5),

    aiAutomationIdeas: normalizeStringArray(
      source.aiAutomationIdeas,
      5,
    ),

    nextStep:
      typeof source.nextStep === "string" &&
      source.nextStep.trim()
        ? source.nextStep.trim()
        : "Schedule a strategy call with AH LLC to validate priorities and plan implementation.",

    disclaimer:
      typeof source.disclaimer === "string" &&
      source.disclaimer.trim()
        ? source.disclaimer.trim()
        : "This is a preliminary AI-generated audit based on submitted information and publicly accessible website content. It should be validated through a complete technical review.",
  };
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

  const ipv4Match = normalized.match(
    /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
  );

  if (!ipv4Match) {
    return false;
  }

  const firstOctet = Number(ipv4Match[1]);
  const secondOctet = Number(ipv4Match[2]);

  return (
    firstOctet === 0 ||
    firstOctet === 10 ||
    firstOctet === 127 ||
    (firstOctet === 169 && secondOctet === 254) ||
    (firstOctet === 172 &&
      secondOctet >= 16 &&
      secondOctet <= 31) ||
    (firstOctet === 192 && secondOctet === 168)
  );
}

function stripHtml(html: string): string {
  return html
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      " ",
    )
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/gi,
      " ",
    )
    .replace(
      /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,
      " ",
    )
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

async function getHomepageText(
  website: string,
): Promise<string> {
  if (!website) {
    return "";
  }

  try {
    const url = new URL(website);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return "";
    }

    if (isPrivateHostname(url.hostname)) {
      return "";
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 8_000);

    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "AHLLC-AuditBot/1.0 (+https://ahllc.biz)",
          Accept:
            "text/html,application/xhtml+xml",
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

      const html = (await response.text()).slice(
        0,
        250_000,
      );

      return stripHtml(html);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.warn(
      "The submitted homepage could not be read:",
      error,
    );

    return "";
  }
}

function createLeadEmailHtml({
  name,
  email,
  phone,
  company,
  website,
  challenge,
  goal,
  report,
}: {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  challenge: string;
  goal: string;
  report: AuditReport;
}): string {
  const opportunityHtml = report.opportunities
    .map(
      (item) => `
        <div
          style="
            margin: 14px 0;
            padding: 16px;
            background: #09090b;
            border: 1px solid #27272a;
            border-radius: 12px;
          "
        >
          <p
            style="
              margin: 0 0 8px;
              color: #67e8f9;
              font-weight: 700;
            "
          >
            ${escapeHtml(item.title)} ·
            ${escapeHtml(item.impact)} impact
          </p>

          <p
            style="
              margin: 0 0 10px;
              color: #d4d4d8;
              line-height: 1.6;
            "
          >
            ${escapeHtml(item.finding)}
          </p>

          <p
            style="
              margin: 0;
              color: #f4f4f5;
              line-height: 1.6;
            "
          >
            <strong>Recommendation:</strong>
            ${escapeHtml(item.recommendation)}
          </p>
        </div>
      `,
    )
    .join("");

  const strengthsHtml = report.strengths
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const quickWinsHtml = report.quickWins
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const automationHtml = report.aiAutomationIdeas
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <div
      style="
        background: #09090b;
        color: #f4f4f5;
        padding: 32px;
        font-family: Arial, sans-serif;
      "
    >
      <div
        style="
          max-width: 760px;
          margin: 0 auto;
          overflow: hidden;
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 18px;
        "
      >
        <div
          style="
            padding: 28px;
            background:
              linear-gradient(135deg, #0e7490, #2563eb);
          "
        >
          <p
            style="
              margin: 0 0 8px;
              color: #cffafe;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.14em;
            "
          >
            AH LLC
          </p>

          <h1
            style="
              margin: 0;
              color: #ffffff;
              font-size: 26px;
            "
          >
            New AI audit lead
          </h1>
        </div>

        <div style="padding: 28px;">
          <p style="margin: 0; color: #ffffff;">
            <strong>${escapeHtml(name)}</strong>
            from
            <strong>${escapeHtml(company)}</strong>
          </p>

          <p
            style="
              margin: 8px 0 0;
              color: #d4d4d8;
            "
          >
            <a
              href="mailto:${escapeHtml(email)}"
              style="color: #67e8f9;"
            >
              ${escapeHtml(email)}
            </a>
            ${
              phone
                ? ` · ${escapeHtml(phone)}`
                : ""
            }
          </p>

          <p
            style="
              margin: 8px 0 0;
              color: #d4d4d8;
            "
          >
            ${
              website
                ? escapeHtml(website)
                : "No website provided"
            }
          </p>

          <div
            style="
              margin-top: 22px;
              padding: 18px;
              background: #09090b;
              border-radius: 12px;
            "
          >
            <p
              style="
                margin: 0 0 10px;
                color: #d4d4d8;
                line-height: 1.6;
              "
            >
              <strong>Challenge:</strong>
              ${escapeHtml(challenge)}
            </p>

            <p
              style="
                margin: 0;
                color: #d4d4d8;
                line-height: 1.6;
              "
            >
              <strong>Goal:</strong>
              ${escapeHtml(goal)}
            </p>
          </div>

          <div
            style="
              margin-top: 24px;
              padding: 22px;
              background: #111827;
              border-radius: 14px;
            "
          >
            <p
              style="
                margin: 0;
                color: #67e8f9;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.12em;
              "
            >
              Instant AI audit
            </p>

            <h2
              style="
                margin: 8px 0 0;
                color: #ffffff;
                font-size: 26px;
              "
            >
              Overall score:
              ${report.overallScore}/100
            </h2>

            <p
              style="
                margin: 14px 0 0;
                color: #d4d4d8;
                line-height: 1.7;
              "
            >
              ${escapeHtml(report.summary)}
            </p>

            <h3
              style="
                margin: 24px 0 8px;
                color: #ffffff;
              "
            >
              Strengths
            </h3>

            <ul
              style="
                margin: 0;
                padding-left: 20px;
                color: #d4d4d8;
                line-height: 1.8;
              "
            >
              ${strengthsHtml}
            </ul>

            <h3
              style="
                margin: 24px 0 8px;
                color: #ffffff;
              "
            >
              Priority opportunities
            </h3>

            ${opportunityHtml}

            <h3
              style="
                margin: 24px 0 8px;
                color: #ffffff;
              "
            >
              Quick wins
            </h3>

            <ul
              style="
                margin: 0;
                padding-left: 20px;
                color: #d4d4d8;
                line-height: 1.8;
              "
            >
              ${quickWinsHtml}
            </ul>

            <h3
              style="
                margin: 24px 0 8px;
                color: #ffffff;
              "
            >
              AI and automation opportunities
            </h3>

            <ul
              style="
                margin: 0;
                padding-left: 20px;
                color: #d4d4d8;
                line-height: 1.8;
              "
            >
              ${automationHtml}
            </ul>

            <h3
              style="
                margin: 24px 0 8px;
                color: #ffffff;
              "
            >
              Recommended next step
            </h3>

            <p
              style="
                margin: 0;
                color: #d4d4d8;
                line-height: 1.7;
              "
            >
              ${escapeHtml(report.nextStep)}
            </p>

            <p
              style="
                margin: 24px 0 0;
                color: #71717a;
                font-size: 12px;
                line-height: 1.6;
              "
            >
              ${escapeHtml(report.disclaimer)}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
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
    const openAiApiKey =
      process.env.OPENAI_API_KEY;

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

    const body =
      (await request.json()) as AuditPayload;

    const name = clean(body.name, 120);
    const email = clean(
      body.email,
      254,
    ).toLowerCase();
    const phone = clean(body.phone, 50);
    const company = clean(body.company, 160);
    const website = clean(body.website, 500);
    const auditFocus = clean(
      body.auditFocus,
      100,
    );
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
          error:
            "Please complete all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
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

    if (website) {
      try {
        const parsedWebsite = new URL(website);

        if (
          parsedWebsite.protocol !== "http:" &&
          parsedWebsite.protocol !== "https:"
        ) {
          throw new Error(
            "Unsupported website protocol.",
          );
        }

        if (
          isPrivateHostname(
            parsedWebsite.hostname,
          )
        ) {
          throw new Error(
            "Private network URLs are not allowed.",
          );
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

    const homepageText =
      await getHomepageText(website);

    const openai = new OpenAI({
      apiKey: openAiApiKey,
    });

    const response =
      await openai.responses.create({
        model:
          process.env.OPENAI_AUDIT_MODEL ??
          "gpt-5-mini",

        instructions: `
You are a senior business-growth, website-conversion, SEO, AI, and automation consultant for AH LLC.

Create a useful preliminary audit from the visitor's submitted business information and any publicly accessible homepage text.

Rules:
- Never invent analytics, rankings, page-speed scores, revenue, conversion rates, guarantees, clients, or technical defects.
- Clearly distinguish direct observations from reasonable inferences.
- Do not claim that you tested site speed, analytics, security, accessibility, search rankings, or backend systems.
- Keep recommendations practical, specific, and concise.
- The overall score is a preliminary growth-readiness and opportunity score, not a certified technical score.
- Use plain business language.
- Output only valid JSON.
- Do not use Markdown.
- Do not include a code fence.

Return this exact JSON shape:

{
  "overallScore": 0,
  "summary": "",
  "strengths": [""],
  "opportunities": [
    {
      "title": "",
      "impact": "High",
      "finding": "",
      "recommendation": ""
    }
  ],
  "quickWins": [""],
  "aiAutomationIdeas": [""],
  "nextStep": "",
  "disclaimer": ""
}

Requirements:
- Return 3 to 5 opportunities.
- Return 3 to 5 quick wins.
- Return 2 to 5 AI or automation ideas.
- Every opportunity impact must be exactly "High", "Medium", or "Low".
        `.trim(),

        input: `
BUSINESS SUBMISSION

Name:
${name}

Company:
${company}

Website:
${website || "Not provided"}

Audit focus:
${displayValue(auditFocus)}

Biggest challenge:
${challenge}

Desired result:
${goal}

Budget:
${
  budget
    ? displayValue(budget)
    : "Not provided"
}

Timeline:
${displayValue(timeline)}

PUBLIC HOMEPAGE TEXT

${
  homepageText ||
  "Homepage content was unavailable. Base the audit only on the visitor submission and explicitly acknowledge that limitation."
}
        `.trim(),

        max_output_tokens: 1_500,
        store: false,
      });

    if (!response.output_text) {
      throw new Error(
        "OpenAI returned an empty audit response.",
      );
    }

    const report = normalizeReport(
      parseJson(response.output_text),
    );

    const resendApiKey =
      process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL;
    const contactEmail =
      process.env.CONTACT_TO_EMAIL;

    if (
      resendApiKey &&
      fromEmail &&
      contactEmail
    ) {
      const resend = new Resend(
        resendApiKey,
      );

      const emailResult =
        await resend.emails.send({
          from: fromEmail,
          to: [contactEmail],
          replyTo: email,
          subject: `AI Audit Lead — ${company} — ${report.overallScore}/100`,
          html: createLeadEmailHtml({
            name,
            email,
            phone,
            company,
            website,
            challenge,
            goal,
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
            `Budget: ${
              budget
                ? displayValue(budget)
                : "Not provided"
            }`,
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

      if (emailResult.error) {
        console.error(
          "Audit lead email failed:",
          emailResult.error,
        );
      }
    } else {
      console.warn(
        "The audit was generated, but Resend environment variables are incomplete.",
      );
    }

    return NextResponse.json({
      success: true,
      report,
    });
  }catch (error) {
  console.error("POST /api/free-audit failed:", error);

  const message =
    error instanceof Error
      ? error.message
      : String(error);

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