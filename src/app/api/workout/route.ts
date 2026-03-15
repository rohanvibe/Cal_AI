import { NextRequest, NextResponse } from "next/server";
import { generateWorkout } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    // In a real app, we'd fetch user stats from a DB here
    const mockUserStats = {
      goal: "muscle gain",
      experience: "intermediate",
      equipment: ["dumbbells", "bench", "pull-up bar"],
      activityLevel: "moderate"
    };

    const result = await generateWorkout(mockUserStats);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Workout generation error:", error);
    return NextResponse.json({ error: "Failed to generate workout" }, { status: 500 });
  }
}
