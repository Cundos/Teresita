// /api/lista-compras-limpiar.js
const { query } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  try {
    const result = await query(
      `DELETE FROM lista_compras WHERE estado = 'comprado'`
    );

    res.status(200).json({ ok: true, deleted: result.rowCount });
  } catch (err) {
    console.error("Error lista-compras-limpiar:", err);
    res.status(500).json({ ok: false, error: "Error al limpiar la lista" });
  }
};
