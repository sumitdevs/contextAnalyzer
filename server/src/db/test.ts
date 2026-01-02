import { db } from "../config/db.config";

async function testConnection(): Promise<void> {
  try {
    const result: any[] = await db`SELECT NOW()`;
    console.log("✅ PostgreSQL connected successfully!");
    console.log("🕒 Database time:", result[0].now);
  } catch (error: any) {
    console.error("❌ PostgreSQL connection failed.");
    console.error("Error:", error.message ?? error);
  } finally {
    db.end?.();
  }
}

testConnection();
