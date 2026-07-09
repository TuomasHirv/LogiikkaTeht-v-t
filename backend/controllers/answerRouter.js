const answerRouter = require("express").Router()
const validatePropositional = require("../utils/correctness")
const dbFunc = require("../database/dbFunc.js")
const evaluator = require("../utils/matchAnswer.js")
const authenticateToken = require("../middleware/auth.js")
const routerHelper = require("./answerHelper.js")

answerRouter.post("/:id", authenticateToken, async (request, response) => {
  const taskId = request.params.id
  console.log("BACKEND RECEIVED TASK ID:", taskId)

  const { answer } = request.body

  const userId = request.userId
  const answerModuleName = await dbFunc.getAnswerAndModule(taskId)
  switch (answerModuleName.moduleName) {
    case "words-to-propositions":
      return await routerHelper.wordsToPropositionsHelper(
        answer,
        taskId,
        userId,
        response,
      )
    case "subformula":
      return await routerHelper.subFormulaHelper(
        answer,
        taskId,
        answerModuleName.answer,
        userId,
        response,
      )
    case "Truth-Table-Task":
      return await routerHelper.truthTableHelper(
        answer,
        taskId,
        userId,
        response,
      )
    case "Equivalence-Rules-Task":
      return await routerHelper.equivalenceRuleHelper(
        answer,
        answerModuleName.answer,
        userId,
        taskId,
        response,
      )
    case "TT-method-Conversion":
      return await routerHelper.TTFormHelper(
        answer,
        answerModuleName.answer,
        userId,
        taskId,
        response,
      )
    case "Equivalence-method-Transform":
      return await routerHelper.equivalenceFormHelper(
        answer,
        answerModuleName.answer,
        userId,
        taskId,
        response,
      )
    case "Resolution-Introduction":
      console.log("Received")
    default:
      return response.status(400).json({ error: "Unsupported module" })
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
