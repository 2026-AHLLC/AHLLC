import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const AH_LLC_INSTRUCTIONS = `
You are the AI assistant for AH LLC.

AH LLC provides:
- AI consulting
- Website design and development
- Business automation
- Search engine optimization
- Digital marketing
- Custom software
- AI-powered business solutions

Your primary goals are:
1. Answer questions about AH LLC and its services.
2. Help visitors determine which service fits their needs.
3. Encourage qualified prospects to request a free audit or contact AH LLC.
4. Collect useful project details conversationally.
5. Never invent pricing, guarantees, clients, results, or capabilities.

Communication style:
- Clear, professional, confident, and helpful.
- Keep most answers under 150 words.
- Ask only one follow-up question at a time.
- Do not use aggressive sales tactics.
- Do not claim to be human.
- Do not provide legal, medical, or financial advice.
- When appropriate, direct users to /contact or /free-audit.

When qualifying a lead, try to learn:
- Their business or organization
- Their current website or digital presence
- Their primary problem
- Their desired outcome
- Their approximate timeline
- Their preferred way to be contacted

AH LLC website:
https://ahllc.biz
`;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "The chatbot is not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as {
      messages?: ChatMessage[];
    };

    const messages = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (message): message is ChatMessage =>
              (message.role === "user" ||
                message.role === "assistant") &&
              typeof message.content === "string",
          )
          .slice(-12)
      : [];

    const latestMessage = messages.at(-1);

    if (!latestMessage || latestMessage.role !== "user") {
      return NextResponse.json(
        { error: "A user message is required." },
        { status: 400 },
      );
    }

    if (latestMessage.content.length > 2_000) {
      return NextResponse.json(
        { error: "Your message is too long." },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.4-mini",
      instructions: AH_LLC_INSTRUCTIONS,
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: 500,
      store: false,
    });

    return NextResponse.json({
      message:
        response.output_text ||
        "I’m sorry, but I couldn’t generate a response. Please try again.",
    });
  } catch (error) {
    console.error("AH LLC chatbot error:", error);

    return NextResponse.json(
      {
        error:
          "The assistant is temporarily unavailable. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}