import { NextRequest, NextResponse } from "next/server";
import { chatWithAI } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, messages } = body;
    
    console.log("Chat API Request received");
    
    if (!profile || !messages) {
      console.error("Missing profile or messages in request body");
      return NextResponse.json({ error: "Missing profile or messages. Please complete onboarding first." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in environment");
      return NextResponse.json({ error: "AI Key is missing. Check your .env.local file." }, { status: 500 });
    }

    console.log("Calling Gemini for chat response...");
    const aiResponse = await chatWithAI(profile, messages);
    console.log("Gemini response received successfully");
    
    return NextResponse.json({ content: aiResponse });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to get AI response",
      details: error.stack 
    }, { status: 500 });
  }
}
