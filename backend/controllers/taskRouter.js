const taskRouter = require("express").Router()
const db = require("../database/db")

taskRouter.get("/", async (request, response) => {
  const q = "SELECT type, question, metadata FROM tasks"
  try {
    const result = await db.query(q)
    return response.json(result.rows)
  } catch (err) {
    console.log("couldn't get tasks:", err)
    return response.json({ error: err })
  }
})

taskRouter.post("/", async (request, response) => {
  const { type, module_name, question, correct_answer, metadata } = request.body

  const q = `
  INSERT INTO tasks (type, module_name, question, correct_answer, metadata)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id`
  const values = [type, module_name, question, correct_answer, metadata]

  try {
    const result = await db.query(q, values)
    return response.status(201).json({ id: result.rows[0].id })
  } catch (err) {
    console.log("Couldn't save task:", err)
    return response.status(500).json({ error: err })
  }
})

taskRouter.get("/:module", async (request, response) => {
  const term = request.params.module
  const q =
    "SELECT type, question, metadata, id FROM tasks WHERE module_name = $1"
  try {
    const result = await db.query(q, [term])
    return response.json(result.rows)
  } catch (err) {
    console.log("couldn't get tasks:", err)
    return response.json({ error: err })
  }
})

module.exports = taskRouter
