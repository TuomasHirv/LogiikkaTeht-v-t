const assert = require("node:assert/strict")
const { describe, it } = require("node:test")

const validator = require("../validateNaturalDeduction")
/** Checks that the reference path is legal @param {[{formula: "", depth: int, rule: "", refs: []}]} fakeLines*/
const fakeLines = [
  { formula: "A", depth: 0, rule: "premise", refs: [] },
  { formula: "B", depth: 0, rule: "premise", refs: [] },
]

describe("validateNaturalDeduction", () => {
  describe("checkPremise", () => {
    it("Accepts listed premise", () => {
      const testPremises = ["A"]
      validator.checkPremise(
        {
          formula: "A",
          depth: 0,
          rule: "premise",
          refs: [],
        },
        testPremises,
      )
    })
    it("Accepts more complicated premise", () => {
      const testPremises = ["C", "TEST STRING HERE", "D"]
      validator.checkPremise(
        {
          formula: "TEST STRING HERE",
          depth: 0,
          rule: "premise",
          refs: [],
        },
        testPremises,
      )
    })
    it("Refuses not listed premise", () => {
      const testPremises = ["C"]
      assert.throws(() =>
        validator.checkPremise(
          {
            formula: "A",
            depth: 0,
            rule: "premise",
            refs: [],
          },
          testPremises,
        ),
      )
    })
  })
  describe("formulasEqual", () => {
    it("trivial check", () => {
      assert.ok(validator.formulasEqual("A", "A"))
      assert.ok(!validator.formulasEqual("A", "B"))
    })
    it("parens stripping", () => {
      assert.ok(validator.formulasEqual("(A)", "A"))
      assert.ok(validator.formulasEqual("((A))", "A"))
      assert.ok(validator.formulasEqual("((A))", "(A)"))
    })
    it("Bigger formula check", () => {
      assert.ok(validator.formulasEqual("(A ∧ B)", "A ∧ B"))
      assert.ok(validator.formulasEqual("((A ∧ B))", "A ∧ B"))
      assert.ok(validator.formulasEqual("((A ∧ B))", "(A ∧ B)"))
    })
    it("Doesnt accept different order", () => {
      assert.ok(!validator.formulasEqual("(B ∧ A)", "A ∧ B"))
      assert.ok(!validator.formulasEqual("((B ∧ A))", "A ∧ B"))
      assert.ok(!validator.formulasEqual("((B ∧ A))", "(A ∧ B)"))
    })
    it("negation wrapping", () => {
      assert.ok(validator.formulasEqual("¬A", "¬A"))
      assert.ok(validator.formulasEqual("¬¬A", "¬(¬A)"))
      assert.ok(validator.formulasEqual("¬¬¬A", "¬(¬(¬A))"))
      assert.ok(validator.formulasEqual("¬¬¬(A)", "¬¬¬A"))
    })
    it("Bigger formula negation wrapping", () => {
      assert.ok(validator.formulasEqual("¬¬(B ∧ A)", "¬(¬(B ∧ A))"))
      assert.ok(validator.formulasEqual("¬¬¬(B ∧ A)", "¬(¬(¬(B ∧ A)))"))
      assert.ok(validator.formulasEqual("¬¬(¬(B ∧ A))", "¬¬¬(B ∧ A)"))
    })
    it("Only touches brackets that are inconsequential", () => {
      assert.ok(!validator.formulasEqual("A∧(B∧C)", "(A∧B)∧C"))
      assert.ok(validator.formulasEqual("A∧(B∧C)", "A∧(B∧C)"))
      assert.ok(validator.formulasEqual("(A)∧(B∧C)", "A∧(B∧C)"))
    })
  })
  describe("checkAndIntro", () => {
    it("Correct passes", () => {
      const currLine = { formula: "A ∧ B", depth: 0, rule: "∧I", refs: [0, 1] }

      validator.checkAndIntro(fakeLines, currLine)
    })
    it("Wrong order also passes", () => {
      const currLine = { formula: "B ∧ A", depth: 0, rule: "∧I", refs: [0, 1] }

      validator.checkAndIntro(fakeLines, currLine)
    })
    it("Require 2 references", () => {
      let currLine = { formula: "B ∧ A", depth: 0, rule: "∧I", refs: [] }

      assert.throws(() => validator.checkAndIntro(fakeLines, currLine))
      currLine = { formula: "B ∧ A", depth: 0, rule: "∧I", refs: [1] }

      assert.throws(() => validator.checkAndIntro(fakeLines, currLine))
      currLine = { formula: "B ∧ A", depth: 0, rule: "∧I", refs: [1, 2, 3] }

      assert.throws(() => validator.checkAndIntro(fakeLines, currLine))
    })
    it("Check that the current formula is the correct type", () => {
      const currLine = { formula: "B ∨ A", depth: 0, rule: "∧I", refs: [0, 1] }
      assert.throws(() => validator.checkAndIntro(fakeLines, currLine))
    })
    it("Check that both sides are equivalent to refs", () => {
      let currLine = { formula: "C ∧ A", depth: 0, rule: "∧I", refs: [0, 1] }

      assert.throws(() => validator.checkAndIntro(fakeLines, currLine))
      currLine = { formula: "B ∧ D", depth: 0, rule: "∧I", refs: [0, 1] }

      assert.throws(() => validator.checkAndIntro(fakeLines, currLine))
      currLine = { formula: "C ∧ D", depth: 0, rule: "∧I", refs: [0, 1] }

      assert.throws(() => validator.checkAndIntro(fakeLines, currLine))
    })
  })
  describe("checkAndElim", () => {
    it("Works when correct", () => {
      const testLines = [
        ...fakeLines,
        { formula: "A ∧ B", depth: 0, rule: "∧I", refs: [0, 1] },
      ]
      const currLine = { formula: "A", depth: 0, rule: "∧E", refs: [2] }
      validator.checkAndElim(testLines, currLine)
      const secondLine = { formula: "B", depth: 0, rule: "∧E", refs: [2] }
      validator.checkAndElim(testLines, secondLine)
    })
    it("Checks ref count", () => {
      const testLines = [
        ...fakeLines,
        { formula: "A ∧ B", depth: 0, rule: "∧I", refs: [0, 1] },
      ]
      const currLine = { formula: "A", depth: 0, rule: "∧E", refs: [] }
      assert.throws(() => validator.checkAndElim(testLines, currLine))
      const secondLine = { formula: "A", depth: 0, rule: "∧E", refs: [1, 2] }
      assert.throws(() => validator.checkAndElim(testLines, secondLine))
    })
    it("Checks ref type", () => {
      const testLines = [
        ...fakeLines,
        { formula: "A ∨ B", depth: 0, rule: "∨I", refs: [0] },
      ]
      const currLine = { formula: "A", depth: 0, rule: "∧E", refs: [2] }
      assert.throws(() => validator.checkAndElim(testLines, currLine))
    })

    it("Checks that current formula is one side of ref", () => {
      const testLines = [
        ...fakeLines,
        { formula: "A ∧ B", depth: 0, rule: "∧I", refs: [0, 1] },
      ]
      const currLine = { formula: "C", depth: 0, rule: "∧E", refs: [2] }
      assert.throws(() => validator.checkAndElim(testLines, currLine))
    })
  })
  describe("checkImpElim", () => {
    it("Works when correct", () => {
      const testLines = [
        ...fakeLines,
        { formula: "A → B", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B", depth: 0, rule: "→E", refs: [2, 0] }
      validator.checkImpElim(testLines, currLine)
      const secondLine = { formula: "B", depth: 0, rule: "→E", refs: [0, 2] }
      validator.checkImpElim(testLines, secondLine)
    })
    it("Doesn't accept antecedent as result", () => {
      const testLines = [
        ...fakeLines,
        { formula: "A → B", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "A", depth: 0, rule: "→E", refs: [2, 0] }
      assert.throws(
        () => validator.checkImpElim(testLines, currLine),
        /Incorrect refs/,
      )
      const secondLine = { formula: "A", depth: 0, rule: "→E", refs: [0, 2] }
      assert.throws(
        () => validator.checkImpElim(testLines, secondLine),
        /Incorrect refs/,
      )
    })
    it("Checks ref count", () => {
      const testLines = [
        ...fakeLines,
        { formula: "A → B", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B", depth: 0, rule: "→E", refs: [2] }
      assert.throws(
        () => validator.checkImpElim(testLines, currLine),
        /→E Always takes two references/,
      )
      const secondLine = { formula: "B", depth: 0, rule: "→E", refs: [2, 0, 3] }
      assert.throws(
        () => validator.checkImpElim(testLines, secondLine),
        /→E Always takes two references/,
      )
    })
    it("Rejects if no implication in refs", () => {
      const testLines = [
        ...fakeLines,
        { formula: "A ∧ B", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B", depth: 0, rule: "→E", refs: [2, 0] }
      assert.throws(
        () => validator.checkImpElim(testLines, currLine),
        /Incorrect refs/,
      )
      const secondLine = { formula: "B", depth: 0, rule: "→E", refs: [0, 2] }
      assert.throws(
        () => validator.checkImpElim(testLines, secondLine),
        /Incorrect refs/,
      )
    })
  })
  describe("checkImpIntro", () => {
    it("Correct passes", () => {
      const testLines = [
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "B", depth: 1, rule: "assumption", refs: [] },
        { formula: "A", depth: 1, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B → A", depth: 0, rule: "→I", refs: [1, 2] }
      validator.checkImpIntro(testLines, currLine, 3)
    })
    it("Intro must be after second ref", () => {
      const testLines = [
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "B", depth: 1, rule: "assumption", refs: [] },
        { formula: "A", depth: 1, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B → A", depth: 0, rule: "→I", refs: [1, 2] }
      assert.throws(
        () => validator.checkImpIntro(testLines, currLine, 4),
        /→I Must discharge the assumption/,
      )
    })
    it("Intro must have -1 depth", () => {
      const testLines = [
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "B", depth: 1, rule: "assumption", refs: [] },
        { formula: "A", depth: 1, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B → A", depth: 1, rule: "→I", refs: [1, 2] }
      assert.throws(
        () => validator.checkImpIntro(testLines, currLine, 3),
        /→I Must discharge the assumption/,
      )
    })
    it("refs have to have same depth", () => {
      const testLines = [
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "B", depth: 1, rule: "assumption", refs: [] },
        { formula: "A", depth: 2, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B → A", depth: 1, rule: "→I", refs: [1, 2] }
      assert.throws(
        () => validator.checkImpIntro(testLines, currLine, 3),
        /Refs must be on the same assumption/,
      )
    })
    it("refs have to be able to access each other", () => {
      const testLines = [
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "B", depth: 1, rule: "assumption", refs: [] },
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "A", depth: 1, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B → A", depth: 0, rule: "→I", refs: [1, 3] }
      assert.throws(
        () => validator.checkImpIntro(testLines, currLine, 4),
        /not on the same assumption/,
      )
    })
    it("First ref has to be assumption", () => {
      const testLines = [
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "B", depth: 1, rule: "premise", refs: [] },
        { formula: "A", depth: 1, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B → A", depth: 0, rule: "→I", refs: [1, 2] }
      assert.throws(
        () => validator.checkImpIntro(testLines, currLine, 3),
        /First ref to →I must be 'assumption'/,
      )
    })
    it("Second ref cant be assumption", () => {
      const testLines = [
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "B", depth: 1, rule: "assumption", refs: [] },
        { formula: "A", depth: 1, rule: "assumption", refs: [] },
      ]
      const currLine = { formula: "B → A", depth: 0, rule: "→I", refs: [1, 2] }
      assert.throws(
        () => validator.checkImpIntro(testLines, currLine, 3),
        /Second ref to →I can't be 'assumption'/,
      )
    })
    it("Result has to be correct type", () => {
      const testLines = [
        { formula: "A", depth: 0, rule: "premise", refs: [] },
        { formula: "B", depth: 1, rule: "assumption", refs: [] },
        { formula: "A", depth: 1, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B ∧ A", depth: 0, rule: "→I", refs: [1, 2] }
      assert.throws(
        () => validator.checkImpIntro(testLines, currLine, 3),
        /isn't the correct type/,
      )
    })
    it("Rejects when a sibling assumption opens between the refs", () => {
      const testLines = [
        ...fakeLines,
        { formula: "P", depth: 1, rule: "assumption", refs: [] },
        { formula: "S", depth: 1, rule: "assumption", refs: [] },
        { formula: "Q", depth: 1, rule: "reiteration", refs: [1] },
      ]
      const currLine = { formula: "P → Q", depth: 0, rule: "→I", refs: [2, 4] }
      assert.throws(() => validator.checkImpIntro(testLines, currLine, 5))
    })

    it("Accepts the same shape without the sibling", () => {
      const testLines = [
        ...fakeLines,
        { formula: "P", depth: 1, rule: "assumption", refs: [] },
        { formula: "Q", depth: 1, rule: "reiteration", refs: [1] },
      ]
      const currLine = { formula: "P → Q", depth: 0, rule: "→I", refs: [2, 3] }
      assert.doesNotThrow(() => validator.checkImpIntro(testLines, currLine, 4))
    })
  })
  describe("checkOrIntro", () => {
    it("Works when correct", () => {
      const currLine = { formula: "A ∨ C", depth: 0, rule: "∨I", refs: [0] }
      validator.checkOrIntro(fakeLines, currLine)
      const secondLine = { formula: "C ∨ A", depth: 0, rule: "∨I", refs: [0] }
      validator.checkOrIntro(fakeLines, secondLine)
    })
    it("Check refs", () => {
      const currLine = { formula: "A ∨ C", depth: 0, rule: "∨I", refs: [0, 1] }
      assert.throws(
        () => validator.checkOrIntro(fakeLines, currLine),
        /∨I Must have one reference/,
      )
      const secondLine = { formula: "A ∨ C", depth: 0, rule: "∨I", refs: [] }
      assert.throws(
        () => validator.checkOrIntro(fakeLines, secondLine),
        /∨I Must have one reference/,
      )
    })
    it("Rejects if neither side match ref", () => {
      const currLine = { formula: "D ∨ C", depth: 0, rule: "∨I", refs: [0] }
      assert.throws(
        () => validator.checkOrIntro(fakeLines, currLine),
        /Neither side matches/,
      )
      const secondLine = { formula: "C ∨ V", depth: 0, rule: "∨I", refs: [0] }
      assert.throws(
        () => validator.checkOrIntro(fakeLines, secondLine),
        /Neither side matches/,
      )
    })
    it("Rejects if wrong type", () => {
      const currLine = { formula: "A ∧ C", depth: 0, rule: "∨I", refs: [0] }
      assert.throws(
        () => validator.checkOrIntro(fakeLines, currLine),
        /isn't the correct type/,
      )
      const secondLine = { formula: "C ∧ A", depth: 0, rule: "∨I", refs: [0] }
      assert.throws(
        () => validator.checkOrIntro(fakeLines, secondLine),
        /isn't the correct type/,
      )
    })
  })
  describe("checkNotElim", () => {
    it("Works when correct", () => {
      const testLines = [
        { formula: "¬¬A", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "A", depth: 0, rule: "¬E", refs: [0] }
      validator.checkNotElim(testLines, currLine)
    })
    it("Check refs", () => {
      const testLines = [
        { formula: "¬¬A", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "A", depth: 0, rule: "¬E", refs: [] }
      assert.throws(
        () => validator.checkNotElim(testLines, currLine),
        /¬E Must have one reference/,
      )
      const secondLine = { formula: "A", depth: 0, rule: "¬E", refs: [0, 1] }
      assert.throws(
        () => validator.checkNotElim(testLines, secondLine),
        /¬E Must have one reference/,
      )
    })
    it("Check ref is double negation", () => {
      const testLines = [{ formula: "A", depth: 0, rule: "premise", refs: [] }]
      const currLine = { formula: "A", depth: 0, rule: "¬E", refs: [0] }
      assert.throws(
        () => validator.checkNotElim(testLines, currLine),
        /isn't a double negation of/,
      )
      const secondLines = [
        { formula: "¬A", depth: 0, rule: "premise", refs: [] },
      ]
      const secondLine = { formula: "A", depth: 0, rule: "¬E", refs: [0] }
      assert.throws(
        () => validator.checkNotElim(secondLines, secondLine),
        /isn't a double negation of/,
      )
    })
    it("Rejects if result is incorrect", () => {
      const testLines = [
        { formula: "¬¬A", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "B", depth: 0, rule: "¬E", refs: [0] }
      assert.throws(
        () => validator.checkNotElim(testLines, currLine),
        /isn't a double negation of/,
      )
    })
  })
  describe("checkNotIntro", () => {
    it("Rejects when a sibling assumption opens between the refs", () => {
      const testLines = [
        ...fakeLines,
        { formula: "P", depth: 1, rule: "assumption", refs: [] },
        { formula: "S", depth: 1, rule: "assumption", refs: [] },
        { formula: "Q ∧ ¬Q", depth: 1, rule: "contradiction", refs: [1, 1] },
      ]
      const currLine = { formula: "¬P", depth: 0, rule: "¬I", refs: [2, 4] }
      assert.throws(() => validator.checkNotIntro(testLines, currLine, 5))
    })

    it("Accepts the same shape without the sibling", () => {
      const testLines = [
        ...fakeLines,
        { formula: "P", depth: 1, rule: "assumption", refs: [] },
        { formula: "Q ∧ ¬Q", depth: 1, rule: "contradiction", refs: [1, 1] },
      ]
      const currLine = { formula: "¬P", depth: 0, rule: "¬I", refs: [2, 3] }
      assert.doesNotThrow(() => validator.checkNotIntro(testLines, currLine, 4))
    })
  })
  describe("checkOrElim", () => {
    it("Rejects when a third sibling opens inside the second box", () => {
      const testLines = [
        { formula: "P ∨ Q", depth: 0, rule: "premise", refs: [] },
        { formula: "P", depth: 1, rule: "assumption", refs: [] },
        { formula: "R", depth: 1, rule: "reiteration", refs: [0] },
        { formula: "Q", depth: 1, rule: "assumption", refs: [] },
        { formula: "S", depth: 1, rule: "assumption", refs: [] },
        { formula: "R", depth: 1, rule: "reiteration", refs: [0] },
      ]
      const currLine = {
        formula: "R",
        depth: 0,
        rule: "∨E",
        refs: [0, 1, 2, 3, 5],
      }
      assert.throws(() => validator.checkOrElim(testLines, currLine, 6))
    })

    it("Accepts genuine sibling boxes", () => {
      const testLines = [
        { formula: "P ∨ Q", depth: 0, rule: "premise", refs: [] },
        { formula: "P", depth: 1, rule: "assumption", refs: [] },
        { formula: "R", depth: 1, rule: "reiteration", refs: [0] },
        { formula: "Q", depth: 1, rule: "assumption", refs: [] },
        { formula: "R", depth: 1, rule: "reiteration", refs: [0] },
      ]
      const currLine = {
        formula: "R",
        depth: 0,
        rule: "∨E",
        refs: [0, 1, 2, 3, 4],
      }
      assert.doesNotThrow(() => validator.checkOrElim(testLines, currLine, 5))
    })
  })
  describe("checkBicondIntro", () => {
    it("Works when correct", () => {
      const testLines = [
        { formula: "P → Q", depth: 0, rule: "premise", refs: [] },
        { formula: "Q → P", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "Q ↔ P", depth: 0, rule: "↔I", refs: [0, 1] }
      assert.doesNotThrow(() => validator.checkBicondIntro(testLines, currLine))
    })
    it("Throws if only one way is referenced", () => {
      const testLines = [
        { formula: "P → Q", depth: 0, rule: "premise", refs: [] },
        { formula: "P → Q", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "Q ↔ P", depth: 0, rule: "↔I", refs: [0, 1] }
      assert.throws(() => validator.checkBicondIntro(testLines, currLine))
    })
    it("Throws if only one is implication", () => {
      const testLines = [
        { formula: "P → Q", depth: 0, rule: "premise", refs: [] },
        { formula: "P", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = { formula: "Q ↔ P", depth: 0, rule: "↔I", refs: [0, 1] }
      assert.throws(() => validator.checkBicondIntro(testLines, currLine))
    })
    it("Throws if referenced lines dont have same formulas", () => {
      const testLines = [
        { formula: "(A → B) → Q", depth: 0, rule: "premise", refs: [] },
        { formula: "Q → (B → A)", depth: 0, rule: "premise", refs: [] },
      ]
      const currLine = {
        formula: "Q ↔ (A → B)",
        depth: 0,
        rule: "↔I",
        refs: [0, 1],
      }
      assert.throws(() => validator.checkBicondIntro(testLines, currLine))
    })
  })
})
