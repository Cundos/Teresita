// api/ping-db.js
module.exports = async (req, res) => {
  const envKeys = Object.keys(process.env).filter((k) =>
    k.toUpperCase().includes("DB") ||
    k.toUpperCase().includes("DATABASE") ||
    k.toUpperCase().includes("NEON")
  );

  return res.status(200).json({
    ok: true,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPreview: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.slice(0, 60) + "..."
      : null,
    envKeys
  });
};
