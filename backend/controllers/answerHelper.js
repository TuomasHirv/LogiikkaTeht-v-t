const dbFunc = require("../database/dbFunc.js")
const evaluator = require("../validation/matchAnswer.js")
const matchTree = require("../validation/matchTree.js")
const validatePropositional = require("../validation/correctness")
const { normalize } = require("../utils/normalize.js")
const logger = require("../config/logger")
const serializeSubmittedAnswer = (answer) => JSON.stringify(answer)

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.status = 422
  }
}

async function runEvaluation(
  evalFunc,
  answer,
  taskId,
  userId,
  evalParams,
  response,
) {
  try {
    const accepted = await evalFunc(evalParams)
    const defaultAccepted = accepted?.accepted || false
    const defaultFeedback =
      accepted?.feedback || "served failed to evaluate answer"

    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      defaultAccepted,
      defaultFeedback,
    )
    if (defaultAccepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: defaultFeedback })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: defaultFeedback })
  } catch (error) {
    if (error instanceof ValidationError) {
      return response.status(error.status).json({ error: error.message })
    }
    if (error.message) {
      return response.status(500).json({ error: error.message })
    }
    return response.status(500).json({ error: "internal server error" })
  }
}

async function wordsToPropositionsHelper(answer, taskId, userId, response) {
  async function wTPEvaluation(evalParams) {
    if (!validatePropositional(evalParams.answer)) {
      throw new ValidationError("Syntax error")
    }
    return await evaluator.matchPropositions(
      evalParams.answer,
      evalParams.taskId,
    )
  }
  const evalParams = { answer: answer, taskId: taskId }
  return await runEvaluation(
    wTPEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function subFormulaHelper(answer, taskId, userId, response) {
  async function subFormulaEvaluation(evalParams) {
    return evaluator.matchSubFormula(evalParams.answer, evalParams.taskId)
  }
  const evalParams = { answer: answer, taskId: taskId }
  return await runEvaluation(
    subFormulaEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function truthTableHelper(answer, taskId, userId, response) {
  async function truthTableEvaluation(evalParams) {
    return await evaluator.matchTruthTable(evalParams.answer, evalParams.taskId)
  }
  const evalParams = { answer: answer, taskId: taskId }
  return await runEvaluation(
    truthTableEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function equivalenceRuleHelper(answer, rule, userId, taskId, response) {
  async function equivalenceEvaluation(evalParams) {
    return await evaluator.matchEquivalenceAnswer(
      evalParams.answer,
      evalParams.rule,
    )
  }
  const evalParams = { answer: answer, rule: rule }

  return await runEvaluation(
    equivalenceEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function TTFormHelper(
  answer,
  correctAnswerAndForm,
  userId,
  taskId,
  response,
) {
  async function TTFormEvaluation(evalParams) {
    return await evaluator.matchTTFormAnswer(
      evalParams.answer,
      evalParams.correctAnswer,
      evalParams.form,
    )
  }
  const evalParams = {
    answer: answer,
    correctAnswer: correctAnswerAndForm[0],
    form: correctAnswerAndForm[1],
  }
  return await runEvaluation(
    TTFormEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function equivalenceFormHelper(
  answer,
  ruleAndForm,
  userId,
  taskId,
  response,
) {
  async function equivalenceFormEvaluation(evalParams) {
    const transformCheck = await evaluator.matchEquivalenceAnswer(
      evalParams.answer,
      evalParams.rule,
    )
    if (!transformCheck) {
      return {
        accepted: transformCheck.accepted,
        feedback: transformCheck.feedback,
      }
    }
    return evaluator.checkIfCorrectForm(
      evalParams.answer.at(-1),
      evalParams.form,
    )
  }
  const evalParams = {
    answer: answer,
    rule: ruleAndForm[0],
    form: ruleAndForm[1],
  }
  return await runEvaluation(
    equivalenceFormEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function resolutionHelper(answer, reqClauses, userId, taskId, response) {
  async function resolutionEvaluation(evalParams) {
    return evaluator.matchResolutionTask(
      evalParams.answer,
      evalParams.assumptionCount,
      evalParams.requiredClauses,
      evalParams.correctAssumptions,
    )
  }
  const evalParams = {
    answer: answer,
    requiredClauses: reqClauses[0],
    assumptionCount: reqClauses[1],
    correctAssumptions: reqClauses[2],
  }
  return await runEvaluation(
    resolutionEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function shorthandHelper(answer, FinalAllowed, userId, taskId, response) {
  async function shorthandEvaluation(evalParams) {
    const question = await dbFunc.getQuestion(evalParams.taskId)
    return await evaluator.validateShorthandtask(
      evalParams.answer,
      evalParams.FinalAllowed,
      question[0].question,
    )
  }
  const evalParams = {
    answer: answer,
    FinalAllowed: FinalAllowed,
    taskId: taskId,
  }
  return await runEvaluation(
    shorthandEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function semanticTreeHelper(answer, reqLines, userId, taskId, response) {
  async function semanticTreeEvaluation(evalParams) {
    const question = await dbFunc.getQuestion(evalParams.taskId)
    return await evaluator.checkSemanticTreeTask(
      evalParams.answer,
      evalParams.reqLines,
      question[0].question,
    )
  }
  const evalParams = { answer: answer, reqLines: reqLines, taskId: taskId }
  return await runEvaluation(
    semanticTreeEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function multipleChoiceHelper(
  answer,
  reqAnswer,
  feedback,
  userId,
  taskId,
  response,
) {
  function multipleChoiceEvaluation(evalParams) {
    if (evalParams.answer === evalParams.reqAnswer) {
      return { accepted: true, feedback: "Pass" }
    }
    return { accepted: false, feedback: evalParams.feedback }
  }
  const evalParams = {
    answer: answer,
    reqAnswer: reqAnswer,
    feedback: feedback,
  }
  return await runEvaluation(
    multipleChoiceEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

async function naturalDeductionHelper(answer, goal, userId, taskId, response) {
  async function naturalDeductionEvaluation(evalParams) {
    const { premises, allowed_rules, prefilled_lines } =
      await dbFunc.getMetadata(taskId)
    const normalizedPremises = premises.map(normalize)
    const allowedRules = new Set(allowed_rules.map(normalize))
    return evaluator.matchNaturalDeduction(
      evalParams.answer,
      evalParams.goal.replace(/\s+/g, ""),
      allowedRules,
      normalizedPremises,
    )
  }
  const evalParams = { answer: answer, goal: goal }
  return await runEvaluation(
    naturalDeductionEvaluation,
    answer,
    taskId,
    userId,
    evalParams,
    response,
  )
}

module.exports = {
  wordsToPropositionsHelper,
  subFormulaHelper,
  truthTableHelper,
  equivalenceRuleHelper,
  TTFormHelper,
  equivalenceFormHelper,
  resolutionHelper,
  shorthandHelper,
  semanticTreeHelper,
  multipleChoiceHelper,
  naturalDeductionHelper,
}
