module.exports = function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500

  console.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  const isProd = process.env.NODE_ENV === "production"

  res.status(status).json({
    error: isProd && status === 500 ? "Internal server error" : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  })
}
