import React from "react"
import { useEffect, useState } from "react"
import { UseField } from "../hooks"
import { useLineList } from "../hooks/lineList"
import useUserStore, { useUserActions } from "../store"
import AnswerFeedback from "./AnswerFeedback"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import {
  buildSavedAnswerFeedback,
  parseSavedEliminationAnswer,
} from "../hooks/savedAnswer"
import { SHORTHAND_CHAIN_LINE_LIMITS } from "../constants"

const Line = ({ initValue, index, change }) => {
  const field = UseField("text", initValue)
  if (index === 0) {
    return (
      <div className="flex bg-amber-100 text-black px-1"> {initValue} </div>
    )
  }
  return (
    <div className="flex bg-white text-black">
      <input
        {...field.inputProps}
        onBlur={() => {
          if (field.inputProps.value) {
            change(field.inputProps.value, index)
          }
        }}
      />
    </div>
  )
}

const ShorthandReference = ({ shorthands }) => (
  <div className="bg-gray-200 border-2 border-black rounded px-3 py-2 w-fit">
    <p className="text-black font-bold mb-1">Shorthand definitions:</p>
    <div className="flex flex-col">
      {Object.entries(shorthands).map(([letter, definition]) => (
        <span key={letter} className="text-black font-mono">
          {letter} = {definition}
        </span>
      ))}
    </div>
  </div>
)

const ShorthandExpansionTask = ({ task }) => {
  const { addAnswer } = useUserActions()
  const taskId = task?.id
  const shorthands = task?.metadata?.shorthands || {}
  const targetDefinition = task?.question
  const start = targetDefinition ? `${targetDefinition}` : ""
  const endGoal = task?.metadata?.end_goal

  const savedAnswer = useUserStore((state) => state.answers[taskId])
  const [feedback, setFeedback] = useState(null)
  const lines = useLineList([start, ""], SHORTHAND_CHAIN_LINE_LIMITS)

  useEffect(() => {
    lines.setLines([start, ""])
    setFeedback(null)
  }, [start, taskId])

  useEffect(() => {
    const savedFeedback = buildSavedAnswerFeedback(savedAnswer)
    const parsedSavedAnswer = parseSavedEliminationAnswer(
      savedAnswer?.submitted_answer,
    )

    if (!savedFeedback || !parsedSavedAnswer) {
      return
    }

    setFeedback(savedFeedback)
    lines.setLines(parsedSavedAnswer)
  }, [taskId, savedAnswer])

  const resetLines = () => {
    lines.setLines([start, ""])
    setFeedback(null)
  }

  const submitAnswer = async (event) => {
    if (!taskId) {
      return
    }

    const answer = lines.lines.filter((line) => line.trim() !== "")
    answer.splice(0, 1, start)

    if (answer.length > SHORTHAND_CHAIN_LINE_LIMITS.max) {
      setFeedback({ correct: false, text: "Too many expansion steps" })
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
      <ShorthandReference shorthands={shorthands} />
      <p className="border border-dotted border-black rounded text-black w-fit mb-2 px-2 py-1">
        {endGoal}
      </p>
      <div className="relative w-fit mt-4">
        <div className="grid border border-black">
          {lines.lines.map((line, index) => (
            <React.Fragment key={index}>
              <Line initValue={line} index={index} change={lines.change} />
            </React.Fragment>
          ))}
        </div>
        <div className="text-black absolute -right-14 border-black border-2 rounded bg-green-700 hover:bg-green-400">
          <button onClick={submitAnswer}>Submit</button>
        </div>
        <button
          onClick={resetLines}
          className="absolute right-0 bg-red-500 text-black border-black border-2 rounded hover:bg-red-700"
        >
          Reset
        </button>
        <div className="flex">
          {lines.lines.length < SHORTHAND_CHAIN_LINE_LIMITS.max && (
            <button
              onClick={() => lines.addRemove(true)}
              className="bg-green-600 text-black border-black border-2 rounded hover:bg-green-400 px-1"
            >
              +
            </button>
          )}
          {lines.lines.length > SHORTHAND_CHAIN_LINE_LIMITS.min && (
            <button
              onClick={() => lines.addRemove(false)}
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

export default ShorthandExpansionTask
