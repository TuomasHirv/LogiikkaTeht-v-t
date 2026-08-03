import React from "react"
import { useEffect, useState } from "react"
import { useField } from "../hooks"
import useUserStore, { useUserActions } from "../store"
import AnswerFeedback from "./AnswerFeedback"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import { useLastSavedAnswer } from "../hooks/useTaskHooks"
import Line from "./Line"
import { ELIMINATION_LINE_LIMITS } from "../constants"

import { useLineList } from "../hooks/lineList"

const EliminationTask = ({ task }) => {
  const { addAnswer } = useUserActions()
  const start = task?.question || ""
  const taskId = task?.id
  const savedAnswer = useUserStore((state) => state.answers[taskId])
  const user = useUserStore((state) => state.user)
  const [feedback, setFeedback] = useState(null)
  const { ...propositions } = useLineList([start, ""], ELIMINATION_LINE_LIMITS)

  useEffect(() => {
    function effectFunc() {
      propositions.setLines([start, ""])
      setFeedback(null)
    }
    effectFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, taskId])
  const parseAnswer = (x) => x
  useLastSavedAnswer({
    task,
    savedAnswer,
    currAnswer: propositions.lines,
    setFeedback,
    applyAnswer: propositions.setLines,
    parseAnswer,
  })

  const resetPropositions = () => {
    propositions.setLines([start, ""])
    setFeedback(null)
  }

  const submitAnswer = async (event) => {
    if (!taskId) {
      return
    }
    const answer = propositions.lines.filter((prop) => prop.trim() !== "")
    answer.splice(0, 1, task.question)
    if (answer.length > ELIMINATION_LINE_LIMITS.max) {
      setFeedback({ correct: false, feedback: "input is too long" })
      return
    }
    await submitTaskAnswer({
      event,
      taskId,
      submittedAnswer: answer,
      addAnswer,
      setFeedback,
      moduleName: task.moduleName,
    })
  }

  return (
    <>
      <div className="border border-dotted border-black rounded text-xl w-fit">
        Task: {task?.metadata?.end_goal}
      </div>
      <div className="relative w-fit">
        <div className="grid border border-black">
          {propositions.lines.map((prop, index) => (
            <React.Fragment key={index}>
              <Line
                initValue={prop}
                index={index}
                change={propositions.change}
                fieldType={useField}
                disableFirstLine={true}
              />
            </React.Fragment>
          ))}
        </div>
        {user && (
          <div className="text-black absolute -right-14 border-black border-2 rounded bg-green-700 hover:bg-green-400">
            <button onClick={submitAnswer}>Submit</button>
          </div>
        )}
        <button
          onClick={resetPropositions}
          className="absolute right-0  bg-red-500 text-black border-black border-2 rounded hover:bg-red-700"
        >
          Reset
        </button>
        <div className="flex">
          {propositions.lines.length < ELIMINATION_LINE_LIMITS.max && (
            <button
              onClick={() => propositions.addRemove(true)}
              className="bg-green-600 text-black border-black border-2 rounded hover:bg-green-400 px-1"
            >
              +
            </button>
          )}
          {propositions.lines.length > ELIMINATION_LINE_LIMITS.min && (
            <button
              onClick={() => propositions.addRemove(false)}
              className="bg-red-500 text-black border-black border-2 rounded hover:bg-red-400 px-2"
            >
              -
            </button>
          )}
        </div>
      </div>
      <div>
        <AnswerFeedback feedback={feedback} />
      </div>
    </>
  )
}

export default EliminationTask
