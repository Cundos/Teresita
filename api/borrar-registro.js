import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const id = req.query.id || (req.body && req.body.id);
  if (!id) {
    return res.status(400).json({ error: 'ID es requerido' });
  }

  try {
    const result = await pool.query('DELETE FROM registros WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error deleting record:', err);
    return res.status(500).json({ error: 'Error deleting record' });
  }
}
