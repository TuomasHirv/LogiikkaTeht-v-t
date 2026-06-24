const userRouter = require("express").Router()
const bcrypt = require("bcrypt")
const db = require("../database/db")

userRouter.post("/", async (request, response) => {
  const { username, password } = request.body
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

    const insertQ = `
    INSERT INTO users (username, password_hash) 
    VALUES ($1, $2) 
    RETURNING id, username
    `
    const newUser = await db.query(insertQ, [username, hashedPassword])
    return response.status(201).json({ user: newUser.rows[0] })
  } catch (error) {
    console.log(error.message)
    return response.status(500).json({ error: "Internal server error" })
  }
})

userRouter.post("/login", async (request, response) => {
  const { username, password } = request.body
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
    return response
      .status(200)
      .json({ user: { id: databaseUser.id, username: databaseUser.username } })
  } catch (error) {
    console.log(error.message)
    return response.status(500).json({ error: "Server error in login" })
  }
})

module.exports = userRouter
