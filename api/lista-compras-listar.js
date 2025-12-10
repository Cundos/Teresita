// /api/lista-compras-listar.js
import sql from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ ok: false, error: "Método no permitido (usar GET)" });
  }

  try {
    // Aseguramos que la tabla exista (idempotente)
    await sql`
      CREATE TABLE IF NOT EXISTS lista_compras (
        id        SERIAL PRIMARY KEY,
        categoria TEXT NOT NULL,
        producto  TEXT NOT NULL,
        cantidad  TEXT NOT NULL,
        estado    TEXT NOT NULL DEFAULT 'pendiente',
        creado    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    const rows = await sql`
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
    `;

    return res.status(200).json({
      ok: true,
      items: rows,
      registros: rows
    });
  } catch (err) {
    console.error("Error al listar la lista de compras:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al listar la lista de compras",
      detail: String(err)
    });
  }
}
