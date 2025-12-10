// /api/lista-compras-agregar.js
import { sql } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Método no permitido (usar POST)" });
  }

  try {
    const { categoria, producto, cantidad } = req.body || {};

    if (!categoria || !producto || !cantidad) {
      return res
        .status(400)
        .json({ ok: false, error: "Faltan datos para agregar a la lista" });
    }

    const rows = await sql`
      INSERT INTO lista_compras (categoria, producto, cantidad, estado)
      VALUES (${categoria}, ${producto}, ${cantidad}, 'pendiente')
      RETURNING id, categoria, producto, cantidad, estado, creado
    `;

    const item = rows[0];

    return res.status(200).json({
      ok: true,
      item,
    });
  } catch (err) {
    console.error("Error al agregar a la lista de compras:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Error al agregar a la lista de compras" });
  }
}
