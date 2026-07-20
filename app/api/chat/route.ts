import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const instructions = `
You are the AI assistant for AH LLC.

AH LLC provides AI consulting, website development, business automation,
SEO, digital marketing, and custom software.

Answer clearly and professionally. Keep most responses under 150 words.
Never invent prices, guarantees, clients, or results.
When appropriate, direct visitors to /contact or /free-audit.
`;

export async function GET() {
  return NextResponse.json({
    status: "ok",
    route: "/api/chat",
    configured: Boolean(process.env.OPENAI_API_KEY),
  });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is missing from .env.local. Restart the development server after adding it.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      messages?: ChatMessage[];
    };

    const messages = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (message): message is ChatMessage =>
              Boolean(message) &&
              (message.role === "user" ||
                message.role === "assistant") &&
              typeof message.content === "string" &&
              message.content.trim().length > 0,
          )
          .map((message) => ({
            role: message.role,
            content: message.content.trim(),
          }))
          .slice(-12)
      : [];

    const latestMessage = messages.at(-1);

    if (!latestMessage || latestMessage.role !== "user") {
      return NextResponse.json(
        { error: "A user message is required." },
        { status: 400 },
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-5.4-mini",
      instructions,
      input: messages,
      max_output_tokens: 500,
      store: false,
    });

    return NextResponse.json({
      message:
        response.output_text?.trim() ||
        "I could not generate a response. Please try again.",
    });
  } catch (error) {
    console.error("POST /api/chat failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown server error";

    return NextResponse.json(
      {
        error: `Chat API error: ${message}`,
      },
      { status: 500 },
    );
  }
}