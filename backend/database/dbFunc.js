const db = require("./db")
const { MODULENAMES } = require("../constants")
const insertAnswer = async (userId, taskId, answer, correct, feedback) => {
  try {
    const qInsertAnswer = `
      INSERT INTO answers (user_id, task_id, submitted_answer, is_correct, feedback)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, task_id)
      DO UPDATE SET submitted_answer = EXCLUDED.submitted_answer, is_correct = EXCLUDED.is_correct, completed_at = CURRENT_TIMESTAMP, feedback = EXCLUDED.feedback
      RETURNING submitted_answer`
    const returnedAnswer = await db.query(qInsertAnswer, [
      userId,
      taskId,
      answer,
      correct,
      feedback,
    ])
    return returnedAnswer
  } catch (error) {
    console.log("Error when inserting answer", error)
    throw new Error(error)
  }
}

const getAllUserAnswers = async (userId) => {
  const q = `
    SELECT A.task_id, A.submitted_answer, A.is_correct, A.feedback, T.module_name
    FROM answers AS A
    JOIN tasks AS T ON A.task_id = T.id
    WHERE A.user_id = $1
    `
  try {
    const answers = await db.query(q, [userId])
    return answers
  } catch (error) {
    console.log("Error getting user answers:", error)
    throw new Error(error)
  }
}

const insertTask = async (
  type,
  moduleName,
  question,
  correctAnswer,
  metadata,
) => {
  const q = `
  INSERT INTO tasks (type, module_name, question, correct_answer, metadata)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id`
  const values = [type, moduleName, question, correctAnswer, metadata]
  try {
    const id = await db.query(q, values)
    return id
  } catch (error) {
    console.log("error inserting task:", error)
    throw new Error(error)
  }
}

const insertUser = async (username, passwordHash) => {
  const insertQ = `
        INSERT INTO users (username, password_hash) 
        VALUES ($1, $2) 
        RETURNING id, username
        `
  try {
    const newUser = await db.query(insertQ, [username, passwordHash])
    return newUser
  } catch (error) {
    console.log("Error inserting user:", error)
    throw new Error(error)
  }
}

const getAnswerAndModule = async (task_id) => {
  const q = `
  SELECT correct_answer, module_name FROM tasks WHERE id = $1`
  try {
    const info = await db.query(q, [task_id])
    const rows = info.rows[0]
    switch (rows.module_name) {
      case MODULENAMES.WORDS_TO_PROPOSITIONS:
        return {
          answer: rows.correct_answer.answers,
          moduleName: rows.module_name,
        }
      case MODULENAMES.SUBFORMULA:
        return { answer: rows.correct_answer, moduleName: rows.module_name }
      case MODULENAMES.TRUTHTABLE_TASK:
        return {
          answer: rows.correct_answer.answer,
          moduleName: rows.module_name,
        }
      case MODULENAMES.EQUIVALENCE_RULES_TASK:
        return {
          answer: rows.correct_answer.remove,
          moduleName: rows.module_name,
        }
      case MODULENAMES.TT_METHOD_CONVERSION:
        return {
          answer: [rows.correct_answer.groups, rows.correct_answer.form],
          moduleName: rows.module_name,
        }
      case MODULENAMES.EQUIVALENCE_METHOD_TRANSFORM:
        return {
          answer: [rows.correct_answer.remove, rows.correct_answer.form],
          moduleName: rows.module_name,
        }
      case MODULENAMES.RESOLUTION_INTRODUCTION:
        return {
          answer: [
            rows.correct_answer.clauses,
            rows.correct_answer.assumption_count,
            rows.correct_answer.assumptions,
          ],
          moduleName: rows.module_name,
        }
      case MODULENAMES.RESOLUTION_REFUTATION:
        return {
          answer: [
            rows.correct_answer.clauses,
            rows.correct_answer.assumption_count,
            rows.correct_answer.assumptions,
          ],
          moduleName: rows.module_name,
        }
      case MODULENAMES.RECURSIVE_DEFINITION:
        return {
          answer: [rows.correct_answer.final, rows.correct_answer.shorthands],
          moduleName: rows.module_name,
        }
      case MODULENAMES.SEMANTIC_TREE_INTRO:
        return {
          answer: rows.correct_answer.lines,
          moduleName: rows.module_name,
        }
      case MODULENAMES.MULTIPLE_CHOICE_NATURAL_DEDUCTION:
        return {
          answerFeedback: [
            rows.correct_answer.answer,
            rows.correct_answer.feedback,
          ],
          moduleName: rows.module_name,
        }
      case MODULENAMES.ASSUMPTIONS_AND_DISCHARGE_NATURAL_DEDUCTION:
      case MODULENAMES.BASIC_RULES_NATURAL_DEDUCTION:
        return {
          answer: rows.correct_answer.goal,
          moduleName: rows.module_name,
        }
      default:
        console.log("Module name isnt in presets:", rows.module_name)
        throw new Error("Module name isnt in presets:", rows.module_name)
    }
  } catch (error) {
    if (moduleName) {
      console.log("Couldnt receive answer and module from db:", moduleName)
    }
    console.log("Module name was undefined")
  }
}

async function getQuestion(taskId) {
  try {
    const q = "SELECT question FROM tasks WHERE id = $1"
    const response = await db.query(q, [taskId])
    return response.rows
  } catch (error) {
    console.log("Error in getQuestion:", error)
    throw new Error(error)
  }
}

async function getMetadata(taskId) {
  try {
    const q = "SELECT metadata FROM tasks WHERE id = $1"
    const response = await db.query(q, [taskId])
    console.log("AT DBFUNC:", response.rows[0].metadata)
    return response.rows[0].metadata
  } catch (error) {
    console.log("Error in getQuestion:", error)
    throw new Error(error)
  }
}

module.exports = {
  insertAnswer,
  insertTask,
  insertUser,
  getAllUserAnswers,
  getAnswerAndModule,
  getQuestion,
  getMetadata,
}
