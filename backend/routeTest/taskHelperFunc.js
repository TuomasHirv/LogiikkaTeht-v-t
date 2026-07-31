const supertest = require("supertest")
const { MODULENAMES } = require("../constants")

const preSetTasks = [
  {
    type: "create-truth-table",
    module_name: MODULENAMES.TRUTHTABLE_TASK,
    question: "¬P ∨ Q",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
        ["¬P", "0", "0", "1", "1"],
        ["¬P ∨ Q", "1", "0", "1", "1"],
      ],
    },
    metadata: { start: ["P", "Q"] },
  },
  {
    type: "create-truth-table",
    module_name: MODULENAMES.TRUTHTABLE_TASK,
    question: "P → Q",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
        ["P → Q", "1", "0", "1", "1"],
      ],
    },
    metadata: { start: ["P", "Q"] },
  },
  {
    type: "create-truth-table",
    module_name: MODULENAMES.TRUTHTABLE_TASK,
    question: "P ∧ ¬P",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["¬P", "0", "0", "1", "1"],
        ["P ∧ ¬P", "0", "0", "0", "0"],
      ],
    },
    metadata: { start: ["P"] },
  },
]

const postToTasks = async (
  testApp,
  type,
  moduleName,
  question,
  correctAnswer,
  metadata,
) => {
  const response = await supertest(testApp)
    .post("/api/tasks")
    .send({
      type: type,
      module_name: moduleName,
      question: question,
      correct_answer: correctAnswer,
      metadata: metadata,
    })
    .expect(201)
  return response
}

const insertTruthTableTasks = async (testApp) => {
  try {
    let i = 0
    while (i < preSetTasks.length) {
      const response = await postToTasks(
        testApp,
        preSetTasks[i].type,
        preSetTasks[i].module_name,
        preSetTasks[i].question,
        preSetTasks[i].correct_answer,
        preSetTasks[i].metadata,
      )
      i++
    }
    return true
  } catch (error) {
    return false
  }
}

const insertTaskDb = async (db, task) => {
  const q = `
    INSERT INTO tasks (type, module_name, question, correct_answer, metadata)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`
  const result = await db.query(q, [
    task.type,
    task.module_name,
    task.question,
    task.correct_answer,
    task.metadata,
  ])
  return result.rows[0].id
}

const insertTruthTableTasksDb = async (db) => {
  for (const task of preSetTasks) {
    await insertTaskDb(db, task)
  }
}

module.exports = {
  postToTasks,
  insertTruthTableTasks,
  insertTaskDb,
  insertTruthTableTasksDb,
}
