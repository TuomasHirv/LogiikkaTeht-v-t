import React from "react"
import { useEffect, useState } from "react"
import { UseField } from "../hooks"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import useUserStore, { useUserActions } from "../store"
import {
  buildSavedAnswerFeedback,
  parseSavedEliminationAnswer,
} from "../hooks/savedAnswer"
import AnswerFeedback from "./AnswerFeedback"

const Line = ({ initValue, index, change }) => {
  const { reset: _reset, ...lineInput } = UseField("text", initValue)
  return (
    <div className="flex bg-white text-black">
      <span className="bg-gray-500 pr-1">{index}:</span>

      <input
        {...lineInput}
        onBlur={() => {
          if (lineInput.value) {
            change(lineInput.value, index)
          }
        }}
      />
    </div>
  )
}

const ResolutionTask = ({ task }) => {
  const { addAnswer } = useUserActions()
  const [feedback, setFeedback] = useState(null)
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  const start = task?.question || ""
  const [clauses, setClauses] = useState([""])

  useEffect(() => {
    const savedFeedback = buildSavedAnswerFeedback(savedAnswer)
    const parsedSavedAnswer = parseSavedEliminationAnswer(
      savedAnswer?.submitted_answer,
    )

    if (!savedFeedback || !parsedSavedAnswer) {
      return
    }

    setFeedback(savedFeedback)
    setClauses(parsedSavedAnswer)
  }, [task.id, savedAnswer])

  const changeClauses = (text, i) => {
    setClauses((previous) => {
      if (previous[i] === text) {
        return previous
      }
      return previous.map((original, index) => (index === i ? text : original))
    })
  }

  const addRemoveLine = (add) => {
    if (add) {
      setClauses((previous) => [...previous, ""])
    } else {
      setClauses((previous) =>
        previous.length > 1 ? previous.slice(0, -1) : previous,
      )
    }
  }
  const submitAnswer = async (event) => {
    if (!task.id) {
      return
    }
    const answer = clauses.filter((cl) => cl.trim() !== "")
    if (answer.length > 10) {
      setFeedback({ corect: false, text: "input is too long" })
      return
    }
    if (answer.length < 1) {
      setFeedback({ corect: false, text: "input is too short" })
      return
    }
    await submitTaskAnswer({
      event,
      taskId: task.id,
      submittedAnswer: answer,
      addAnswer,
      setFeedback,
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
          {clauses.map((cl, index) => (
            <React.Fragment key={index}>
              <Line initValue={cl} index={index} change={changeClauses} />
            </React.Fragment>
          ))}
        </div>

        <div className="flex">
          {clauses.length < 10 && (
            <button
              onClick={() => addRemoveLine(true)}
              className="bg-green-600 text-black border-black border-2 rounded hover:bg-green-400 px-1"
            >
              +
            </button>
          )}
          {clauses.length > 1 && (
            <button
              onClick={() => addRemoveLine(false)}
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
