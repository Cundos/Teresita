// api/borrar-registro.js
const { getPool } = require("./db.js");

module.exports = async (req, res) => {
  try {
    // Vercel pasa los query params en req.query
    const { id } = req.query || {};

    const parsedId = parseInt(id, 10);
    if (!parsedId || Number.isNaN(parsedId)) {
      return res.status(400).json({
        ok: false,
        error: "Parámetro 'id' inválido o ausente"
      });
    }

    const pool = getPool();
    const result = await pool.query(
      "DELETE FROM registros_cuidado WHERE id = $1",
      [parsedId]
    );

    return res.status(200).json({
      ok: true,
      deleted: result.rowCount
    });
  } catch (err) {
    console.error("Error en borrar-registro:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
};
