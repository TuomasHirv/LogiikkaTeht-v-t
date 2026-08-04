const { describe, test } = require("node:test")
const assert = require("node:assert/strict")

const {
  toTokens,
  validateDifference,
  validateShorthandExpansion,
  validatePropositionList,
} = require("../validateShorthand.js")

describe("Shorthand validation tests", () => {
  test("toTokens tokenizes operators and parentheses", () => {
    const keys = []

    assert.deepEqual(toTokens("(p0∧p1)", keys), ["(", "p0", "∧", "p1", ")"])
  })

  test("toTokens recognizes shorthand symbols", () => {
    const keys = ["A", "B"]

    assert.deepEqual(toTokens("A∧B", keys), ["A", "∧", "B"])
  })

  test("toTokens rejects invalid characters", () => {
    const keys = []

    assert.throws(() => toTokens("x", keys), {
      message: 'Invalid character "x" at position 0',
    })
  })

  test("validateShorthandExpansion accepts matching expansion", () => {
    const definition = ["¬", "A"]
    const current = ["¬", "A", "∧", "p0"]

    assert.equal(validateShorthandExpansion(definition, current, 0), 2)
  })

  test("validateShorthandExpansion rejects wrong expansion", () => {
    const definition = ["¬", "A"]
    const current = ["A"]

    assert.throws(() => validateShorthandExpansion(definition, current, 0))
  })

  test("validateDifference accepts identical tokens", () => {
    const shorthands = {
      A: ["p0"],
    }

    assert.equal(validateDifference(["p0"], ["p0"], shorthands), true)
  })

  test("validateDifference accepts shorthand expansion", () => {
    const shorthands = {
      A: ["p0"],
    }

    assert.equal(validateDifference(["A"], ["p0"], shorthands), true)
  })

  test("validateDifference rejects invalid changes", () => {
    const shorthands = {
      A: ["p0"],
    }

    assert.throws(() => validateDifference(["A"], ["p1"], shorthands))
  })

  test("validatePropositionList accepts valid proof", () => {
    const shorthands = {
      A: ["p0"],
    }

    assert.equal(
      validatePropositionList(["A", "p0"], shorthands).accepted,
      true,
    )
    assert.equal(
      validatePropositionList(["A", "p0"], shorthands).feedback,
      "Pass",
    )
  })

  test("validatePropositionList accepts long valid proof", () => {
    const shorthands = {
      A: ["p0", "∧", "C"],
      B: ["p1"],
      C: ["p2"],
    }

    assert.equal(
      validatePropositionList(
        ["A ∧ B", "p0 ∧ C ∧ B", "p0 ∧ p2 ∧ B", "p0 ∧ p2 ∧ p1"],
        shorthands,
      ).accepted,
      true,
    )
  })

  test("validatePropositionList rejects double expansion", () => {
    const shorthands = {
      A: ["p0", "∧", "C"],
      B: ["p1"],
      C: ["p2"],
    }
    const validated = validatePropositionList(
      ["A ∧ B", "p0 ∧ C ∧ p1", "p0 ∧ p2 ∧ p1"],
      shorthands,
    )
    assert.equal(validated.accepted, false)
    assert.equal(validated.feedback, "Change from 0 to 1 not accepted")
  })

  test("validatePropositionList rejects proof ending with shorthand", () => {
    const shorthands = {
      A: ["p0"],
    }

    assert.throws(() => validatePropositionList(["p0", "A"], shorthands))
  })
  test("Rejects proof where 2 shorthands are opened at once", () => {
    const shorthands = {
      A: ["p0"],
      B: ["p1"],
    }
    assert.equal(
      validateDifference(["A", "∧", "B"], ["p0", "∧", "p1"], shorthands),
      false,
    )
  })
  test("accepts proof where shorthands are opened to many parts at once", () => {
    const shorthands = {
      A: ["p0", "∧", "A"],
      B: ["p1"],
    }
    assert.equal(
      validateDifference(
        ["A", "∧", "B"],
        ["p0", "∧", "A", "∧", "B"],
        shorthands,
      ),
      true,
    )
  })
})
