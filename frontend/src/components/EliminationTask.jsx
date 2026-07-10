import React from "react"
import { useEffect, useState } from "react"
import { UseField } from "../hooks"
import useUserStore, { useUserActions } from "../store"
import AnswerFeedback from "./AnswerFeedback"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import {
  buildSavedAnswerFeedback,
  parseSavedEliminationAnswer,
} from "../hooks/savedAnswer"

const Line = ({ initValue, index, change }) => {
  const { reset: _reset, ...lineInput } = UseField("text", initValue)
  if (index === 0) {
    return <div className="flex bg-amber-100 text-black"> {initValue} </div>
  }
  return (
    <div className="flex bg-white text-black">
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

const EliminationTask = ({ task }) => {
  const { addAnswer } = useUserActions()
  const start = task?.question || ""
  const taskId = task?.id
  const savedAnswer = useUserStore((state) => state.answers[taskId])
  const [feedback, setFeedback] = useState(null)
  const createInitialPropositions = (initial) => [initial, ""]
  const [propositions, setPropositions] = useState(() =>
    createInitialPropositions(start),
  )

  useEffect(() => {
    setPropositions(createInitialPropositions(start))
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
    setPropositions(parsedSavedAnswer)
  }, [taskId, savedAnswer])

  const resetPropositions = () => {
    setPropositions(createInitialPropositions(start))
    setFeedback(null)
  }

  const submitAnswer = async (event) => {
    if (!taskId) {
      return
    }

    const answer = propositions.filter((prop) => prop.trim() !== "")
    answer.splice(0, 1, task.question)
    if (answer.length > 6) {
      setFeedback({ corect: false, text: "input is too long" })
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

  const changePropositions = (text, i) => {
    setPropositions((previous) => {
      if (previous[i] === text) {
        return previous
      }
      return previous.map((original, index) => (index === i ? text : original))
    })
  }

  const addRemoveLine = (add) => {
    if (add) {
      setPropositions((previous) => [...previous, ""])
    } else {
      setPropositions((previous) =>
        previous.length > 1 ? previous.slice(0, -1) : previous,
      )
    }
  }

  return (
    <>
      <div className="border border-dotted border-black rounded text-xl w-fit">
        Task: {task?.metadata?.end_goal}
      </div>
      <div className="relative w-fit">
        <div className="grid border border-black">
          {propositions.map((prop, index) => (
            <React.Fragment key={index}>
              <Line
                initValue={prop}
                index={index}
                change={changePropositions}
              />
            </React.Fragment>
          ))}
        </div>
        <div className="text-black absolute -right-14 border-black border-2 rounded bg-green-700 hover:bg-green-400">
          <button onClick={submitAnswer}>Submit</button>
        </div>
        <button
          onClick={resetPropositions}
          className="absolute right-0  bg-red-500 text-black border-black border-2 rounded hover:bg-red-700"
        >
          Reset
        </button>
        <div className="flex">
          {propositions.length < 6 && (
            <button
              onClick={() => addRemoveLine(true)}
              className="bg-green-600 text-black border-black border-2 rounded hover:bg-green-400 px-1"
            >
              +
            </button>
          )}
          {propositions.length > 1 && (
            <button
              onClick={() => addRemoveLine(false)}
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
