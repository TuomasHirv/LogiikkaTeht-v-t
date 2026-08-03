import { useState } from "react"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import { useLastSavedAnswer } from "../hooks/useTaskHooks"

import AnswerFeedback from "./AnswerFeedback"
import useUserStore, { useUserActions } from "../store"

const MultipleChoiseTask = ({ task }) => {
  const { addAnswer } = useUserActions()
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState(null)
  const user = useUserStore((state) => state.user)
  const savedAnswer = useUserStore((state) => state.answers[task.id])

  const parseAnswer = (x) => x
  useLastSavedAnswer({
    task: task,
    savedAnswer: savedAnswer,
    currAnswer: answer,
    setFeedback: setFeedback,
    applyAnswer: setAnswer,
    parseAnswer,
  })

  const submitAnswer = async (event, submitted) => {
    if (user) {
      await submitTaskAnswer({
        event,
        taskId: task.id,
        submittedAnswer: submitted,
        addAnswer,
        setFeedback,
        moduleName: task.moduleName,
      })
    } else {
      setFeedback({
        correct: false,
        feeback: "You need to be logged to submit!",
      })
    }
  }
  return (
    <div className="task-card">
      <h3 className="text-2xl">{task.question}</h3>
      <div className="flex gap-2 py-1 px-1">
        {task?.metadata?.choises.map((choise, index) => (
          <button
            key={index}
            onClick={(event) => {
              setAnswer(choise)
              submitAnswer(event, choise)
            }}
            className={`border-2 rounded hover:bg-green-500 ${
              answer === choise && feedback?.correct ? "bg-green-500" : ""
            }`}
          >
            {choise}
          </button>
        ))}
      </div>
      <AnswerFeedback feedback={feedback} />
    </div>
  )
}

export default MultipleChoiseTask
