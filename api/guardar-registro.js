// api/guardar-registro.js
import { getPool } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      fecha,          // "YYYY-MM-DD"
      turno,          // maniana | tarde | noche | completo
      cuidador,       // guadalupe | aylen | noelia | rocio | otro
      desayuno,
      almuerzo,
      merienda,
      cena,
      aguaVasos,
      medManiana,
      medNoche,
      notas,
      estadoAnimo,
    } = req.body || {};

    if (!fecha || !turno || !cuidador) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const pool = getPool();

    const query = `
      INSERT INTO registros_cuidado (
        fecha, turno, cuidador,
        desayuno, almuerzo, merienda, cena,
        agua_vasos, med_maniana, med_noche,
        notas, estado_animo,
        updated_at
      )
      VALUES (
        $1, $2, $3,
        $4, $5, $6, $7,
        $8, $9, $10,
        $11, $12,
        now()
      )
      ON CONFLICT (fecha, turno, cuidador)
      DO UPDATE SET
        desayuno     = EXCLUDED.desayuno,
        almuerzo     = EXCLUDED.almuerzo,
        merienda     = EXCLUDED.merienda,
        cena         = EXCLUDED.cena,
        agua_vasos   = EXCLUDED.agua_vasos,
        med_maniana  = EXCLUDED.med_maniana,
        med_noche    = EXCLUDED.med_noche,
        notas        = EXCLUDED.notas,
        estado_animo = EXCLUDED.estado_animo,
        updated_at   = now()
      RETURNING *;
    `;

    const values = [
      fecha,
      turno,
      cuidador,
      !!desayuno,
      !!almuerzo,
      !!merienda,
      !!cena,
      Number.isFinite(+aguaVasos) ? parseInt(aguaVasos, 10) : 0,
      !!medManiana,
      !!medNoche,
      notas ?? "",
      estadoAnimo ?? null,
    ];

    const { rows } = await pool.query(query, values);
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error en guardar-registro:", err);
    return res.status(500).json({ error: "Error interno al guardar" });
  }
}
