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

// Post is turned off as there is no interface to create tasks with.
// Creating tasks is done with npm run seed on the backend directory
// To implement this it would require atleast: 1. authentication 2. Frontend interface 3. Validation on input
const taskRouterPost = false
taskRouter.post("/", async (request, response) => {
  if (!taskRouterPost) {
    return response.status(404).json({ error: "This route is turned off" })
  }
  const { type, module_name, question, correct_answer, metadata } = request.body

  try {
    const result = await dbFunc.insertTask(
      type,
      module_name,
      question,
      correct_answer,
      metadata,
    )
    return response.status(201).json({ id: result.rows[0].id })
  } catch (err) {
    return response.status(500).json({ error: err })
  }
})

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
