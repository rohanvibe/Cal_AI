import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const mealModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const workoutModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function analyzeMealImage(imageBuffer: Buffer, mimeType: string) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("Mocking meal analysis...");
    return {
      name: "Healthy Salad Bowl",
      calories: 450,
      protein: 25,
      carbs: 45,
      fats: 18,
      ingredients: ["Quinoa", "Kale", "Tofu", "Avocado", "Cherry Tomatoes"],
      rating: 9,
      tips: "Excellent macronutrient balance. Try adding some flax seeds for extra Omega-3s."
    };
  }
  const prompt = `
    Analyze this meal image. 
    Provide:
    1. Meal Name.
    2. Approximate Calories.
    3. Macronutrients (Protein, Carbs, Fats in grams).
    4. Main ingredients.
    5. Health rating (1-10).
    6. Tips for improvement.
    Return ONLY JSON format like this:
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

  const result = await mealModel.generateContent([
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
  if (!process.env.GEMINI_API_KEY) {
    console.log("Mocking AI nutrition calculation...");
    return {
      dailyCalories: 2250,
      protein: 160,
      carbs: 250,
      fats: 75,
      suggestedGoal: "Lean Muscle Gain",
      aiReasoning: "Based on your activity level and height, a slight surplus will help build strength while maintaining health."
    };
  }
  const prompt = `
    Act as a professional sports nutritionist. Based on these user stats:
    ${JSON.stringify(userStats)}
    Calculate their optimal daily:
    1. Calorie target (TDEE adjustment).
    2. Protein (grams).
    3. Carbohydrates (grams).
    4. Fats (grams).
    5. A suggested primary fitness goal based on their BMI and activity.
    
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

  const result = await workoutModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const cleanJson = text.replace(/^[^{]*|[^}]*$/g, "").trim();
  return JSON.parse(cleanJson);
}

export async function generateWorkout(userStats: any) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("Mocking workout generation...");
    return {
      planName: "Full Body Strength",
      exercises: [
        { name: "Dumbbell Squats", sets: 3, reps: "12", muscle: "Quads", instructions: "Keep back straight, feet shoulder width." },
        { name: "Push Ups", sets: 3, reps: "15", muscle: "Chest/Triceps", instructions: "Maintain core tension." },
        { name: "Plank", sets: 3, reps: "60s", muscle: "Core", instructions: "Don't drop your hips." }
      ]
    };
  }
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

  const result = await workoutModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const cleanJson = text.replace(/^[^{]*|[^}]*$/g, "").trim();
  return JSON.parse(cleanJson);
}
