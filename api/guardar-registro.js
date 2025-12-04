import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const data = req.body || {};
  try {
    // Insert the record into the database. Adjust table and columns according to your schema.
    // Here we assume there is a table `registros` with a jsonb column `data`.
    const result = await pool.query(
      'INSERT INTO registros(data) VALUES ($1) RETURNING id',
      [data]
    );
    const id = result.rows[0]?.id;
    res.status(200).json({ ok: true, id });
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ error: 'Error al guardar el registro' });
  }
}
