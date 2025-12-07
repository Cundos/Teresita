import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { fecha, cuidador, turno, limite } = req.query;

  try {
    let query = 'SELECT id, data, created_at FROM registros';
    const params = [];
    const conditions = [];

    if (fecha) {
      params.push(fecha);
      conditions.push("data->>'fecha' = $" + params.length);
    }
    if (cuidador) {
      params.push(cuidador);
      conditions.push("data->>'cuidador' = $" + params.length);
    }
    if (turno) {
      params.push(turno);
      conditions.push("data->>'turno' = $" + params.length);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    if (limite) {
      params.push(parseInt(limite));
      query += ' LIMIT $' + params.length;
    }

    const result = await pool.query(query, params);

    const registros = result.rows.map((row) => {
      return {
        id: row.id,
        ...row.data,
        created_at: row.created_at,
      };
    });

    return res.status(200).json(registros);
  } catch (err) {
    console.error('Error fetching records:', err);
    return res.status(500).json({ error: 'Error fetching records' });
  }
}
