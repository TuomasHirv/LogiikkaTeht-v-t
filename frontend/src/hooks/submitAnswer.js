import { answerService } from "../services/answerService"
import { createPassFailFeedback } from "./savedAnswer"

const buildSubmissionErrorFeedback = (error) => {
  if (error.response && error.response.status === 422) {
    return {
      correct: false,
      text: "Error in syntax",
    }
  }

  return {
    correct: false,
    text: "Server failed to evaluate answer",
  }
}

export const submitTaskAnswer = async ({
  event,
  taskId,
  submittedAnswer,
  addAnswer,
  setFeedback,
  moduleName,
}) => {
  event?.preventDefault()
  try {
    const responseData = await answerService.submit(taskId, submittedAnswer)
    addAnswer(taskId, submittedAnswer, responseData.correct, moduleName)
    setFeedback(createPassFailFeedback(responseData.correct))
  } catch (error) {
    console.log("Failed to submit answer:", error.message)
    setFeedback(buildSubmissionErrorFeedback(error))
  }
}
