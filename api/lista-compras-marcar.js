// api/lista-compras-marcar.js
const { getPool } = require("./db.js");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Método no permitido (usar POST)" });
  }

  try {
    const pool = getPool();
    const { id, estado } = req.body || {};

    if (!id) {
      return res.status(400).json({
        ok: false,
        error: "Falta el id del ítem a actualizar",
      });
    }

    const nuevoEstado = estado === "pendiente" ? "pendiente" : "comprado";

    const { rows } = await pool.query(
      `
      UPDATE lista_compras
      SET estado = $1
      WHERE id = $2
      RETURNING id, categoria, producto, cantidad, estado, creado
      `,
      [nuevoEstado, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Ítem de lista no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      item: rows[0],
    });
  } catch (err) {
    console.error("Error al marcar ítem de lista:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al marcar ítem de la lista",
      detail: err.message,
    });
  }
};
