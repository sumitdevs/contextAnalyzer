// src/services/WordSenseEngine.ts
import type {
  DisambiguationInput,
  DisambiguationResult,
  WordDoc,
  WordSenseDoc,
} from "../types/types.js";
import type { WordRepository } from "../repository/wordRepo.ts";
import { Embedder } from "./embedder.js";
import { cosineSimilarity } from "../utils/similarity.ts";
import { getSenseFromLlm } from "./geminiSense.ts";

export class WordSenseEngine {
  private repo: WordRepository;
  private embedder: Embedder;

  // thresholds
  private HIGH_CONF_THRESHOLD = 0.90; //0.65
  private MEDIUM_CONF_THRESHOLD = .84;
  private MAX_SENSES_PER_WORD = 10;

  constructor(repo: WordRepository) {
    this.repo = repo;
    this.embedder = Embedder.getInstance();
  }

  private normalizeLemma(raw: string): string {
    return raw.toLowerCase().trim();
  }

  /**
   * Main entry: disambiguate a word in a given context.
   */
  async disambiguate(
    input: DisambiguationInput
  ): Promise<DisambiguationResult> {
    const lemma = this.normalizeLemma(input.lemma);
    const { language, selectedText, fullSentence, pageUrl } = input;

    // 1) Ensure word document exist s
    let word = await this.repo.findWord(lemma, language);
    if (!word) {
      word = await this.repo.createWord(lemma, language);
    }   

    // 2) Get existing senses for that word
    let senses = await this.repo.getSensesForWord(word._id);

    // 3) Embed context ONCE
    const contextEmbedding = await this.embedder.embed(fullSentence);

    let chosenSense: WordSenseDoc | null = null;
    let bestScore: number | null = null;
    let createdNewSense = false;

    if (senses.length > 0) {
      // 4) Find best sense by cosine similarity
      let best: WordSenseDoc | null = null;
      let bestSim = -1;

      for (const sense of senses) {
        const sim = cosineSimilarity(contextEmbedding, sense.embedding);
        if (sim > bestSim) {
          bestSim = sim;
          best = sense;
        }
      }

      bestScore = bestSim;

      if (best && bestSim >= this.HIGH_CONF_THRESHOLD) {
        // High confidence → reuse sense
        chosenSense = best;
      } else if (best && bestSim >= this.MEDIUM_CONF_THRESHOLD) {
        // Medium confidence → reuse sense for now (optional: log as "uncertain")
        chosenSense = best;
      } else {
        // No good existing sense → consider new
        chosenSense = null;
      }
    }

    // 5) If no good sense or we have too many senses, decide on LLM/new sense
    if (!chosenSense && senses.length < this.MAX_SENSES_PER_WORD) {
      // Call LLM to create new sense
      const llmResult = await getSenseFromLlm(lemma, fullSentence);

      // Build sense text for embedding
      // const senseText = `${lemma} – ${llmResult.meaning} – ${llmResult.simplified}`;
      // const senseEmbedding = await this.embedder.embed(senseText);
      const senseEmbedding = contextEmbedding;

      const newSense: Omit<WordSenseDoc, "_id"> = {
        wordId: word._id,
        senseKey: `${lemma}#${senses.length + 1}`,
        partOfSpeech: llmResult.partOfSpeech ?? "other",
        meaning: llmResult.meaning,
        simplified: llmResult.simplified,
        synonyms: llmResult.synonyms,
        example: llmResult.example,
        tone: llmResult.tone,
        source: llmResult.source,
        embedding: senseEmbedding,
        domainTags: llmResult.domainTags ?? [],
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      chosenSense = await this.repo.createSense(newSense);
      createdNewSense = true;
      senses = [...senses, chosenSense];
    }

    if (!chosenSense) {
      // Fallback: use "best" sense even if below threshold to avoid user error
      // or simply throw error / generic message.
      throw new Error("Unable to disambiguate sense for this context.");
    }

    // 6) Save usage
    const usage = await this.repo.createUsage({
      wordId: word._id,
      senseId: chosenSense._id,
      selectedText,
      fullSentence,
      pageUrl,
      contextEmbedding,
      createdAt: new Date(),
    });

    await this.repo.updateSenseUsageCount(chosenSense._id, 1);

    return {
      word,
      sense: chosenSense,
      usage,
      createdNewSense,
      similarity: bestScore,
    };
  }
}
