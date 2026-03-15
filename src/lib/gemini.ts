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
    Act as a professional health and fitness nutritionist. 
    Analyze the user's profile and provide a personalized plan.
    
    USER PROFILE:
    - Name: ${userStats.name}
    - Age: ${userStats.age} (CRITICAL: Adjust recommendations based on this age.)
    - Weight: ${userStats.weight}kg
    - Height: ${userStats.height}cm
    - Activity Level: ${userStats.activity}
    
    USER'S AMBITION:
    "${userStats.goal}"
    
    REQUIREMENTS:
    1. Calculate Daily Calorie Target (ensure safety for their specific age).
    2. Define Macros: Protein, Carbs, Fats (in grams).
    3. Generate a Plan Name.
    4. Provide AI Reasoning.
    
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

export async function generateWorkout(userStats: any, constraints: string = "") {
  const model = getAIModel(DEFAULT_MODEL);
  const prompt = `
    Generate a personalized workout plan for a user.
    USER STATS: ${JSON.stringify(userStats)}
    USER CONSTRAINTS/EQUIPMENT: "${constraints || "No specific constraints"}"
    
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

export async function chatWithAI(userProfile: any, messages: { role: 'user' | 'assistant', content: string }[]) {
  const model = getAIModel(DEFAULT_MODEL);
  
  // Use a simpler approach for chat with explicit system instruction prefix
  const systemInstruction = `YOU ARE CAL AI MENTOR. 
USER PROFILE: ${JSON.stringify(userProfile)}. 
DIRECTIONS: Stay in character. Provide age-appropriate, science-based health advice for a ${userProfile.age} year old. Be brief/concise.`;

  // Filter messages to ensure they alternate correctly for startChat
  const chatHistory = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const lastMessage = messages[messages.length - 1].content;
  // Prefix the last message with the system instruction if it's the start
  const response = await chat.sendMessage(`${systemInstruction}\n\nUSER QUESTION: ${lastMessage}`);
  const result = await response.response;
  return result.text();
}
