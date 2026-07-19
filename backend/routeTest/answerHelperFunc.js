const supertest = require("supertest")
const bcrypt = require("bcrypt")
const { MODULENAMES } = require("../constants")
const tasks = {
  [MODULENAMES.WORDS_TO_PROPOSITIONS]: {
    type: "forming-propositions",
    module_name: "words-to-propositions",
    question: "Kuu on juustoa ja Aurinko palaa.",
    correct_answer: { answers: ["K ∧ A", "A ∧ K"] },
    metadata: {
      definitions: ["K = Kuu on juustoa", "A = Aurinko palaa"],
    },
  },
  [MODULENAMES.SUBFORMULA]: {
    type: "destructure",
    module_name: "subformula",
    question: "P ∨ ¬Q",
    correct_answer: {
      text: "P ∨ ¬Q",
      children: [
        { text: "P", children: null },
        { text: "¬Q", children: [{ text: "Q", children: {} }] },
      ],
    },
    metadata: {},
  },
  [MODULENAMES.TRUTHTABLE_TASK]: {
    type: "create-truth-table",
    module_name: "Truth-Table-Task",
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
  [MODULENAMES.EQUIVALENCE_RULES_TASK]: {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "¬¬P ∨ ¬¬Q",
    correct_answer: { remove: ["¬"] },
    metadata: { end_goal: "Remove all ¬ (negations)" },
  },
  [MODULENAMES.TT_METHOD_CONVERSION]: {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "(P ∨ Q) ∧ R",
    correct_answer: {
      groups: [
        ["P", "Q", "R"],
        ["P", "¬Q", "R"],
        ["¬P", "Q", "R"],
      ],
      form: "DNF",
    },
    metadata: {
      start: ["P", "Q", "R"],
      end_goal: "Write the final answer in DNF.",
    },
  },
  [MODULENAMES.EQUIVALENCE_METHOD_TRANSFORM]: {
    type: "Transform-To-Normal-Form",
    module_name: "Equivalence-method-Transform",
    question: "(P → Q) ∧ R",
    correct_answer: { remove: ["→", "↔"], form: "DNF" },
    metadata: { end_goal: "Create DNF from this" },
  },
  [MODULENAMES.RESOLUTION_INTRODUCTION]: {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(P) ∧ (¬P)",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 2,
      assumptions: [["P"], ["¬P"]],
    },
  },
  [MODULENAMES.RESOLUTION_REFUTATION]: {
    type: "Resolution-task",
    module_name: "Resolution-Refutation",
    question: "Premises: (P) ∧ (¬P ∨ Q)\nProve: Q",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 3,
      assumptions: [["P"], ["¬P", "Q"], ["¬Q"]],
    },
  },
  [MODULENAMES.RECURSIVE_DEFINITION]: {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(A → B)",
    correct_answer: {
      final: "(p0 → p1)",
      shorthands: {
        A: ["p0"],
        B: ["p1"],
      },
    },
    metadata: {
      shorthands: { A: "p0", B: "p1" },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
}
const createTasksForTest = async (db, taskModule) => {
  let allIds = []
  if (taskModule === "all") {
    for (const [moduleName, taskData] of Object.entries(tasks)) {
      const id = await insertTaskDb(db, taskData)
      allIds.push(id)
    }
    return allIds
  }
  const insertableTask = tasks[taskModule]
  const id = await insertTaskDb(db, insertableTask)
  return [id]
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

const insertAnswerDb = async (db, answer, userId, taskId) => {
  const q = `
  INSERT INTO answers (user_id, task_id, submitted_answer, is_correct)
  VALUES ($1, $2, $3, $4)
  RETURNING id`
  const result = await db.query(q, [
    userId,
    taskId,
    answer.submittedAnswer,
    answer.isCorrect,
  ])
  return result.rows[0].id
}

const signup = async (testApp, username, password) => {
  return supertest(testApp).post("/api/users").send({ username, password })
}

module.exports = {
  createTasksForTest,
  insertTaskDb,
  insertAnswerDb,
  signup,
}
