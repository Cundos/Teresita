// /api/lista-compras-agregar.js
const { query } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const { categoria, producto, cantidad, creadoPor } = req.body || {};

    if (!categoria || !producto || !cantidad) {
      return res.status(400).json({ ok: false, error: "Faltan datos obligatorios" });
    }

    const result = await query(
      `
      INSERT INTO lista_compras (categoria, producto, cantidad, creado_por)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [categoria, producto, cantidad, creadoPor || null]
    );

    res.status(200).json({ ok: true, item: result.rows[0] });
  } catch (err) {
    console.error("Error lista-compras-agregar:", err);
    res.status(500).json({ ok: false, error: "Error al agregar a la lista" });
  }
};
