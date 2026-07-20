const db = require("../database/db")
const matchText = require("./matchTree")
const areLogicallyEquivalent = require("./equivalence")
const formChecker = require("./textToForm")
const resolutionChecker = require("./ValidateResolution")
const checkShorthand = require("./validateShorthand")
const { validateSemanticTree } = require("./validateSemanticTree")
const normalizeProposition = (proposition) =>
  proposition.replace(/\s+/g, "").toLowerCase()

const matchPropositions = async (userAnswer, taskId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const databaseAnswer = await db.query(q, [taskId])
  const correctAnswerList = databaseAnswer.rows[0].correct_answer.answers
  const normalizedUserAnswer = normalizeProposition(userAnswer)

  return correctAnswerList.some((answer) =>
    areLogicallyEquivalent(normalizeProposition(answer), normalizedUserAnswer),
  )
}
const matchSubFormula = async (userObject, answerId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const dbAnswer = await db.query(q, [answerId])
  const correctAnswer = dbAnswer.rows[0].correct_answer
  return recurseChildren(userObject, correctAnswer)
}

function recurseChildren(object, node) {
  if (!object.children) {
    if (!node.children) {
      return true
    } else if (node.children.length > 0) {
      return false
    }
    return true
  }
  if (!node.children) {
    return false
  }

  if (object.children.length !== node.children.length) {
    return false
  }
  if (object.children.length === 0) {
    return true
  }

  for (const cNode of node.children) {
    let found = false
    for (const child of object.children) {
      const correctText = cNode.text.trim().replace(/\s+/g, "")
      const userText = child.text.trim().replace(/\s+/g, "")
      if (correctText === userText) {
        found = true
        const correct = recurseChildren(child, cNode)
        if (!correct) {
          return false
        }
        break
      }
    }
    if (!found) {
      return false
    }
  }

  return true
}
const normalizeRow = (row) => row.map((cell) => cell.trim().replace(/\s+/g, ""))

const matchTruthTable = async (userTable, taskId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const databaseAnswer = await db.query(q, [taskId])
  const correctTable = databaseAnswer.rows[0].correct_answer.answer
  if (correctTable.length !== userTable.length) {
    return false
  }
  const normCorrect = correctTable.map(normalizeRow)
  const normUser = userTable.map(normalizeRow)
  const value = normCorrect.every((a) =>
    normUser.some(
      (b) => a.length === b.length && a.every((val, i) => val === b[i]),
    ),
  )
  return value
}

const matchEquivalenceAnswer = (answerList, excluded) => {
  const lastAnswer = answerList[answerList.length - 1]
  for (i = 0; i < excluded.length; i++) {
    if (lastAnswer.includes(excluded[i])) {
      console.log("DOESNT FIT THE RULE")
      return false
    }
  }

  let accepted = false
  for (i = 1; i < answerList.length; i++) {
    accepted = matchText(answerList[i - 1], answerList[i])
    console.log(
      "First text:",
      answerList[i - 1],
      "Second text:",
      answerList[i],
      "Result:",
      accepted,
    )
  }
  return accepted
}

const matchTTFormAnswer = (text, form, correctAnswer) => {
  try {
    if (form === "CNF") {
      const tokens = formChecker.toTokens(text)
      const result = formChecker.parseCNF(tokens, 0)
      const userClauses = result.clauses
      return matchArrays(userClauses, correctAnswer)
    } else if (form === "DNF") {
      const tokens = formChecker.toTokens(text)
      const result = formChecker.parseDNF(tokens, 0)
      const userClauses = result.clauses
      return matchArrays(userClauses, correctAnswer)
    }
    console.log("Form doesnt conform to expectations:", form)
    return false
  } catch (error) {
    console.log("Something is wrong with the text")
    console.log(error)
    return false
  }
}

function matchArrays(userClauses, correctAnswer) {
  if (userClauses.length !== correctAnswer.length) {
    return false
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
      return false
    }
  }
  return true
}

function checkIfCorrectForm(text, form) {
  try {
    if (form === "CNF") {
      const tokens = formChecker.toTokens(text)
      const result = formChecker.parseCNF(tokens, 0)
      if (result) {
        return true
      }
      return false
    } else if (form === "DNF") {
      const tokens = formChecker.toTokens(text)
      const result = formChecker.parseDNF(tokens, 0)
      if (result) {
        return true
      }
      return false
    }
    console.log("Form doesnt conform to expectations:", form)
    return false
  } catch (error) {
    console.log("Something is wrong with the text")
    console.log(error)
    return false
  }
}

function matchResolutionTask(
  userList,
  assumptionCount,
  requiredClauses,
  correctAssumptions,
) {
  try {
    console.log(
      "Users input:",
      userList,
      "Amount of assumptions allowed:",
      assumptionCount,
      "Clauses required:",
      requiredClauses,
      "Correct assumptions:",
      correctAssumptions,
    )
    const clauseList = resolutionChecker.parseClauseList(
      userList,
      correctAssumptions,
    )
    console.log("CREATED LIST OF CLAUSES:", clauseList)
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
      return { accepted: foundEmptyClause && hasAllRequired, text: "" }
    }

    return { accepted: hasAllRequired, text: "" }
  } catch (error) {
    console.log(error)
    return { accepted: false, text: error.text }
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
      return false
    }
    const userLast = userList[userList.length - 1].replace(/\s/g, "")
    const expectedLast = finalAllowed[0].replace(/\s/g, "")
    if (userLast !== expectedLast) {
      return false
    }
    return checkShorthand.validatePropositionList(userList, finalAllowed[1])
  } catch (error) {
    console.log(error)
    return false
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
    console.log(error)
    return false
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
      return false
    }
  }

  return true
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
}
