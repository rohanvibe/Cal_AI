import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to get the model with the current API key from environment
function getAIModel(modelName: string) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

// User specified using Gemini 2.5 Flash
const DEFAULT_MODEL = "gemini-2.5-flash";

export async function analyzeMealImage(imageBuffer: Buffer, mimeType: string) {
  if (!process.env.GEMINI_API_KEY) {
      return {
        name: "Demo Meal",
        calories: 500,
        protein: 30,
        carbs: 50,
        fats: 20,
        ingredients: ["Mock Quinoa"],
        rating: 8,
        tips: "Add your API key to see actual AI analysis."
      };
  }
  
  const model = getAIModel(DEFAULT_MODEL);
  const prompt = `
    Analyze this meal image. 
    Provide:
    1. Meal Name.
    2. Approximate Calories.
    3. Macronutrients (Protein, Carbs, Fats in grams).
    4. Main ingredients.
    5. Health rating (1-10).
    6. Tips for improvement.
    Return ONLY JSON format:
    {
      "name": "string",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "ingredients": ["string"],
      "rating": number,
      "tips": "string"
    }
  `;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    },
  ]);

  const response = await result.response;
  const text = response.text();
  const cleanJson = text.replace(/^[^{]*|[^}]*$/g, "").trim();
  return JSON.parse(cleanJson);
}

export async function calculateNutritionGoals(userStats: any) {
  const model = getAIModel(DEFAULT_MODEL);
  const prompt = `
    Act as a professional sports performance nutritionist and fitness coach.
    Based on the following user profile and their specific ambition, calculate their targets.
    
    USER PROFILE:
    - Name: ${userStats.name}
    - Age: ${userStats.age}
    - Weight: ${userStats.weight}kg
    - Height: ${userStats.height}cm
    - Activity Level: ${userStats.activity}
    
    USER'S SPECIFIC AMBITION:
    "${userStats.goal}"
    
    TASKS:
    1. Calculate optimal Daily Calorie Target to achieve this specific goal.
    2. Define Macro breakdown: Protein, Carbs, Fats (in grams).
    3. Generate a professional Name for this specific plan.
    4. Provide a clear, professional "AI Reasoning" (2-3 sentences) explaining how these numbers specifically address their text goal.
    
    Return ONLY JSON:
    {
      "dailyCalories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "suggestedGoal": "string",
      "aiReasoning": "string"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const cleanJson = text.replace(/^[^{]*|[^}]*$/g, "").trim();
  return JSON.parse(cleanJson);
}

export async function generateWorkout(userStats: any) {
  const model = getAIModel(DEFAULT_MODEL);
  const prompt = `
    Generate a personalized workout plan for a user with these stats:
    ${JSON.stringify(userStats)}
    Include 5 exercises with sets, reps, and target muscle groups.
    Return ONLY JSON format:
    {
      "planName": "string",
      "exercises": [
        { "name": "string", "sets": number, "reps": "string", "muscle": "string", "instructions": "string" }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const cleanJson = text.replace(/^[^{]*|[^}]*$/g, "").trim();
  return JSON.parse(cleanJson);
}
