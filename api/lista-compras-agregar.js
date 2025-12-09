// /api/lista-compras-agregar.js
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
    const { categoria, producto, cantidad, creadoPor } = req.body || {};

    if (!categoria || !producto) {
      res.status(400).json({ ok: false, error: "Faltan datos (categoría/producto)" });
      return;
    }

    const { rows } = await pool.query(
      `
      INSERT INTO lista_compras (categoria, producto, cantidad, creado_por)
      VALUES ($1, $2, $3, $4)
      RETURNING id, categoria, producto, cantidad, estado, creado_por, creado_en
      `,
      [categoria, producto, cantidad || null, creadoPor || null]
    );

    res.status(200).json({ ok: true, item: rows[0] });
  } catch (err) {
    console.error("Error al agregar a lista_compras:", err);
    res.status(500).json({ ok: false, error: "Error al agregar item" });
  }
};
