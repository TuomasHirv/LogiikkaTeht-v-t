// This file is AI-coded
const pino = require("pino")

const isProd = process.env.NODE_ENV === "production"

const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  transport: isProd
    ? undefined // plain JSON in prod — log aggregators want this, not pretty-printed text
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
})

module.exports = logger
