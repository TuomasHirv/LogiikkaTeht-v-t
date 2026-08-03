import React from "react"
import { useState } from "react"
import { useNaturalDeductionField } from "../hooks"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import useUserStore, { useUserActions } from "../store"
import { useLineList } from "../hooks/lineList"
import { NATURALDEDUCTION_LINE_LIMITS } from "../constants"
import { useLastSavedAnswer } from "../hooks/useTaskHooks"
import AnswerFeedback from "./AnswerFeedback"
import Line from "./Line"

const NaturalDeductionTask = ({ task }) => {
  const { addAnswer } = useUserActions()
  const [feedback, setFeedback] = useState(null)
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  const user = useUserStore((state) => state.user)
  const { ...clauses } = useLineList([""], NATURALDEDUCTION_LINE_LIMITS)

  const parseAnswer = (x) => x
  useLastSavedAnswer({
    task,
    savedAnswer,
    currAnswer: clauses.lines,
    setFeedback,
    applyAnswer: clauses.setLines,
    parseAnswer,
  })

  const submitAnswer = async (event) => {
    if (!task.id) {
      return
    }
    const answer = clauses.lines.filter((cl) => cl.trim() !== "")
    if (answer.length > NATURALDEDUCTION_LINE_LIMITS.max) {
      setFeedback({ correct: false, feedback: "input is too long" })
      return
    }
    if (answer.length < NATURALDEDUCTION_LINE_LIMITS.min) {
      setFeedback({ correct: false, feedback: "input is too short" })
      return
    }
    await submitTaskAnswer({
      event,
      taskId: task.id,
      submittedAnswer: answer,
      addAnswer,
      setFeedback,
      moduleName: task.moduleName,
    })
  }

  return (
    <div>
      <div className=" rounded text-xl w-fit">Prove: {task?.question}</div>
      <div className="border-dotted border-2 rounded text-black w-fit flex gap-10">
        <p> PREMISES: </p>
        {task?.metadata?.premises.map((premise, index) => (
          <li key={index}>{premise}</li>
        ))}
      </div>
      <div className="relative w-full max-w-3xl">
        <div className="grid border border-black">
          {clauses.lines.map((cl, index) => (
            <React.Fragment key={index}>
              <Line
                initValue={cl}
                index={index}
                change={clauses.change}
                validateSyntax={true}
                disableFirstLine={false}
                fieldType={useNaturalDeductionField}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="flex">
          {clauses.lines.length < NATURALDEDUCTION_LINE_LIMITS.max && (
            <button
              onClick={() => clauses.addRemove(true)}
              className="bg-green-600 text-black border-black border-2 rounded hover:bg-green-400 px-1"
            >
              +
            </button>
          )}
          {clauses.lines.length > NATURALDEDUCTION_LINE_LIMITS.min && (
            <button
              onClick={() => clauses.addRemove(false)}
              className="bg-red-500 text-black border-black border-2 rounded hover:bg-red-400 px-2"
            >
              -
            </button>
          )}
          {user && (
            <div className="text-black ml-auto border-black border-2 rounded bg-green-700 hover:bg-green-400">
              <button onClick={submitAnswer}>Submit</button>
            </div>
          )}
        </div>
      </div>
      <div>
        <AnswerFeedback feedback={feedback} />
      </div>
    </div>
  )
}

export default NaturalDeductionTask
