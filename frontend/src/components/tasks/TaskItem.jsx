import { useState } from "react"
import { useField } from "../../hooks"
import { submitTaskAnswer } from "../../hooks/submitAnswer"
import { useLastSavedAnswer } from "../../hooks/useTaskHooks"

import AnswerFeedback from "../AnswerFeedback"
import useUserStore, { useUserActions } from "../../store"

const TaskItem = ({ task }) => {
  const { addAnswer } = useUserActions()
  const answerInput = useField("text")
  const [feedback, setFeedback] = useState(null)
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  const user = useUserStore((state) => state.user)

  const parseAnswer = (x) => {
    return {
      target: {
        value: x,
      },
    }
  }
  useLastSavedAnswer({
    task: task,
    savedAnswer: savedAnswer,
    currAnswer: answerInput.inputProps.value,
    setFeedback: setFeedback,
    applyAnswer: answerInput.inputProps.onChange,
    parseAnswer,
  })

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
        {user && (
          <button
            type="submit"
            className="border-black border-2 rounded hover:bg-green-700"
          >
            {" "}
            Submit Answer{" "}
          </button>
        )}
      </form>
      <AnswerFeedback feedback={feedback} />
    </div>
  )
}

export default TaskItem
