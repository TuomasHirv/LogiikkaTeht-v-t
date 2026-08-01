// This file is AI-generated
const { logger } = require("../config/logger")
const { PostgreSqlContainer } = require("@testcontainers/postgresql")
const jwt = require("jsonwebtoken")

const JWT_secret = process.env.JWT_SECRET

let container
let app
let db

// Spins up a throwaway Postgres container, points the db pool at it,
// creates the schema and requires the express app so supertest can hit it.
// Call from test.before() in each route test file.
const setupTestDb = async () => {
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

  db = require("../database/db")

  // Same table-creation logic exprApp.js runs on startup, called here
  // directly (and awaited) so the schema is guaranteed ready before tests run.
  const initDB = require("../database/initDb")
  await initDB()

  // Required after the PG* env vars are set so its own initDB() call
  // (fire-and-forget, already a no-op thanks to IF NOT EXISTS) targets the container.
  app = require("../exprApp")

  return { app, db }
}

// Call from test.after().
const teardownTestDb = async () => {
  logger.info("globalTeardown: start")
  try {
    await db?.end()
    await container?.stop()
  } catch (err) {
    console.warn("container stop failed", { cause: err })
  }
}

// Call from test.afterEach() to isolate tests from each other.
const clearTestDb = async () => {
  await db.query(`
    TRUNCATE TABLE answers, tasks, users RESTART IDENTITY CASCADE;
  `)
}

// Mirrors the token shape issued by userRouter's login/signup routes,
// for tests that need to hit routes behind authenticateToken.
const generateTestToken = (userId) =>
  jwt.sign({ userId }, JWT_secret, { expiresIn: "7d" })

module.exports = {
  setupTestDb,
  teardownTestDb,
  clearTestDb,
  generateTestToken,
}
