// src/index.ts
import { InMemoryWordRepository } from "./repository/wordRepo.js";
import type { DisambiguationInput } from "./types/types.js";
import { WordSenseEngine } from "./services/wordSenseEngine.js";

async function runCase(
  engine: WordSenseEngine,
  label: string,
  input: DisambiguationInput
) {
  console.log("\n====", label, "====");
  const result = await engine.disambiguate(input);
  console.log({
    lemma: input.lemma,
    sentence: input.fullSentence,
    senseKey: result.sense.senseKey,
    meaning: result.sense.meaning,
    createdNewSense: result.createdNewSense,
    similarity: result.similarity,
  });
}

async function main() {
  const st:any = new Date();
  const repo = new InMemoryWordRepository();
  const engine = new WordSenseEngine(repo);

  // ------------ BANK ------------
  await runCase(engine, "bank#finance#1 (seed)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "I went to the bank to deposit money.",
    pageUrl: "https://ex.com/bank/finance1",
  });

  await runCase(engine, "bank#finance#2 (should reuse finance sense)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "They discussed loan rates at the bank yesterday.",
    pageUrl: "https://ex.com/bank/finance2",
  });

  await runCase(engine, "bank#finance#3 (reuse finance sense)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "She opened a new savings account at the bank.",
    pageUrl: "https://ex.com/bank/finance3",
  });

  await runCase(engine, "bank#river#1 (new river sense)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "We had a picnic on the bank of the river.",
    pageUrl: "https://ex.com/bank/river1",
  });

  await runCase(engine, "bank#river#2 (should reuse river sense)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "Children were playing near the bank of the stream.",
    pageUrl: "https://ex.com/bank/river2",
  });

  await runCase(engine, "bank#river#3 (reuse river sense)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "Trees along the river bank were damaged by the flood.",
    pageUrl: "https://ex.com/bank/river3",
  });

  await runCase(engine, "bank#power#1 (new power bank sense)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "I forgot my power bank at home and my phone died.",
    pageUrl: "https://ex.com/bank/power1",
  });

  await runCase(engine, "bank#power#2 (reuse power bank sense)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "This power bank can charge my phone three times.",
    pageUrl: "https://ex.com/bank/power2",
  });

  await runCase(engine, "bank#power#3 (reuse power bank sense)", {
    lemma: "bank",
    language: "en",
    selectedText: "bank",
    fullSentence: "My power bank saved me during the long train journey.",
    pageUrl: "https://ex.com/bank/power3",
  });

  // ------------ BAT ------------
  await runCase(engine, "bat#animal#1", {
    lemma: "bat",
    language: "en",
    selectedText: "bat",
    fullSentence: "A bat flew out of the cave at dusk.",
    pageUrl: "https://ex.com/bat/animal1",
  });

  await runCase(engine, "bat#animal#2 (reuse animal sense)", {
    lemma: "bat",
    language: "en",
    selectedText: "bat",
    fullSentence: "We saw a bat hanging upside down from the tree.",
    pageUrl: "https://ex.com/bat/animal2",
  });

  await runCase(engine, "bat#animal#3 (reuse animal sense)", {
    lemma: "bat",
    language: "en",
    selectedText: "bat",
    fullSentence: "The cave was full of bats sleeping in the dark.",
    pageUrl: "https://ex.com/bat/animal3",
  });

  await runCase(engine, "bat#sports#1 (new sports sense)", {
    lemma: "bat",
    language: "en",
    selectedText: "bat",
    fullSentence: "He swung the bat and hit a home run.",
    pageUrl: "https://ex.com/bat/sports1",
  });

  await runCase(engine, "bat#sports#2 (reuse sports sense)", {
    lemma: "bat",
    language: "en",
    selectedText: "bat",
    fullSentence: "The cricket bat was lying next to the stumps.",
    pageUrl: "https://ex.com/bat/sports2",
  });

  await runCase(engine, "bat#sports#3 (reuse sports sense)", {
    lemma: "bat",
    language: "en",
    selectedText: "bat",
    fullSentence: "He bought a new bat for the upcoming tournament.",
    pageUrl: "https://ex.com/bat/sports3",
  });

  // ------------ CHARGE ------------
  await runCase(engine, "charge#money#1", {
    lemma: "charge",
    language: "en",
    selectedText: "charge",
    fullSentence: "The restaurant did not charge us for the dessert.",
    pageUrl: "https://ex.com/charge/money1",
  });

  await runCase(engine, "charge#money#2 (reuse money sense)", {
    lemma: "charge",
    language: "en",
    selectedText: "charge",
    fullSentence: "They will charge a small fee for late payments.",
    pageUrl: "https://ex.com/charge/money2",
  });

  await runCase(engine, "charge#money#3 (reuse money sense)", {
    lemma: "charge",
    language: "en",
    selectedText: "charge",
    fullSentence: "There is an additional service charge on the bill.",
    pageUrl: "https://ex.com/charge/money3",
  });

  await runCase(engine, "charge#electric#1 (new electric sense)", {
    lemma: "charge",
    language: "en",
    selectedText: "charge",
    fullSentence: "I need to charge my laptop before the meeting.",
    pageUrl: "https://ex.com/charge/electric1",
  });

  await runCase(engine, "charge#electric#2 (reuse electric sense)", {
    lemma: "charge",
    language: "en",
    selectedText: "charge",
    fullSentence: "The phone is fully charged and ready.",
    pageUrl: "https://ex.com/charge/electric2",
  });

  await runCase(engine, "charge#electric#3 (reuse electric sense)", {
    lemma: "charge",
    language: "en",
    selectedText: "charge",
    fullSentence: "The battery can fully charge in under an hour.",
    pageUrl: "https://ex.com/charge/electric3",
  });

  // ------------ LIGHT ------------
  await runCase(engine, "light#brightness#1", {
    lemma: "light",
    language: "en",
    selectedText: "light",
    fullSentence: "The light from the candle flickered in the dark room.",
    pageUrl: "https://ex.com/light/brightness1",
  });

  await runCase(engine, "light#weight#1 (new weight sense)", {
    lemma: "light",
    language: "en",
    selectedText: "light",
    fullSentence: "This laptop is very light and easy to carry.",
    pageUrl: "https://ex.com/light/weight1",
  });

  await runCase(engine, "light#brightness#2 (reuse brightness sense)", {
    lemma: "light",
    language: "en",
    selectedText: "light",
    fullSentence: "He turned on the light to read the book.",
    pageUrl: "https://ex.com/light/brightness2",
  });

  await runCase(engine, "light#brightness#3 (reuse brightness sense)", {
    lemma: "light",
    language: "en",
    selectedText: "light",
    fullSentence: "The morning light filtered softly through the curtains.",
    pageUrl: "https://ex.com/light/brightness3",
  });

  await runCase(engine, "light#weight#2 (reuse weight sense)", {
    lemma: "light",
    language: "en",
    selectedText: "light",
    fullSentence: "The bag was surprisingly light for its size.",
    pageUrl: "https://ex.com/light/weight2",
  });

  await runCase(engine, "light#weight#3 (reuse weight sense)", {
    lemma: "light",
    language: "en",
    selectedText: "light",
    fullSentence: "He prefers a light backpack when hiking.",
    pageUrl: "https://ex.com/light/weight3",
  });

  // ------------ BUG ------------
  await runCase(engine, "bug#software#1", {
    lemma: "bug",
    language: "en",
    selectedText: "bug",
    fullSentence: "There is a critical bug in the login flow.",
    pageUrl: "https://ex.com/bug/software1",
  });

  await runCase(engine, "bug#software#2 (reuse software sense)", {
    lemma: "bug",
    language: "en",
    selectedText: "bug",
    fullSentence: "We need to fix this bug before the next release.",
    pageUrl: "https://ex.com/bug/software2",
  });

  await runCase(engine, "bug#software#3 (reuse software sense)", {
    lemma: "bug",
    language: "en",
    selectedText: "bug",
    fullSentence: "The latest update introduced a strange bug in the payment page.",
    pageUrl: "https://ex.com/bug/software3",
  });

  await runCase(engine, "bug#insect#1 (new insect sense)", {
    lemma: "bug",
    language: "en",
    selectedText: "bug",
    fullSentence: "A bug landed on the window and started crawling.",
    pageUrl: "https://ex.com/bug/insect1",
  });

  await runCase(engine, "bug#insect#2 (reuse insect sense)", {
    lemma: "bug",
    language: "en",
    selectedText: "bug",
    fullSentence: "She screamed when she saw a big bug in the kitchen.",
    pageUrl: "https://ex.com/bug/insect2",
  });

  // ------------ PORT ------------
  await runCase(engine, "port#network#1", {
    lemma: "port",
    language: "en",
    selectedText: "port",
    fullSentence: "The API is running on port 8080.",
    pageUrl: "https://ex.com/port/network1",
  });

  await runCase(engine, "port#network#2 (reuse network sense)", {
    lemma: "port",
    language: "en",
    selectedText: "port",
    fullSentence: "Make sure the firewall is not blocking this port.",
    pageUrl: "https://ex.com/port/network2",
  });

  await runCase(engine, "port#harbor#1 (new harbor sense)", {
    lemma: "port",
    language: "en",
    selectedText: "port",
    fullSentence: "The ship arrived at the port early in the morning.",
    pageUrl: "https://ex.com/port/harbor1",
  });

  await runCase(engine, "port#harbor#2 (reuse harbor sense)", {
    lemma: "port",
    language: "en",
    selectedText: "port",
    fullSentence: "They spent the afternoon walking near the port.",
    pageUrl: "https://ex.com/port/harbor2",
  });

  // ------------ ISSUE ------------
  await runCase(engine, "issue#problem#1", {
    lemma: "issue",
    language: "en",
    selectedText: "issue",
    fullSentence: "We had an issue with the payment system yesterday.",
    pageUrl: "https://ex.com/issue/problem1",
  });

  await runCase(engine, "issue#problem#2 (reuse problem sense)", {
    lemma: "issue",
    language: "en",
    selectedText: "issue",
    fullSentence: "This bug is causing a serious performance issue.",
    pageUrl: "https://ex.com/issue/problem2",
  });

  await runCase(engine, "issue#magazine#1 (new magazine sense)", {
    lemma: "issue",
    language: "en",
    selectedText: "issue",
    fullSentence: "Did you read the latest issue of the journal?",
    pageUrl: "https://ex.com/issue/magazine1",
  });

  await runCase(engine, "issue#magazine#2 (reuse magazine sense)", {
    lemma: "issue",
    language: "en",
    selectedText: "issue",
    fullSentence: "The September issue features an interview with the author.",
    pageUrl: "https://ex.com/issue/magazine2",
  });

  // ------------ DRAFT ------------
  await runCase(engine, "draft#doc#1", {
    lemma: "draft",
    language: "en",
    selectedText: "draft",
    fullSentence: "I sent you the first draft of the proposal.",
    pageUrl: "https://ex.com/draft/doc1",
  });

  await runCase(engine, "draft#doc#2 (reuse doc sense)", {
    lemma: "draft",
    language: "en",
    selectedText: "draft",
    fullSentence: "The legal team is reviewing the latest draft of the contract.",
    pageUrl: "https://ex.com/draft/doc2",
  });

  await runCase(engine, "draft#air#1 (new air sense)", {
    lemma: "draft",
    language: "en",
    selectedText: "draft",
    fullSentence: "There is a cold draft coming from that window.",
    pageUrl: "https://ex.com/draft/air1",
  });

  await runCase(engine, "draft#air#2 (reuse air sense)", {
    lemma: "draft",
    language: "en",
    selectedText: "draft",
    fullSentence: "Close the door, I can feel a draft in here.",
    pageUrl: "https://ex.com/draft/air2",
  });

  // ------------ CRASH ------------
  await runCase(engine, "crash#software#1", {
    lemma: "crash",
    language: "en",
    selectedText: "crash",
    fullSentence: "The app started to crash whenever I opened the settings page.",
    pageUrl: "https://ex.com/crash/software1",
  });

  await runCase(engine, "crash#software#2 (reuse software sense)", {
    lemma: "crash",
    language: "en",
    selectedText: "crash",
    fullSentence: "We fixed the bug that caused the browser to crash.",
    pageUrl: "https://ex.com/crash/software2",
  });

  await runCase(engine, "crash#vehicle#1 (new vehicle sense)", {
    lemma: "crash",
    language: "en",
    selectedText: "crash",
    fullSentence: "The highway was blocked due to a car crash.",
    pageUrl: "https://ex.com/crash/vehicle1",
  });

  await runCase(engine, "crash#vehicle#2 (reuse vehicle sense)", {
    lemma: "crash",
    language: "en",
    selectedText: "crash",
    fullSentence: "He was injured in a motorcycle crash last year.",
    pageUrl: "https://ex.com/crash/vehicle2",
  });

  // ------------ CLOUD ------------
  await runCase(engine, "cloud#weather#1", {
    lemma: "cloud",
    language: "en",
    selectedText: "cloud",
    fullSentence: "A dark cloud formed over the city before the storm.",
    pageUrl: "https://ex.com/cloud/weather1",
  });

  await runCase(engine, "cloud#weather#2 (reuse weather sense)", {
    lemma: "cloud",
    language: "en",
    selectedText: "cloud",
    fullSentence: "The sky was covered with thick clouds.",
    pageUrl: "https://ex.com/cloud/weather2",
  });

  await runCase(engine, "cloud#computing#1 (new computing sense)", {
    lemma: "cloud",
    language: "en",
    selectedText: "cloud",
    fullSentence: "Our application data is stored in the cloud.",
    pageUrl: "https://ex.com/cloud/computing1",
  });

  await runCase(engine, "cloud#computing#2 (reuse computing sense)", {
    lemma: "cloud",
    language: "en",
    selectedText: "cloud",
    fullSentence: "They migrated their database to a cloud provider.",
    pageUrl: "https://ex.com/cloud/computing2",
  });

  // ------------ STREAM ------------
  await runCase(engine, "stream#river#1", {
    lemma: "stream",
    language: "en",
    selectedText: "stream",
    fullSentence: "We followed the stream through the forest.",
    pageUrl: "https://ex.com/stream/river1",
  });

  await runCase(engine, "stream#river#2 (reuse river sense)", {
    lemma: "stream",
    language: "en",
    selectedText: "stream",
    fullSentence: "The stream was shallow enough to cross on foot.",
    pageUrl: "https://ex.com/stream/river2",
  });

  await runCase(engine, "stream#video#1 (new video stream sense)", {
    lemma: "stream",
    language: "en",
    selectedText: "stream",
    fullSentence: "She started a live stream of the concert.",
    pageUrl: "https://ex.com/stream/video1",
  });

  await runCase(engine, "stream#video#2 (reuse video stream sense)", {
    lemma: "stream",
    language: "en",
    selectedText: "stream",
    fullSentence: "You can stream the movie in full HD.",
    pageUrl: "https://ex.com/stream/video2",
  });

  await runCase(engine, "stream#data#1 (new data stream sense)", {
    lemma: "stream",
    language: "en",
    selectedText: "stream",
    fullSentence: "The server processes a stream of events from sensors.",
    pageUrl: "https://ex.com/stream/data1",
  });

  await runCase(engine, "stream#data#2 (reuse data stream sense)", {
    lemma: "stream",
    language: "en",
    selectedText: "stream",
    fullSentence: "Logs stream in real time to the monitoring dashboard.",
    pageUrl: "https://ex.com/stream/data2",
  });
  const et: any = new Date()
  console.log('time to run: ', et -st);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
