const { test, describe } = require("node:test")
const assert = require("node:assert/strict")
const supertest = require("supertest")
const jwt = require("jsonwebtoken")
const { setupTestDb, teardownTestDb, clearTestDb } = require("./setup")
const userHelperFunc = require("./userHelperFunc")

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

describe("userRouter", () => {
  describe("POST /api/users", () => {
    test("creates a user and returns a token", async () => {
      const response = await userHelperFunc.signup(app, "tester", "password")
      assert.strictEqual(response.status, 201)
      assert.ok(response.body.token)
      assert.strictEqual(response.body.user.username, "tester")
      assert.ok(response.body.user.id)

      const decoded = jwt.decode(response.body.token)
      assert.strictEqual(decoded.userId, response.body.user.id)
    })

    test("persists a hashed password, not the plaintext", async () => {
      await userHelperFunc.signup(app, "tester", "password")
      const result = await db.query(
        "SELECT password_hash FROM users WHERE username = $1",
        ["tester"],
      )
      assert.notStrictEqual(result.rows[0].password_hash, "password")
    })

    test("rejects a taken username", async () => {
      await userHelperFunc.insertUserDb(db, "tester", "password")
      const response = await userHelperFunc.signup(app, "tester", "different")
      assert.strictEqual(response.status, 400)
      assert.strictEqual(response.body.error, "Username is taken")

      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        "tester",
      ])
      assert.strictEqual(result.rows.length, 1)
    })

    test("doesn't create a user when password is missing", async (t) => {
      t.mock.method(console, "log", () => {})
      const response = await supertest(app)
        .post("/api/users")
        .send({ username: "tester" })
      assert.strictEqual(response.status, 500)

      const result = await db.query("SELECT * FROM users")
      assert.deepEqual(result.rows, [])
    })
    test("doesn't create a user when username is too short", async (t) => {
      t.mock.method(console, "log", () => {})
      const response = await supertest(app)
        .post("/api/users")
        .send({ username: "test   ", password: "testerPassword" })
      assert.strictEqual(response.status, 401)

      const result = await db.query("SELECT * FROM users")
      assert.deepEqual(result.rows, [])
    })
  })

  describe("POST /api/users/login", () => {
    test("logs in with correct credentials", async () => {
      const user = await userHelperFunc.insertUserDb(db, "tester", "password")
      const response = await userHelperFunc.login(app, "tester", "password")
      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.body.user.id, user.id)
      assert.strictEqual(response.body.user.username, "tester")

      const decoded = jwt.decode(response.body.token)
      assert.strictEqual(decoded.userId, user.id)
    })

    test("returns 404 for an unknown username", async () => {
      const response = await userHelperFunc.login(
        app,
        "NotRegistered",
        "password",
      )
      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.body.error, "Couldn't find the user")
    })

    test("returns 401 for an incorrect password", async () => {
      await userHelperFunc.insertUserDb(db, "tester", "password")
      const response = await userHelperFunc.login(
        app,
        "tester",
        "wrong-password",
      )
      assert.strictEqual(response.status, 401)
      assert.strictEqual(response.body.error, "incorrect password")
    })
  })
})
