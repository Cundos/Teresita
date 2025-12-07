import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    // 1. Verificamos que sea un envío de datos (POST)
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Solo se permite POST' });
    }

    const d = request.body;

    // 2. Insertamos los datos en sus columnas correspondientes.
    // La parte "ON CONFLICT" es la magia: si ya existe un registro para esa FECHA+TURNO+CUIDADORA,
    // en lugar de dar error o duplicar, ACTUALIZA los valores.
    await sql`
      INSERT INTO registros (
        fecha, turno, cuidador, 
        desayuno, almuerzo, merienda, cena, 
        agua_vasos, med_maniana, med_noche, 
        estado_animo, notas
      ) VALUES (
        ${d.fecha}, ${d.turno}, ${d.cuidador},
        ${d.desayuno}, ${d.almuerzo}, ${d.merienda}, ${d.cena},
        ${d.aguaVasos}, ${d.medManiana}, ${d.medNoche},
        ${d.estadoAnimo}, ${d.notas}
      )
      ON CONFLICT (fecha, turno, cuidador) 
      DO UPDATE SET 
        desayuno = EXCLUDED.desayuno,
        almuerzo = EXCLUDED.almuerzo,
        merienda = EXCLUDED.merienda,
        cena = EXCLUDED.cena,
        agua_vasos = EXCLUDED.agua_vasos,
        med_maniana = EXCLUDED.med_maniana,
        med_noche = EXCLUDED.med_noche,
        estado_animo = EXCLUDED.estado_animo,
        notas = EXCLUDED.notas,
        updated_at = NOW();
    `;

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Error guardando:", error);
    return response.status(500).json({ error: error.message });
  }
}
