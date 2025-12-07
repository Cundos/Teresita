import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    if (request.method !== 'DELETE' && request.method !== 'POST') {
      return response.status(405).json({ error: 'Método no permitido' });
    }

    const id = request.query.id || (request.body && request.body.id);
    
    if (!id) {
      return response.status(400).json({ error: 'ID es requerido' });
    }

    // Ejecutamos el borrado usando la librería nueva
    const result = await sql`DELETE FROM registros WHERE id = ${id}`;

    if (result.rowCount === 0) {
      return response.status(404).json({ error: 'Registro no encontrado' });
    }
    
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error deleting:', error);
    return response.status(500).json({ error: error.message });
  }
}
