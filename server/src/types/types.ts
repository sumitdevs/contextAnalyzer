// src/types.ts
export interface WordDoc {
  _id: string;
  lemma: string;       // normalized word: "bank"
  language: string;    // "en"
  createdAt: Date;
  updatedAt: Date;
}



export interface Env {
  NODE_ENV: string,
  PORT: number,
  JWT_SECRET: string,
  JWT_EXPIRES_IN: string,
  DB: {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
  }
}
export type SenseSource = "gemini" | "fallback" | "manual";

export interface WordSenseDoc {
  _id: string;
  wordId: string;       // ref to WordDoc._id
  senseKey: string;     // e.g. "bank#1"
  partOfSpeech: "noun" | "verb" | "adj" | "adv" | "other";

  meaning: string;
  simplified: string;
  synonyms: string[];
  example: string;
  tone: string;
  source: SenseSource;

  embedding: number[];  // sense-level embedding

  domainTags?: string[];
  usageCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface WordUsageDoc {
  _id: string;
  userId?: string;
  wordId: string;
  senseId: string;

  selectedText: string;
  fullSentence: string;
  pageUrl: string;

  contextEmbedding: number[];

  createdAt: Date;
}

export interface DisambiguationInput {
  lemma: string;
  language: string;
  selectedText: string;
  fullSentence: string;
  pageUrl: string;
}

export interface DisambiguationResult {
  word: WordDoc;
  sense: WordSenseDoc;
  usage: WordUsageDoc;
  createdNewSense: boolean;
  similarity: number | null;
}
