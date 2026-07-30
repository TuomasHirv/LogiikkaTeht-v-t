const db = require("./db")

const initDB = async () => {
  try {
    await createExtensions()
    console.log("Extensions initialized")

    await createTasksTable()
    console.log("Tasks table initialized")

    await createUsersTable()
    console.log("Users table initialized")

    await createAnswersTable()
    console.log("Answers table initialized")
  } catch (err) {
    console.error("Initializing tables failed", err)
  }
}

const createExtensions = async () => {
  const extensionsQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
  try {
    await db.query(extensionsQuery)
  } catch (err) {
    throw new Error(err.message)
  }
}

const createTasksTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type VARCHAR(50) NOT NULL,
      module_name TEXT NOT NULL,
      question TEXT NOT NULL,
      correct_answer JSONB DEFAULT '{}'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb
    );
  `
  try {
    await db.query(createTableQuery)
  } catch (err) {
    throw new Error(err.message)
  }
}

const createUsersTable = async () => {
  const createUserQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `
  try {
    await db.query(createUserQuery)
  } catch (err) {
    throw new Error(err.message)
  }
}

const createAnswersTable = async () => {
  const createAnswersQuery = `
    CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    submitted_answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    feedback VARCHAR(100),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_task UNIQUE (user_id, task_id)
    );
  `
  try {
    await db.query(createAnswersQuery)
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = initDB
