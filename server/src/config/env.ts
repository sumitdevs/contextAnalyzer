import { Env } from "../types/types";


export const env: Env= {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: Number(process.env.PORT ?? 3000),

  DB: {
    host: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER ?? "postgres",
    password: process.env.PGPASSWORD ?? "7808",
    database: process.env.PGDATABASE ?? "test_db",
  },

  JWT_SECRET: process.env.JWT_SECRET ?? "dev_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
};
