// /api/lista-compras-listar.js
const { query } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const result = await query(
      `
      SELECT
        id,
        categoria,
        producto,
        cantidad,
        estado,
        creado_por,
        creado_en,
        comprado_por,
        comprado_en
      FROM lista_compras
      ORDER BY
        estado = 'pendiente' DESC,   -- primero pendientes
        categoria ASC,
        creado_en ASC
      `
    );

    res.status(200).json({ ok: true, items: result.rows });
  } catch (err) {
    console.error("Error lista-compras-listar:", err);
    res.status(500).json({ ok: false, error: "Error al listar la lista de compras" });
  }
};
