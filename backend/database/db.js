const { Pool } = require("pg");

const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "logic_tasks_db",
  password: "AWDSAD1231235123",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
