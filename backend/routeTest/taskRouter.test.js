const { test, describe } = require("node:test")
const assert = require("node:assert/strict")
const supertest = require("supertest")
const { setupTestDb, teardownTestDb, clearTestDb } = require("./setup")
const { MODULENAMES } = require("../constants")
const helperFunc = require("./taskHelperFunc")
let app
let db
test.before(async () => {
  ;({ app, db } = await setupTestDb())
})

test.after(async () => {
  await teardownTestDb()
})

test.afterEach(async () => {
  await clearTestDb()
})
describe("taskRouter", () => {
  describe("GET /api/tasks", () => {
    test("returns an empty list when no tasks exist", async () => {
      const response = await supertest(app).get("/api/tasks").expect(200)
      assert.deepEqual(response.body, [])
    })
    test("returns all tasks", async () => {
      await helperFunc.insertTruthTableTasksDb(db)
      const response = await supertest(app).get("/api/tasks").expect(200)
      assert.strictEqual(response.body.length, 3)
    })
    test("returns tasks from multiple modules", async () => {
      await helperFunc.insertTruthTableTasksDb(db)
      await helperFunc.insertTaskDb(db, {
        type: "propositional",
        module_name: MODULENAMES.SUBFORMULA,
        question: "Is p a subformula of p ∧ q?",
        correct_answer: { answer: true },
        metadata: {},
      })

      const response = await supertest(app).get("/api/tasks").expect(200)
      assert.strictEqual(response.body.length, 4)
    })
    test("returns only accepted rows", async () => {
      await helperFunc.insertTaskDb(db, {
        type: "propositional",
        module_name: MODULENAMES.SUBFORMULA,
        question: "Is p a subformula of p ∧ q?",
        correct_answer: { answer: true },
        metadata: {},
      })
      const response = await supertest(app).get("/api/tasks").expect(200)

      assert.ok(response.body[0].question)
      assert.ok(response.body[0].type)
      assert.ok(response.body[0].metadata)
      assert.strictEqual(
        Object.hasOwn(response.body[0], "correct_answer"),
        false,
      )
    })
  })
  describe("GET /api/tasks/count", () => {
    test("returns the count of all tasks", async () => {
      await helperFunc.insertTruthTableTasksDb(db)
      const response = await supertest(app).get("/api/tasks/count").expect(200)
      assert.strictEqual(response.body[0].module_name, "Truth-Table-Task")
      assert.strictEqual(response.body[0].count, "3")
    })
    test("returns [] when there are no tasks", async () => {
      const response = await supertest(app).get("/api/tasks/count").expect(200)
      assert.deepEqual(response.body, [])
    })
    test("returns correctly with multiple modules", async () => {
      await helperFunc.insertTruthTableTasksDb(db)
      await helperFunc.insertTaskDb(db, {
        type: "test",
        module_name: MODULENAMES.WORDS_TO_PROPOSITIONS,
        question: "question",
        correct_answer: { test: "This should be in json" },
        metadata: { metadata: "also json" },
      })
      const response = await supertest(app).get("/api/tasks/count").expect(200)
      const data = response.body
      assert.strictEqual(data.length, 2)
      assert.strictEqual(data[0].module_name, MODULENAMES.TRUTHTABLE_TASK)
      assert.strictEqual(data[0].count, "3")
      assert.strictEqual(data[1].module_name, MODULENAMES.WORDS_TO_PROPOSITIONS)
      assert.strictEqual(data[1].count, "1")
    })
  })
  describe("GET /api/tasks/:module", () => {
    test("works correctly", async () => {
      await helperFunc.insertTruthTableTasksDb(db)
      const response = await supertest(app)
        .get(`/api/tasks/${MODULENAMES.TRUTHTABLE_TASK}`)
        .expect(200)
      let i = 0
      const data = response.body
      while (i < data.length) {
        assert.ok(data[i].type)
        assert.ok(data[i].question)
        assert.ok(data[i].metadata)
        assert.ok(data[i].id)
        assert.strictEqual(Object.hasOwn(data[i], "correct_answer"), false)
        i++
      }
    })
    test("returns 404 when module_name isn't found in database", async () => {
      const response = await supertest(app)
        .get(`/api/tasks/${MODULENAMES.TRUTHTABLE_TASK}`)
        .expect(404)
      assert.strictEqual(response.status, 404)
    })
  })
})
