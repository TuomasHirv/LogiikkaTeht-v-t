// This file is AI-coded
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

import SubFormulaTask from "../SubFormulaTask"
import useUserStore from "../../store"
import * as submitAnswerModule from "../../hooks/submitAnswer"
import * as useTaskHooksModule from "../../hooks/useTaskHooks"

vi.mock("../AnswerFeedback", () => ({ default: vi.fn(() => null) }))
import AnswerFeedback from "../AnswerFeedback"

const task = {
  id: "sub-1",
  question: "P ∨ ¬Q",
  moduleName: "subformula",
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

describe("SubFormulaTask", () => {
  describe("renders the task's question", () => {
    it("shows the question as the tree root", () => {
      render(<SubFormulaTask task={task} />)
      expect(getQuestionParagraph()).toBeInTheDocument()
    })
  })

  describe("sends correct data to useLastSavedAnswer", () => {
    it("passes the task, saved answer, current root and working callbacks", () => {
      const spy = vi.spyOn(useTaskHooksModule, "useLastSavedAnswer")

      render(<SubFormulaTask task={task} />)

      expect(spy).toHaveBeenCalledTimes(1)
      const call = spy.mock.calls[0][0]
      expect(call.task).toBe(task)
      expect(call.savedAnswer).toBeUndefined()
      expect(call.currAnswer).toEqual({
        text: task.question,
        locked: true,
        children: null,
      })
      expect(typeof call.applyAnswer).toBe("function")
      const tree = { text: "P", locked: true, children: null }
      expect(call.parseAnswer(tree)).toBe(tree)
    })
  })

  describe("restoring a saved answer", () => {
    it("shows the restored tree and feedback when the store has a saved answer", () => {
      const savedTree = {
        text: "P ∨ ¬Q",
        locked: true,
        children: [
          { text: "P", locked: true, children: null },
          { text: "¬Q", locked: true, children: null },
        ],
      }
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: savedTree,
            is_correct: false,
            feedback: "Wrong branch",
            module_name: task.moduleName,
          },
        },
      })

      render(<SubFormulaTask task={task} />)

      expect(screen.getByText("P")).toBeInTheDocument()
      expect(AnswerFeedback).toHaveBeenLastCalledWith(
        { feedback: { correct: false, feedback: "Wrong branch" } },
        undefined,
      )
    })

    it("shows only the unsplit question when the store has no saved answer", () => {
      render(<SubFormulaTask task={task} />)

      expect(screen.queryByText("P")).not.toBeInTheDocument()
    })
  })

  describe("submitting an answer", () => {
    it("sends the current root and taskId to submitTaskAnswer, without a moduleName", async () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      const submitSpy = vi
        .spyOn(submitAnswerModule, "submitTaskAnswer")
        .mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<SubFormulaTask task={task} />)
      await user.click(screen.getByRole("button", { name: /submit answer/i }))

      expect(submitSpy).toHaveBeenCalledTimes(1)
      const call = submitSpy.mock.calls[0][0]
      expect(call.taskId).toBe(task.id)
      expect(call.submittedAnswer).toEqual({
        text: task.question,
        locked: true,
        children: null,
      })
      expect(call.addAnswer).toBe(useUserStore.getState().actions.addAnswer)
      expect(call.moduleName).toBeUndefined()
    })
    it("Doesn't show a submit button when not logged in", () => {
      render(<SubFormulaTask task={task} />)
      expect(screen.queryByRole("button", { name: "Submit" })).toBeNull()
    })
    it("Shows submit button when logged in", () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      render(<SubFormulaTask task={task} />)
      expect(screen.queryByRole("button", { name: "Submit" }))
    })
  })
})
