import { useEffect } from "react"
import { buildSavedAnswerFeedback } from "../hooks/savedAnswer"

export const useLastSavedAnswer = (
  task,
  savedAnswer,
  currAnswer,
  setFeedback,
  applyAnswer,
  parseAnswer,
) => {
  useEffect(() => {
    const lastSavedAnswer = savedAnswer?.submitted_answer
    const savedFeedback = buildSavedAnswerFeedback(savedAnswer)

    if (!savedFeedback || currAnswer === lastSavedAnswer) {
      return
    }
    setFeedback(savedFeedback)
    applyAnswer(parseAnswer(lastSavedAnswer))
  }, [task.id, savedAnswer])
}
