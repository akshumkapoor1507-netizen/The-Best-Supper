import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Ingredient, UserPreferences } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ===== Models =====
export const flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
export const proModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// ===== Prompts =====
export const KITCHEN_ANALYSIS_PROMPT = `You are a professional chef's assistant with expert knowledge of food ingredients
and kitchen inventory. You are given photographs of a kitchen, refrigerator,
pantry, or countertop.

Your task: identify every visible food ingredient with high confidence.

Respond ONLY with valid JSON. No preamble, no explanation, no markdown. Schema:
{
  "ingredients": [
    {
      "name": "string",
      "category": "protein | vegetable | fruit | grain | dairy | fat | spice | condiment | other",
      "estimated_quantity": "string or null",
      "confidence": "high | medium | low"
    }
  ],
  "notes": "string or null"
}

Only include items identifiable with medium or high confidence.
Use generic common names a recipe database would recognise.
Do not include non-food items.`;

export function buildRecipePrompt(
  ingredients: Ingredient[],
  preferences: UserPreferences
): string {
  const ingredientList = ingredients
    .map((i) => `- ${i.name} (${i.category}${i.estimated_quantity ? ', ' + i.estimated_quantity : ''})`)
    .join('\n');

  const healthGoalLabels: Record<string, string> = {
    'healthy': 'Healthy & Balanced',
    'high-protein': 'High Protein',
    'keto': 'High Fat / Keto',
    'plant-based': 'Plant-Based',
    'low-calorie': 'Low Calorie',
    'indulgent': 'Indulgent',
  };

  const complexityLabels: Record<string, string> = {
    'quick': 'Quick & Easy (<20 min)',
    'home-cooked': 'Home Cooked (30-60 min)',
    'full-meal': 'Full Proper Meal (1-2 hrs)',
    'fine-dining': 'Fine Dining (2+ hrs)',
  };

  const healthGoal = preferences.healthGoal
    ? healthGoalLabels[preferences.healthGoal] || preferences.healthGoal
    : 'No preference';

  const complexity = preferences.complexity
    ? complexityLabels[preferences.complexity] || preferences.complexity
    : 'No preference';

  const occasions = preferences.occasions.length > 0
    ? preferences.occasions.join(', ')
    : 'Any occasion';

  const restrictions = preferences.dietaryRestrictions.length > 0
    ? preferences.dietaryRestrictions.filter(r => r !== 'none').join(', ')
    : 'None';

  const format = preferences.mealFormat === 'full-spread'
    ? `Full Spread (${[
        preferences.includeStarter && 'Starter',
        preferences.includeMain && 'Main',
        preferences.includeDessert && 'Dessert',
      ].filter(Boolean).join(' + ')})`
    : 'Single Dish';

  const count = preferences.mealFormat === 'full-spread' ? 5 : 3;

  return `You are The Best Supper, a world-class AI chef with Michelin-star knowledge and
the warmth of a home cook.

The user has these ingredients available:
${ingredientList}

Their preferences:
- Health goal: ${healthGoal}
- Meal complexity: ${complexity}
- Occasion: ${occasions}
- Serves: ${preferences.servings} people
- Format: ${format}
- Dietary restrictions: ${restrictions}

Generate exactly ${count} recipes. 

Respond ONLY with valid JSON. No preamble, no markdown. Schema:
{
  "recipes": [{
    "id": "string (slug)",
    "name": "string",
    "tagline": "string (max 12 words, punchy and appetising)",
    "description": "string (2-3 sentences, evocative, mouth-watering)",
    "cuisine": "string",
    "difficulty": "easy | medium | hard | expert",
    "cook_time_minutes": number,
    "prep_time_minutes": number,
    "servings": ${preferences.servings},
    "health_tags": ["string"],
    "occasion_tags": ["string"],
    "ingredients_available": [
      { "name": "string", "quantity": "string", "unit": "string or null" }
    ],
    "ingredients_needed": [
      { "name": "string", "quantity": "string", "unit": "string or null", "optional": boolean }
    ],
    "instructions": [
      { "step": number, "title": "string", "detail": "string" }
    ],
    "nutrition_per_serving": {
      "calories": number, "protein_g": number,
      "carbs_g": number, "fat_g": number, "fibre_g": number
    },
    "chef_tip": "string (one specific, actionable pro tip)"
  }]
}

Rules:
- Prioritise recipes using the MOST available ingredients
- Clearly separate what user has vs needs to buy
- Match difficulty STRICTLY to requested complexity
- ALL recipes MUST comply with dietary restrictions — no exceptions
- Make descriptions genuinely appetising`;
}
