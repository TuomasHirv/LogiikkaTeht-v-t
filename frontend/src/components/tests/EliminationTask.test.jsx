// This file is AI-coded
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

import EliminationTask from "../EliminationTask"
import useUserStore from "../../store"
import * as submitAnswerModule from "../../hooks/submitAnswer"
import * as useTaskHooksModule from "../../hooks/useTaskHooks"

vi.mock("../AnswerFeedback", () => ({ default: vi.fn(() => null) }))
import AnswerFeedback from "../AnswerFeedback"

const task = {
  id: "elim-1",
  question: "P → Q",
  metadata: { end_goal: "Eliminate the arrow" },
  moduleName: "Equivalence-Rules-Task",
}

const initialStoreState = useUserStore.getState()

beforeEach(() => {
  useUserStore.setState(initialStoreState, true)
  vi.restoreAllMocks()
  AnswerFeedback.mockClear()
})

describe("EliminationTask", () => {
  describe("renders the task's question and instructions", () => {
    it("shows the question as the first, locked line", () => {
      render(<EliminationTask task={task} />)
      expect(screen.getByText(task.question)).toBeInTheDocument()
    })

    it("shows the end goal from metadata", () => {
      render(<EliminationTask task={task} />)
      expect(
        screen.getByText(`Task: ${task.metadata.end_goal}`),
      ).toBeInTheDocument()
    })
  })

  describe("sends correct data to useLastSavedAnswer", () => {
    it("passes the task, saved answer, current lines and working callbacks", () => {
      const spy = vi.spyOn(useTaskHooksModule, "useLastSavedAnswer")

      render(<EliminationTask task={task} />)

      // EliminationTask's own line-reset effect creates a fresh array on
      // mount, which re-renders the component (and so calls the hook again)
      // even though the visible line values don't change - assert on the
      // last call rather than assuming exactly one.
      expect(spy).toHaveBeenCalled()
      const call = spy.mock.calls.at(-1)[0]
      expect(call.task).toBe(task)
      expect(call.savedAnswer).toBeUndefined()
      expect(call.currAnswer).toEqual([task.question, ""])
      expect(typeof call.applyAnswer).toBe("function")
      expect(call.parseAnswer(["a", "b"])).toEqual(["a", "b"])
    })
  })

  describe("restoring a saved answer", () => {
    it("fills the lines and shows feedback when the store has a saved answer", () => {
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: [task.question, "Q"],
            is_correct: true,
            feedback: "Pass",
            module_name: task.moduleName,
          },
        },
      })

      render(<EliminationTask task={task} />)

      expect(screen.getByRole("textbox")).toHaveValue("Q")
      expect(AnswerFeedback).toHaveBeenLastCalledWith(
        { feedback: { correct: true, feedback: "Pass" } },
        undefined,
      )
    })

    it("leaves the second line empty when the store has no saved answer", () => {
      render(<EliminationTask task={task} />)

      expect(screen.getByRole("textbox")).toHaveValue("")
      expect(AnswerFeedback).toHaveBeenLastCalledWith(
        { feedback: null },
        undefined,
      )
    })
  })

  describe("submitting an answer", () => {
    it("sends the completed lines, taskId, addAnswer and moduleName to submitTaskAnswer", async () => {
      const submitSpy = vi
        .spyOn(submitAnswerModule, "submitTaskAnswer")
        .mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<EliminationTask task={task} />)
      const input = screen.getByRole("textbox")
      await user.type(input, "Q")
      await user.tab()
      await user.click(screen.getByRole("button", { name: "Submit" }))

      expect(submitSpy).toHaveBeenCalledTimes(1)
      const call = submitSpy.mock.calls[0][0]
      expect(call.taskId).toBe(task.id)
      expect(call.submittedAnswer).toEqual([task.question, "Q"])
      expect(call.moduleName).toBe(task.moduleName)
      expect(call.addAnswer).toBe(useUserStore.getState().actions.addAnswer)
    })
  })
})
