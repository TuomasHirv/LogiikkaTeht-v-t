import { useState, useEffect, useRef } from "react"
import useUserStore, { useUserActions } from "../store"
import AnswerFeedback from "./AnswerFeedback"
import TruthTableField from "./TruthTableField"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import { useLastSavedAnswer } from "../hooks/useTaskHooks"
import { buildSavedAnswerFeedback } from "../hooks/savedAnswer"

{
  /* Mapping of input fields and using arrows to navigate the array are AI coded  */
}

const TruthTable = ({ task, start, showSubmitButton = true }) => {
  const { addAnswer } = useUserActions()
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  const [feedback, setFeedback] = useState(null)

  const [inputFields, setInputFields] = useState(() =>
    start.map((str) => [str, "", "", "", ""]),
  )
  const parseAnswer = (x) => x
  useLastSavedAnswer({
    task,
    savedAnswer,
    setFeedback,
    applyAnswer: setInputFields,
    parseAnswer,
    enabled: false,
  })

  useEffect(() => {
    function effectFunc(showSubmitButton) {
      if (showSubmitButton) {
        const savedFeedback = buildSavedAnswerFeedback(savedAnswer)
        if (!savedFeedback) {
          return
        }

        setFeedback(savedFeedback)
        setInputFields(savedAnswer.submitted_answer)
      }
    }
    effectFunc(showSubmitButton)
  }, [task.id, savedAnswer, showSubmitButton])

  const submitAnswer = async (event) => {
    if (showSubmitButton) {
      await submitTaskAnswer({
        event,
        taskId: task.id,
        submittedAnswer: inputFields,
        addAnswer,
        setFeedback,
        moduleName: task.moduleName,
      })
    }
  }

  const fieldRefs = useRef({})

  const registerRef = (x, y) => (el) => {
    const key = `${x}-${y}`
    if (el) {
      fieldRefs.current[key] = el
    } else {
      delete fieldRefs.current[key]
    }
  }

  const focusField = (x, y) => {
    const el = fieldRefs.current[`${x}-${y}`]
    if (el) el.focus()
  }

  const resetFields = () => {
    setInputFields(() => start.map((str) => [str, "", "", "", ""]))
  }

  const submitValue = (text, x, y) => {
    setInputFields((prev) =>
      prev.map((col, colIndex) =>
        colIndex === x
          ? col.map((cell, rowIndex) => (rowIndex === y ? text : cell))
          : col,
      ),
    )
  }

  const addColumn = () => {
    setInputFields((prev) => [...prev, Array(prev[0]?.length || 1).fill("")])
  }

  const addRow = () => {
    setInputFields((prev) => prev.map((row) => [...row, "", ""]))
  }
  const numRows = inputFields[0]?.length || 1

  return (
    <div className="relative w-fit">
      <button
        onClick={addColumn}
        className="absolute -top -right-9 bg-blue-500 text-white text-xl font-medium px-3 py-1 shadow-md hover:bg-blue-600"
      >
        +
      </button>
      <button
        onClick={addRow}
        className="absolute -bottom-9 -left bg-green-500 text-white text-xl font-medium px-3 py-1 shadow-md hover:bg-green-600"
      >
        +
      </button>

      <div
        className="grid border border-black"
        style={{
          gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
          gridAutoFlow: "column",
        }}
      >
        {inputFields.map((column, colIndex) =>
          column.map((item, rowIndex) => (
            <TruthTableField
              submitFunc={submitValue}
              x={colIndex}
              y={rowIndex}
              value={item}
              isHead={rowIndex === 0}
              key={`${colIndex}-${rowIndex}`}
              ref={registerRef(colIndex, rowIndex)}
              onNavigate={focusField}
            />
          )),
        )}
      </div>
      {showSubmitButton && (
        <div className="text-black absolute -right-14 border-black border-2 rounded hover:bg-green-700">
          <button onClick={submitAnswer}>Submit</button>
        </div>
      )}
      <button
        onClick={resetFields}
        className="absolute right-0  bg-red-500 text-black border-black border-2 rounded hover:bg-red-700"
      >
        Reset
      </button>
      <AnswerFeedback feedback={feedback} />
    </div>
  )
}

export default TruthTable
