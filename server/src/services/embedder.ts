// src/embedding/Embedder.ts
import { pipeline, env } from "@xenova/transformers";

// optional: avoid loading big stuff you don't need
env.allowLocalModels = true;
env.useBrowserCache = false;

export class Embedder {
  private static instance: Embedder;
  private ready: Promise<void>;
  private embedPipeline: any;

  private constructor() {
    this.ready = this.init();
  }

  static getInstance(): Embedder {
    if (!Embedder.instance) {
      Embedder.instance = new Embedder();
    }
    return Embedder.instance;
  }

  private async init() {
    // model: MiniLM sentence transformer
    this.embedPipeline = await pipeline(
      "feature-extraction",
      // "Xenova/all-mpnet-base-v2" // ~384-dim sentence embeddings,
      // "Xenova/bge-large-en-v1.5",
      "Xenova/gte-small",
      // "Xenova/gte-large"
    );
  }

  async ensureReady() {
    await this.ready;
  }

  private normalizeForEmbedding(text: string): string {
    return text.replace(/\s+/g, " ").trim().slice(0, 400); // limit length
  }

  /**
   * Returns a normalized dense vector (L2-normalized).
   */
  async embed(text: string): Promise<number[]> {
    await this.ensureReady();
    const normalized = this.normalizeForEmbedding(text);

    const output = await this.embedPipeline(normalized, {
      pooling: "mean",
      normalize: true, // cosine-ready
    });

    // output.data is a TypedArray (Float32Array)
    return Array.from(output.data as Float32Array);
  }
}
