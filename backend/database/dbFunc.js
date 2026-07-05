const db = require("./db")

const insertAnswer = async (userId, taskId, answer, correct) => {
  try {
    const qInsertAnswer = `
      INSERT INTO answers (user_id, task_id, submitted_answer, is_correct)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, task_id)
      DO UPDATE SET submitted_answer = EXCLUDED.submitted_answer, is_correct = EXCLUDED.is_correct, completed_at = CURRENT_TIMESTAMP
      RETURNING submitted_answer`
    const returnedAnswer = await db.query(qInsertAnswer, [
      userId,
      taskId,
      answer,
      correct,
    ])
    return returnedAnswer
  } catch (error) {
    console.log("Error when inserting answer", error)
    throw new Error(error)
  }
}

const getAllUserAnswers = async (userId) => {
  const q = `
    SELECT task_id, submitted_answer, is_correct
    FROM answers
    WHERE user_id = $1`
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

  const info = await db.query(q, [task_id])
  const rows = info.rows[0]
  console.log(rows)
  if (rows.module_name === "words-to-propositions") {
    return { answer: rows.correct_answer.answers, moduleName: rows.module_name }
  }
  if (rows.module_name === "subformula") {
    return { answer: rows.correct_answer, moduleName: rows.module_name }
  }
  if (rows.module_name === "Truth-Table-Task") {
    return { answer: rows.correct_answer.answer, moduleName: rows.module_name }
  }
  if (rows.module_name === "Equivalence-Rules-Task") {
    return { answer: rows.correct_answer.remove, moduleName: rows.module_name }
  }
  console.log("Module name isnt in presets:", rows.module_name)
}

module.exports = {
  insertAnswer,
  insertTask,
  insertUser,
  getAllUserAnswers,
  getAnswerAndModule,
}
