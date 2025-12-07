import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Ensure request body exists
  const body = req.body || {};

  // Map front-end camelCase fields to snake_case for the database
  const data = {
    fecha: body.fecha,
    turno: body.turno,
    cuidador: body.cuidador,
    desayuno: !!body.desayuno,
    almuerzo: !!body.almuerzo,
    merienda: !!body.merienda,
    cena: !!body.cena,
    agua_vasos: parseInt(body.aguaVasos ?? 0, 10),
    med_maniana: !!body.medManiana,
    med_noche: !!body.medNoche,
    notas: body.notas || '',
    estado_animo: body.estadoAnimo || '',
  };

  try {
    // Ensure the table exists. It holds a JSONB payload and a timestamp.
    await pool.query(`CREATE TABLE IF NOT EXISTS registros (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    // Insert the transformed data into the database
    const result = await pool.query(
      'INSERT INTO registros(data) VALUES ($1) RETURNING id',
      [data]
    );

    const id = result.rows[0]?.id;
    return res.status(200).json({ ok: true, id });
  } catch (error) {
    console.error('Error saving record:', error);
    return res.status(500).json({ error: 'Error al guardar el registro' });
  }
}
