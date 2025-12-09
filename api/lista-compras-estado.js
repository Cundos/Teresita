// /api/lista-compras-estado.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const { id, estado, accion } = req.body || {};

    if (!id) {
      res.status(400).json({ ok: false, error: "Falta id" });
      return;
    }

    // Borrar (lo usás con el PIN desde el front)
    if (accion === "borrar") {
      const result = await pool.query(
        "DELETE FROM lista_compras WHERE id = $1",
        [id]
      );
      res.status(200).json({ ok: true, deleted: result.rowCount });
      return;
    }

    // Marcar como 'pendiente' o 'comprado'
    if (estado !== "pendiente" && estado !== "comprado") {
      res.status(400).json({ ok: false, error: "Estado inválido" });
      return;
    }

    const { rowCount } = await pool.query(
      "UPDATE lista_compras SET estado = $1 WHERE id = $2",
      [estado, id]
    );

    res.status(200).json({ ok: true, updated: rowCount });
  } catch (err) {
    console.error("Error en lista_compras-estado:", err);
    res.status(500).json({ ok: false, error: "Error al actualizar estado" });
  }
};
