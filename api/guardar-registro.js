// /api/guardar-registro.js
// Placeholder para Vercel. Acá deberías pegar la lógica que hoy tenés en tu
// Netlify Function de guardar, adaptando el handler.
//
// IMPORTANTE: esto no persiste en ningún lado, sólo eco de prueba.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const body = req.body || {};
  console.log("Guardar registro (demo, sin DB):", body);

  // Acá iría tu insert en Neon / Postgres usando DATABASE_URL, etc.
  // Ejemplo (pseudo):
  // const client = new Client({ connectionString: process.env.DATABASE_URL });
  // await client.connect();
  // await client.query("INSERT INTO ...", [...]);
  // await client.end();

  res.status(200).json({ ok: true, demo: true });
}
