import { NextRequest, NextResponse } from "next/server";
import { calculateNutritionGoals } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    console.log("Profile Init: Key present =", !!process.env.GEMINI_API_KEY);
    const userStats = await req.json();
    const aiCalculations = await calculateNutritionGoals(userStats);
    
    return NextResponse.json({
        ...userStats,
        ...aiCalculations
    });
  } catch (error: any) {
    console.error("Profile initialization error:", error);
    return NextResponse.json({ error: error.message || "Failed to initialize AI profile" }, { status: 500 });
  }
}
