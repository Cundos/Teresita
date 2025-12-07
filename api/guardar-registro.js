import { Pool } from '@neondatabase/serverless';

// Usamos el nombre de la variable que pegaste: POSTGRES_URL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Solo se permite POST' });
  }

  try {
    const d = request.body;
    
    const queryText = `
      INSERT INTO registros (
        fecha, turno, cuidador, 
        desayuno, almuerzo, merienda, cena, 
        agua_vasos, med_maniana, med_noche, 
        estado_animo, notas
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      ON CONFLICT (fecha, turno, cuidador) 
      DO UPDATE SET 
        desayuno = $4,
        almuerzo = $5,
        merienda = $6,
        cena = $7,
        agua_vasos = $8,
        med_maniana = $9,
        med_noche = $10,
        estado_animo = $11,
        notas = $12,
        updated_at = NOW()
    `;

    const values = [
      d.fecha, d.turno, d.cuidador,
      d.desayuno, d.almuerzo, d.merienda, d.cena,
      parseInt(d.aguaVasos || "0", 10), d.medManiana, d.medNoche,
      d.estadoAnimo, d.notas
    ];

    await pool.query(queryText, values);

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Error guardando:", error);
    return response.status(500).json({ error: 'Error interno del servidor.' });
  }
}
