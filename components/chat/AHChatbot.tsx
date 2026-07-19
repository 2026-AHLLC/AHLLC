"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi, I’m the AH LLC assistant. I can help with websites, AI solutions, automation, SEO, digital marketing, and custom software. What would you like to improve in your business?",
  },
];

export function AHChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

    if (!content || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send message.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            data.message ||
            "I’m sorry, but I couldn’t generate a response.",
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "The assistant is temporarily unavailable.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isOpen && (
        <section
          aria-label="AH LLC AI assistant"
          className="fixed bottom-24 right-4 z-50 flex h-[min(620px,calc(100vh-120px))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0e] shadow-2xl shadow-black/50 sm:right-6"
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-violet-600/20 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  AH LLC Assistant
                </h2>
                <p className="flex items-center gap-1 text-xs text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Online
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[84%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm leading-6 text-white"
                      : "max-w-[88%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-zinc-200"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-zinc-400">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="mb-3 flex gap-2 overflow-x-auto">
              {[
                "I need a website",
                "How can AI help?",
                "Request a free audit",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:border-blue-500/50 hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form
              onSubmit={sendMessage}
              className="flex items-end gap-2"
            >
              <label htmlFor="ah-chat-input" className="sr-only">
                Message the AH LLC assistant
              </label>

              <textarea
                id="ah-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                maxLength={2_000}
                placeholder="Ask about your project..."
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-2 text-center text-[11px] text-zinc-600">
              AI responses may contain errors.{" "}
              <Link
                href="/contact"
                className="text-zinc-400 hover:text-white"
              >
                Contact AH LLC
              </Link>
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        className="fixed bottom-5 right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-blue-600 px-5 font-bold text-white shadow-xl shadow-blue-950/50 transition hover:-translate-y-0.5 hover:bg-blue-500 sm:right-6"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5" />
            <span>Ask AH AI</span>
            <Sparkles className="h-4 w-4" />
          </>
        )}
      </button>
    </>
  );
}