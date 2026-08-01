const userRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const db = require("../database/db")
const logger = require("../config/logger")
const { normalize } = require("../utils/normalize.js")
const JWT_secret = process.env.JWT_SECRET
const dbFunc = require("../database/dbFunc.js")

userRouter.post("/", async (request, response) => {
  const { username, password } = request.body
  const normUsername = normalize(username)
  const normPassword = normalize(password)
  if (normUsername.length < 6) {
    return response.status(401).json({ error: "Username is too short" })
  }
  if (normPassword.length < 6) {
    return response.status(401).json({ error: "password is too short" })
  }

  const saltRounds = 10

  try {
    const checkUsername = `
    SELECT * FROM users WHERE username = $1
    `
    const result = await db.query(checkUsername, [username])
    if (result.rows.length > 0) {
      return response.status(400).json({ error: "Username is taken" })
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const res = await dbFunc.insertUser(username, hashedPassword)
    const newUser = res.rows[0]
    const token = jwt.sign({ userId: newUser.id }, JWT_secret, {
      expiresIn: "7d",
    })

    return response.status(201).json({ user: newUser, token: token })
  } catch (error) {
    logger.error(error)
    return response.status(500).json({ error: "Internal server error" })
  }
})

userRouter.post("/login", async (request, response) => {
  const { username, password } = request.body
  if (username < 6) {
    return response.status(401).json({ error: "Username is too short" })
  }
  if (password < 6) {
    return response.status(401).json({ error: "password is too short" })
  }
  try {
    const checkUsername = `
    SELECT * FROM users WHERE username = $1
    `
    const result = await db.query(checkUsername, [username])
    if (result.rows.length !== 1) {
      return response.status(404).json({ error: "Couldn't find the user" })
    }
    const databaseUser = result.rows[0]
    const match = await bcrypt.compare(password, databaseUser.password_hash)
    if (!match) {
      return response.status(401).json({ error: "incorrect password" })
    }
    const token = jwt.sign({ userId: databaseUser.id }, JWT_secret, {
      expiresIn: "7d",
    })
    return response.status(200).json({
      user: { id: databaseUser.id, username: databaseUser.username },
      token: token,
    })
  } catch (error) {
    logger.error(error)
    return response.status(500).json({ error: "Server error in login" })
  }
})

module.exports = userRouter
