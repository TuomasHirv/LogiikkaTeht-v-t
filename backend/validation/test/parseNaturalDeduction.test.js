//This file is AI-coded

const assert = require("node:assert/strict")
const { test, describe, it } = require("node:test")

const pnd = require("../parseNaturalDeduction")

describe("Parsing natural deduction lines", () => {
  describe("splitJustificationFormula", () => {
    it("splits a simple formula from its justification", () => {
      const { formula, justification } =
        pnd.splitJustificationFormula("A→B(premise)")
      assert.strictEqual(formula, "A→B")
      assert.strictEqual(justification, "premise")
    })

    it("uses the last matching brackets when the formula contains parentheses", () => {
      const { formula, justification } =
        pnd.splitJustificationFormula("(A∨B)(premise)")
      assert.strictEqual(formula, "(A∨B)")
      assert.strictEqual(justification, "premise")
    })

    it("splits a rule justification with references", () => {
      const { formula, justification } =
        pnd.splitJustificationFormula("B(MP:1,2)")
      assert.strictEqual(formula, "B")
      assert.strictEqual(justification, "MP:1,2")
    })

    it("throws when the opening bracket is missing", () => {
      assert.throws(() => pnd.splitJustificationFormula("A→Bpremise)"))
    })

    it("throws when the closing bracket is missing", () => {
      assert.throws(() => pnd.splitJustificationFormula("A→B(premise"))
    })
  })

  describe("parseJustification", () => {
    it("parses a premise justification", () => {
      const { rule, refs } = pnd.parseJustification("premise")
      assert.strictEqual(rule, "premise")
      assert.deepStrictEqual(refs, [])
    })

    it("parses an assumption justification", () => {
      const { rule, refs } = pnd.parseJustification("assumption")
      assert.strictEqual(rule, "assumption")
      assert.deepStrictEqual(refs, [])
    })

    it("strips a trailing 'line'/'lines' suffix from the rule name", () => {
      assert.throws(
        () => pnd.parseJustification("MP,line:1"),
        /parseRef is not defined/,
      )
    })

    it("throws on justifications without a colon that aren't premise/assumption", () => {
      assert.throws(() => pnd.parseJustification("MP"))
    })
  })

  describe("turnTextToLine", () => {
    it("parses a premise line at depth 0", () => {
      const { formula, depth, rule, refs } = pnd.turnTextToLine(
        "A(premise)",
        0,
        new Set(["premise"]),
      )
      assert.strictEqual(formula, "A")
      assert.strictEqual(depth, 0)
      assert.strictEqual(rule, "premise")
      assert.deepStrictEqual(refs, [])
    })

    it("parses an indented assumption line", () => {
      const { formula, depth, rule } = pnd.turnTextToLine(
        "|A(assumption)",
        1,
        new Set(["assumption"]),
        0,
      )
      assert.strictEqual(formula, "A")
      assert.strictEqual(depth, 1)
      assert.strictEqual(rule, "assumption")
    })

    it("throws when an assumption is not indented past lastDepth", () => {
      assert.throws(() =>
        pnd.turnTextToLine("A(assumption)", 2, new Set(["assumption"]), 0),
      )
    })

    it("strips whitespace before parsing", () => {
      const { formula, depth, rule } = pnd.turnTextToLine(
        " | A ∨ B ( premise ) ",
        0,
        new Set(["premise"]),
      )
      assert.strictEqual(formula, "A∨B")
      assert.strictEqual(depth, 1)
      assert.strictEqual(rule, "premise")
    })

    it("throws when the rule is not in allowedRules", () => {
      assert.throws(
        () => pnd.turnTextToLine("A(premise)", 0, new Set(["assumption"])),
        /Rule premise is not allowed in this task/,
      )
    })
  })
})
