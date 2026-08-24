import { describe, expect, it } from "vitest"

import {
  buildSavedAnswerFeedback,
  createPassFailFeedback,
  parseSavedEliminationAnswer,
  parseSavedSubFormulaAnswer,
} from "../savedAnswer"

describe("SavedAnswer", () => {
  describe("createPassFailFeedback", () => {
    it("picks correct and feedback from the given object", () => {
      expect(
        createPassFailFeedback({ correct: true, feedback: "Well done" }),
      ).toEqual({ correct: true, feedback: "Well done" })
    })
    it("drops extra fields", () => {
      expect(
        createPassFailFeedback({
          correct: true,
          feedback: "Well done",
          extra: "ignored",
          id: 5,
        }),
      ).toEqual({ correct: true, feedback: "Well done" })
    })
  })

  describe("buildSavedAnswerFeedback", () => {
    it("maps is_correct to correct", () => {
      expect(
        buildSavedAnswerFeedback({ is_correct: true, feedback: "Correct!" }),
      ).toEqual({ correct: true, feedback: "Correct!" })
    })
    it("ignores fields other than is_correct and feedback", () => {
      expect(
        buildSavedAnswerFeedback({
          id: 1,
          exercise_id: 2,
          submitted_answer: "{A, B} (assumption)",
          is_correct: true,
          feedback: "Correct!",
        }),
      ).toEqual({ correct: true, feedback: "Correct!" })
    })
  })

  describe("parseSavedSubFormulaAnswer", () => {
    it("returns null for empty answers", () => {
      expect(parseSavedSubFormulaAnswer(null)).toBe(null)
      expect(parseSavedSubFormulaAnswer(undefined)).toBe(null)
      expect(parseSavedSubFormulaAnswer("")).toBe(null)
    })
    it("returns null for a stringified object", () => {
      expect(parseSavedSubFormulaAnswer("[object Object]")).toBe(null)
      expect(parseSavedSubFormulaAnswer("   [object Object]   ")).toBe(null)
    })
    it("parses a JSON string", () => {
      expect(
        parseSavedSubFormulaAnswer(
          '{"text":"A∧B","locked":false,"children":null}',
        ),
      ).toEqual({ text: "A∧B", locked: false, children: null })
    })
    it("parses nested children from a JSON string", () => {
      expect(
        parseSavedSubFormulaAnswer(
          '{"text":"A∧B","locked":true,"children":[{"text":"A","locked":true,"children":null},{"text":"B","locked":true,"children":null}]}',
        ),
      ).toEqual({
        text: "A∧B",
        locked: true,
        children: [
          { text: "A", locked: true, children: null },
          { text: "B", locked: true, children: null },
        ],
      })
    })
    it("wraps a plain string that isn't JSON", () => {
      expect(parseSavedSubFormulaAnswer("A∧B")).toEqual({
        text: "A∧B",
        locked: true,
        children: null,
      })
    })
    it("returns an object as is", () => {
      const answer = { text: "A∧B", locked: false, children: null }
      expect(parseSavedSubFormulaAnswer(answer)).toEqual(answer)
    })
    it("returns a deep copy of an object", () => {
      const answer = {
        text: "A∧B",
        locked: false,
        children: [{ text: "A", locked: true, children: null }],
      }
      const parsed = parseSavedSubFormulaAnswer(answer)

      expect(parsed).not.toBe(answer)
      expect(parsed.children).not.toBe(answer.children)
      expect(parsed.children[0]).not.toBe(answer.children[0])

      parsed.children[0].text = "changed"
      expect(answer.children[0].text).toBe("A")
    })
  })

  describe("parseSavedEliminationAnswer", () => {
    it("returns null for empty answers", () => {
      expect(parseSavedEliminationAnswer(null)).toBe(null)
      expect(parseSavedEliminationAnswer(undefined)).toBe(null)
      expect(parseSavedEliminationAnswer("")).toBe(null)
    })
    it("parses a JSON array string", () => {
      expect(parseSavedEliminationAnswer('["A∧B","A","B"]')).toEqual([
        "A∧B",
        "A",
        "B",
      ])
    })
    it("returns null for a string that isn't JSON", () => {
      expect(parseSavedEliminationAnswer("A∧B")).toBe(null)
      expect(parseSavedEliminationAnswer("[object Object]")).toBe(null)
      expect(parseSavedEliminationAnswer('["A∧B"')).toBe(null)
    })
    it("returns null for JSON that isn't an array", () => {
      expect(parseSavedEliminationAnswer('{"text":"A∧B"}')).toBe(null)
      expect(parseSavedEliminationAnswer("5")).toBe(null)
      expect(parseSavedEliminationAnswer("true")).toBe(null)
    })
    it("returns null for a non-array value", () => {
      expect(parseSavedEliminationAnswer({ text: "A∧B" })).toBe(null)
      expect(parseSavedEliminationAnswer(5)).toBe(null)
    })
    it("returns an array as is", () => {
      expect(parseSavedEliminationAnswer(["A∧B", "A", "B"])).toEqual([
        "A∧B",
        "A",
        "B",
      ])
    })
    it("drops steps that aren't strings", () => {
      expect(
        parseSavedEliminationAnswer(["A∧B", 5, null, { text: "B" }, "B"]),
      ).toEqual(["A∧B", "B"])
      expect(parseSavedEliminationAnswer('["A∧B",5,null,"B"]')).toEqual([
        "A∧B",
        "B",
      ])
    })
    it("returns a copy of the array", () => {
      const answer = ["A∧B", "A", "B"]
      const parsed = parseSavedEliminationAnswer(answer)

      expect(parsed).not.toBe(answer)

      parsed.push("C")
      expect(answer).toEqual(["A∧B", "A", "B"])
    })
  })
})
