// api/lista-compras-limpiar.js
const { getPool } = require("./db.js");

module.exports = async (req, res) => {
  const pool = getPool();

  try {
    // Borra todos los ítems marcados como "comprado"
    const result = await pool.query(
      "DELETE FROM lista_compras WHERE estado = $1",
      ["comprado"]
    );

    return res.status(200).json({
      ok: true,
      deleted: result.rowCount,
    });
  } catch (err) {
    console.error("Error al limpiar la lista de compras:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al limpiar la lista de compras",
      detail: err.message,
    });
  }
};
