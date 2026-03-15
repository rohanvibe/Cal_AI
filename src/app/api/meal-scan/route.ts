import { NextRequest, NextResponse } from "next/server";
import { analyzeMealImage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    
    // Convert base64 to buffer
    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const mimeType = image.split(";")[0].split(":")[1];

    const result = await analyzeMealImage(buffer, mimeType);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Meal scan error:", error);
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 });
  }
}
