// api/lista-compras-listar.js
const { getPool } = require("./db.js");

async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lista_compras (
      id        SERIAL PRIMARY KEY,
      categoria TEXT NOT NULL,
      producto  TEXT NOT NULL,
      cantidad  TEXT NOT NULL,
      estado    TEXT NOT NULL DEFAULT 'pendiente',
      creado    TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

    // Aseguramos la tabla
    await ensureTable(pool);

    // Pendientes primero, luego comprados, más nuevos arriba
    const { rows } = await pool.query(
      `
      SELECT
        id,
        categoria,
        producto,
        cantidad,
        estado,
        creado
      FROM lista_compras
      ORDER BY
        (estado = 'pendiente') DESC,
        creado DESC
      `
    );

    return res.status(200).json({
      ok: true,
      items: rows,
      registros: rows, // por si en algún lado usás "registros"
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
