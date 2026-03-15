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
    - Age: ${userStats.age} (CRITICAL: Adjust recommendations based on this age. If the user is a child or adolescent, prioritize growth and safety over aggressive performance.)
    - Weight: ${userStats.weight}kg
    - Height: ${userStats.height}cm
    - Activity Level: ${userStats.activity}
    
    USER'S AMBITION:
    "${userStats.goal}"
    
    REQUIREMENTS:
    1. Calculate Daily Calorie Target (ensure safety for their specific age).
    2. Define Macros: Protein, Carbs, Fats (in grams).
    3. Generate a Plan Name.
    4. Provide AI Reasoning explaining why these numbers are safe and effective for someone who is ${userStats.age} years old with their goals.
    
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
    
    AGE SENSITIVITY: The user is ${userStats.age} years old. 
    - If under 18: Focus on mobility, technique, and bodyweight exercises. Avoid heavy lifting that impacts growth.
    - If adult: Standard fitness protocols.
    
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
  
  const systemInstruction = `
    You are Cal AI, a friendly and professional fitness/nutrition mentor.
    User Profile: ${JSON.stringify(userProfile)}
    
    Your tone: Encouraging, concise, and safety-first.
    Important: The user is ${userProfile.age} years old. Always provide age-appropriate advice. 
    Never suggest dangerous supplements or extreme diets.
    
    Stay in character. If asked about non-fitness topics, politely steer them back to health and wellness.
  `;

  const chat = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    })),
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const lastMessage = messages[messages.length - 1].content;
  const fullPrompt = `${systemInstruction}\n\nUser Question: ${lastMessage}`;
  
  const result = await chat.sendMessage(fullPrompt);
  const response = await result.response;
  return response.text();
}
