const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test DB + create ONE table only
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS test (
      id SERIAL PRIMARY KEY,
      value TEXT
    );
  `);

  console.log("DB connected + table ready");
}

// ROOT
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// DB TEST
app.get("/test", async (req, res) => {
  const result = await pool.query(`SELECT NOW()`);
  res.json(result.rows[0]);
});

// PORT (CRITICAL FOR RENDER)
const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
  console.log("Server started on port", PORT);
  await initDB();
});
