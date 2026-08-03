const path = require("path")

if (process.env.NODE_ENV !== "test" && !process.env.CI) {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") })
}
const rateLimit = require("express-rate-limit")
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
app.set("trust proxy", 1)
app.use(pinoHttp({ logger }))
app.use(cors(corsOptions))
app.use(express.json())
if (process.env.NODE_ENV !== "test") {
  initDB()
    .then(() => logger.info("DB initialized"))
    .catch((error) => {
      logger.error(error, "DB init failed")
      process.exit(1)
    })
}
const skipInTests = () => process.env.NODE_ENV === "test"

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts, try again later" },
  skip: skipInTests,
})
app.use(globalLimiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: "Too many attempts, try again later" },
  skip: skipInTests,
})

app.use("/api/tasks", taskRouter)
app.use("/api/answers", answerRouter)
app.use("/api/users", authLimiter, userRouter)
app.use(notFound)
app.use(errorHandler)
module.exports = app
