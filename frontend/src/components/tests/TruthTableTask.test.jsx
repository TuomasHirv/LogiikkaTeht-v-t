// This file is AI-coded
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

import TruthTableTask from "../tasks/TruthTableTask"
import useUserStore from "../../store"
import * as submitAnswerModule from "../../hooks/submitAnswer"

vi.mock("../AnswerFeedback", () => ({ default: vi.fn(() => null) }))
import AnswerFeedback from "../AnswerFeedback"

const task = {
  id: "tt-1",
  question: "¬P ∨ Q",
  metadata: { start: ["P", "Q"] },
  moduleName: "Truth-Table-Task",
}

const initialStoreState = useUserStore.getState()

beforeEach(() => {
  useUserStore.setState(initialStoreState, true)
  vi.restoreAllMocks()
  AnswerFeedback.mockClear()
})

const getQuestionParagraph = () =>
  screen.getByText(
    (_, element) =>
      element?.tagName.toLowerCase() === "p" &&
      element.textContent === task.question,
  )

// TruthTableTask never calls useLastSavedAnswer/submitTaskAnswer/AnswerFeedback
// itself - those live one level down in the TruthTable/PreSetSubFormula
// children it renders. These tests verify what TruthTableTask actually
// controls: that it wires the right task/start/question through to those
// children, using the real (unmocked) child components so restore/submit
// behavior is exercised end to end.
describe("TruthTableTask", () => {
  describe("renders the task's question", () => {
    it("shows the question via the preset formula tree", () => {
      render(<TruthTableTask task={task} />)
      expect(getQuestionParagraph()).toBeInTheDocument()
    })
  })

  describe("restoring a saved answer", () => {
    it("fills the grid and shows feedback when the store has a saved answer", () => {
      const savedTable = [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
      ]
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: savedTable,
            is_correct: true,
            feedback: "Pass",
            module_name: task.moduleName,
          },
        },
      })

      render(<TruthTableTask task={task} />)

      const values = screen.getAllByRole("textbox").map((input) => input.value)
      expect(values).toEqual(savedTable.flat())
      expect(AnswerFeedback).toHaveBeenLastCalledWith(
        { feedback: { correct: true, feedback: "Pass" } },
        undefined,
      )
    })

    it("shows an empty grid when the store has no saved answer", () => {
      render(<TruthTableTask task={task} />)

      const values = screen.getAllByRole("textbox").map((input) => input.value)
      expect(values).toEqual(["P", "", "", "", "", "Q", "", "", "", ""])
    })
  })

  describe("submitting an answer", () => {
    it("sends the grid, taskId, addAnswer and moduleName to submitTaskAnswer", async () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      const submitSpy = vi
        .spyOn(submitAnswerModule, "submitTaskAnswer")
        .mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<TruthTableTask task={task} />)
      await user.click(screen.getByRole("button", { name: "Submit" }))

      expect(submitSpy).toHaveBeenCalledTimes(1)
      const call = submitSpy.mock.calls[0][0]
      expect(call.taskId).toBe(task.id)
      expect(call.submittedAnswer).toEqual([
        ["P", "", "", "", ""],
        ["Q", "", "", "", ""],
      ])
      expect(call.moduleName).toBe(task.moduleName)
      expect(call.addAnswer).toBe(useUserStore.getState().actions.addAnswer)
    })
    it("Doesn't show a submit button when not logged in", () => {
      render(<TruthTableTask task={task} />)
      expect(screen.queryByRole("button", { name: "Submit" })).toBeNull()
    })
    it("Shows submit button when logged in", () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      render(<TruthTableTask task={task} />)
      expect(screen.queryByRole("button", { name: "Submit" }))
    })
  })
})
