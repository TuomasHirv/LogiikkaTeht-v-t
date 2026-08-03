// This file is AI-generated
const logger = require("../config/logger")
const { PostgreSqlContainer } = require("@testcontainers/postgresql")
const jwt = require("jsonwebtoken")

const JWT_secret = process.env.JWT_SECRET

const SETUP_TIMEOUT_MS = 45_000 // allow for a cold `postgres:16-alpine` pull in CI
const TEARDOWN_TIMEOUT_MS = 20_000

// Promise.race doesn't cancel the underlying operation, it just stops us
// waiting on it - this exists so a stalled Docker call fails loudly with a
// clear "what timed out" message instead of hanging the whole CI job.
const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`${label} timed out after ${ms}ms`)),
        ms,
      )
      timer.unref()
    }),
  ])

let container
let app
let db

// Spins up a throwaway Postgres container, points the db pool at it,
// creates the schema and requires the express app so supertest can hit it.
// Call from test.before() in each route test file.
const setupTestDb = async () => {
  container = await withTimeout(
    new PostgreSqlContainer("postgres:16-alpine")
      .withDatabase("logic_tasks_test")
      .withUsername("tester")
      .withPassword("TESTING")
      .withReuse()
      .start(),
    SETUP_TIMEOUT_MS,
    "setupTestDb(): PostgreSqlContainer.start()",
  )

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

  // Required after the PG* env vars are set so it targets the container.
  // DB_ALREADY_INITIALIZED tells it to skip its own redundant initDB() call.
  app = require("../exprApp")

  return { app, db }
}

// Call from test.after().
const teardownTestDb = async () => {
  logger.info("globalTeardown: start")
  try {
    await withTimeout(
      db?.end(),
      TEARDOWN_TIMEOUT_MS,
      "teardownTestDb(): db.end()",
    )
    if (!process.env.CI) {
      // Locally, always stop the container so repeated test runs don't
      // accumulate orphaned postgres containers. In CI, withReuse() already
      // opted this container out of Ryuk tracking so the next test file's
      // setupTestDb() can reuse it instead of paying a fresh container boot;
      // the runner VM (and its Docker daemon) is destroyed at the end of the
      // job regardless, so nothing leaks by skipping the stop here.
      await withTimeout(
        container?.stop(),
        TEARDOWN_TIMEOUT_MS,
        "teardownTestDb(): container.stop()",
      )
    }
  } catch (err) {
    logger.error(err, "teardownTestDb failed")
    // A root-level test.after() throw doesn't reliably fail the CI job on
    // its own, so nudge the exit code explicitly.
    process.exitCode = 1
    throw err
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
