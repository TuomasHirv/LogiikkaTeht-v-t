const test = require("node:test")
const assert = require("node:assert/strict")
const { PostgreSqlContainer } = require("@testcontainers/postgresql")

let container
let db
let dbFunc

const fakeTasks = [
  {
    type: "create-truth-table-difficult",
    module_name: "Truth-Table-Task",
    question: "(P ∧ Q) ∨ (P ∧ R)",
    correct_answer: {
      answer: [
        ["P", "1", "1", "1", "1", "0", "0", "0", "0"],
        ["Q", "1", "1", "0", "0", "1", "1", "0", "0"],
        ["R", "1", "0", "1", "0", "1", "0", "1", "0"],
        ["P ∧ Q", "1", "1", "0", "0", "0", "0", "0", "0"],
        ["P ∧ R", "1", "0", "1", "0", "0", "0", "0", "0"],
        ["(P ∧ Q) ∨ (P ∧ R)", "1", "1", "1", "0", "0", "0", "0", "0"],
      ],
    },
    metadata: { start: ["P", "Q", "R"] },
  },
  {
    type: "forming-propositions",
    module_name: "words-to-propositions",
    question: "Kuu on juustoa ja Aurinko palaa.",
    correct_answer: { answers: ["K ∧ A", "A ∧ K"] },
    metadata: {
      definitions: ["K = Kuu on juustoa", "A = Aurinko palaa"],
    },
  },
  {
    type: "destructure",
    module_name: "subformula",
    question: "P ∧ Q",
    correct_answer: {
      text: "P ∧ Q",
      children: [
        { text: "P", children: null },
        { text: "Q", children: null },
      ],
    },
    metadata: {},
  },
  {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "¬(P → Q)",
    correct_answer: { remove: ["→", "∨"] },
    metadata: { end_goal: "Remove all → (implications) and ∨ (conjunctions)" },
  },
]

test.before(async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine")
    .withDatabase("logic_tasks_test")
    .withUsername("tester")
    .withPassword("TESTING")
    .start()

  process.env.PGHOST = container.getHost()
  process.env.PGPORT = String(container.getPort())
  process.env.PGUSER = container.getUsername()
  process.env.PGPASSWORD = container.getPassword()
  process.env.PGDATABASE = container.getDatabase()

  db = require("../db")
  dbFunc = require("../dbFunc")

  await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type VARCHAR(50) NOT NULL,
      module_name TEXT NOT NULL,
      question TEXT NOT NULL,
      correct_answer JSONB DEFAULT '{}'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS answers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      submitted_answer JSONB NOT NULL,
      feedback VARCHAR(50),
      is_correct BOOLEAN NOT NULL,
      completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT unique_user_task UNIQUE (user_id, task_id)
    );
  `)
})

test.after(async () => {
  await db.end()
  await container.stop()
})

test.afterEach(async () => {
  await db.query(`
    TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    TRUNCATE TABLE answers RESTART IDENTITY CASCADE;
  `)
})

test("Inserts a task succesfully", async () => {
  for (let i = 0; i < fakeTasks.length; i++) {
    const curr = fakeTasks[i]

    const type = curr.type
    const moduleName = curr.module_name
    const question = curr.question
    const correctAnswer = curr.correct_answer
    const metadata = curr.metadata
    const id = await dbFunc.insertTask(
      type,
      moduleName,
      question,
      correctAnswer,
      metadata,
    )
    assert.equal(id.rowCount, 1)
    assert.ok(id.rows[0].id != null)
  }

  const insertedTasks = await db.query(
    `SELECT COUNT(*)::int AS count FROM tasks`,
  )
  assert.equal(insertedTasks.rows[0].count, fakeTasks.length)
})

test("Inserts a user succesfully", async () => {
  const username = "test_user"
  const passwordHash = "test_hash"

  const user = await dbFunc.insertUser(username, passwordHash)
  assert.equal(user.rowCount, 1)
  assert.ok(user.rows[0].id != null)
  assert.equal(user.rows[0].username, username)

  const insertedUser = await db.query(
    `SELECT username, password_hash FROM users WHERE id = $1`,
    [user.rows[0].id],
  )

  assert.equal(insertedUser.rowCount, 1)
  assert.equal(insertedUser.rows[0].username, username)
  assert.equal(insertedUser.rows[0].password_hash, passwordHash)
})

test("Inserts and updates an answer succesfully", async () => {
  const user = await dbFunc.insertUser("answer_user", "hash")
  const task = await dbFunc.insertTask(
    fakeTasks[0].type,
    fakeTasks[0].module_name,
    fakeTasks[0].question,
    fakeTasks[0].correct_answer,
    fakeTasks[0].metadata,
  )

  const userId = user.rows[0].id
  const taskId = task.rows[0].id

  const firstAnswer = { attempt: "first" }
  const firstInsert = await dbFunc.insertAnswer(
    userId,
    taskId,
    firstAnswer,
    true,
  )
  assert.equal(firstInsert.rowCount, 1)
  assert.deepEqual(firstInsert.rows[0].submitted_answer, firstAnswer)

  const updatedAnswer = { attempt: "updated" }
  const secondInsert = await dbFunc.insertAnswer(
    userId,
    taskId,
    updatedAnswer,
    false,
  )

  assert.equal(secondInsert.rowCount, 1)
  assert.deepEqual(secondInsert.rows[0].submitted_answer, updatedAnswer)

  const storedAnswer = await db.query(
    `
      SELECT submitted_answer, is_correct
      FROM answers
      WHERE user_id = $1 AND task_id = $2
    `,
    [userId, taskId],
  )

  assert.equal(storedAnswer.rowCount, 1)
  assert.deepEqual(storedAnswer.rows[0].submitted_answer, updatedAnswer)
  assert.equal(storedAnswer.rows[0].is_correct, false)
})

test("Gets all answers for a user succesfully", async () => {
  const user = await dbFunc.insertUser("all_answers_user", "hash")
  const userId = user.rows[0].id

  const taskA = await dbFunc.insertTask(
    fakeTasks[0].type,
    fakeTasks[0].module_name,
    fakeTasks[0].question,
    fakeTasks[0].correct_answer,
    fakeTasks[0].metadata,
  )

  const taskB = await dbFunc.insertTask(
    fakeTasks[1].type,
    fakeTasks[1].module_name,
    fakeTasks[1].question,
    fakeTasks[1].correct_answer,
    fakeTasks[1].metadata,
  )

  const taskAId = taskA.rows[0].id
  const taskBId = taskB.rows[0].id

  await dbFunc.insertAnswer(userId, taskAId, { value: "A" }, true)
  await dbFunc.insertAnswer(userId, taskBId, { value: "B" }, false)

  const allAnswers = await dbFunc.getAllUserAnswers(userId)
  assert.equal(allAnswers.rowCount, 2)

  const answersByTask = Object.fromEntries(
    allAnswers.rows.map((row) => [row.task_id, row]),
  )

  assert.deepEqual(answersByTask[taskAId].submitted_answer, { value: "A" })
  assert.equal(answersByTask[taskAId].is_correct, true)
  assert.deepEqual(answersByTask[taskBId].submitted_answer, { value: "B" })
  assert.equal(answersByTask[taskBId].is_correct, false)
})

test("Gets answer and module for supported modules", async () => {
  const taskIds = []

  for (let i = 0; i < fakeTasks.length; i++) {
    const curr = fakeTasks[i]
    const insertedTask = await dbFunc.insertTask(
      curr.type,
      curr.module_name,
      curr.question,
      curr.correct_answer,
      curr.metadata,
    )

    taskIds.push(insertedTask.rows[0].id)
  }

  for (let i = 0; i < fakeTasks.length; i++) {
    const curr = fakeTasks[i]
    const answerAndModule = await dbFunc.getAnswerAndModule(taskIds[i])

    assert.equal(answerAndModule.moduleName, curr.module_name)

    if (curr.module_name === "words-to-propositions") {
      assert.deepEqual(answerAndModule.answer, curr.correct_answer.answers)
    }
    if (curr.module_name === "subformula") {
      assert.deepEqual(answerAndModule.answer, curr.correct_answer)
    }
    if (curr.module_name === "Truth-Table-Task") {
      assert.deepEqual(answerAndModule.answer, curr.correct_answer.answer)
    }
    if (curr.module_name === "Equivalence-Rules-Task") {
      assert.deepEqual(answerAndModule.answer, curr.correct_answer.remove)
    }
  }
})
