const path = require("path")

if (process.env.NODE_ENV !== "test" || !process.env.CI) {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") })
}
const express = require("express")
const cors = require("cors")
const app = express()
const initDB = require("./database/initDb")
const taskRouter = require("./controllers/taskRouter")
const answerRouter = require("./controllers/answerRouter")
const userRouter = require("./controllers/userRouter")
const corsOptions = require("./config/cors")
const notFound = require("./middleware/notFound")
const errorHandler = require("./middleware/errorHandler")
const pinoHttp = require("pino-http")
const logger = require("./config/logger")

app.use(pinoHttp({ logger }))
app.use(cors(corsOptions))
app.use(express.json())

if (process.env.DB_ALREADY_INITIALIZED !== "true") {
  initDB()
}

app.use("/api/tasks", taskRouter)
app.use("/api/answers", answerRouter)
app.use("/api/users", userRouter)
app.use(notFound)
app.use(errorHandler)
module.exports = app
