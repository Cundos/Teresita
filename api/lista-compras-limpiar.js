// api/lista-compras-limpiar.js
const { getPool } = require("./db.js");

module.exports = async (req, res) => {
  // Sólo permitimos POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método no permitido. Usá POST.",
    });
  }

  try {
    const pool = getPool();

    // Borra todos los ítems marcados como "comprado"
    const result = await pool.query(
      "DELETE FROM lista_compras WHERE estado = $1",
      ["comprado"]
    );

    return res.status(200).json({
      ok: true,
      deleted: result.rowCount, // cuántas filas borró
    });
  } catch (err) {
    console.error("Error en lista-compras-limpiar:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al limpiar la lista de compras",
      detail: err.message,
    });
  }
};
