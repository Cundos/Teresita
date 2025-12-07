// api/ping-db.js
const { getPool } = require("./db.js");

module.exports = async (req, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query("SELECT now() AS ahora, version()");
    return res.status(200).json({
      ok: true,
      ahora: rows[0].ahora,
      version: rows[0].version
    });
  } catch (err) {
    console.error("Error en ping-db:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
};
