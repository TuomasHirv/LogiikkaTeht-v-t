const dbFunc = require("../database/dbFunc.js")
const evaluator = require("../validation/matchAnswer.js")
const matchTree = require("../validation/matchTree.js")
const validatePropositional = require("../validation/correctness")
const { normalize } = require("../utils/normalize.js")
const serializeSubmittedAnswer = (answer) => JSON.stringify(answer)

async function wordsToPropositionsHelper(answer, taskId, userId, response) {
  try {
    if (!validatePropositional(answer)) {
      return response.status(422).json({ error: "Syntax error" })
    }
    const accepted = await evaluator.matchPropositions(answer, taskId)
    feedback = accepted ? "Pass" : "Fail"
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted,
    )
    if (accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: feedback })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: feedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function subFormulaHelper(answer, taskId, dbAnswer, userId, response) {
  try {
    const accepted = await evaluator.matchSubFormula(answer, taskId, dbAnswer)
    const defaultFeedback =
      accepted?.feedback || "served failed to evaluate answer"
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      defaultFeedback,
    )
    if (accepted.accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: defaultFeedback })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: defaultFeedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function truthTableHelper(answer, taskId, userId, response) {
  try {
    const accepted = await evaluator.matchTruthTable(answer, taskId)
    feedback = accepted ? "Pass" : "Fail"
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted,
    )
    if (accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: feedback })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: feedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function equivalenceRuleHelper(answer, rule, userId, taskId, response) {
  try {
    const accepted = await evaluator.matchEquivalenceAnswer(answer, rule)
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      accepted.feedback,
    )
    if (accepted.accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: accepted.feedback })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: accepted.feedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function TTFormHelper(
  answer,
  correctAnswerAndForm,
  userId,
  taskId,
  response,
) {
  try {
    const accepted = evaluator.matchTTFormAnswer(
      answer,
      correctAnswerAndForm[1],
      correctAnswerAndForm[0],
    )
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      accepted.feedback,
    )
    if (accepted.accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: accepted.feedback })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: accepted.feedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function equivalenceFormHelper(
  answer,
  ruleAndForm,
  userId,
  taskId,
  response,
) {
  try {
    const rule = ruleAndForm[0]
    const form = ruleAndForm[1]
    const transformCheck = await evaluator.matchEquivalenceAnswer(answer, rule)
    if (!transformCheck.accepted) {
      return response.status(200).json({
        correct: false,
        answer: answer,
        feedback: transformCheck.feedback,
      })
    }
    const accepted = evaluator.checkIfCorrectForm(answer.at(-1), form)
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      accepted.feedback,
    )
    if (accepted.accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: accepted.feedback })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: accepted.feedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function resolutionHelper(answer, reqClauses, userId, taskId, response) {
  try {
    const requiredClauses = reqClauses[0]
    const assumptionCount = reqClauses[1]
    const correctAssumptions = reqClauses[2]
    const accepted = evaluator.matchResolutionTask(
      answer,
      assumptionCount,
      requiredClauses,
      correctAssumptions,
    )
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      accepted.feedback,
    )
    if (accepted.accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: accepted.feedback })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: accepted.feedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function shorthandHelper(answer, FinalAllowed, userId, taskId, response) {
  try {
    const question = await dbFunc.getQuestion(taskId)
    const accepted = await evaluator.validateShorthandtask(
      answer,
      FinalAllowed,
      question[0].question,
    )
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      accepted.feedback,
    )
    if (accepted.accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: "Pass" })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: accepted.feedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function semanticTreeHelper(answer, reqLines, userId, taskId, response) {
  try {
    const question = await dbFunc.getQuestion(taskId)
    const accepted = await evaluator.checkSemanticTreeTask(
      answer,
      reqLines,
      question[0].question,
    )
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      accepted.feedback,
    )
    if (accepted.accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: "Pass" })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: accepted.feedback })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function multipleChoiceHelper(
  answer,
  reqAnswer,
  feedback,
  userId,
  taskId,
  response,
) {
  if (answer === reqAnswer) {
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      true,
      "Pass",
    )
    return response
      .status(200)
      .json({ correct: true, answer: answer, feedback: "Pass" })
  }
  await dbFunc.insertAnswer(
    userId,
    taskId,
    serializeSubmittedAnswer(answer),
    false,
    feedback,
  )
  return response
    .status(200)
    .json({ correct: false, answer: answer, feedback: feedback })
}

async function naturalDeductionHelper(answer, goal, userId, taskId, response) {
  try {
    const { premises, allowed_rules, prefilled_lines } =
      await dbFunc.getMetadata(taskId)
    console.log(
      "Given premise, allowedRules, prefilled_lines",
      premises,
      allowed_rules,
      prefilled_lines,
      "Given answer and expected GOAL:",
      answer,
      goal,
    )
    const normalizedPremises = premises.map(normalize)
    const allowedRules = new Set(allowed_rules.map(normalize))
    const accepted = evaluator.matchNaturalDeduction(
      answer,
      goal.replace(/\s+/g, ""),
      allowedRules,
      normalizedPremises,
    )
    console.log("Return value of accepted:", accepted)
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      accepted.feedback,
    )
    if (accepted.accepted) {
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: "Pass" })
    }
    return response
      .status(200)
      .json({ correct: false, answer: answer, feedback: accepted.feedback })
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error: "internal server error" })
  }
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
