const express = require("express")
const cors = require("cors")
const app = express()
const initDB = require("./database/initDb")
const taskRouter = require("./controllers/taskRouter")

app.use(cors())
app.use(express.json())

initDB()

app.use("/api/tasks", taskRouter)

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`)
})

module.exports = app
