// This file is AI-coded
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

import NormalFormTask from "../NormalFormTask"
import useUserStore from "../../store"
import * as submitAnswerModule from "../../hooks/submitAnswer"
import * as useTaskHooksModule from "../../hooks/useTaskHooks"

vi.mock("../AnswerFeedback", () => ({ default: vi.fn(() => null) }))
import AnswerFeedback from "../AnswerFeedback"

const task = {
  id: "nf-1",
  question: "(P ∨ Q) ∧ R",
  metadata: { start: ["P", "Q", "R"], end_goal: "Write in DNF" },
  moduleName: "TT-method-Conversion",
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

describe("NormalFormTask", () => {
  describe("renders the task's question and instructions", () => {
    it("shows the question via the preset formula tree", () => {
      render(<NormalFormTask task={task} />)
      expect(getQuestionParagraph()).toBeInTheDocument()
    })

    it("shows the end goal when present", () => {
      render(<NormalFormTask task={task} />)
      expect(screen.getByText(task.metadata.end_goal)).toBeInTheDocument()
    })

    it("renders no end-goal text when metadata has none", () => {
      render(
        <NormalFormTask
          task={{ ...task, metadata: { start: task.metadata.start } }}
        />,
      )
      expect(screen.queryByText(task.metadata.end_goal)).not.toBeInTheDocument()
    })
  })

  describe("sends correct data to useLastSavedAnswer", () => {
    it("passes its own task, saved answer, current value and working callbacks", () => {
      const spy = vi.spyOn(useTaskHooksModule, "useLastSavedAnswer")

      render(<NormalFormTask task={task} />)

      // TruthTable (a child of NormalFormTask) also calls this hook, always
      // with enabled: false - find NormalFormTask's own call specifically.
      const ownCall = spy.mock.calls
        .map((call) => call[0])
        .find((args) => args.enabled !== false)

      expect(ownCall).toBeDefined()
      expect(ownCall.task).toBe(task)
      expect(ownCall.savedAnswer).toBeUndefined()
      expect(ownCall.currAnswer).toBe("")
      expect(typeof ownCall.applyAnswer).toBe("function")
      expect(ownCall.parseAnswer("DNF form")).toEqual({
        target: { value: "DNF form" },
      })
    })
  })

  describe("restoring a saved answer", () => {
    it("fills its own input and shows feedback when the store has a saved answer", () => {
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: "(P ∧ R) ∨ (Q ∧ R)",
            is_correct: true,
            feedback: "Pass",
            module_name: task.moduleName,
          },
        },
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })

      render(<NormalFormTask task={task} />)

      const submitButton = screen.getByRole("button", {
        name: /submit answer/i,
      })
      const ownForm = submitButton.closest("form")
      expect(within(ownForm).getByRole("textbox")).toHaveValue(
        "(P ∧ R) ∨ (Q ∧ R)",
      )
      expect(AnswerFeedback).toHaveBeenCalledWith(
        { feedback: { correct: true, feedback: "Pass" } },
        undefined,
      )
    })

    it("leaves its own input empty when the store has no saved answer", () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      render(<NormalFormTask task={task} />)

      const submitButton = screen.getByRole("button", {
        name: /submit answer/i,
      })
      const ownForm = submitButton.closest("form")
      expect(within(ownForm).getByRole("textbox")).toHaveValue("")
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

      render(<NormalFormTask task={task} />)
      const submitButton = screen.getByRole("button", {
        name: /submit answer/i,
      })
      const ownForm = submitButton.closest("form")
      await user.type(within(ownForm).getByRole("textbox"), "P ∨ Q")
      await user.click(submitButton)

      expect(submitSpy).toHaveBeenCalledTimes(1)
      const call = submitSpy.mock.calls[0][0]
      expect(call.taskId).toBe(task.id)
      expect(call.submittedAnswer).toBe("P ∨ Q")
      expect(call.moduleName).toBe(task.moduleName)
      expect(call.addAnswer).toBe(useUserStore.getState().actions.addAnswer)
    })
    it("Doesn't show a submit button when not logged in", () => {
      render(<NormalFormTask task={task} />)
      expect(screen.queryByRole("button", { name: "Submit" })).toBeNull()
    })
    it("Shows submit button when logged in", () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      render(<NormalFormTask task={task} />)
      expect(screen.queryByRole("button", { name: "Submit" }))
    })
  })
})
