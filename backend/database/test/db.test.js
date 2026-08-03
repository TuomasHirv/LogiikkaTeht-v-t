const test = require("node:test")
const { PostgreSqlContainer } = require("@testcontainers/postgresql")

let container
let db

test.before(async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine")
    .withDatabase("logic_tasks_test")
    .withUsername("tester")
    .withPassword("TESTING")
    .start()

  process.env.PGHOST = container.getHost()
  process.env.PGPORT = String(container.getPort())
  process.env.PGUSER = container.getUsername()
  process.env.PGPASSWORD = container.getPassword()
  process.env.PGDATABASE = container.getDatabase()

  db = require("../db")

  await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type VARCHAR(50) NOT NULL,
      module_name TEXT NOT NULL,
      question TEXT NOT NULL,
      correct_answer JSONB DEFAULT '{}'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    submitted_answer JSONB NOT NULL,
    feedback VARCHAR(100),
    is_correct BOOLEAN NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_task UNIQUE (user_id, task_id)
    );
  `)
})

test.after(async () => {
  await db.end()
  await container.stop()
})

test.afterEach(async () => {
  await db.query(`
    TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    TRUNCATE TABLE answers RESTART IDENTITY CASCADE;
    `)
})
