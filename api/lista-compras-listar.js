// api/lista-compras-listar.js
const { getPool } = require("./db.js");

async function ensureTable(pool) {
  // Definición mínima, sin columna "creado"
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
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ ok: false, error: "Método no permitido (usar GET)" });
  }

  try {
    const pool = getPool();

    // Si la tabla ya existe, esto no la rompe
    await ensureTable(pool);

    // Ordenamos: pendientes primero, luego comprados, y dentro de eso id DESC
    const { rows } = await pool.query(`
      SELECT
        id,
        categoria,
        producto,
        cantidad,
        estado
      FROM lista_compras
      ORDER BY
        (estado = 'pendiente') DESC,
        id DESC
    `);

    return res.status(200).json({
      ok: true,
      items: rows,
      registros: rows,
    });
  } catch (err) {
    console.error("Error al listar la lista de compras:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al listar la lista de compras",
      detail: err.message,
    });
  }
};
