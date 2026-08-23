import { describe, expect, it } from "vitest"

import { _forTests } from "../index"

describe("Index", () => {
  describe("Symbol changing", () => {
    it("applyBaseSymbols changes correctly when only the correct text is given", () => {
      expect(_forTests.applyBaseSymbols("not")).toBe("¬")
      expect(_forTests.applyBaseSymbols("ei")).toBe("¬")
      expect(_forTests.applyBaseSymbols("{}")).toBe("∅")
    })
    it("applyBaseSymbols changes correctly with more complicated text", () => {
      expect(_forTests.applyBaseSymbols("A Bs not")).toBe("A Bs ¬")
      expect(_forTests.applyBaseSymbols("A Bs ei")).toBe("A Bs ¬")
      expect(_forTests.applyBaseSymbols("not A B s")).toBe("¬ A B s")
      expect(_forTests.applyBaseSymbols("ei A B s")).toBe("¬ A B s")
      expect(_forTests.applyBaseSymbols("{    }")).toBe("∅")
      expect(_forTests.applyBaseSymbols("asdasd{    }")).toBe("asdasd∅")
    })
    it("applyBaseSymbols doesn't change without space", () => {
      expect(_forTests.applyBaseSymbols("A Bsnot")).toBe("A Bsnot")
      expect(_forTests.applyBaseSymbols("A Bsei")).toBe("A Bsei")
      expect(_forTests.applyBaseSymbols("notA B s")).toBe("notA B s")
      expect(_forTests.applyBaseSymbols("eiA B s")).toBe("eiA B s")
    })
    it("applyFullWordSymbols changes correctly", () => {
      expect(_forTests.applyFullWordSymbols("and")).toBe("∧")
      expect(_forTests.applyFullWordSymbols("or")).toBe("∨")
      expect(_forTests.applyFullWordSymbols("ja")).toBe("∧")
      expect(_forTests.applyFullWordSymbols("tai")).toBe("∨")
      expect(_forTests.applyFullWordSymbols("imply")).toBe("→")
      expect(_forTests.applyFullWordSymbols("siis")).toBe("→")
      expect(_forTests.applyFullWordSymbols("->")).toBe("→")
      expect(_forTests.applyFullWordSymbols("<->")).toBe("↔")
    })
    it("applyFullWordSymbols changes correctly with clutter around", () => {
      expect(_forTests.applyFullWordSymbols("asd and asd")).toBe("asd ∧ asd")
      expect(_forTests.applyFullWordSymbols("asd or asd")).toBe("asd ∨ asd")
      expect(_forTests.applyFullWordSymbols("asd ja asd")).toBe("asd ∧ asd")
      expect(_forTests.applyFullWordSymbols("asd tai asd")).toBe("asd ∨ asd")
      expect(_forTests.applyFullWordSymbols("asd imply asd")).toBe("asd → asd")
      expect(_forTests.applyFullWordSymbols("asd siis asd")).toBe("asd → asd")
      expect(_forTests.applyFullWordSymbols("asd->asd")).toBe("asd→asd")
      expect(_forTests.applyFullWordSymbols("asd<->asd")).toBe("asd↔asd")
    })
    it("applyNaturalDeduction indeting works correctly", () => {
      expect(_forTests.applyNaturalDeduction("+")).toBe("  |")
      expect(_forTests.applyNaturalDeduction("++")).toBe("  |  |")
    })
    it("applyNaturalDeduction indeting works correctly with more complicated text", () => {
      expect(_forTests.applyNaturalDeduction("+testi")).toBe("  |testi")
      expect(_forTests.applyNaturalDeduction("++testi")).toBe("  |  |testi")
    })
  })
  describe("validateResolutionSyntax", () => {
    it("accepts correct", () => {
      expect(_forTests.validateResolutionSyntax("{A, B} (assumption)"), 0).toBe(
        "",
      )
      expect(
        _forTests.validateResolutionSyntax("{¬a, ¬b} (assumption)"),
        0,
      ).toBe("")
      expect(
        _forTests.validateResolutionSyntax("{A, B} (lines: 1, 2)"),
        3,
      ).toBe("")
      expect(_forTests.validateResolutionSyntax("∅ (lines: 1, 2)"), 3).toBe("")
    })
    it("Referenced line can't be equal or before index", () => {
      expect(
        _forTests.validateResolutionSyntax("{A, B} (lines: 1, 2)", 1),
      ).toBe("Can't reference the current line or later lines")
      expect(
        _forTests.validateResolutionSyntax("{A, B} (lines: 1, 2)", 2),
      ).toBe("Can't reference the current line or later lines")
    })
    it("Empty clause can't be an assumption", () => {
      expect(_forTests.validateResolutionSyntax("∅ (assumption)"), 3).toBe(
        "∅ can never be an assumption",
      )
    })
    it("Rejects incorrect clause", () => {
      expect(_forTests.validateResolutionSyntax("A} (assumption)", 0)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      expect(_forTests.validateResolutionSyntax("{A,,} (assumption)", 0)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      expect(_forTests.validateResolutionSyntax("{A}B (assumption)", 0)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      expect(_forTests.validateResolutionSyntax("{A (assumption)", 0)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      expect(_forTests.validateResolutionSyntax("{,A} (assumption)", 0)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
    })
    it("Rejects incorrect justification", () => {
      expect(_forTests.validateResolutionSyntax("{A} (assuon)", 0)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      expect(_forTests.validateResolutionSyntax("{A} (assumption", 0)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      expect(_forTests.validateResolutionSyntax("{A} lines: 1,2", 5)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      expect(_forTests.validateResolutionSyntax("{A} (line: 1, 0)", 0)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      expect(_forTests.validateResolutionSyntax("{A} (lines: 1)", 5)).toBe(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
    })
  })
  describe("validateNaturalDeductionSyntax", () => {
    it("Accepts correct justification", () => {
      expect(_forTests.validateNaturalDeductionSyntax("A (premise)", 0)).toBe(
        "",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("A (assumption)", 0),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I lines: 0,1)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I lines: 0   ,   1)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I line: 0,1)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I lines: 0-1)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I line: 0-1)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax(
          "A (∧I line: 0-1, 1, 2, 4, 5-6)",
          10,
        ),
      ).toBe("")
    })
    it("Accepts correct clause", () => {
      expect(_forTests.validateNaturalDeductionSyntax("A (premise)", 0)).toBe(
        "",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("A (assumption)", 0),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("  |A (assumption)", 0),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("|  |A (assumption)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("¬A (assumption)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("A∧B (assumption)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("(A) (assumption)", 2),
      ).toBe("")
      expect(
        _forTests.validateNaturalDeductionSyntax("(A∧B)∨C (assumption)", 2),
      ).toBe("")
    })
    it("Referenced line can't be equal or before index", () => {
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I line: 1,2)", 1),
      ).toBe("Can't reference the current line or later lines")
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I line: 1,2)", 2),
      ).toBe("Can't reference the current line or later lines")
    })
    it("Rejects incorrect clause", () => {
      expect(
        _forTests.validateNaturalDeductionSyntax("∨ (assumption)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("∨A (assumption)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("¬¬ (assumption)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("{} (assumption)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("AA (assumption)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("AA (assumption)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("A| (assumption)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
    })
    it("Rejects incorrect justification", () => {
      expect(_forTests.validateNaturalDeductionSyntax("A (assuon)", 3)).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I le: 1,2)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(_forTests.validateNaturalDeductionSyntax("A (premise", 0)).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(_forTests.validateNaturalDeductionSyntax("A premise", 0)).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(_forTests.validateNaturalDeductionSyntax("A (∧I lines:)", 3)).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
      expect(
        _forTests.validateNaturalDeductionSyntax("A (∧I lines 1, 2)", 3),
      ).toBe(
        "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')",
      )
    })
  })
})
