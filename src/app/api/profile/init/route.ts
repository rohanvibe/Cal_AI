import { NextRequest, NextResponse } from "next/server";
import { calculateNutritionGoals } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const userStats = await req.json();
    const aiCalculations = await calculateNutritionGoals(userStats);
    
    return NextResponse.json({
        ...userStats,
        ...aiCalculations
    });
  } catch (error) {
    console.error("Profile initialization error:", error);
    return NextResponse.json({ error: "Failed to initialize AI profile" }, { status: 500 });
  }
}
