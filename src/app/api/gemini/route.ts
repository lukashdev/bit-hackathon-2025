import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Pobierz klucz API ze zmiennych środowiskowych
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Brak klucza API Google AI (GOOGLE_AI_API_KEY)" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Brak promptu w ciele żądania" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Używamy modelu Flash Lite. 
    // Jeśli "2.5" jest dostępne, zmień nazwę modelu tutaj.
    // Obecnie standardem dla Flash Lite jest seria 2.0.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite-preview-02-05" 
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Błąd komunikacji z Google AI:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas przetwarzania żądania." },
      { status: 500 }
    );
  }
}
