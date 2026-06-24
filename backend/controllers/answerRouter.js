const answerRouter = require("express").Router()
const validatePropositional = require("../utils/correctness")
const db = require("../database/db")

answerRouter.post("/:id", async (request, response) => {
  const taskId = request.params.id
  const { answer } = request.body
  console.log("ANSWER RECEIVED:", answer, "TASK ID RECEIVED:", taskId)
  if (!validatePropositional(answer)) {
    return response.status(422).json({ error: "incorrect syntax" })
  }
  try {
    const q = `SELECT correct_answer FROM tasks WHERE id = $1`
    const databaseAnswer = await db.query(q, [taskId])
    const correctAnswer = databaseAnswer.rows[0].correct_answer
    const cleanedCorrectAnswer = correctAnswer.replace(/\s+/g, "").toLowerCase()
    const cleanedUserAnswer = answer.replace(/\s+/g, "").toLowerCase()
    if (cleanedUserAnswer === cleanedCorrectAnswer) {
      console.log("Should be correct!")
      return response.status(200).json({ correct: true })
    }
    console.log("Failed!")
    return response.status(200).json({ correct: false })
  } catch (err) {
    console.log("error:", err.message)
    return response.status(500).json({ error: "Internal server error" })
  }
})

module.exports = answerRouter
