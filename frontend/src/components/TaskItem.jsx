import { useState, useEffect } from "react"
import { answerService } from "../services/answerService"
import { UseField } from "../hooks"
import useUserStore, { useUserActions } from "../store"

const TaskItem = ({ task }) => {
  const token = useUserStore((state) => state.token)
  const { addAnswer } = useUserActions()
  const { reset, ...answerInput } = UseField("text")
  const [feedback, setFeedback] = useState(null)
  const allAnswers = useUserStore((state) => state.answers)
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  useEffect(() => {
    const lastSavedAnswer = savedAnswer?.submitted_answer
    if (savedAnswer && answerInput.value !== lastSavedAnswer) {
      setFeedback({
        correct: savedAnswer.is_correct,
        text: savedAnswer.is_correct ? "Pass" : "Fail",
      })
      answerInput.onChange({ target: { value: savedAnswer.submitted_answer } })
    }
  }, [task.id, savedAnswer])

  const submitAnswer = async (event) => {
    event.preventDefault()
    try {
      const responseData = await answerService.submit(
        task.id,
        answerInput.value,
      )
      addAnswer(task.id, answerInput.value, responseData.correct)
      setFeedback({
        correct: responseData.correct,
        text: responseData.correct ? "Pass" : "Fail",
      })
    } catch (error) {
      console.log("Failed to submit answer:", error.message)

      if (error.response && error.response.status === 422) {
        setFeedback({
          correct: false,
          text: "Error in syntax",
        })
      } else {
        setFeedback({
          correct: false,
          text: "Server failed to evaluate answer",
        })
      }
    }
  }

  return (
    <div className="task-card">
      <h3>{task.question}</h3>
      <form onSubmit={submitAnswer}>
        <input {...answerInput} className="bg-white text-black" />
        <button
          type="submit"
          className="border-black border-2 rounded hover:bg-green-700"
        >
          {" "}
          Submit Answer{" "}
        </button>
      </form>
      {feedback && (
        <p
          style={{
            color: feedback.text.includes("Pass") ? "#16a34a" : "#dc2626",
            fontSize: "1.4rem",
          }}
        >
          {" "}
          {feedback.text} {feedback.text.includes("Pass") ? " ✓ " : " ✗ "}
        </p>
      )}
    </div>
  )
}

export default TaskItem
