const express = require("express")
const cors = require("cors")
const app = express()
const initDB = require("./database/initDb")
const taskRouter = require("./controllers/taskRouter")
const answerRouter = require("./controllers/answerRouter")
const userRouter = require("./controllers/userRouter")
require("dotenv").config()

app.use(cors())
app.use(express.json())

initDB()

app.use("/api/tasks", taskRouter)
app.use("/api/answers", answerRouter)
app.use("/api/users", userRouter)

module.exports = app
