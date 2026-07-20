const answerRouter = require("express").Router()
const validatePropositional = require("../validation/correctness")
const dbFunc = require("../database/dbFunc.js")
const evaluator = require("../validation/matchAnswer.js")
const authenticateToken = require("../middleware/auth.js")
const routerHelper = require("./answerHelper.js")
const { MODULENAMES } = require("../constants.js")

answerRouter.post("/:id", authenticateToken, async (request, response) => {
  const taskId = request.params.id
  console.log("BACKEND RECEIVED TASK ID:", taskId)

  const { answer } = request.body

  const userId = request.userId
  let answerModuleName
  try {
    answerModuleName = await dbFunc.getAnswerAndModule(taskId)
  } catch (err) {
    return response.status(404).json({ error: err })
  }
  switch (answerModuleName.moduleName) {
    case MODULENAMES.WORDS_TO_PROPOSITIONS:
      return await routerHelper.wordsToPropositionsHelper(
        answer,
        taskId,
        userId,
        response,
      )
    case MODULENAMES.SUBFORMULA:
      return await routerHelper.subFormulaHelper(
        answer,
        taskId,
        answerModuleName.answer,
        userId,
        response,
      )
    case MODULENAMES.TRUTHTABLE_TASK:
      return await routerHelper.truthTableHelper(
        answer,
        taskId,
        userId,
        response,
      )
    case MODULENAMES.EQUIVALENCE_RULES_TASK:
      return await routerHelper.equivalenceRuleHelper(
        answer,
        answerModuleName.answer,
        userId,
        taskId,
        response,
      )
    case MODULENAMES.TT_METHOD_CONVERSION:
      return await routerHelper.TTFormHelper(
        answer,
        answerModuleName.answer,
        userId,
        taskId,
        response,
      )
    case MODULENAMES.EQUIVALENCE_METHOD_TRANSFORM:
      return await routerHelper.equivalenceFormHelper(
        answer,
        answerModuleName.answer,
        userId,
        taskId,
        response,
      )
    case MODULENAMES.RESOLUTION_INTRODUCTION:
      return await routerHelper.resolutionHelper(
        answer,
        answerModuleName.answer,
        userId,
        taskId,
        response,
      )
    case MODULENAMES.RECURSIVE_DEFINITION:
      return await routerHelper.shorthandHelper(
        answer,
        answerModuleName.answer,
        userId,
        taskId,
        response,
      )
    default:
      return response.status(400).json({ error: "Unsupported module" })
  }
})

answerRouter.get("/", authenticateToken, async (request, response) => {
  const userId = request.userId

  try {
    const answerList = await dbFunc.getAllUserAnswers(userId)
    if (answerList.rows.length === 0) {
      return response.status(404).json({ error: "Answers not found" })
    }
    return response.status(200).json({ answerList: answerList.rows })
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error: "Error in server" })
  }
})
module.exports = answerRouter
