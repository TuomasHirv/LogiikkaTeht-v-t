const test = require("node:test")
const assert = require("node:assert/strict")

const matchAnswer = require("./matchTree")

function loadMatchAnswerWithEquivalenceStub(stubExport) {
  const matchTreePath = require.resolve("./matchTree")
  const equivalencePath = require.resolve("./equivalence")

  const originalMatchTree = require.cache[matchTreePath]
  const originalEquivalence = require.cache[equivalencePath]

  delete require.cache[matchTreePath]
  delete require.cache[equivalencePath]

  require.cache[equivalencePath] = {
    id: equivalencePath,
    filename: equivalencePath,
    loaded: true,
    exports: stubExport,
  }

  try {
    return require("./matchTree")
  } finally {
    delete require.cache[matchTreePath]
    delete require.cache[equivalencePath]

    if (originalMatchTree) {
      require.cache[matchTreePath] = originalMatchTree
    }
    if (originalEquivalence) {
      require.cache[equivalencePath] = originalEquivalence
    }
  }
}

test("accepts implication elimination", () => {
  assert.equal(matchAnswer("¬A∨B", "A→B"), true)
})

test("accepts biconditional elimination", () => {
  assert.equal(matchAnswer("(A→B)∧(B→A)", "A↔B"), true)
})

test("rejects a single rewrite that does not match a supported rule", () => {
  assert.equal(matchAnswer("A∧B", "A→B"), false)
})

test("rejects changes with more than one difference", () => {
  assert.equal(matchAnswer("C∧D", "A∧B"), false)
})

test("rejects a rule-valid rewrite when propositions are not equivalent", () => {
  const matchAnswerWithEquivalenceStub = loadMatchAnswerWithEquivalenceStub(
    () => false,
  )

  assert.equal(matchAnswerWithEquivalenceStub("¬A∨B", "A→B"), false)
})
