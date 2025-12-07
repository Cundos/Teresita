import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Esto evita que Vercel guarde datos viejos en caché
  response.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const fecha = searchParams.get('fecha');
    const turno = searchParams.get('turno');
    const cuidador = searchParams.get('cuidador');
    const limite = searchParams.get('limite');

    let query = 'SELECT * FROM registros';
    const conditions = [];
    const values = [];

    // Filtros dinámicos
    if (fecha) {
      conditions.push(`fecha = $${values.length + 1}`);
      values.push(fecha);
    }
    if (turno) {
      conditions.push(`turno = $${values.length + 1}`);
      values.push(turno);
    }
    if (cuidador) {
      conditions.push(`cuidador = $${values.length + 1}`);
      values.push(cuidador);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY fecha DESC, created_at DESC';

    if (limite) {
      query += ` LIMIT ${parseInt(limite)}`;
    }

    // Ejecutamos la consulta
    const result = await sql.query(query, values);

    return response.status(200).json(result.rows);
  } catch (error) {
    console.error("Error leyendo:", error);
    return response.status(500).json({ error: error.message });
  }
}
