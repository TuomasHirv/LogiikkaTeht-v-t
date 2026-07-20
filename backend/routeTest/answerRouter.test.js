const { test, describe, mock } = require("node:test")
const assert = require("node:assert/strict")
const supertest = require("supertest")
const {
  setupTestDb,
  teardownTestDb,
  clearTestDb,
  generateTestToken,
} = require("./setup")
const { MODULENAMES } = require("../constants")
const helperFunc = require("./answerHelperFunc")
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

describe("answerRouter", async () => {
  describe("GET /api/answers", async () => {
    test("no answers results in 404 status", async () => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const response = await supertest(app)
        .get("/api/answers")
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
      assert.strictEqual(response.status, 404)
    })
    test("works with one answer in database", async () => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const userId = signupResponse.body.user.id
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.WORDS_TO_PROPOSITIONS,
      )
      const taskId = taskIdList[0]
      const answer = {
        submittedAnswer: { text: "A and B" },
        isCorrect: false,
      }
      await helperFunc.insertAnswerDb(db, answer, userId, taskId)

      const response = await supertest(app)
        .get("/api/answers")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
      assert.strictEqual(response.body.answerList[0].task_id, taskId)
      assert.strictEqual(
        response.body.answerList[0].module_name,
        MODULENAMES.WORDS_TO_PROPOSITIONS,
      )
    })
    test("works with for all current tasks", async () => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const userId = signupResponse.body.user.id
      const taskIdList = await helperFunc.createTasksForTest(db, "all")
      const answer = {
        submittedAnswer: { text: "A and B" },
        isCorrect: false,
      }
      for (const taskId of taskIdList) {
        await helperFunc.insertAnswerDb(db, answer, userId, taskId)
      }
      const response = await supertest(app)
        .get("/api/answers")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
      assert.strictEqual(response.body.answerList.length, taskIdList.length)

      const moduleNames = response.body.answerList.map((a) => a.module_name)
      assert.strictEqual(new Set(moduleNames).size, taskIdList.length)
    })
  })
  // I decided to not test everything from answer router with supertest since it is a very long route.
  // Unit tests are better for it since it is very logic heavy
  describe("POST /api/answers", async () => {
    test("words-to-propositions task works with correct answer", async () => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const userId = signupResponse.body.user.id
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.WORDS_TO_PROPOSITIONS,
      )
      const taskId = taskIdList[0]
      const correctAnswer = "K ∧ A"

      const response = await supertest(app)
        .post(`/api/answers/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ answer: correctAnswer })
        .expect(200)

      assert.strictEqual(response.body.correct, true)
      assert.strictEqual(response.body.answer, correctAnswer)

      const result = await db.query(
        "SELECT is_correct FROM answers WHERE user_id = $1 AND task_id = $2",
        [userId, taskId],
      )
      assert.strictEqual(result.rows[0].is_correct, true)
    })
    test("words-to-propositions task works with a wrong answer", async () => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const userId = signupResponse.body.user.id
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.WORDS_TO_PROPOSITIONS,
      )
      const taskId = taskIdList[0]
      const wrongAnswer = "B ∧ C"

      const response = await supertest(app)
        .post(`/api/answers/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ answer: wrongAnswer })
        .expect(200)

      assert.strictEqual(response.body.correct, false)
      assert.strictEqual(response.body.answer, wrongAnswer)

      const result = await db.query(
        "SELECT is_correct FROM answers WHERE user_id = $1 AND task_id = $2",
        [userId, taskId],
      )
      assert.strictEqual(result.rows[0].is_correct, false)
    })
    test("returns 400 with a not supported modulename", async () => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const userId = signupResponse.body.user.id
      const taskId = "89202dd7-7fbb-4912-ae18-0d5d05f69cd2"
      const wrongAnswer = "B ∧ C"

      const response = await supertest(app)
        .post(`/api/answers/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ answer: wrongAnswer })
        .expect(404)

      assert.ok(response.body.error)
    })
  })
})
