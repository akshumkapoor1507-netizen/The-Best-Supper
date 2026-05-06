import { NextRequest, NextResponse } from 'next/server';
import { proModel, buildRecipePrompt } from '@/lib/gemini';
import type { Ingredient, UserPreferences } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredients, preferences } = body as {
      ingredients: Ingredient[];
      preferences: UserPreferences;
    };

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'At least one ingredient is required' },
        { status: 400 }
      );
    }

    if (!preferences) {
      return NextResponse.json(
        { error: 'Preferences are required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const prompt = buildRecipePrompt(ingredients, preferences);

    const result = await proModel.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    // Validate response shape
    if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
      return NextResponse.json(
        { error: 'Invalid response from AI: missing recipes array' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Recipe generation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate recipes: ${message}` },
      { status: 500 }
    );
  }
}
