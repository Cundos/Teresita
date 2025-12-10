// /api/lista-compras-listar.js
import { sql } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ ok: false, error: "Método no permitido (usar GET)" });
  }

  try {
    // Traemos todo y los ordenamos:
    // 1) pendientes primero
    // 2) luego comprados
    // 3) más nuevos arriba
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
      items: rows,     // la app usa items
      registros: rows, // por si en algún lado usamos registros
    });
  } catch (err) {
    console.error("Error al listar la lista de compras:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Error al listar la lista de compras" });
  }
}
