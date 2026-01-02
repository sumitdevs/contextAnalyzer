// src/repositories/WordRepository.ts
import type {
  WordDoc,
  WordSenseDoc,
  WordUsageDoc
 } from "../types/types";
import { randomUUID } from "crypto";

export interface WordRepository {
  findWord(lemma: string, language: string): Promise<WordDoc | null>;
  createWord(lemma: string, language: string): Promise<WordDoc>;
  getSensesForWord(wordId: string): Promise<WordSenseDoc[]>;
  createSense(sense: Omit<WordSenseDoc, "_id">): Promise<WordSenseDoc>;
  updateSenseUsageCount(senseId: string, delta: number): Promise<void>;
  createUsage(usage: Omit<WordUsageDoc, "_id">): Promise<WordUsageDoc>;
}

// Simple in-memory implementation for demo
export class InMemoryWordRepository implements WordRepository {
  private words: WordDoc[] = [];
  private senses: WordSenseDoc[] = [];
  private usages: WordUsageDoc[] = [];

  async findWord(lemma: string, language: string): Promise<WordDoc | null> {
    return this.words.find(
      (w) => w.lemma === lemma && w.language === language
    ) ?? null;
  }

  async createWord(lemma: string, language: string): Promise<WordDoc> {
    const word: WordDoc = {
      _id: randomUUID(),
      lemma,
      language,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.words.push(word);
    return word;
  }

  async getSensesForWord(wordId: string): Promise<WordSenseDoc[]> {
    return this.senses.filter((s) => s.wordId === wordId);
  }

  async createSense(sense: Omit<WordSenseDoc, "_id">): Promise<WordSenseDoc> {
    const doc: WordSenseDoc = {
      _id: randomUUID(),
      ...sense,
    };
    this.senses.push(doc);
    return doc;
  }

  async updateSenseUsageCount(senseId: string, delta: number): Promise<void> {
    const sense = this.senses.find((s) => s._id === senseId);
    if (sense) {
      sense.usageCount += delta;
      sense.updatedAt = new Date();
    }
  }

  async createUsage(usage: Omit<WordUsageDoc, "_id">): Promise<WordUsageDoc> {
    const doc: WordUsageDoc = {
      _id: randomUUID(),
      ...usage,
    };
    this.usages.push(doc);
    return doc;
  }
}
