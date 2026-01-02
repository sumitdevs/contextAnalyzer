import { Embedder } from "./services/embedder";
import { cosineSimilarity } from "./utils/similarity";

import { db } from "./config/db.config";


async function debugEmbeddings() {
  const start = Date.now();
  const embedder = Embedder.getInstance();
  const a = "I went to the bank to deposit money.";
  const b = "She opened a savings account at the bank.";
  const c = "We had a picnic on the bank of the river.";
  const d = 'Artificial intelligence systems can analyze large amounts of user data and extract useful patterns. These insights help companies personalize recommendations and automate repetitive tasks. Modern AI tools also integrate with chatbots, analytics dashboards, and business applications.'

  // const [ea, eb, ec] = await Promise.all([
  //   embedder.embed(a),
  //   embedder.embed(b),
  //   embedder.embed(c),
  // ]);

  // const res = await embedder.embed(a);
  // console.log(typeof res, res.length);

async function searchWordInContext(word: string, sentence: string) {
  let embedding = await embedder.embed(sentence);

  const norm = Math.hypot(...embedding);
  if (norm > 0) embedding = embedding.map(v => v / norm);

  const wordRow = await db`
    SELECT word_id, lemma
    FROM words
    WHERE lemma = ${word} OR lemma = LOWER(${word})
    LIMIT 1;
  `;

  if (!wordRow[0]) return null;

  const wordId = wordRow[0].word_id;

  const rows = await db`
    SELECT 
      sy.synset_id,
      sy.synonyms,
      sy.gloss,
      sy.pos,
      s.sense_number,
      (sy.embedding <-> (${db.array(embedding)}::float4[])::vector) AS distance
    FROM senses s
    JOIN synsets sy ON sy.synset_id = s.synset_id
    WHERE s.word_id = ${wordId}
    ORDER BY distance
    LIMIT 1;
  `;

  const r = rows[0];

  if (!r) return null;

  return {
    lemma: wordRow[0].lemma,
    synset_id: r.synset_id,
    gloss: r.gloss,
    synonyms: r.synonyms,
    pos: r.pos,
    sense_number: r.sense_number,
    distance: r.distance,
    similarity: 1 - r.distance
  };
}

const word = 'bank';
const context = 'We had a picnic on the bank of the river'

 console.log(await searchWordInContext(word, context))

   const end = Date.now();
  console.log(end-start);


  // console.log("sim(a, a):", cosineSimilarity(ea, ea));
  // console.log("sim(a, b):", cosineSimilarity(ea, eb));
  // console.log("sim(a, c):", cosineSimilarity(ea, ec));

}

debugEmbeddings();
