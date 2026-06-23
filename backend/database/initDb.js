const db = require("./db")

const initDB = async () => {
  const createTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type VARCHAR(50) NOT NULL,
      module_name TEXT NOT NULL,
      question TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb
    );
  `
  try {
    await db.query(createTableQuery)
    console.log("Tasks table initialized")
  } catch (err) {
    console.error("Initializing tables failed", err)
  }
}

module.exports = initDB
