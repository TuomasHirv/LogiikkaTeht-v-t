const supertest = require("supertest")
const bcrypt = require("bcrypt")

const signup = async (testApp, username, password) => {
  return supertest(testApp).post("/api/users").send({ username, password })
}

const login = async (testApp, username, password) => {
  return supertest(testApp)
    .post("/api/users/login")
    .send({ username, password })
}

const insertUserDb = async (db, username, password) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const result = await db.query(
    `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username`,
    [username, passwordHash],
  )
  return result.rows[0]
}

module.exports = { signup, login, insertUserDb }
