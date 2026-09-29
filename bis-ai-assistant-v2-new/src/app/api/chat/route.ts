import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.8-flash",
  "gemini-3.8-flash-lite",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid message." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from the server environment." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    let lastError: unknown = null;

    for (const model of MODELS) {
      try {
        console.log(`Trying Gemini model: ${model}`);

        const response = await ai.models.generateContent({
          model,
          contents: message.trim(),
        });

        console.log(`Gemini success with model: ${model}`);

        return NextResponse.json({
          answer: response.text ?? "Gemini returned an empty response.",
          model,
        });
      } catch (error) {
        lastError = error;

        console.error(`Model ${model} failed:`, error);

        continue;
      }
    }

    console.error("All Gemini models failed:", lastError);

    return NextResponse.json(
      {
        error:
          lastError instanceof Error
            ? lastError.message
            : "All Gemini models are currently unavailable.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process your request.",
      },
      { status: 500 }
    );
  }
}