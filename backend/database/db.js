const { Pool } = require("pg")
const logger = require("../config/logger")
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})
logger.debug(
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
  },
  "DB CONFIG USED:",
)
module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
}
