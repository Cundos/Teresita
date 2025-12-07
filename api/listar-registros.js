// api/listar-registros.js
const { getPool } = require("./db.js");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { fecha, cuidador, turno, limite } = req.query;

    const pool = getPool();
    const where = [];
    const values = [];
    let idx = 1;

    if (fecha) {
      where.push(`fecha = $${idx++}`);
      values.push(fecha);
    }
    if (cuidador) {
      where.push(`cuidador = $${idx++}`);
      values.push(cuidador);
    }
    if (turno) {
      where.push(`turno = $${idx++}`);
      values.push(turno);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const limitNum = Number.isFinite(+limite) ? parseInt(limite, 10) : 50;

    const query = `
      SELECT
        id,
        fecha,
        turno,
        cuidador,
        desayuno,
        almuerzo,
        merienda,
        cena,
        agua_vasos,
        med_maniana,
        med_noche,
        notas,
        estado_animo,
        created_at,
        updated_at
      FROM registros_cuidado
      ${whereClause}
      ORDER BY fecha DESC, created_at DESC
      LIMIT ${limitNum};
    `;

    const { rows } = await pool.query(query, values);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error en listar-registros:", err);
    return res.status(500).json({ error: "Error interno al listar" });
  }
};
