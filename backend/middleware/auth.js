const jwt = require("jsonwebtoken")
const logger = require("../config/logger")

const JWT_secret = process.env.JWT_SECRET

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return response.status(401).json({ error: "Token missing" })
  }

  try {
    const decoded = jwt.verify(token, JWT_secret)

    request.userId = decoded.userId

    next()
  } catch (error) {
    logger.error(error)
    return response.status(403).json({ error: "bad token" })
  }
}

module.exports = authenticateToken
