// This file is AI-coded
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

import TaskItem from "../tasks/TaskItem"
import useUserStore from "../../store"
import * as submitAnswerModule from "../../hooks/submitAnswer"
import * as useTaskHooksModule from "../../hooks/useTaskHooks"

vi.mock("../AnswerFeedback", () => ({ default: vi.fn(() => null) }))
import AnswerFeedback from "../AnswerFeedback"

const task = {
  id: "task-1",
  question: "Kuu on juustoa ja Aurinko palaa.",
  metadata: { definitions: ["K = Kuu on juustoa", "A = Aurinko palaa"] },
  moduleName: "words-to-propositions",
}

const initialStoreState = useUserStore.getState()

beforeEach(() => {
  useUserStore.setState(initialStoreState, true)
  vi.restoreAllMocks()
  AnswerFeedback.mockClear()
})

describe("TaskItem", () => {
  describe("renders the task's question and instructions", () => {
    it("shows the question as a heading", () => {
      render(<TaskItem task={task} />)
      expect(
        screen.getByRole("heading", { name: task.question }),
      ).toBeInTheDocument()
    })

    it("lists the definitions from metadata", () => {
      render(<TaskItem task={task} />)
      task.metadata.definitions.forEach((def) => {
        expect(screen.getByText(def)).toBeInTheDocument()
      })
    })

    it("renders no definition items when metadata has none", () => {
      render(<TaskItem task={{ ...task, metadata: {} }} />)
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument()
    })
  })

  describe("sends correct data to useLastSavedAnswer", () => {
    it("passes the task, saved answer, current value and working callbacks", () => {
      const spy = vi.spyOn(useTaskHooksModule, "useLastSavedAnswer")

      render(<TaskItem task={task} />)

      expect(spy).toHaveBeenCalledTimes(1)
      const call = spy.mock.calls[0][0]
      expect(call.task).toBe(task)
      expect(call.savedAnswer).toBeUndefined()
      expect(call.currAnswer).toBe("")
      expect(typeof call.setFeedback).toBe("function")
      expect(typeof call.applyAnswer).toBe("function")
      expect(call.parseAnswer("K ∧ A")).toEqual({ target: { value: "K ∧ A" } })
    })
  })

  describe("restoring a saved answer", () => {
    it("fills the input and shows feedback when the store has a saved answer", () => {
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: "K ∧ A",
            is_correct: true,
            feedback: "Pass",
            module_name: task.moduleName,
          },
        },
      })

      render(<TaskItem task={task} />)

      expect(screen.getByRole("textbox")).toHaveValue("K ∧ A")
      expect(AnswerFeedback).toHaveBeenLastCalledWith(
        { feedback: { correct: true, feedback: "Pass" } },
        undefined,
      )
    })

    it("leaves the input empty when the store has no saved answer", () => {
      render(<TaskItem task={task} />)

      expect(screen.getByRole("textbox")).toHaveValue("")
      expect(AnswerFeedback).toHaveBeenLastCalledWith(
        { feedback: null },
        undefined,
      )
    })
  })

  describe("submitting an answer", () => {
    it("sends the typed answer, taskId, addAnswer and moduleName to submitTaskAnswer", async () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      const submitSpy = vi
        .spyOn(submitAnswerModule, "submitTaskAnswer")
        .mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<TaskItem task={task} />)
      await user.type(screen.getByRole("textbox"), "K ∧ A")
      await user.click(screen.getByRole("button", { name: /submit answer/i }))

      expect(submitSpy).toHaveBeenCalledTimes(1)
      const call = submitSpy.mock.calls[0][0]
      expect(call.taskId).toBe(task.id)
      expect(call.submittedAnswer).toBe("K ∧ A")
      expect(call.moduleName).toBe(task.moduleName)
      expect(call.addAnswer).toBe(useUserStore.getState().actions.addAnswer)
      expect(typeof call.setFeedback).toBe("function")
    })
    it("Doesn't show a submit button when not logged in", () => {
      render(<TaskItem task={task} />)
      expect(screen.queryByRole("button", { name: "Submit" })).toBeNull()
    })
    it("Shows submit button when logged in", () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      render(<TaskItem task={task} />)
      expect(screen.queryByRole("button", { name: "Submit" }))
    })
  })
})
