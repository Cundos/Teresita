// api/db.js
const { Pool } = require("pg");

let cachedPool = null;

function getPool() {
  if (!cachedPool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL no está configurada en Vercel");
    }

    cachedPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // necesario para Neon
    });
  }
  return cachedPool;
}

module.exports = { getPool };
