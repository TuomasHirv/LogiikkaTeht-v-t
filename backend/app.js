const app = require("./exprApp")
const logger = require("./config/logger")
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  logger.info(`Backend server is running on http://localhost:${PORT}`)
})

module.exports = app
