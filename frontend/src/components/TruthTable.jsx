import { useState } from "react"
import { UseField } from "../hooks"
const TruthTableField = ({ submitFunc, x, y, value, isHead }) => {
  const { reset: reset, ...textInput } = UseField("text")
  const [locked, setLocked] = useState(false)
  const bgClass = isHead ? "bg-amber-100" : "bg-gray-300"

  if (!locked) {
    return (
      <form
        onSubmit={() => {
          event.preventDefault()
          if (textInput.value) {
            setLocked(true)
            submitFunc(textInput.value, x, y)
          }
        }}
      >
        <input
          {...textInput}
          className={`${bgClass} text-black text-2xl border-black border-2`}
        />
      </form>
    )
  }
  return (
    <button
      onClick={() => setLocked(false)}
      className={`${bgClass} text-black text-2xl px-3 border-black border-x-2`}
    >
      {value}
    </button>
  )
}

const TruthTable = () => {
  const [inputFields, setInputFields] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ])
  const submitValue = (text, x, y) => {
    console.log(x, "/", y)
    setInputFields((prev) =>
      prev.map((col, colIndex) =>
        colIndex === x
          ? col.map((cell, rowIndex) => (rowIndex === y ? text : cell))
          : col,
      ),
    )
    console.log(inputFields)
  }

  const addColumn = () => {
    setInputFields((prev) => [...prev, Array(prev[0]?.length || 1).fill("")])
  }

  const addRow = () => {
    setInputFields((prev) => prev.map((row) => [...row, "", ""]))
  }
  const numRows = inputFields[0]?.length || 1
  const numCols = inputFields.length

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
            />
          )),
        )}
      </div>
    </div>
  )
}

export default TruthTable
