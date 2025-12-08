// api/borrar-registro.js

// Intentamos cargar db.js, pero sin que reviente toda la función si algo falla
let getPool;
try {
  ({ getPool } = require("./db.js"));
} catch (err) {
  // Si explota el require, devolvemos error explícito
  module.exports = async (req, res) => {
    return res.status(500).json({
      ok: false,
      stage: "require-db",
      error: err.message,
    });
  };
  // Importante: salimos acá, no definimos nada más
  return;
}

module.exports = async (req, res) => {
  try {
    // En Vercel Node.js, los query params vienen en req.query
    const { id } = req.query || {};

    const parsedId = parseInt(id, 10);
    if (!parsedId || Number.isNaN(parsedId)) {
      return res.status(400).json({
        ok: false,
        stage: "validate",
        error: "Parámetro 'id' inválido o ausente",
        rawId: id ?? null,
      });
    }

    const pool = getPool();

    // ⚠️ Asegurate que la tabla se llame así:
    //     registros_cuidado
    // y tenga columna id (PK)
    const result = await pool.query(
      "DELETE FROM registros_cuidado WHERE id = $1",
      [parsedId]
    );

    return res.status(200).json({
      ok: true,
      stage: "done",
      deleted: result.rowCount,
      id: parsedId,
    });
  } catch (err) {
    console.error("Error en borrar-registro:", err);
    return res.status(500).json({
      ok: false,
      stage: "query",
      error: err.message,
    });
  }
};
