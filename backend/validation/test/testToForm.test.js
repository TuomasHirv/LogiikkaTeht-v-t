const assert = require("node:assert/strict")
const { test, describe, it } = require("node:test")

const ttForm = require("../textToForm")

const gTokens = ["(", "A", "∨", "¬", "B", ")"]
describe("Parsing text to CNF forms", () => {
  it("Peek function works", () => {
    const tokens = ["(", "A", "∨", "B", ")"]
    assert.strictEqual(ttForm.peek(tokens, 1), "A")
    assert.strictEqual(ttForm.peek(tokens, 2), "∨")
    assert.strictEqual(ttForm.peek(tokens, 0), "(")
    assert.strictEqual(ttForm.peek(tokens, tokens.length - 1), ")")
  })
  it("Consume function works", () => {
    const tokens = ["(", "A", "∨", "B", ")"]
    assert.strictEqual(ttForm.consume(tokens, 1, "A"), 2)
    assert.strictEqual(ttForm.consume(tokens, 2, "∨"), 3)
    assert.strictEqual(
      ttForm.consume(tokens, tokens.length - 1, ")"),
      tokens.length,
    )
  })
  it("Consume function correctly throws error", () => {
    const tokens = ["(", "A", "∨", "B", ")"]
    assert.throws(() => ttForm.consume(tokens, 0, "A"))
  })
  it("Parse variable works", () => {
    const first = ttForm.parseVariable(gTokens, 1)
    assert.strictEqual(first.literal, "A")
    assert.strictEqual(first.index, 2)
  })
  it("Parse variable correctly gets negation", () => {
    const second = ttForm.parseVariable(gTokens, 3)
    assert.strictEqual(second.literal, "¬B")
    assert.strictEqual(second.index, 5)
  })

  it("Parse clause works", () => {
    const first = ttForm.parseClauseCNF(gTokens, 0)
    assert.strictEqual(first.index, gTokens.length)
    assert.deepStrictEqual(first.clause, ["A", "¬B"])
  })
  it("Parse clause gets a single literal", () => {
    const sTokens = ["B", "∧", "¬A"]
    const second = ttForm.parseClauseCNF(sTokens, 0)
    assert.strictEqual(second.index, 1)
    assert.deepStrictEqual(second.clause, ["B"])
  })
  it("Parse clause correctly gets a negated single literal", () => {
    const sTokens = ["B", "∧", "¬A"]
    const third = ttForm.parseClauseCNF(sTokens, 2)
    assert.strictEqual(third.index, 3)
    assert.deepStrictEqual(third.clause, ["¬A"])
  })

  it("Parsing whole CNF works", () => {
    const tokens = ["(", "A", "∨", "¬", "B", ")"]
    const first = ttForm.parseCNF(tokens, 0)
    assert.strictEqual(first.index, tokens.length)
    assert.deepStrictEqual(first.clauses, [["A", "¬B"]])
  })
  it("Parsing whole CNF incorrect form throws error", () => {
    const tokens = ["(", "A", "∨", "¬", "B", ")", "A"]
    assert.throws(() => ttForm.parseCNF(tokens, 0))
  })
  it("Parsing whole CNF incorrect clause throws error", () => {
    const tokens = ["(", "A", "∧", "¬", "B", ")", "A"]
    assert.throws(() => ttForm.parseCNF(tokens, 0))
  })
  it("Parsing whole CNF gets multiple clauses", () => {
    const tokens = [
      "(",
      "A",
      "∨",
      "¬",
      "B",
      ")",
      "∧",
      "B",
      "∧",
      "¬A",
      "∧",
      "(",
      "A",
      "∨",
      "¬A",
      ")",
    ]
    const first = ttForm.parseCNF(tokens, 0)
    assert.strictEqual(first.index, tokens.length)
    assert.deepStrictEqual(first.clauses, [
      ["A", "¬B"],
      ["B"],
      ["¬A"],
      ["A", "¬A"],
    ])
  })
})
