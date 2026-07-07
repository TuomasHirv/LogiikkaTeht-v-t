require("dotenv").config()
const db = require("../database/db")
const tasks = require("./taskSeed")
// I have designed the database structure my self. Many of the tasks are AI-generated.

const seedDatabase = async () => {
  try {
    console.log("🔄 Starting database seeding...")
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

    console.log(
      `✅ Successfully seeded ${tasks.length} tasks into the database!`,
    )
  } catch (error) {
    console.error("❌ Error while seeding database:", error)
  } finally {
    if (db.end) {
      await db.end()
    } else {
      process.exit(0)
    }
  }
}

seedDatabase()
