const answerRouter = require("express").Router()
const validatePropositional = require("../utils/correctness")
const db = require("../database/db")
const dbFunc = require("../database/dbFunc.js")
const evaluator = require("../utils/matchAnswer.js")
const authenticateToken = require("../middleware/auth.js")

async function wordsToPropositionsHelper(answer, taskId, response) {
  try {
    if (!validatePropositional(answer)) {
      return response.status(422).json({ error: "Syntax error" })
    }
    const accepted = await evaluator.matchPropositions(answer, taskId)
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function subFormulaHelper(answer, taskId, dbAnswer, response) {
  try {
    const accepted = await evaluator.matchSubFormula(answer, taskId, dbAnswer)
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

answerRouter.post("/:id", authenticateToken, async (request, response) => {
  const taskId = request.params.id
  console.log("BACKEND RECEIVED TASK ID:", taskId)

  const { answer } = request.body

  const userId = request.userId
  const answerModuleName = await dbFunc.getAnswerAndModule(taskId)
  console.log("Before switch:", answerModuleName)
  switch (answerModuleName.moduleName) {
    case "words-to-propositions":
      return await wordsToPropositionsHelper(answer, taskId, response)
    case "subformula":
      try {
        const accepted = await evaluator.matchSubFormula(
          answer,
          taskId,
          answerModuleName.answer,
        )
        if (accepted) {
          return response.status(200).json({ correct: true, answer: answer })
        }
        return response.status(200).json({ correct: false, answer: answer })
      } catch (error) {
        return response.status(500).json({ error: "internal server error" })
      }
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
