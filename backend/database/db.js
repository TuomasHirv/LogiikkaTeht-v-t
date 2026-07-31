const { Pool } = require("pg")
const logger = require("../config/logger")
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})
logger.debug("DB CONFIG USED:", {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
})
module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
}
