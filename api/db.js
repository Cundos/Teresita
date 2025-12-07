// api/db.js
import pkg from "pg";
const { Pool } = pkg;

// reutilizar pool entre invocaciones (serverless friendly)
let cachedPool;

export function getPool() {
  if (!cachedPool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL no está configurada en Vercel");
    }
    cachedPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Neon usa SSL
    });
  }
  return cachedPool;
}
