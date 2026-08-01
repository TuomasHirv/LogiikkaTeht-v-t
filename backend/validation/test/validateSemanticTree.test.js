const assert = require("node:assert/strict")
const { test, describe } = require("node:test")

const semTree = require("../validateSemanticTree")
const {
  testNodeOneAnd,
  testNodeOneAndContradiction,
  bigTest,
  throwsOnIncorrectX,
  throwsOnIncorrectFork,
  throwsOnNotInPending,
  throwsOnNotExhausted,
  throwsOnContradictionNotMarked,
  throwsOnForkWhenChain,
  throwsOnVarFork,
} = require("./semanticTreeTestConfig")

describe("validateSemanticTree tests", () => {
  describe("stripOuterParens", () => {
    test("Works with parens", () => {
      const text = "(p ∨ p)"
      const result = semTree.stripOuterParens(text)
      assert.strictEqual(result, "p ∨ p")
    })
    test("Works without parens", () => {
      const text = "p ∨ p"
      const result = semTree.stripOuterParens(text)
      assert.strictEqual(result, "p ∨ p")
    })
    test("Works with multiple outer parens in a row", () => {
      const text = "((p ∨ p))"
      const result = semTree.stripOuterParens(text)
      assert.strictEqual(result, "p ∨ p")
    })
    test("Doesn't remove parens if they arent outer", () => {
      const text = "(p) ∨ (p)"
      const result = semTree.stripOuterParens(text)
      assert.strictEqual(result, "(p) ∨ (p)")
    })
    test("Doesn't remove parens if they arent outer but does remove outer still", () => {
      const text = "((p) ∨ (p))"
      const result = semTree.stripOuterParens(text)
      assert.strictEqual(result, "(p) ∨ (p)")
    })
  })
  describe("findMainConnective", () => {
    test("Works with single variable", () => {
      const text = "p"
      const result = semTree.findMainConnective(text)
      assert.strictEqual(result.type, "VAR")
      assert.strictEqual(result.value, "p")
    })
    test("Works with single negated variable", () => {
      const text = "¬p"
      const result = semTree.findMainConnective(text)
      assert.strictEqual(result.type, "NOT")
      assert.strictEqual(result.inner, "p")
    })
    test("Works with single symbol", () => {
      const text = "p ↔ a"
      const result = semTree.findMainConnective(text)
      assert.strictEqual(result.type, "BICOND")
      assert.strictEqual(result.left, "p")
      assert.strictEqual(result.right, "a")
    })
    test("Works with 2 symbols", () => {
      const text = "p ∧ a ∧ b"
      const result = semTree.findMainConnective(text)
      assert.strictEqual(result.type, "AND")
      assert.strictEqual(result.left, "p")
      assert.strictEqual(result.right, "a ∧ b")
    })
    test("Respects parenthesis", () => {
      const text = "(p ∧ a) ∧ b"
      const result = semTree.findMainConnective(text)
      assert.strictEqual(result.type, "AND")
      assert.strictEqual(result.left, "(p ∧ a)")
      assert.strictEqual(result.right, "b")
    })
    test("First symbol negation works", () => {
      const text = "¬(p ∧ a) ∧ b"
      const result = semTree.findMainConnective(text)
      assert.strictEqual(result.type, "AND")
      assert.strictEqual(result.left, "¬(p ∧ a)")
      assert.strictEqual(result.right, "b")
    })
  })
  describe("expandNegation", () => {
    test("Variable returns null", () => {
      const text = "p"
      const result = semTree.expandNegation(text)
      if (result) {
        assert.fail("Result wasn't null")
      }
    })
    test("NEGATION is a chain", () => {
      const text = "¬(p ∧ a)"
      const result = semTree.expandNegation(text)
      assert.strictEqual(result.kind, "chain")
      assert.deepEqual(result.results, ["(p ∧ a)"])
    })
    test("AND is a fork", () => {
      const text = "(p ∧ a)"
      const result = semTree.expandNegation(text)
      assert.strictEqual(result.kind, "fork")
      assert.deepEqual(result.results, ["¬p", "¬a"])
    })
    test("OR is a chain", () => {
      const text = "(p ∨ a)"
      const result = semTree.expandNegation(text)
      assert.strictEqual(result.kind, "chain")
      assert.deepEqual(result.results, ["¬p", "¬a"])
    })
    test("IMPLIES is a chain", () => {
      const text = "(p → a)"
      const result = semTree.expandNegation(text)
      assert.strictEqual(result.kind, "chain")
      assert.deepEqual(result.results, ["p", "¬a"])
    })
    test("BICOND is a fork", () => {
      const text = "(p ↔ a)"
      const result = semTree.expandNegation(text)
      assert.strictEqual(result.kind, "fork")
      assert.deepEqual(result.results, ["p ∧ ¬a", "¬p ∧ a"])
    })
  })
  describe("expandObligation", () => {
    test("Simple test", () => {
      const text = "(p ∨ a)"
      const result = semTree.expandObligation(text)
      assert.strictEqual(result.kind, "fork")
      assert.deepEqual(result.results, ["p", "a"])
    })
    test("Finds many results with AND statements", () => {
      const text = "p ∧ a ∧ b"
      const result = semTree.expandObligation(text)
      assert.strictEqual(result.kind, "chain")
      assert.deepEqual(result.results, ["p", "a", "b"])
    })
    test("Works with VAR", () => {
      const text = "(p)"
      const result = semTree.expandObligation(text)
      if (result) {
        assert.fail("Result wasn't null for single variable")
      }
    })
  })
  describe("searchMoreAnd", () => {
    test("Simple test", () => {
      const text = "p ∧ a"
      const result = semTree.searchMoreAnd(text)
      assert.deepEqual(result, ["p", "a"])
    })
    test("Doesn't go in to parenthesis", () => {
      const text = "(p ∧ a)"
      const result = semTree.searchMoreAnd(text)
      assert.deepEqual(result, ["(p ∧ a)"])
    })
    test("Respects parenthesis", () => {
      const text = "(p ∧ a) ∧ a"
      const result = semTree.searchMoreAnd(text)
      assert.deepEqual(result, ["(p ∧ a)", "a"])
    })
    test("Respects other symbols", () => {
      const text = "(p ∧ a) → a"
      const result = semTree.searchMoreAnd(text)
      assert.deepEqual(result, ["(p ∧ a) → a"])
    })
  })
  describe("evaluateNode", () => {
    test("Simple proposition", () => {
      const state = {
        pending: new Set(["p ∧ a"]),
        literals: new Set([]),
      }
      semTree.evaluateNode(testNodeOneAnd, state, [])
    })
    test("Simple proposition with contradiction", () => {
      const state = {
        pending: new Set(["p ∧ ¬p"]),
        literals: new Set([]),
      }
      semTree.evaluateNode(testNodeOneAndContradiction, state, [])
    })
    test("Testing sample task", () => {
      const state = {
        pending: new Set(["(P ↔ Q) ∧ ¬P"]),
        literals: new Set([]),
      }
      semTree.evaluateNode(bigTest, state, [])
    })
    test("Throws on incorrect X", () => {
      const state = {
        pending: new Set(["p ∧ a"]),
        literals: new Set([]),
      }
      assert.throws(() => semTree.evaluateNode(throwsOnIncorrectX, state, []))
    })

    test("Throws on incorrect fork", () => {
      const state = {
        pending: new Set(["p ∨ a"]),
        literals: new Set([]),
      }
      assert.throws(() =>
        semTree.evaluateNode(throwsOnIncorrectFork, state, []),
      )
    })
    test("Throws on not in pending", () => {
      const state = {
        pending: new Set(["p ∨ a"]),
        literals: new Set([]),
      }
      assert.throws(() => semTree.evaluateNode(throwsOnNotInPending, state, []))
    })
    test("Throws on not exhausted", () => {
      const state = {
        pending: new Set(["p ∨ a"]),
        literals: new Set([]),
      }
      assert.throws(() => semTree.evaluateNode(throwsOnNotExhausted, state, []))
    })
    test("Throws on contradiction not marked", () => {
      const state = {
        pending: new Set(["p ∧ ¬p"]),
        literals: new Set([]),
      }
      assert.throws(() =>
        semTree.evaluateNode(throwsOnContradictionNotMarked, state, []),
      )
    })

    test("Throws on fork when should be chain", () => {
      const state = {
        pending: new Set(["p ∧ p"]),
        literals: new Set([]),
      }
      assert.throws(() =>
        semTree.evaluateNode(throwsOnForkWhenChain, state, []),
      )
    })
    test("Throws on VAR fork", () => {
      const state = {
        pending: new Set(["a", "p", "c"]),
        literals: new Set([]),
      }
      assert.throws(() => semTree.evaluateNode(throwsOnVarFork, state, []))
    })
  })
})
