const db = require("../database/db")
const matchText = require("./matchTree")
const areLogicallyEquivalent = require("./equivalence")

const normalizeProposition = (proposition) =>
  proposition.replace(/\s+/g, "").toLowerCase()

const matchPropositions = async (userAnswer, taskId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const databaseAnswer = await db.query(q, [taskId])
  const correctAnswerList = databaseAnswer.rows[0].correct_answer.answers
  const normalizedUserAnswer = normalizeProposition(userAnswer)

  return correctAnswerList.some((answer) =>
    areLogicallyEquivalent(
      normalizeProposition(answer),
      normalizedUserAnswer,
    ),
  )
}
const matchSubFormula = async (userObject, answerId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const dbAnswer = await db.query(q, [answerId])
  const correctAnswer = dbAnswer.rows[0].correct_answer
  const accepted = recurseChildren(userObject, correctAnswer)
  if (accepted) {
    return true
  } else {
    return false
  }
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
  console.log("Accepted by matchText?", accepted)
  return accepted
}

module.exports = {
  matchPropositions,
  matchSubFormula,
  matchTruthTable,
  matchEquivalenceAnswer,
}
