// This file is AI-coded
import { beforeEach, describe, expect, it, vi } from "vitest"

import { answerService } from "../../services/answerService"
import { createPassFailFeedback } from "../savedAnswer"
import { submitTaskAnswer } from "../submitAnswer"

vi.mock("../../services/answerService", () => ({
  answerService: {
    submit: vi.fn(),
  },
}))

vi.mock("../savedAnswer", () => ({
  createPassFailFeedback: vi.fn(),
}))

const buildArgs = (overrides = {}) => ({
  event: { preventDefault: vi.fn() },
  taskId: 7,
  submittedAnswer: "{A, B} (assumption)",
  addAnswer: vi.fn(),
  setFeedback: vi.fn(),
  moduleName: "resolution",
  ...overrides,
})

describe("SubmitAnswer", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Successful submit", () => {
    it("submits the task id and the answer", async () => {
      answerService.submit.mockResolvedValue({ correct: true, feedback: "Ok" })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(answerService.submit).toHaveBeenCalledTimes(1)
      expect(answerService.submit).toHaveBeenCalledWith(
        7,
        "{A, B} (assumption)",
      )
    })
    it("prevents the default event action", async () => {
      answerService.submit.mockResolvedValue({ correct: true, feedback: "Ok" })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.event.preventDefault).toHaveBeenCalledTimes(1)
    })
    it("works without an event", async () => {
      answerService.submit.mockResolvedValue({ correct: true, feedback: "Ok" })
      const args = buildArgs({ event: undefined })

      await submitTaskAnswer(args)

      expect(answerService.submit).toHaveBeenCalledTimes(1)
      expect(args.setFeedback).toHaveBeenCalledTimes(1)
    })
    it("adds the answer with the response values", async () => {
      answerService.submit.mockResolvedValue({
        correct: true,
        feedback: "Correct!",
      })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.addAnswer).toHaveBeenCalledTimes(1)
      expect(args.addAnswer).toHaveBeenCalledWith(
        7,
        "{A, B} (assumption)",
        true,
        "Correct!",
        "resolution",
      )
    })
    it("adds the answer also when the response says it's wrong", async () => {
      answerService.submit.mockResolvedValue({
        correct: false,
        feedback: "Wrong line",
      })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.addAnswer).toHaveBeenCalledWith(
        7,
        "{A, B} (assumption)",
        false,
        "Wrong line",
        "resolution",
      )
    })
    it("builds the feedback from the response values", async () => {
      answerService.submit.mockResolvedValue({
        correct: true,
        feedback: "Correct!",
        extra: "ignored",
      })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(createPassFailFeedback).toHaveBeenCalledTimes(1)
      expect(createPassFailFeedback).toHaveBeenCalledWith({
        correct: true,
        feedback: "Correct!",
      })
    })
    it("sets the feedback that was built", async () => {
      answerService.submit.mockResolvedValue({
        correct: true,
        feedback: "Correct!",
      })
      createPassFailFeedback.mockReturnValue({
        correct: true,
        feedback: "Correct!",
      })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.setFeedback).toHaveBeenCalledTimes(1)
      expect(args.setFeedback).toHaveBeenCalledWith({
        correct: true,
        feedback: "Correct!",
      })
    })
    it("adds the answer before setting the feedback", async () => {
      answerService.submit.mockResolvedValue({ correct: true, feedback: "Ok" })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.addAnswer.mock.invocationCallOrder[0]).toBeLessThan(
        args.setFeedback.mock.invocationCallOrder[0],
      )
    })
  })

  describe("Failing submit", () => {
    it("sets a syntax error feedback on status 422", async () => {
      answerService.submit.mockRejectedValue({ response: { status: 422 } })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.setFeedback).toHaveBeenCalledTimes(1)
      expect(args.setFeedback).toHaveBeenCalledWith({
        correct: false,
        feedback: "Error in syntax",
      })
    })
    it("sets a server error feedback on other statuses", async () => {
      answerService.submit.mockRejectedValue({ response: { status: 500 } })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.setFeedback).toHaveBeenCalledWith({
        correct: false,
        feedback: "Server failed to evaluate answer",
      })
    })
    it("sets a server error feedback without a response", async () => {
      answerService.submit.mockRejectedValue(new Error("Network Error"))
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.setFeedback).toHaveBeenCalledWith({
        correct: false,
        feedback: "Server failed to evaluate answer",
      })
    })
    it("doesn't add the answer when the submit fails", async () => {
      answerService.submit.mockRejectedValue({ response: { status: 422 } })
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.addAnswer).not.toHaveBeenCalled()
      expect(createPassFailFeedback).not.toHaveBeenCalled()
    })
    it("doesn't throw when the submit fails", async () => {
      answerService.submit.mockRejectedValue(new Error("Network Error"))

      await expect(submitTaskAnswer(buildArgs())).resolves.toBeUndefined()
    })
    it("catches a failing addAnswer", async () => {
      answerService.submit.mockResolvedValue({ correct: true, feedback: "Ok" })
      const args = buildArgs({
        addAnswer: vi.fn(() => {
          throw new Error("Store is broken")
        }),
      })

      await submitTaskAnswer(args)

      expect(args.setFeedback).toHaveBeenCalledTimes(1)
      expect(args.setFeedback).toHaveBeenCalledWith({
        correct: false,
        feedback: "Server failed to evaluate answer",
      })
    })
    it("catches an empty response", async () => {
      answerService.submit.mockResolvedValue(null)
      const args = buildArgs()

      await submitTaskAnswer(args)

      expect(args.addAnswer).not.toHaveBeenCalled()
      expect(args.setFeedback).toHaveBeenCalledWith({
        correct: false,
        feedback: "Server failed to evaluate answer",
      })
    })
  })
})
