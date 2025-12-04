// /api/listar-registros.js
// Placeholder para Vercel. Deberías reemplazar este código por tu consulta real a DB.
// Actualmente devuelve un array vacío.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const { fecha, cuidador, turno, limite } = req.query;
  console.log("Listar registros (demo, sin DB):", { fecha, cuidador, turno, limite });

  // Acá iría tu SELECT real a Neon / Postgres.
  // De momento devolvemos un array vacío para que el front no rompa.
  res.status(200).json([]);
}
