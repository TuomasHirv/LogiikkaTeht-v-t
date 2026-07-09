// This file is AI coded

const assert = require("node:assert/strict")
const { test, describe, it } = require("node:test")

const VRfunc = require("./ValidateResolution")

describe("Testing ValidateResolution", () => {
  describe("toTokens", () => {
    it("tokenizes a simple literal", () => {
      assert.deepEqual(VRfunc.toTokens("P"), ["P"])
    })

    it("tokenizes a negated literal", () => {
      assert.deepEqual(VRfunc.toTokens("¬P"), ["¬", "P"])
    })

    it("skips commas without adding them as tokens", () => {
      assert.deepEqual(VRfunc.toTokens("P,Q"), ["P", "Q"])
    })

    it("uppercases lowercase letters", () => {
      assert.deepEqual(VRfunc.toTokens("p"), ["P"])
    })

    it("throws on invalid characters", () => {
      assert.throws(() => VRfunc.toTokens("P&Q"))
    })
  })

  describe("parseClauseToSet", () => {
    it("parses a simple two-literal clause", () => {
      const result = VRfunc.parseClauseToSet("{P, Q}")
      assert.equal(result.size, 2)
      assert.ok(result.has("P"))
      assert.ok(result.has("Q"))
    })

    it("parses negated literals correctly", () => {
      const result = VRfunc.parseClauseToSet("{¬P, Q}")
      assert.ok(result.has("¬P"))
      assert.ok(result.has("Q"))
    })

    it("parses the empty clause", () => {
      const result = VRfunc.parseClauseToSet("{}")
      assert.equal(result.size, 0)
    })

    it("parses a single-literal clause", () => {
      const result = VRfunc.parseClauseToSet("{R}")
      assert.equal(result.size, 1)
      assert.ok(result.has("R"))
    })

    it("throws on a missing comma between literals (regression check)", () => {
      assert.throws(() => VRfunc.parseClauseToSet("{PQ, R}"))
    })
  })

  describe("parseReferencedLines", () => {
    it("returns 'assumption' for an assumption justification", () => {
      assert.equal(VRfunc.parseReferencedLines("(assumption)"), "assumption")
    })

    it("extracts two line numbers", () => {
      assert.deepEqual(VRfunc.parseReferencedLines("(lines: 1,2)"), [1, 2])
    })

    it("throws when no numbers are present and it isn't 'assumption'", () => {
      assert.throws(() => VRfunc.parseReferencedLines("(lines:)"))
    })

    it("throws when more or fewer than two numbers are given", () => {
      assert.throws(() => VRfunc.parseReferencedLines("(lines: 1,2,3)"))
      assert.throws(() => VRfunc.parseReferencedLines("(lines: 1)"))
    })
  })

  describe("parseUserClause", () => {
    it("parses a full assumption line", () => {
      const result = VRfunc.parseUserClause("{P, Q} (assumption)")
      assert.equal(result.justification, "assumption")
      assert.ok(result.clause.has("P"))
      assert.ok(result.clause.has("Q"))
    })

    it("parses a full resolution line", () => {
      const result = VRfunc.parseUserClause("{Q} (lines: 1,2)")
      assert.deepEqual(result.justification, [1, 2])
      assert.ok(result.clause.has("Q"))
    })

    it("ignores irregular whitespace", () => {
      const result = VRfunc.parseUserClause("{ P , Q }   ( lines: 1 , 2 )")
      assert.deepEqual(result.justification, [1, 2])
      assert.ok(result.clause.has("P"))
    })

    it("throws on a malformed line", () => {
      assert.throws(() => VRfunc.parseUserClause("P, Q (assumption)")) // missing braces
    })
  })
  describe("Parsing whole list", () => {
    it("parses multiple valid clauses correctly", () => {
      const list = [
        "{P, Q} (assumption)",
        "{Q} (lines: 1,2)",
        "{ P , ¬Q }   ( lines: 2 , 3 )",
      ]

      const result = VRfunc.parseClauseList(list)

      assert.strictEqual(result.length, 3)

      // Clause 1
      assert.deepStrictEqual([...result[0].clause], ["P", "Q"])
      assert.strictEqual(result[0].justification, "assumption")

      // Clause 2
      assert.deepStrictEqual([...result[1].clause], ["Q"])
      assert.deepStrictEqual(result[1].justification, [1, 2])

      // Clause 3 (with negation + whitespace)
      assert.deepStrictEqual([...result[2].clause], ["P", "¬Q"])
      assert.deepStrictEqual(result[2].justification, [2, 3])
    })

    it("handles empty clause", () => {
      const list = ["{} (assumption)"]
      const result = VRfunc.parseClauseList(list)

      assert.strictEqual(result.length, 1)
      assert.deepStrictEqual([...result[0].clause], [])
      assert.strictEqual(result[0].justification, "assumption")
    })

    it("throws on invalid clause format", () => {
      const list = ["P, Q (assumption)"] // missing {}

      assert.throws(() => {
        VRfunc.parseClauseList(list)
      })
    })

    it("throws on invalid justification", () => {
      const list = ["{P} (line: 1)"] // wrong format

      assert.throws(() => {
        VRfunc.parseClauseList(list)
      })
    })

    it("throws on invalid characters", () => {
      const list = ["{P, 1} (assumption)"] // invalid literal

      assert.throws(() => {
        VRfunc.parseClauseList(list)
      })
    })

    it("handles single literal with negation", () => {
      const list = ["{¬P} (assumption)"]
      const result = VRfunc.parseClauseList(list)

      assert.deepStrictEqual([...result[0].clause], ["¬P"])
    })
  })
})
