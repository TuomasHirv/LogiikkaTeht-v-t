const jwt = require("jsonwebtoken")

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
    console.log(error)
    return response.status(403).json({ error: "bad token" })
  }
}

module.exports = authenticateToken
