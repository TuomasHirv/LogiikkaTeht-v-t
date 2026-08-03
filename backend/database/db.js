const { Pool } = require("pg")
const logger = require("../config/logger")
// Hosted environments provide a single DATABASE_URL and require SSL.
// Local development and the Testcontainers test suite use the discrete PG*
// vars against a plain postgres image that has SSL disabled.
const connectionString = process.env.DATABASE_URL

const pool = new Pool(
  connectionString
    ? { connectionString, ssl: { rejectUnauthorized: false } }
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
      },
)
logger.debug(
  {
    mode: connectionString ? "DATABASE_URL" : "PG*",
    host: connectionString ? undefined : process.env.PGHOST,
    port: connectionString ? undefined : process.env.PGPORT,
  },
  "DB CONFIG USED:",
)
module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
}
