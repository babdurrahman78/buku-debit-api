import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  ssl: {
    rejectUnauthorized: false,
  },
  host: process.env.HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "buku_debit",
  port: process.env.DB_PORT || 5432,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to buku_debit database"))
  .catch((err) => console.error("❌ Database connection error:", err.stack));
