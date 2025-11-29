"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function generateContentAction(prompt: string) {
  // 1. Walidacja sesji
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "Użytkownik nie jest zalogowany",
    };
  }

  // 2. Walidacja danych wejściowych
  if (!prompt) {
    return {
      success: false,
      error: "Brak promptu",
    };
  }

  try {
    // 3. Wywołanie API route /api/gemini
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Wystąpił błąd podczas wywoływania API Gemini.");
    }

    const data = await response.json();
    const text = data.response;

    return {
      success: true,
      data: text,
    };

  } catch (error) {
    console.error("Błąd generowania treści:", error instanceof Error ? error.message : error);
    return {
      success: false,
      error: "Wystąpił błąd podczas generowania treści.",
    };
  }
}
