// api/lista-compras-agregar.js
const { getPool } = require("./db.js");

async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lista_compras (
      id        SERIAL PRIMARY KEY,
      categoria TEXT NOT NULL,
      producto  TEXT NOT NULL,
      cantidad  TEXT NOT NULL,
      estado    TEXT NOT NULL DEFAULT 'pendiente'
    )
  `);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Método no permitido (usar POST)" });
  }

  try {
    const pool = getPool();
    await ensureTable(pool);

    const { categoria, producto, cantidad } = req.body || {};

    if (!categoria || !producto || !cantidad) {
      return res.status(400).json({
        ok: false,
        error: "Faltan datos para agregar a la lista (categoría, producto, cantidad)",
      });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO lista_compras (categoria, producto, cantidad, estado)
      VALUES ($1, $2, $3, 'pendiente')
      RETURNING id, categoria, producto, cantidad, estado
      `,
      [categoria, producto, cantidad]
    );

    return res.status(200).json({
      ok: true,
      item: rows[0],
    });
  } catch (err) {
    console.error("Error al agregar a la lista de compras:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al agregar a la lista de compras",
      detail: err.message,
    });
  }
};
