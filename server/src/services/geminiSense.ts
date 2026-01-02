// src/llm/geminiSense.ts
import type { SenseSource } from "../types/types.ts"

export interface LlmSenseResponse {
  meaning: string;
  simplified: string;
  synonyms: string[];
  example: string;
  tone: string;
  partOfSpeech?: "noun" | "verb" | "adj" | "adv" | "other";
  domainTags?: string[];
  source: SenseSource; // "gemini" or "fallback"
}

/**
 * Call your Gemini (or other LLM) backend here.
 * This is a stub example.
 */
export async function getSenseFromLlm(
  lemma: string,
  context: string
): Promise<LlmSenseResponse> {
  // TODO: Replace with real HTTP call to your backend
  // e.g., POST /api/sense-with-context

  console.log("[FAKE LLM] called for:", { lemma, context });

  return {
    meaning: `Dummy meaning for "${lemma}" based on context.`,
    simplified: `Simple explanation of "${lemma}" in this sentence.`,
    synonyms: [],
    example: `Example usage for "${lemma}".`,
    tone: "neutral",
    partOfSpeech: "noun",
    domainTags: [],
    source: "fallback",
  };
}
