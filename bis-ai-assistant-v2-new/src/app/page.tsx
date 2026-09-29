"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! 👋 I’m BIS AI Assistant. Ask me anything about Bureau of Indian Standards, certification, standards, licences, or BIS procedures.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    setInput("");

    setMessages((current) => [
      ...current,
      { role: "user", content: message },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `Sorry, I couldn't process that request. ${error.message}`
              : "Sorry, I couldn't process that request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col">
        <header className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
              BIS
            </div>

            <div>
              <h1 className="text-xl font-semibold">
                BIS AI Assistant
              </h1>

              <p className="text-sm text-slate-400">
                AI-powered assistant for Indian Standards & BIS Services
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2 text-sm text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Online
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 leading-7 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-white/10 bg-white/5 text-slate-200"
                  }`}
                >
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {message.role === "user" ? "You" : "BIS AI"}
                  </div>

                  <div className="whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-slate-400">
                  BIS AI is thinking...
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="border-t border-white/10 p-4 sm:p-6">
          <form
            onSubmit={sendMessage}
            className="mx-auto flex max-w-3xl gap-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about BIS standards, certification, licences..."
              disabled={loading}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "..." : "Ask"}
            </button>
          </form>

          <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-slate-500">
            BIS AI Assistant may make mistakes. Verify important
            regulatory information with official BIS sources.
          </p>
        </div>
      </div>
    </main>
  );
}