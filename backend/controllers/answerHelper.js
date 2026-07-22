const dbFunc = require("../database/dbFunc.js")
const evaluator = require("../validation/matchAnswer.js")
const matchTree = require("../validation/matchTree.js")
const validatePropositional = require("../validation/correctness")

const serializeSubmittedAnswer = (answer) => JSON.stringify(answer)

async function wordsToPropositionsHelper(answer, taskId, userId, response) {
  try {
    if (!validatePropositional(answer)) {
      return response.status(422).json({ error: "Syntax error" })
    }
    const accepted = await evaluator.matchPropositions(answer, taskId)
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted,
    )
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function subFormulaHelper(answer, taskId, dbAnswer, userId, response) {
  try {
    const accepted = await evaluator.matchSubFormula(answer, taskId, dbAnswer)
    console.log(accepted)
    const defaultFeedback =
      accepted?.feedback || "served failed to evaluate answer"
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted.accepted,
      defaultFeedback,
    )
    console.log("DB inserted!")
    if (accepted.accepted) {
      console.log("Accepted")
      return response
        .status(200)
        .json({ correct: true, answer: answer, feedback: defaultFeedback })
    }
    console.log("Not accepted")
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
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted,
    )
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    return response.status(500).json({ error: "internal server error" })
  }
}

async function equivalenceRuleHelper(answer, rule, userId, taskId, response) {
  try {
    console.log(answer, "/", rule)
    const accepted = await evaluator.matchEquivalenceAnswer(answer, rule)
    console.log("accepted:", accepted)
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted,
    )
    console.log("Inserted")
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    console.log(error)
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
      accepted,
    )
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    console.log(error)
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
    if (!transformCheck) {
      return response.status(200).json({ correct: false, answer: answer })
    }
    const accepted = evaluator.checkIfCorrectForm(answer.at(-1), form)
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted,
    )
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error: "internal server error" })
  }
}

async function resolutionHelper(answer, reqClauses, userId, taskId, response) {
  try {
    const requiredClauses = reqClauses[0]
    const assumptionCount = reqClauses[1]
    const correctAssumptions = reqClauses[2]
    console.log(reqClauses)
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
    )
    if (accepted.accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    console.log(error)
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
      accepted,
    )
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error: "internal server error" })
  }
}

async function semanticTreeHelper(answer, reqLines, userId, taskId, response) {
  try {
    const question = await dbFunc.getQuestion(taskId)
    console.log("question: ", question[0].question)
    const accepted = await evaluator.checkSemanticTreeTask(
      answer,
      reqLines,
      question[0].question,
    )
    await dbFunc.insertAnswer(
      userId,
      taskId,
      serializeSubmittedAnswer(answer),
      accepted,
    )
    if (accepted) {
      return response.status(200).json({ correct: true, answer: answer })
    }
    return response.status(200).json({ correct: false, answer: answer })
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
}
