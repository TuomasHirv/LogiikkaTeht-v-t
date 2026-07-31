const taskRouter = require("express").Router()
const db = require("../database/db")
const dbFunc = require("../database/dbFunc.js")
const logger = require("../config/logger")

taskRouter.get("/", async (request, response) => {
  const q = "SELECT type, question, metadata FROM tasks"
  try {
    const result = await db.query(q)
    return response.json(result.rows)
  } catch (err) {
    logger.error(err, "couldn't get tasks")
    return response.json({ error: err })
  }
})

// Removed POST route since it isn't used. And wont be able to be created in time.
// Creating tasks is done by Seeding them in to the database

taskRouter.get("/count", async (request, response) => {
  const q =
    "SELECT module_name, COUNT(*) FROM tasks GROUP BY module_name ORDER BY count DESC"
  try {
    const result = await db.query(q)
    return response.json(result.rows)
  } catch (error) {
    logger.error(error, "Error in counting all tasks")
    return response.json({ error: error })
  }
})

taskRouter.get("/:module", async (request, response) => {
  const term = request.params.module
  const q =
    "SELECT type, question, metadata, id FROM tasks WHERE module_name = $1"
  try {
    const result = await db.query(q, [term])
    if (result.rows.length === 0) {
      return response.status(404).json({ error: `No tasks found for ${term} ` })
    }
    return response.json(result.rows)
  } catch (err) {
    logger.error(err, "couldn't get tasks")
    return response.json({ error: err })
  }
})

module.exports = taskRouter
