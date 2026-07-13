import React from "react"
import { useEffect, useState } from "react"
import { UseResolutionField } from "../hooks"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import useUserStore, { useUserActions } from "../store"
import { useLineList } from "../hooks/lineList"
import { RESOLUTION_LINE_LIMITS } from "../constants"

import {
  buildSavedAnswerFeedback,
  parseSavedEliminationAnswer,
} from "../hooks/savedAnswer"
import AnswerFeedback from "./AnswerFeedback"

const Line = ({ initValue, index, change }) => {
  const lineInput = UseResolutionField("text", initValue, index)

  return (
    <React.Fragment>
      <div className="flex bg-white text-black">
        <span className="bg-gray-500 pr-1">{index}:</span>

        <input
          {...lineInput.inputProps}
          onBlur={() => {
            lineInput.checkSyntax(lineInput.inputProps.value, index)
            if (lineInput.value) {
              change(lineInput.value, index)
            }
          }}
        />
        {lineInput.syntaxError && (
          <div className="group relative">
            <span className="cursor-pointer text-red-700 bg-gray-700 select-none px-1">
              {" "}
              !{" "}
            </span>
            <p
              className="
              absolute left-0 top-full mt-1 z-10
              max-w-xs whitespace-normal
              bg-gray-700 text-white text-sm rounded px-2 py-1
              opacity-0 pointer-events-none
              group-hover:opacity-100
              transition-opacity duration-150
            "
            >
              {" "}
              {lineInput.syntaxError}{" "}
            </p>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

const ResolutionTask = ({ task }) => {
  const { addAnswer } = useUserActions()
  const [feedback, setFeedback] = useState(null)
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  const start = task?.question || ""
  const { ...clauses } = useLineList([""], RESOLUTION_LINE_LIMITS)

  useEffect(() => {
    const savedFeedback = buildSavedAnswerFeedback(savedAnswer)
    const parsedSavedAnswer = parseSavedEliminationAnswer(
      savedAnswer?.submitted_answer,
    )

    if (!savedFeedback || !parsedSavedAnswer) {
      return
    }

    setFeedback(savedFeedback)
    clauses.setLines(parsedSavedAnswer)
  }, [task.id, savedAnswer])

  const submitAnswer = async (event) => {
    if (!task.id) {
      return
    }
    const answer = clauses.lines.filter((cl) => cl.trim() !== "")
    if (answer.length > RESOLUTION_LINE_LIMITS.max) {
      setFeedback({ correct: false, text: "input is too long" })
      return
    }
    if (answer.length < RESOLUTION_LINE_LIMITS.min) {
      setFeedback({ correct: false, text: "input is too short" })
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
      <div className=" rounded text-xl w-fit">{task?.question}</div>
      <div className="bg-gray-500 rounded text-black w-fit">
        Either create an empty clause or create all meaningful clauses from the
        given proposition.
      </div>
      <div className="relative w-fit">
        <div className="grid border border-black">
          {clauses.lines.map((cl, index) => (
            <React.Fragment key={index}>
              <Line initValue={cl} index={index} change={clauses.change} />
            </React.Fragment>
          ))}
        </div>

        <div className="flex">
          {clauses.lines.length < RESOLUTION_LINE_LIMITS.max && (
            <button
              onClick={() => clauses.addRemove(true)}
              className="bg-green-600 text-black border-black border-2 rounded hover:bg-green-400 px-1"
            >
              +
            </button>
          )}
          {clauses.lines.length > RESOLUTION_LINE_LIMITS.min && (
            <button
              onClick={() => clauses.addRemove(false)}
              className="bg-red-500 text-black border-black border-2 rounded hover:bg-red-400 px-2"
            >
              -
            </button>
          )}
          <div className="text-black ml-auto border-black border-2 rounded bg-green-700 hover:bg-green-400">
            <button onClick={submitAnswer}>Submit</button>
          </div>
        </div>
      </div>
      <div>
        <AnswerFeedback feedback={feedback} />
      </div>
    </div>
  )
}

export default ResolutionTask
