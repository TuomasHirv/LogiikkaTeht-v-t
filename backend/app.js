const app = require("./exprApp")
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`)
})

module.exports = app
