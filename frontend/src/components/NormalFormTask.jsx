import { useEffect, useState } from "react"
import TruthTable from "./TruthTable"
import PreSetSubFormula from "./PreSetSubformula"
import { UseField } from "../hooks"
import { buildSavedAnswerFeedback } from "../hooks/savedAnswer"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import AnswerFeedback from "./AnswerFeedback"
import useUserStore, { useUserActions } from "../store"

const NormalFormTask = ({ task }) => {
  const taskId = task.id
  const { addAnswer } = useUserActions()
  const savedAnswer = useUserStore((state) => state.answers[taskId])
  const normalFormInput = UseField("text")
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const lastSavedAnswer = savedAnswer?.submitted_answer
    const savedFeedback = buildSavedAnswerFeedback(savedAnswer)

    if (
      !savedFeedback ||
      typeof lastSavedAnswer !== "string" ||
      normalFormInput.value === lastSavedAnswer
    ) {
      return
    }

    setFeedback(savedFeedback)
    normalFormInput.inputProps.onChange({ target: { value: lastSavedAnswer } })
  }, [taskId, savedAnswer])

  const submitAnswer = async (event) => {
    await submitTaskAnswer({
      event,
      taskId,
      submittedAnswer: normalFormInput.value,
      addAnswer,
      setFeedback,
      moduleName: task.moduleName,
    })
  }

  return (
    <div className=" overflow-y-auto">
      <div className="border border-black  p-3">
        <PreSetSubFormula text={task.question} />
      </div>
      <div className="pr-9 pb-9 border-2 border-dotted w-fit rounded ">
        <TruthTable
          task={task}
          start={task.metadata.start}
          showSubmitButton={false}
        />
      </div>
      {task?.metadata?.end_goal && (
        <div className="border border-dotted border-black rounded text-black w-fit mb-2 px-2 py-1">
          {task.metadata.end_goal}
        </div>
      )}
      <form onSubmit={submitAnswer} className="flex items-center gap-2">
        <input
          {...normalFormInput.inputProps}
          className="bg-white text-black border-black border rounded px-3 py-2 text-lg min-w-md"
        />
        <button
          type="submit"
          className="border-black border-2 rounded bg-green-700 hover:bg-green-400 text-black px-2 py-1"
        >
          Submit answer
        </button>
      </form>
      <AnswerFeedback feedback={feedback} />
    </div>
  )
}

export default NormalFormTask
