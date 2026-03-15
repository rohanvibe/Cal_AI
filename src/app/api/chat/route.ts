import { NextRequest, NextResponse } from "next/server";
import { chatWithAI } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { profile, messages } = await req.json();
    
    if (!profile || !messages) {
      return NextResponse.json({ error: "Missing profile or messages" }, { status: 400 });
    }

    const aiResponse = await chatWithAI(profile, messages);
    
    return NextResponse.json({ content: aiResponse });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message || "Failed to get AI response" }, { status: 500 });
  }
}
