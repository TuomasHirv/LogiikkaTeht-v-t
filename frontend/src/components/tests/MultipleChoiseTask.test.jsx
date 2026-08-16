import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

import MultipleChoiseTask from "../tasks/MultipleChoiseTask"
import useUserStore from "../../store"
import * as submitAnswerModule from "../../hooks/submitAnswer"

const initialStoreState = useUserStore.getState()

beforeEach(() => {
  useUserStore.setState(initialStoreState, true)
  vi.restoreAllMocks()
})

const task = {
  id: "Fake-id",
  type: "multiple-Choise",
  module_name: "Multiple-Choice-Natural-Deduction",
  question: "Natural deduction unlike other systems is purely mechanical",
  correct_answer: {
    answer: "Incorrect",
    feedback: "Natural deduction is goal-directed.",
  },
  metadata: {
    choises: ["True", "Incorrect", "All systems are purely mechanical"],
  },
}

describe("MultipleChoiseTask", () => {
  describe("renders question and possible options", () => {
    it("renders question", () => {
      render(<MultipleChoiseTask task={task} />)
      expect(screen.getByRole("question")).toBeInTheDocument()
    })
    it("renders choises", () => {
      render(<MultipleChoiseTask task={task} />)
      const buttons = screen.getAllByRole("button")
      expect(buttons.length).toEqual(task.metadata.choises.length)
    })
    it("Doesn't render feedback without any", () => {
      render(<MultipleChoiseTask task={task} />)
      expect(screen.queryByRole("feedback")).not.toBeInTheDocument()
    })
  })
  describe("Restores saved answer", () => {
    it("Renders correct answer with green", () => {
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: "Incorrect",
            is_correct: true,
            feedback: "Pass",
            module_name: task.moduleName,
          },
        },
      })
      render(<MultipleChoiseTask task={task} />)
      expect(screen.getByRole("button", { name: "Incorrect" })).toHaveClass(
        "bg-green-500",
      )
    })
    it("Incorrect answers arent in green", () => {
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: "True",
            is_correct: false,
            feedback: "test",
            module_name: task.moduleName,
          },
        },
      })
      render(<MultipleChoiseTask task={task} />)
      expect(screen.getByRole("button", { name: "True" })).not.toHaveClass(
        "bg-green-500",
      )
    })
    it("Renders answerFeedback", () => {
      useUserStore.setState({
        answers: {
          [task.id]: {
            submitted_answer: "True",
            is_correct: false,
            feedback: "test",
            module_name: task.moduleName,
          },
        },
      })
      render(<MultipleChoiseTask task={task} />)
      expect(screen.getByRole("feedback")).toBeInTheDocument()
    })
  })
  describe("Submits an answer", () => {
    it("Sends the correct information to submitAnswer", async () => {
      useUserStore.setState({
        user: { id: "test", username: "tester" },
        token: "fake-token",
      })
      const submitSpy = vi
        .spyOn(submitAnswerModule, "submitTaskAnswer")
        .mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<MultipleChoiseTask task={task} />)
      await user.click(screen.getByRole("button", { name: /Incorrect/i }))

      expect(submitSpy).toHaveBeenCalledTimes(1)
      const call = submitSpy.mock.calls[0][0]
      expect(call.taskId).toBe(task.id)
      expect(call.submittedAnswer).toBe("Incorrect")
      expect(call.moduleName).toBe(task.moduleName)
      expect(call.addAnswer).toBe(useUserStore.getState().actions.addAnswer)
      expect(typeof call.setFeedback).toBe("function")
    })
    it("Doesn't submit an answer if not logged in", async () => {
      const submitSpy = vi
        .spyOn(submitAnswerModule, "submitTaskAnswer")
        .mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<MultipleChoiseTask task={task} />)
      await user.click(screen.getByRole("button", { name: /Incorrect/i }))

      expect(submitSpy).toHaveBeenCalledTimes(0)
      expect(screen.getByRole("feedback")).toBeInTheDocument()
    })
  })
})
