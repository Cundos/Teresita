// /api/lista-compras-marcar.js
import sql from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Método no permitido (usar POST)" });
  }

  try {
    const { id, estado } = req.body || {};

    if (!id) {
      return res
        .status(400)
        .json({ ok: false, error: "Falta el id del ítem a actualizar" });
    }

    const nuevoEstado = estado === "pendiente" ? "pendiente" : "comprado";

    const rows = await sql`
      UPDATE lista_compras
      SET estado = ${nuevoEstado}
      WHERE id = ${id}
      RETURNING id, categoria, producto, cantidad, estado, creado
    `;

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, error: "Ítem de lista no encontrado" });
    }

    return res.status(200).json({
      ok: true,
      item: rows[0]
    });
  } catch (err) {
    console.error("Error al marcar ítem de lista:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al marcar ítem de la lista",
      detail: String(err)
    });
  }
}
