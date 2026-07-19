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
})
