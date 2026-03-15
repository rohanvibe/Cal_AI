import { NextRequest, NextResponse } from "next/server";
import { generateWorkout } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { profile, constraints } = await req.json();
    
    if (!profile) {
      return NextResponse.json({ error: "No profile provided" }, { status: 400 });
    }

    const workout = await generateWorkout(profile, constraints);
    
    return NextResponse.json(workout);
  } catch (error: any) {
    console.error("Workout generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate workout" }, { status: 500 });
  }
}
