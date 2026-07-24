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
