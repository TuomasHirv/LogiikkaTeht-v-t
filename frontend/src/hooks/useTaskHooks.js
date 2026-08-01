import { useEffect } from "react"
import { buildSavedAnswerFeedback } from "../hooks/savedAnswer"

export const useLastSavedAnswer = ({
  task,
  savedAnswer,
  currAnswer,
  setFeedback,
  applyAnswer,
  parseAnswer,
  enabled = true,
}) => {
  useEffect(() => {
    if (!enabled) {
      return
    }
    const lastSavedAnswer = savedAnswer?.submitted_answer
    const savedFeedback = buildSavedAnswerFeedback(savedAnswer)

    if (!savedFeedback || currAnswer === lastSavedAnswer) {
      return
    }
    setFeedback(savedFeedback)
    applyAnswer(parseAnswer(lastSavedAnswer))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id, savedAnswer, enabled])
}
