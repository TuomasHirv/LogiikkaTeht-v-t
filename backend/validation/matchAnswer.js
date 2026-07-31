const db = require("../database/db")
const matchText = require("./matchTree")
const areLogicallyEquivalent = require("./equivalence")
const formChecker = require("./textToForm")
const resolutionChecker = require("./ValidateResolution")
const checkShorthand = require("./validateShorthand")
const { validateSemanticTree } = require("./validateSemanticTree")
const { parseAllLines } = require("./parseNaturalDeduction")
const { checkLine, formulasEqual } = require("./validateNaturalDeduction")
const normalizeProposition = (proposition) =>
  proposition.replace(/\s+/g, "").toLowerCase()

const matchPropositions = async (userAnswer, taskId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const databaseAnswer = await db.query(q, [taskId])
  const correctAnswerList = databaseAnswer.rows[0].correct_answer.answers
  const normalizedUserAnswer = normalizeProposition(userAnswer)

  const accepted = correctAnswerList.some((answer) =>
    areLogicallyEquivalent(normalizeProposition(answer), normalizedUserAnswer),
  )
  if (accepted) {
    return { accepted: true, feedback: "Pass" }
  }
  return { accepted: false, feedback: "Fail" }
}
const matchSubFormula = async (userObject, answerId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const dbAnswer = await db.query(q, [answerId])
  const correctAnswer = dbAnswer.rows[0].correct_answer
  const result = recurseChildren(userObject, correctAnswer)
  return { accepted: result.accepted, feedback: result.feedback }
}

function recurseChildren(object, node) {
  if (!object.children) {
    if (!node.children) {
      return { accepted: true, feedback: "Pass" }
    } else if (node.children.length > 0) {
      return { accepted: false, feedback: `This isn't complete ${node.text}` }
    }
    return { accepted: true, feedback: "Pass" }
  }
  if (!node.children) {
    return { accepted: false, feedback: `There should be more branches` }
  }
  if (object.children.length !== node.children.length) {
    return {
      accepted: false,
      feedback: `This should have more branches ${node.text}`,
    }
  }
  if (object.children.length === 0) {
    return { accepted: true, feedback: "Pass" }
  }

  if (node.children && node.children.length > 0) {
    const userChildren = new Set()

    for (const cNode of node.children) {
      let found = false
      for (const child of object.children) {
        const correctText = cNode.text.trim().replace(/\s+/g, "")
        const userText = child.text.trim().replace(/\s+/g, "")
        if (correctText === userText) {
          found = true
          const correct = recurseChildren(child, cNode)
          if (!correct.accepted) {
            return { accepted: false, feedback: correct.feedback }
          }
          break
        }
      }
      if (!found) {
        return {
          accepted: false,
          feedback: `You didnt find the correct branches for ${node.text}`,
        }
      }
    }
  }

  return { accepted: true, feedback: "Pass" }
}
const normalizeRow = (row) => row.map((cell) => cell.trim().replace(/\s+/g, ""))

const matchTruthTable = async (userTable, taskId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const databaseAnswer = await db.query(q, [taskId])
  const correctTable = databaseAnswer.rows[0].correct_answer.answer
  if (correctTable.length !== userTable.length) {
    return { accepted: false, feedback: "Fail" }
  }
  const normCorrect = correctTable.map(normalizeRow)
  const normUser = userTable.map(normalizeRow)
  const value = normCorrect.every((a) =>
    normUser.some(
      (b) => a.length === b.length && a.every((val, i) => val === b[i]),
    ),
  )
  if (value) {
    return { accepted: true, feedback: "Pass" }
  }
  return { accepted: false, feedback: "Fail" }
}

const matchEquivalenceAnswer = (answerList, excluded) => {
  const lastAnswer = answerList[answerList.length - 1]
  for (i = 0; i < excluded.length; i++) {
    if (lastAnswer.includes(excluded[i])) {
      return {
        accepted: false,
        feedback: `Last line: ${lastAnswer} includes ${excluded[i]}`,
      }
    }
  }

  let accepted = false
  for (i = 1; i < answerList.length; i++) {
    accepted = matchText(answerList[i - 1], answerList[i])
    if (!accepted) {
      return {
        accepted: false,
        feedback: `This change is incorrect: ${answerList[i - 1]} → ${answerList[i]}`,
      }
    }
  }
  return { accepted: accepted, feedback: "Pass" }
}

const matchTTFormAnswer = (text, form, correctAnswer) => {
  try {
    if (form === "CNF") {
      const tokens = formChecker.toTokens(text)
      const result = formChecker.parseCNF(tokens, 0)
      const userClauses = result.clauses
      const accepted = matchArrays(userClauses, correctAnswer)
      if (accepted.accepted) {
        return {
          accepted: true,
          feedback: "Pass",
        }
      }
      return {
        accepted: false,
        feedback: accepted.feedback,
      }
    } else if (form === "DNF") {
      const tokens = formChecker.toTokens(text)
      const result = formChecker.parseDNF(tokens, 0)
      const userClauses = result.clauses
      const accepted = matchArrays(userClauses, correctAnswer)
      if (accepted.accepted) {
        return {
          accepted: true,
          feedback: "Pass",
        }
      }
      return {
        accepted: false,
        feedback: accepted.feedback,
      }
    }
    return {
      accepted: false,
      feedback: "Server failed to parse the expected form",
    }
  } catch (error) {
    return { accepted: false, feedback: error.message }
  }
}

function matchArrays(userClauses, correctAnswer) {
  if (userClauses.length !== correctAnswer.length) {
    return {
      accepted: false,
      feedback: "Amount of clauses differs from the expected answer",
    }
  }
  for (let i = 0; i < correctAnswer.length; i++) {
    let found = false
    const curr = [...correctAnswer[i]].sort()
    for (let j = 0; j < userClauses.length; j++) {
      const compared = [...userClauses[j]].sort()
      if (JSON.stringify(compared) === JSON.stringify(curr)) {
        found = true
        break
      }
    }
    if (!found) {
      return {
        accepted: false,
        feedback: "Some clause was incorrect",
      }
    }
  }
  return { accepted: true, feedback: "Pass" }
}

function checkIfCorrectForm(text, form) {
  try {
    if (form === "CNF") {
      const tokens = formChecker.toTokens(text)
      const result = formChecker.parseCNF(tokens, 0)
      if (result) {
        return { accepted: true, feedback: "Pass" }
      }
      return { accepted: false, feedback: "Couldn't create clauses from input" }
    } else if (form === "DNF") {
      const tokens = formChecker.toTokens(text)
      const result = formChecker.parseDNF(tokens, 0)
      if (result) {
        return { accepted: true, feedback: "Pass" }
      }
      return { accepted: false, feedback: "Couldn't create clauses from input" }
    }
    return {
      accepted: false,
      feedback: `Form doesnt conform to expectations: ${form}}`,
    }
  } catch (error) {
    if (!error.message) {
      return { accepted: false, feedback: "Unaccounted error or mistake" }
    }
    return { accepted: false, feedback: error.message }
  }
}

function matchResolutionTask(
  userList,
  assumptionCount,
  requiredClauses,
  correctAssumptions,
) {
  try {
    const clauseList = resolutionChecker.parseClauseList(
      userList,
      correctAssumptions,
    )
    const foundEmptyClause = resolutionChecker.validateResolutionSteps(
      clauseList,
      assumptionCount,
    )

    const hasAllRequired = containsAllRequiredClauses(
      clauseList,
      requiredClauses,
    )

    const requiresEmpty =
      requiredClauses.length === 1 && requiredClauses[0][0] === "∅"

    if (requiresEmpty) {
      if (foundEmptyClause && hasAllRequired) {
        return {
          accepted: true,
          feedback: "Pass",
        }
      }
      return {
        accepted: false,
        feedback: "Necessary clause not found",
      }
    }

    return { accepted: hasAllRequired, feedback: "Pass" }
  } catch (error) {
    return { accepted: false, feedback: error.message }
  }
}
function sameClause(setClause, arrClause) {
  if (setClause.size !== arrClause.length) return false

  for (const lit of arrClause) {
    if (!setClause.has(lit)) return false
  }

  return true
}

function containsAllRequiredClauses(clauseList, requiredClauses) {
  return requiredClauses.every((required) =>
    clauseList.some((c) => sameClause(c.clause, required)),
  )
}

async function validateShorthandtask(userList, finalAllowed, reqStart) {
  try {
    if (userList[0] !== reqStart) {
      return { accepted: false, feedback: "First line doesn't match question" }
    }
    const userLast = userList[userList.length - 1].replace(/\s/g, "")
    const expectedLast = finalAllowed[0].replace(/\s/g, "")
    if (userLast !== expectedLast) {
      return { accepted: false, feedback: "Last line doesn't match expected" }
    }
    return checkShorthand.validatePropositionList(userList, finalAllowed[1])
  } catch (error) {
    if (!error.message) {
      return { accepted: false, feedback: "Unaccounted for error or mistake" }
    }
    return { accepted: false, feedback: error.message }
  }
}

function isContradictorySet(literals) {
  for (const lit of literals) {
    const complement = lit.startsWith("¬") ? lit.slice(1) : "¬" + lit
    if (literals.includes(complement)) {
      return true
    }
  }
  return false
}

function checkSemanticTreeTask(userTree, reqLines, question) {
  let userBranches

  try {
    userBranches = validateSemanticTree(userTree, question)
  } catch (error) {
    if (!error.message) {
      return { accepted: false, feedback: "Unaccounted for error or mistake" }
    }
    return { accepted: false, feedback: error.message }
  }

  for (const requiredLine of reqLines) {
    const requiredClosed = isContradictorySet(requiredLine)
    const requiredLiterals = new Set(requiredLine)

    const found = userBranches.some((branch) => {
      if (branch.closed !== requiredClosed) {
        return false
      }
      if (requiredClosed) {
        return [...requiredLiterals].every((lit) => branch.literals.has(lit))
      }
      return (
        branch.literals.size === requiredLiterals.size &&
        [...branch.literals].every((lit) => requiredLiterals.has(lit))
      )
    })

    if (!found) {
      return { accepted: false, feedback: "Some branch was incorrect" }
    }
  }

  return { accepted: true, feedback: "Pass" }
}

function matchNaturalDeduction(userList, goal, allowedRules, allowedPremises) {
  try {
    const parsedLines = parseAllLines(userList, allowedRules)
    if (!formulasEqual(parsedLines.at(-1).formula, goal)) {
      return { accepted: false, feedback: "Last line doesn't match goal" }
    }
    let i = 0
    while (i < parsedLines.length) {
      checkLine(parsedLines, i, allowedPremises)
      i++
    }
    return { accepted: true, feedback: "Pass" }
  } catch (error) {
    if (error.message) {
      return { accepted: false, feedback: error.message }
    }
    return { accepted: false, feedback: "Unaccounted error or mistake" }
  }
}

module.exports = {
  matchPropositions,
  matchSubFormula,
  matchTruthTable,
  matchEquivalenceAnswer,
  matchTTFormAnswer,
  checkIfCorrectForm,
  matchResolutionTask,
  validateShorthandtask,
  checkSemanticTreeTask,
  matchNaturalDeduction,
}
