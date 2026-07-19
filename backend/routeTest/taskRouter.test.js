const test = require("node:test")
const assert = require("node:assert/strict")
const supertest = require("supertest")
const {
  setupTestDb,
  teardownTestDb,
  clearTestDb,
} = require("./setup")

let app

test.before(async () => {
  ;({ app } = await setupTestDb())
})

test.after(async () => {
  await teardownTestDb()
})

test.afterEach(async () => {
  await clearTestDb()
})

test("GET /api/tasks returns an empty list when no tasks exist", async () => {
  const response = await supertest(app).get("/api/tasks").expect(200)
  assert.deepEqual(response.body, [])
})

test("POST /api/tasks creates a task", async () => {
  const response = await supertest(app)
    .post("/api/tasks")
    .send({
      type: "propositional",
      module_name: "subformula",
      question: "Is p a subformula of p ∧ q?",
      correct_answer: { answer: true },
      metadata: {},
    })
    .expect(201)

  assert.ok(response.body.id)
})
