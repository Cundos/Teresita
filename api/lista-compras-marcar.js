// /api/lista-compras-marcar.js
const { query } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const { id, estado, compradoPor } = req.body || {};

    if (!id || !estado) {
      return res.status(400).json({ ok: false, error: "Faltan parámetros" });
    }

    const esComprado = estado === "comprado";

    const result = await query(
      `
      UPDATE lista_compras
      SET
        estado = $2,
        comprado_por = CASE WHEN $2 = 'comprado' THEN $3 ELSE NULL END,
        comprado_en = CASE WHEN $2 = 'comprado' THEN now() ELSE NULL END
      WHERE id = $1
      RETURNING *
      `,
      [id, estado, compradoPor || null]
    );

    res.status(200).json({ ok: true, item: result.rows[0] });
  } catch (err) {
    console.error("Error lista-compras-marcar:", err);
    res.status(500).json({ ok: false, error: "Error al actualizar el ítem" });
  }
};
