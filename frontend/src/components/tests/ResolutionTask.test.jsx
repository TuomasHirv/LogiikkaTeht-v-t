// This file is AI-coded
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

import ResolutionTask from "../ResolutionTask"
import useUserStore from "../../store"
import * as submitAnswerModule from "../../hooks/submitAnswer"
import * as useTaskHooksModule from "../../hooks/useTaskHooks"

vi.mock("../AnswerFeedback", () => ({ default: vi.fn(() => null) }))
import AnswerFeedback from "../AnswerFeedback"

const task = {
  id: "res-1",
  question: "(P) ∧ (¬P)",
  moduleName: "Resolution-Introduction",
}

const initialStoreState = useUserStore.getState()

beforeEach(() => {
  useUserStore.setState(initialStoreState, true)
  vi.restoreAllMocks()
  AnswerFeedback.mockClear()
})

describe("ResolutionTask", () => {
  describe("renders the task's question and instructions", () => {
    it("shows the question", () => {
      render(<ResolutionTask task={task} />)
      expect(screen.getByText(task.question)).toBeInTheDocument()
    })
  })

  describe("sends correct data to useLastSavedAnswer", () => {
    it("passes the task, saved answer, current lines and working callbacks", () => {
      const spy = vi.spyOn(useTaskHooksModule, "useLastSavedAnswer")

      render(<ResolutionTask task={task} />)

      expect(spy).toHaveBeenCalledTimes(1)
      const call = spy.mock.calls[0][0]
      expect(call.task).toBe(task)
      expect(call.savedAnswer).toBeUndefined()
      expect(call.currAnswer).toEqual([""])
      expect(typeof call.applyAnswer).toBe("function")
      expect(call.parseAnswer(["{P}"])).toEqual(["{P}"])
    })
  })

  describe("restoring a saved answer", () => {
    it("fills the clauses and shows feedback when the store has a saved answer", () => {
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: [
              "{P} (assumption)",
              "{¬P} (assumption)",
              "∅ (lines: 0, 1)",
            ],
            is_correct: true,
            feedback: "Pass",
            module_name: task.moduleName,
          },
        },
      })

      render(<ResolutionTask task={task} />)

      expect(screen.getAllByRole("textbox")).toHaveLength(3)
      expect(screen.getByDisplayValue("{P} (assumption)")).toBeInTheDocument()
      expect(screen.getByDisplayValue("∅ (lines: 0, 1)")).toBeInTheDocument()
      expect(AnswerFeedback).toHaveBeenLastCalledWith(
        { feedback: { correct: true, feedback: "Pass" } },
        undefined,
      )
    })

    it("shows a single empty clause when the store has no saved answer", () => {
      render(<ResolutionTask task={task} />)

      expect(screen.getAllByRole("textbox")).toHaveLength(1)
      expect(screen.getByRole("textbox")).toHaveValue("")
    })
  })

  describe("submitting an answer", () => {
    it("sends the completed clauses, taskId, addAnswer and moduleName to submitTaskAnswer", async () => {
      const submitSpy = vi
        .spyOn(submitAnswerModule, "submitTaskAnswer")
        .mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<ResolutionTask task={task} />)
      await user.click(screen.getByRole("button", { name: "+" }))
      const [firstLine, secondLine] = screen.getAllByRole("textbox")
      // userEvent.type treats { as special key syntax, so a literal { needs
      // escaping by doubling it - a lone } needs no escaping since there's
      // no open descriptor left for it to close.
      await user.type(firstLine, "{{P} (assumption)")
      await user.tab()
      await user.type(secondLine, "{{¬P} (assumption)")
      await user.tab()
      await user.click(screen.getByRole("button", { name: "Submit" }))

      expect(submitSpy).toHaveBeenCalledTimes(1)
      const call = submitSpy.mock.calls[0][0]
      expect(call.taskId).toBe(task.id)
      expect(call.submittedAnswer).toEqual([
        "{P} (assumption)",
        "{¬P} (assumption)",
      ])
      expect(call.moduleName).toBe(task.moduleName)
      expect(call.addAnswer).toBe(useUserStore.getState().actions.addAnswer)
    })

    it("does not call submitTaskAnswer when below the minimum line count", async () => {
      const submitSpy = vi
        .spyOn(submitAnswerModule, "submitTaskAnswer")
        .mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<ResolutionTask task={task} />)
      await user.click(screen.getByRole("button", { name: "Submit" }))

      expect(submitSpy).not.toHaveBeenCalled()
    })
  })
})
