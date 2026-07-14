import { useState, useEffect } from "react"
import { UseField } from "../hooks"
import { buildSavedAnswerFeedback } from "../hooks/savedAnswer"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import AnswerFeedback from "./AnswerFeedback"
import useUserStore, { useUserActions } from "../store"

const TaskItem = ({ task }) => {
  const token = useUserStore((state) => state.token)
  const { addAnswer } = useUserActions()
  const answerInput = UseField("text")
  const [feedback, setFeedback] = useState(null)
  const allAnswers = useUserStore((state) => state.answers)
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  useEffect(() => {
    const lastSavedAnswer = savedAnswer?.submitted_answer
    const savedFeedback = buildSavedAnswerFeedback(savedAnswer)

    if (
      !savedFeedback ||
      typeof lastSavedAnswer !== "string" ||
      answerInput.value === lastSavedAnswer
    ) {
      return
    }

    setFeedback(savedFeedback)
    answerInput.inputProps.onChange({
      target: { value: savedAnswer.submitted_answer },
    })
  }, [task.id, savedAnswer])

  const submitAnswer = async (event) => {
    await submitTaskAnswer({
      event,
      taskId: task.id,
      submittedAnswer: answerInput.inputProps.value,
      addAnswer,
      setFeedback,
      moduleName: task.moduleName,
    })
  }

  return (
    <div className="task-card">
      <h3>{task.question}</h3>
      <div className="border-black border-2 border-dotted w-fit rounded mt-0.5 ">
        {task?.metadata?.definitions &&
          task.metadata.definitions.map((def, index) => (
            <li key={index}>{def}</li>
          ))}
      </div>
      <form onSubmit={submitAnswer}>
        <input {...answerInput.inputProps} className="bg-white text-black" />
        <button
          type="submit"
          className="border-black border-2 rounded hover:bg-green-700"
        >
          {" "}
          Submit Answer{" "}
        </button>
      </form>
      <AnswerFeedback feedback={feedback} />
    </div>
  )
}

export default TaskItem
