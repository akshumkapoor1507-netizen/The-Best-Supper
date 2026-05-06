import { NextRequest, NextResponse } from 'next/server';
import { flashModel, KITCHEN_ANALYSIS_PROMPT } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrls } = body as { imageUrls: string[] };

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one image URL is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Build image parts for Gemini
    const imageParts = await Promise.all(
      imageUrls.map(async (url) => {
        // Handle base64 data URLs
        if (url.startsWith('data:')) {
          const matches = url.match(/^data:(.+?);base64,(.+)$/);
          if (!matches) throw new Error('Invalid data URL format');
          return {
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          };
        }

        // Handle remote URLs - fetch and convert to base64
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        return {
          inlineData: {
            mimeType: contentType,
            data: base64,
          },
        };
      })
    );

    const result = await flashModel.generateContent([
      KITCHEN_ANALYSIS_PROMPT,
      ...imageParts,
    ]);

    const responseText = result.response.text();

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    // Validate response shape
    if (!parsed.ingredients || !Array.isArray(parsed.ingredients)) {
      return NextResponse.json(
        { error: 'Invalid response from AI: missing ingredients array' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Kitchen analysis error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to analyse kitchen: ${message}` },
      { status: 500 }
    );
  }
}
