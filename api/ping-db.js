// api/ping-db.js
module.exports = async (req, res) => {
  const dbUrl = process.env.DATABASE_URL || null;

  return res.status(200).json({
    ok: true,
    hasDatabaseUrl: !!dbUrl,
    databaseUrlPreview: dbUrl ? dbUrl.slice(0, 120) + "..." : null
  });
};
