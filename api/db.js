// api/db.js
const { Pool } = require("pg");

// ⚠️ TU URL REAL DE NEON (probada con psql)
const HARD_CODED_URL =
  "postgres://neondb_owner:npg_ItgBZaudYF47@ep-late-frost-aeqpys6s-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

let cachedPool = null;

function getPool() {
  // Lo que venga de Vercel
  const envUrl = process.env.DATABASE_URL || "";

  // Si la env está vacía o tiene el placeholder ep-tu-host..., usamos la hardcoded
  const connectionString =
    envUrl && !envUrl.includes("ep-tu-host-neon.neon.tech")
      ? envUrl
      : HARD_CODED_URL;

  if (!cachedPool) {
    cachedPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }, // requerido por Neon
    });
  }

  return cachedPool;
}

module.exports = { getPool };
