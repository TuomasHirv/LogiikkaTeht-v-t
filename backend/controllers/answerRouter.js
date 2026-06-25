const answerRouter = require("express").Router()
const validatePropositional = require("../utils/correctness")
const db = require("../database/db")
const dbFunc = require("../database/dbFunc.js")
const authenticateToken = require("../middleware/auth.js")

answerRouter.post("/:id", authenticateToken, async (request, response) => {
  const taskId = request.params.id
  console.log("BACKEND RECEIVED TASK ID:", taskId)
  const { answer } = request.body

  const userId = request.userId

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
      const submittedAnswer = await dbFunc.insertAnswer(
        userId,
        taskId,
        answer,
        true,
      )
      return response
        .status(200)
        .json({ correct: true, answer: submittedAnswer.rows[0] })
    }
    const submittedAnswer = await dbFunc.insertAnswer(
      userId,
      taskId,
      answer,
      false,
    )
    return response
      .status(200)
      .json({ correct: false, answer: submittedAnswer.rows[0] })
  } catch (err) {
    console.log("error:", err.message)
    return response.status(500).json({ error: "Internal server error" })
  }
})
answerRouter.get("/", authenticateToken, async (request, response) => {
  const userId = request.userId

  try {
    const answerList = await dbFunc.getAllUserAnswers(userId)
    if (answerList.length === 0) {
      return response.status(404).json({ error: "Answers not found" })
    }
    return response.status(200).json({ answerList: answerList.rows })
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error: "Error in server" })
  }
})
module.exports = answerRouter
