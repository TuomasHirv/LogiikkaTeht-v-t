// This file is AI coded

const assert = require("node:assert/strict")
const { describe, it } = require("node:test")

const VRfunc = require("../ValidateResolution")

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
      assert.equal(result.size, 1)
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
      const result = VRfunc.parseUserClause(
        "{P, Q} (assumption)",
        [["P", "Q"]],
        0,
      )
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
        "{¬Q} (assumption)",
        "{ P  }   ( lines: 0 , 1 )",
      ]

      const result = VRfunc.parseClauseList(list, [["P", "Q"], ["¬Q"]])

      assert.strictEqual(result.length, 3)

      // Clause 1
      assert.deepStrictEqual([...result[0].clause], ["P", "Q"])
      assert.strictEqual(result[0].justification, "assumption")

      // Clause 2
      assert.deepStrictEqual([...result[1].clause], ["¬Q"])
      assert.deepStrictEqual(result[1].justification, "assumption")

      // Clause 3 (with negation + whitespace)
      assert.deepStrictEqual([...result[2].clause], ["P"])
      assert.deepStrictEqual(result[2].justification, [0, 1])
    })

    it("handles empty clause", () => {
      const list = ["{} (assumption)"]
      assert.throws(() => {
        VRfunc.parseClauseList(list, ["{}"])
      })
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
      const result = VRfunc.parseClauseList(list, [["¬P"]])

      assert.deepStrictEqual([...result[0].clause], ["¬P"])
    })
  })
  describe("stepCheck", () => {
    it("returns false for valid non-empty resolution", () => {
      const ref1 = new Set(["A", "B"])
      const ref2 = new Set(["¬A", "C"])
      const result = new Set(["B", "C"])

      assert.equal(VRfunc.stepCheck(result, ref1, ref2), false)
    })

    it("returns true when result is the empty set (∅)", () => {
      const ref1 = new Set(["A"])
      const ref2 = new Set(["¬A"])
      const result = new Set(["∅"])

      assert.equal(VRfunc.stepCheck(result, ref1, ref2), true)
    })

    it("throws if no literals were changed from ref1", () => {
      const ref1 = new Set(["A"])
      const ref2 = new Set(["¬A"])
      const result = new Set(["A"])

      assert.throws(
        () => VRfunc.stepCheck(result, ref1, ref2),
        /No literals were changed from ref1/,
      )
    })

    it("throws if complement is missing", () => {
      const ref1 = new Set(["A"])
      const ref2 = new Set(["B"])
      const result = new Set(["B"])

      assert.throws(
        () => VRfunc.stepCheck(result, ref1, ref2),
        /Couldn't match complement/,
      )
    })

    it("throws if empty set is present but step is invalid", () => {
      const ref1 = new Set(["A"])
      const ref2 = new Set(["B"]) // no complement
      const result = new Set(["∅"])

      assert.throws(() => VRfunc.stepCheck(result, ref1, ref2))
    })
  })
  describe("validateResolutionSteps", () => {
    it("returns false when no empty clause is derived", () => {
      const clauseList = [
        { clause: new Set(["A", "B"]), justification: "assumption" }, // 0
        { clause: new Set(["¬A", "C"]), justification: "assumption" }, // 1
        {
          clause: new Set(["B", "C"]),
          justification: [0, 1],
        },
      ]

      assert.equal(VRfunc.validateResolutionSteps(clauseList, 2), false)
    })

    it("returns true when empty clause (∅) is derived", () => {
      const clauseList = [
        { clause: new Set(["A"]), justification: "assumption" }, // 0
        { clause: new Set(["¬A"]), justification: "assumption" }, // 1
        {
          clause: new Set(["∅"]),
          justification: [0, 1],
        },
      ]

      assert.equal(VRfunc.validateResolutionSteps(clauseList, 2), true)
    })

    it("throws if too many assumptions are used", () => {
      const clauseList = [
        { clause: new Set(["A"]), justification: "assumption" },
        { clause: new Set(["B"]), justification: "assumption" },
      ]

      assert.throws(
        () => VRfunc.validateResolutionSteps(clauseList, 1),
        /Too many assumptions used/,
      )
    })

    it("does not throw if assumptions equal allowed count", () => {
      const clauseList = [
        { clause: new Set(["A"]), justification: "assumption" },
        { clause: new Set(["B"]), justification: "assumption" },
      ]

      assert.equal(VRfunc.validateResolutionSteps(clauseList, 2), false)
    })

    it("throws on invalid resolution step", () => {
      const clauseList = [
        { clause: new Set(["A"]), justification: "assumption" }, // 0
        { clause: new Set(["B"]), justification: "assumption" }, // 1
        {
          clause: new Set(["A", "B"]), // invalid
          justification: [0, 1],
        },
      ]

      assert.throws(() => VRfunc.validateResolutionSteps(clauseList, 2))
    })

    it("returns result of the LAST step only", () => {
      const clauseList = [
        { clause: new Set(["A"]), justification: "assumption" }, // 0
        { clause: new Set(["¬A"]), justification: "assumption" }, // 1
        { clause: new Set(["¬B"]), justification: "assumption" },
        { clause: new Set(["B", "C"]), justification: "assumption" },
        {
          clause: new Set(["∅"]),
          justification: [0, 1],
        },
        {
          clause: new Set(["C"]),
          justification: [2, 3],
        },
      ]
      assert.equal(VRfunc.validateResolutionSteps(clauseList, 4), false)
    })
    it("throws if a new literal is introduced", () => {
      const ref1 = new Set(["A"])
      const ref2 = new Set(["¬A"])
      const result = new Set(["X"]) // 🚨 invalid

      assert.throws(
        () => VRfunc.stepCheck(result, ref1, ref2),
        /Invalid literal/,
      )
    })
    it("throws if result mixes ∅ with other literals", () => {
      const ref1 = new Set(["A"])
      const ref2 = new Set(["¬A"])
      const result = new Set(["∅", "A"])

      assert.throws(
        () => VRfunc.stepCheck(result, ref1, ref2),
        /Empty set must be the only literal/,
      )
    })
  })
})
