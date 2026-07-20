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
  companyWebsite?: unknown;
};

type AuditReport = {
  overallScore: number;
  summary: string;
  strengths: string[];
  opportunities: Array<{
    title: string;
    impact: "High" | "Medium" | "Low";
    finding: string;
    recommendation: string;
  }>;
  quickWins: string[];
  aiAutomationIdeas: string[];
  nextStep: string;
  disclaimer: string;
};

const clean = (value: unknown, max = 4000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const validEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const display = (value: string) =>
  value.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

function parseJson(text: string) {
  try {
    return JSON.parse(text.trim()) as unknown;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end <= start) {
      throw new Error("AI response did not contain valid JSON.");
    }
    return JSON.parse(text.slice(start, end + 1)) as unknown;
  }
}

function normalizeReport(value: unknown): AuditReport {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const strings = (input: unknown, max = 5) =>
    Array.isArray(input)
      ? input
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, max)
      : [];

  const score = Number(source.overallScore);

  return {
    overallScore: Number.isFinite(score)
      ? Math.max(0, Math.min(100, Math.round(score)))
      : 50,
    summary:
      typeof source.summary === "string"
        ? source.summary.trim()
        : "This preliminary audit identifies practical growth opportunities.",
    strengths: strings(source.strengths, 4),
    opportunities: Array.isArray(source.opportunities)
      ? source.opportunities
          .filter(
            (item): item is Record<string, unknown> =>
              Boolean(item) && typeof item === "object",
          )
          .map((item) => ({
            title:
              typeof item.title === "string"
                ? item.title.trim()
                : "Growth opportunity",
            impact:
              item.impact === "High" || item.impact === "Low"
                ? item.impact
                : "Medium",
            finding:
              typeof item.finding === "string"
                ? item.finding.trim()
                : "",
            recommendation:
              typeof item.recommendation === "string"
                ? item.recommendation.trim()
                : "",
          }))
          .filter(
            (item) =>
              item.title && item.finding && item.recommendation,
          )
          .slice(0, 5)
      : [],
    quickWins: strings(source.quickWins, 5),
    aiAutomationIdeas: strings(source.aiAutomationIdeas, 5),
    nextStep:
      typeof source.nextStep === "string"
        ? source.nextStep.trim()
        : "Schedule a strategy call with AH LLC to validate priorities and plan implementation.",
    disclaimer:
      typeof source.disclaimer === "string"
        ? source.disclaimer.trim()
        : "This is a preliminary AI-generated audit based on submitted information and should be validated through a complete technical review.",
  };
}

async function getHomepageText(website: string) {
  if (!website) return "";

  try {
    const url = new URL(website);

    if (!["http:", "https:"].includes(url.protocol)) return "";

    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.endsWith(".local") ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0"
    ) {
      return "";
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "AHLLC-AuditBot/1.0 (+https://ahllc.biz)",
        Accept: "text/html",
      },
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!response.ok) return "";

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return "";

    const html = (await response.text()).slice(0, 250000);

    return html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);
  } catch {
    return "";
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
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "The instant audit service is temporarily unavailable." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as AuditPayload;

    if (clean(body.companyWebsite, 200)) {
      return NextResponse.json({ success: true });
    }

    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 50);
    const company = clean(body.company, 160);
    const website = clean(body.website, 500);
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
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!validEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Please confirm that AH LLC may contact you." },
        { status: 400 },
      );
    }

    const homepageText = await getHomepageText(website);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.responses.create({
      model: process.env.OPENAI_AUDIT_MODEL ?? "gpt-5-mini",
      instructions: `
You are a senior business-growth, website-conversion, SEO, AI, and automation consultant for AH LLC.

Create a preliminary audit from the visitor submission and any public homepage text.

Rules:
- Never invent analytics, rankings, speed scores, revenue, conversion rates, guarantees, or technical defects.
- Clearly distinguish observations from inferences.
- Keep recommendations practical and specific.
- Output only valid JSON with this exact shape:
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
Return 3-5 opportunities, 3-5 quick wins, and 2-5 AI automation ideas.
      `.trim(),
      input: `
Company: ${company}
Website: ${website || "Not provided"}
Audit focus: ${display(auditFocus)}
Challenge: ${challenge}
Goal: ${goal}
Budget: ${budget ? display(budget) : "Not provided"}
Timeline: ${display(timeline)}

Public homepage text:
${homepageText || "Unavailable. Base the audit on the submission and state that limitation."}
      `.trim(),
      max_output_tokens: 1500,
      store: false,
    });

    const report = normalizeReport(
      parseJson(response.output_text ?? ""),
    );

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (resendKey && fromEmail && toEmail) {
      const resend = new Resend(resendKey);

      const result = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        replyTo: email,
        subject: `AI Audit Lead — ${company} — ${report.overallScore}/100`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#09090b;color:#f4f4f5;padding:28px">
            <div style="max-width:720px;margin:auto;background:#18181b;border:1px solid #27272a;border-radius:18px;padding:28px">
              <h1 style="margin-top:0;color:#67e8f9">New AI Audit Lead</h1>
              <p><strong>${escapeHtml(name)}</strong> — ${escapeHtml(company)}</p>
              <p>${escapeHtml(email)}${phone ? ` · ${escapeHtml(phone)}` : ""}</p>
              <p>${website ? escapeHtml(website) : "No website provided"}</p>
              <p><strong>Challenge:</strong> ${escapeHtml(challenge)}</p>
              <p><strong>Goal:</strong> ${escapeHtml(goal)}</p>
              <hr style="border-color:#27272a;margin:24px 0" />
              <h2>Audit score: ${report.overallScore}/100</h2>
              <p>${escapeHtml(report.summary)}</p>
              <h3>Priority opportunities</h3>
              ${report.opportunities
                .map(
                  (item) => `
                    <div style="margin:12px 0;padding:14px;background:#09090b;border-radius:10px">
                      <strong>${escapeHtml(item.title)} — ${escapeHtml(item.impact)} impact</strong>
                      <p>${escapeHtml(item.finding)}</p>
                      <p><strong>Recommendation:</strong> ${escapeHtml(item.recommendation)}</p>
                    </div>
                  `,
                )
                .join("")}
            </div>
          </div>
        `,
      });

      if (result.error) {
        console.error("Audit email failed:", result.error);
      }
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("POST /api/free-audit failed:", error);

    return NextResponse.json(
      { error: "The instant audit could not be generated. Please try again." },
      { status: 500 },
    );
  }
}
