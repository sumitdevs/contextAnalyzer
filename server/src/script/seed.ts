// import fs from "fs";
// import { Embedder } from "../services/embedder";
// import { db } from "../config/db.config";

// const embedder = Embedder.getInstance();

// // ---------- HELPERS ----------

// function parseGloss(line: string) {
//   return line.split("|")[1]?.trim() ?? "";
// }

// function parseLemmasFromData(line: string) {
//   const parts = line.split("|")[0].trim().split(/\s+/);

//   const wCntHex = parts[3];
//   const wCnt = parseInt(wCntHex, 16);

//   const lemmas: string[] = [];
//   let idx = 4;

//   for (let i = 0; i < wCnt; i++) {
//     const lemma = parts[idx];
//     lemmas.push(lemma.replace(/_/g, " "));
//     idx += 2; // skip lex_id
//   }

//   return lemmas;
// }

// async function main() {
//   console.log("📚 Loading WordNet noun files...");

//   const indexText = fs.readFileSync("./dict/index.noun", "utf-8");
//   const dataText = fs.readFileSync("./dict/data.noun", "utf-8");

//   // ---------- Build index map ----------
//   const indexMap = new Map<string, string[]>();

//   for (const line of indexText.split("\n")) {
//     if (!line || line.startsWith(" ")) continue;

//     const parts = line.trim().split(/\s+/);

//     const lemma = parts[0].replace(/_/g, " ");
//     const synsetCount = parseInt(parts[2], 10);

//     const offsets = parts.slice(-synsetCount);

//     for (const off of offsets) {
//       if (!indexMap.has(off)) indexMap.set(off, []);
//       indexMap.get(off)!.push(lemma);
//     }
//   }

//   const dataLines = dataText.split("\n");
//   let total = 0;

//   await db.begin(async (tx: any) => {
//     for (const line of dataLines) {
//       if (!line || line.startsWith(" ")) continue;

//       const parts = line.trim().split(/\s+/);

//       const pos = parts[2];
//       if (pos !== "n") continue; // nouns only

//       const offset = parts[0];
//       const synsetId = parseInt(offset, 10);

//       const gloss = parseGloss(line);
//       const lemmas = parseLemmasFromData(line);
//       const synonyms = indexMap.get(offset) ?? [];

//       const synonymsJson = JSON.stringify(synonyms);

//       // text to embed
//       const textForEmbedding = gloss.length > 0 ? gloss : lemmas.join(" ");

//       // ---------- embedding ----------
//       let embedding: number[] | null = null;

//       try {
//         embedding = await embedder.embed(textForEmbedding);
//       } catch (e) {
//         console.warn("⚠️ embed failed for synset", synsetId, e);
//       }

//       // pgvector literal "::vector"
//       const embeddingLiteral = embedding
//         ? db`${JSON.stringify(embedding)}::vector`
//         : null;

//       // ---------- insert synset ----------
//       await tx`
//         INSERT INTO synsets (synset_id, pos, gloss, synonyms, embedding)
//         VALUES (
//           ${synsetId},
//           ${pos},
//           ${gloss},
//           ${synonymsJson}::jsonb,
//           ${embeddingLiteral}
//         )
//         ON CONFLICT (synset_id) DO NOTHING
//       `;

//       // ---------- insert words + senses ----------
//       for (let i = 0; i < lemmas.length; i++) {
//         const lemma = lemmas[i];

//         const rows =
//           await tx`
//             INSERT INTO words (lemma)
//             VALUES (${lemma})
//             ON CONFLICT (lemma)
//             DO UPDATE SET lemma = EXCLUDED.lemma
//             RETURNING word_id
//           `;

//         const word_id = rows[0].word_id;

//         await tx`
//           INSERT INTO senses (word_id, synset_id, sense_number)
//           VALUES (${word_id}, ${synsetId}, ${i + 1})
//           ON CONFLICT DO NOTHING
//         `;
//       }

//       total++;

//       if (total % 500 === 0) {
//         console.log(`Inserted ${total} noun synsets...`);
//       }
//     }
//   });

//   console.log(`🎉 Done. Seeded ${total} noun synsets with embeddings.`);
//   await db.end();
// }

// main().catch((err) => {
//   console.error("❌ Script failed", err);
//   process.exit(1);
// });



// import fs from "fs";
// import { Embedder } from "../services/embedder";
// import { db } from "../config/db.config";

// const embedder = Embedder.getInstance();

// // ---------- HELPERS ----------

// function parseGloss(line: string) {
//   return line.split("|")[1]?.trim() ?? "";
// }

// function parseLemmasFromData(line: string) {
//   const parts = line.split("|")[0].trim().split(/\s+/);

//   const wCntHex = parts[3];
//   const wCnt = parseInt(wCntHex, 16);

//   const lemmas: string[] = [];
//   let idx = 4;

//   for (let i = 0; i < wCnt; i++) {
//     const lemma = parts[idx];
//     lemmas.push(lemma.replace(/_/g, " "));
//     idx += 2; // skip lex_id
//   }

//   return lemmas;
// }

// async function main() {
//   console.log("📚 Loading WordNet verb files...");

//   // 🔹 change noun → verb files
//   const indexText = fs.readFileSync("./dict/index.verb", "utf-8");
//   const dataText = fs.readFileSync("./dict/data.verb", "utf-8");

//   // ---------- Build index map ----------
//   const indexMap = new Map<string, string[]>();

//   for (const line of indexText.split("\n")) {
//     if (!line || line.startsWith(" ")) continue;

//     const parts = line.trim().split(/\s+/);

//     const lemma = parts[0].replace(/_/g, " ");
//     const synsetCount = parseInt(parts[2], 10);

//     const offsets = parts.slice(-synsetCount);

//     for (const off of offsets) {
//       if (!indexMap.has(off)) indexMap.set(off, []);
//       indexMap.get(off)!.push(lemma);
//     }
//   }

//   const dataLines = dataText.split("\n");
//   let total = 0;

//   await db.begin(async (tx: any) => {
//     for (const line of dataLines) {
//       if (!line || line.startsWith(" ")) continue;

//       const parts = line.trim().split(/\s+/);

//       const pos = parts[2];

//       // 🔹 verbs only
//       if (pos !== "v") continue;

//       const offset = parts[0];
//       const synsetId = parseInt(offset, 10);

//       const gloss = parseGloss(line);
//       const lemmas = parseLemmasFromData(line);
//       const synonyms = indexMap.get(offset) ?? [];

//       const synonymsJson = JSON.stringify(synonyms);

//       // text for embedding (prefer gloss)
//       const textForEmbedding =
//         gloss.length > 0 ? gloss : lemmas.join(" ");

//       // ---------- embedding ----------
//       let embedding: number[] | null = null;

//       try {
//         embedding = await embedder.embed(textForEmbedding);
//       } catch (e) {
//         console.warn("⚠️ embed failed for synset", synsetId, e);
//       }

//       const embeddingLiteral = embedding
//         ? db`${JSON.stringify(embedding)}::vector`
//         : null;

//       // ---------- insert synset ----------
//       await tx`
//         INSERT INTO synsets (synset_id, pos, gloss, synonyms, embedding)
//         VALUES (
//           ${synsetId},
//           ${pos},
//           ${gloss},
//           ${synonymsJson}::jsonb,
//           ${embeddingLiteral}
//         )
//         ON CONFLICT (synset_id) DO NOTHING
//       `;

//       // ---------- insert words + senses ----------
//       for (let i = 0; i < lemmas.length; i++) {
//         const lemma = lemmas[i];

//         const rows =
//           await tx`
//             INSERT INTO words (lemma)
//             VALUES (${lemma})
//             ON CONFLICT (lemma)
//             DO UPDATE SET lemma = EXCLUDED.lemma
//             RETURNING word_id
//           `;

//         const word_id = rows[0].word_id;

//         await tx`
//           INSERT INTO senses (word_id, synset_id, sense_number)
//           VALUES (${word_id}, ${synsetId}, ${i + 1})
//           ON CONFLICT DO NOTHING
//         `;
//       }

//       total++;

//       if (total % 500 === 0) {
//         console.log(`Inserted ${total} verb synsets...`);
//       }
//     }
//   });

//   console.log(`🎉 Done. Seeded ${total} verb synsets with embeddings.`);
//   await db.end();
// }

// main().catch((err) => {
//   console.error("❌ Script failed", err);
//   process.exit(1);
// });



// import fs from "fs";
// import { Embedder } from "../services/embedder";
// import { db } from "../config/db.config";

// const embedder = Embedder.getInstance();

// // ---------- HELPERS ----------

// function parseGloss(line: string) {
//   return line.split("|")[1]?.trim() ?? "";
// }

// function parseLemmasFromData(line: string) {
//   const parts = line.split("|")[0].trim().split(/\s+/);

//   const wCntHex = parts[3];
//   const wCnt = parseInt(wCntHex, 16);

//   const lemmas: string[] = [];
//   let idx = 4;

//   for (let i = 0; i < wCnt; i++) {
//     const lemma = parts[idx];
//     lemmas.push(lemma.replace(/_/g, " "));
//     idx += 2; // skip lex_id
//   }

//   return lemmas;
// }

// async function main() {
//   console.log("📚 Loading WordNet adverb files...");

//   // 🔹 adverb files
//   const indexText = fs.readFileSync("./dict/index.adv", "utf-8");
//   const dataText = fs.readFileSync("./dict/data.adv", "utf-8");

//   // ---------- Build index map ----------
//   const indexMap = new Map<string, string[]>();

//   for (const line of indexText.split("\n")) {
//     if (!line || line.startsWith(" ")) continue;

//     const parts = line.trim().split(/\s+/);

//     const lemma = parts[0].replace(/_/g, " ");
//     const synsetCount = parseInt(parts[2], 10);

//     const offsets = parts.slice(-synsetCount);

//     for (const off of offsets) {
//       if (!indexMap.has(off)) indexMap.set(off, []);
//       indexMap.get(off)!.push(lemma);
//     }
//   }

//   const dataLines = dataText.split("\n");
//   let total = 0;

//   await db.begin(async (tx: any) => {
//     for (const line of dataLines) {
//       if (!line || line.startsWith(" ")) continue;

//       const parts = line.trim().split(/\s+/);

//       const pos = parts[2];

//       // 🔹 adverbs only — WordNet POS = 'r'
//       if (pos !== "r") continue;

//       const offset = parts[0];
//       const synsetId = parseInt(offset, 10);

//       const gloss = parseGloss(line);
//       const lemmas = parseLemmasFromData(line);
//       const synonyms = indexMap.get(offset) ?? [];

//       const synonymsJson = JSON.stringify(synonyms);

//       // choose text to embed (gloss preferred)
//       const textForEmbedding =
//         gloss.length > 0 ? gloss : lemmas.join(" ");

//       // ---------- embedding ----------
//       let embedding: number[] | null = null;

//       try {
//         embedding = await embedder.embed(textForEmbedding);
//       } catch (e) {
//         console.warn("⚠️ embed failed for synset", synsetId, e);
//       }

//       const embeddingLiteral = embedding
//         ? db`${JSON.stringify(embedding)}::vector`
//         : null;

//       // ---------- insert synset ----------
//       await tx`
//         INSERT INTO synsets (synset_id, pos, gloss, synonyms, embedding)
//         VALUES (
//           ${synsetId},
//           ${pos},
//           ${gloss},
//           ${synonymsJson}::jsonb,
//           ${embeddingLiteral}
//         )
//         ON CONFLICT (synset_id) DO NOTHING
//       `;

//       // ---------- insert words + senses ----------
//       for (let i = 0; i < lemmas.length; i++) {
//         const lemma = lemmas[i];

//         const rows =
//           await tx`
//             INSERT INTO words (lemma)
//             VALUES (${lemma})
//             ON CONFLICT (lemma)
//             DO UPDATE SET lemma = EXCLUDED.lemma
//             RETURNING word_id
//           `;

//         const word_id = rows[0].word_id;

//         await tx`
//           INSERT INTO senses (word_id, synset_id, sense_number)
//           VALUES (${word_id}, ${synsetId}, ${i + 1})
//           ON CONFLICT DO NOTHING
//         `;
//       }

//       total++;

//       if (total % 500 === 0) {
//         console.log(`Inserted ${total} adverb synsets...`);
//       }
//     }
//   });

//   console.log(`🎉 Done. Seeded ${total} adverb synsets with embeddings.`);
//   await db.end();
// }

// main().catch((err) => {
//   console.error("❌ Script failed", err);
//   process.exit(1);
// });



// import fs from "fs";
// import { Embedder } from "../services/embedder";
// import { db } from "../config/db.config";

// const embedder = Embedder.getInstance();

// // ---------- HELPERS ----------

// function parseGloss(line: string) {
//   return line.split("|")[1]?.trim() ?? "";
// }

// function parseLemmasFromData(line: string) {
//   const parts = line.split("|")[0].trim().split(/\s+/);

//   // WordNet uses hex for word count
//   const wCntHex = parts[3];
//   const wCnt = parseInt(wCntHex, 16);

//   const lemmas: string[] = [];
//   let idx = 4;

//   for (let i = 0; i < wCnt; i++) {
//     const lemma = parts[idx];
//     lemmas.push(lemma.replace(/_/g, " "));
//     idx += 2; // skip lex_id
//   }

//   return lemmas;
// }

// async function main() {
//   console.log("📚 Loading WordNet adjective files...");

//   const indexText = fs.readFileSync("./dict/index.adj", "utf-8");
//   const dataText = fs.readFileSync("./dict/data.adj", "utf-8");

//   // ---------- Build index map (offset -> list of lemmas) ----------
//   const indexMap = new Map<string, string[]>();

//   for (const line of indexText.split("\n")) {
//     if (!line || line.startsWith(" ")) continue; // skip comments and header

//     const parts = line.trim().split(/\s+/);

//     const lemma = parts[0].replace(/_/g, " ");
//     const synsetCount = parseInt(parts[2], 10);

//     const offsets = parts.slice(-synsetCount);

//     for (const off of offsets) {
//       if (!indexMap.has(off)) indexMap.set(off, []);
//       indexMap.get(off)!.push(lemma);
//     }
//   }

//   const dataLines = dataText.split("\n");
//   let total = 0;

//   await db.begin(async (tx: any) => {
//     for (const line of dataLines) {
//       if (!line || line.startsWith(" ")) continue;

//       const parts = line.trim().split(/\s+/);

//       const pos = parts[2];

//       // adjectives may be 'a' or 's' (satellite)
//       if (pos !== "a" && pos !== "s") continue;

//       const offset = parts[0];
//       const synsetId = parseInt(offset, 10);

//       const gloss = parseGloss(line);
//       const lemmas = parseLemmasFromData(line);

//       // synonyms stored as JSONB
//       const synonyms = indexMap.get(offset) ?? [];
//       const synonymsJson = JSON.stringify(synonyms);

//       // choose embedding text
//       const textForEmbedding =
//         gloss.length > 0 ? gloss : lemmas.join(" ");

//       // ---------- embedding ----------
//       let embedding: number[] | null = null;

//       try {
//         embedding = await embedder.embed(textForEmbedding);
//       } catch (e) {
//         console.warn("⚠️ embedding failed for synset", synsetId, e);
//       }

//       // prepare pgvector literal
//       const embeddingLiteral = embedding
//         ? db`${JSON.stringify(embedding)}::vector`
//         : null;

//       // ---------- insert synset ----------
//       await tx`
//         INSERT INTO synsets (synset_id, pos, gloss, synonyms, embedding)
//         VALUES (
//           ${synsetId},
//           ${pos},
//           ${gloss},
//           ${synonymsJson}::jsonb,
//           ${embeddingLiteral}
//         )
//         ON CONFLICT (synset_id) DO NOTHING
//       `;

//       // ---------- insert words + senses ----------
//       for (let i = 0; i < lemmas.length; i++) {
//         const lemma = lemmas[i];

//         const rows =
//           await tx`
//             INSERT INTO words (lemma)
//             VALUES (${lemma})
//             ON CONFLICT (lemma)
//             DO UPDATE SET lemma = EXCLUDED.lemma
//             RETURNING word_id
//           `;

//         const word_id = rows[0].word_id;

//         await tx`
//           INSERT INTO senses (word_id, synset_id, sense_number)
//           VALUES (${word_id}, ${synsetId}, ${i + 1})
//           ON CONFLICT DO NOTHING
//         `;
//       }

//       total++;

//       if (total % 500 === 0) {
//         console.log(`Inserted ${total} adjective synsets...`);
//       }
//     }
//   });

//   console.log(`🎉 Done. Seeded ${total} adjective synsets with embeddings.`);
//   await db.end();
// }

// main().catch((err) => {
//   console.error("❌ Script failed", err);
//   process.exit(1);
// });
