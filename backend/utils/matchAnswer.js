const db = require("../database/db")

const matchPropositions = async (userAnswer, taskId) => {
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const databaseAnswer = await db.query(q, [taskId])
  const correctAnswerList = databaseAnswer.rows[0].correct_answer.answers
  const cleanedUserAnswer = userAnswer.replace(/\s+/g, "").toLowerCase()
  let found = false
  correctAnswerList.forEach((ans) => {
    const cleaned = ans.replace(/\s+/g, "").toLowerCase()
    if (cleaned === cleanedUserAnswer) {
      found = true
    }
  })
  return found
}
const matchSubFormula = async (userObject, taskId, correctAnswer) => {
  console.log("Correcasodjas", correctAnswer)
  const q = `SELECT correct_answer FROM tasks WHERE id = $1`
  const databaseAnswer = await db.query(q, [taskId])
  const databaseObject = databaseAnswer.rows[0].correct_answer
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
      if (cNode.text === child.text) {
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

module.exports = { matchPropositions, matchSubFormula }
