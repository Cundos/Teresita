import { Pool } from '@neondatabase/serverless';

// Usamos el nombre de la variable que pegaste: POSTGRES_URL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, 
});

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const fecha = searchParams.get('fecha');
    const limite = searchParams.get('limite');

    let query = 'SELECT * FROM registros';
    const values = [];
    const conditions = [];

    if (fecha) {
      conditions.push(`fecha = $${values.length + 1}`);
      values.push(fecha);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY fecha DESC, created_at DESC';

    if (limite) {
      query += ` LIMIT ${parseInt(limite)}`;
    }

    const result = await pool.query(query, values);

    return response.status(200).json(result.rows);
  } catch (error) {
    console.error("Error leyendo:", error);
    return response.status(500).json({ error: 'Error interno del servidor.' });
  }
}
