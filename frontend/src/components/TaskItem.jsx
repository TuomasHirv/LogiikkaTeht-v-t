import { useState, useEffect } from "react"
import { UseField } from "../hooks"

const TaskItem = ({ task }) => {
  const { reset, ...answerInput } = UseField("text")
  const [feedback, setFeedback] = useState(null)
  const submitAnswer = async (event) => {
    event.preventDefault()
    try {
      console.log(task.id)
      const response = await fetch(
        `http://localhost:5000/api/answers/${task.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: answerInput.value }),
        },
      )
      const data = await response.json()
      if (response.status === 422) {
        setFeedback({ correct: false, text: "Error in syntax" })
      } else {
        setFeedback({
          correct: data.correct,
          text: data.correct ? "Pass" : "Fail",
        })
      }
    } catch (error) {
      console.log("Failed to submit answer:", error.message)
      setFeedback({ correct: false, text: "Server failed to evaluate answer" })
    }
  }

  return (
    <div className="task-card">
      <h3>{task.question}</h3>
      <form onSubmit={submitAnswer}>
        <input {...answerInput} />
        <button type="submit"> Submit Answer </button>
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
