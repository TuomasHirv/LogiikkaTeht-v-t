const test = require("node:test")
const assert = require("node:assert/strict")

function loadMatchAnswerWithDbStub(dbExport) {
  const matchAnswerPath = require.resolve("../matchAnswer")
  const dbPath = require.resolve("../../database/db")

  const originalMatchAnswer = require.cache[matchAnswerPath]
  const originalDb = require.cache[dbPath]

  delete require.cache[matchAnswerPath]
  delete require.cache[dbPath]

  require.cache[dbPath] = {
    id: dbPath,
    filename: dbPath,
    loaded: true,
    exports: dbExport,
  }

  try {
    return require("../matchAnswer")
  } finally {
    delete require.cache[matchAnswerPath]
    delete require.cache[dbPath]

    if (originalMatchAnswer) {
      require.cache[matchAnswerPath] = originalMatchAnswer
    }
    if (originalDb) {
      require.cache[dbPath] = originalDb
    }
  }
}

test("accepts logically equivalent answer for proposition task", async () => {
  const { matchPropositions } = loadMatchAnswerWithDbStub({
    query: () => ({
      rows: [{ correct_answer: { answers: ["A→B"] } }],
    }),
  })

  const accepted = await matchPropositions("¬A∨B", 1)
  assert.equal(accepted.accepted, true)
  assert.equal(accepted.feedback, "Pass")
})

test("rejects non-equivalent answer for proposition task", async () => {
  const { matchPropositions } = loadMatchAnswerWithDbStub({
    query: () => ({
      rows: [{ correct_answer: { answers: ["A→B"] } }],
    }),
  })

  const accepted = await matchPropositions("A∧B", 1)
  assert.equal(accepted.accepted, false)
  assert.equal(accepted.feedback, "Fail")
})

test("keeps case-insensitive proposition matching", async () => {
  const { matchPropositions } = loadMatchAnswerWithDbStub({
    query: () => ({
      rows: [{ correct_answer: { answers: ["A→B"] } }],
    }),
  })

  const accepted = await matchPropositions("¬a∨b", 1)
  assert.equal(accepted.accepted, true)
  assert.equal(accepted.feedback, "Pass")
})
