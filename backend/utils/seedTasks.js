const path = require("path")
// Same root .env exprApp.js loads, so seeding and the server always agree
// on which database they are pointed at.
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") })
const db = require("../database/db")
const initDB = require("../database/initDb")
const tasks = require("./taskSeed")
const logger = require("../config/logger")
// I have designed the database structure my self. Many of the tasks are AI-generated.

const seedDatabase = async () => {
  try {
    logger.info("🔄 Starting database seeding...")
    // Idempotent, and lets this run against a brand new database without
    // having to boot the server first just to create the schema.
    await initDB()
    await db.query("TRUNCATE TABLE tasks CASCADE")
    const qInsert = `
      INSERT INTO tasks (type, module_name, question, correct_answer, metadata) 
      VALUES ($1, $2, $3, $4, $5)
    `

    for (const task of tasks) {
      await db.query(qInsert, [
        task.type,
        task.module_name,
        task.question,
        task.correct_answer,
        task.metadata,
      ])
    }

    logger.info(
      `✅ Successfully seeded ${tasks.length} tasks into the database!`,
    )
  } catch (error) {
    logger.error(error, "❌ Error while seeding database")
  } finally {
    if (db.end) {
      await db.end()
    } else {
      process.exit(0)
    }
  }
}

seedDatabase()
