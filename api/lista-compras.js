// api/lista-compras.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function listarListaCompras() {
  const query = `
    SELECT id, categoria, producto, cantidad, estado,
           creado_por, creado_en, actualizado_en
    FROM lista_compras
    ORDER BY
      CASE WHEN estado = 'pendiente' THEN 0 ELSE 1 END,
      creado_en ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function agregarItem(body) {
  const { categoria, producto, cantidad, creadoPor } = body;

  if (!categoria || !producto) {
    throw new Error("Faltan datos obligatorios (categoría y producto).");
  }

  const query = `
    INSERT INTO lista_compras (categoria, producto, cantidad, estado, creado_por)
    VALUES ($1, $2, $3, 'pendiente', $4)
    RETURNING *;
  `;
  const values = [categoria, producto, cantidad || null, creadoPor || null];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function marcarComprado(id) {
  const query = `
    UPDATE lista_compras
    SET estado = 'comprado',
        actualizado_en = NOW()
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function limpiarComprados() {
  const query = `
    DELETE FROM lista_compras
    WHERE estado = 'comprado';
  `;
  const { rowCount } = await pool.query(query);
  return rowCount;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    if (req.method === "GET") {
      // Listar todos los ítems
      const items = await listarListaCompras();
      return res.status(200).json({ ok: true, items });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const accion = body.accion || "agregar";

      if (accion === "agregar") {
        const item = await agregarItem(body);
        return res.status(200).json({ ok: true, item });
      }

      if (accion === "marcarComprado") {
        const id = body.id;
        if (!id) throw new Error("Falta el ID del ítem a marcar.");
        const item = await marcarComprado(id);
        return res.status(200).json({ ok: true, item });
      }

      if (accion === "limpiarComprados") {
        const deleted = await limpiarComprados();
        return res.status(200).json({ ok: true, deleted });
      }

      throw new Error("Acción no reconocida en lista de compras.");
    }

    // Otros métodos no permitidos
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  } catch (e) {
    console.error("Error en /api/lista-compras:", e);
    return res.status(500).json({ ok: false, error: e.message || "Error interno" });
  }
};
