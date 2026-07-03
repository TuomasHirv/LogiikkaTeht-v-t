import { useState, useRef, forwardRef } from "react"
import { UseField } from "../hooks"
{
  /* Mapping of input fields and using arrows to navigate the array are AI coded  */
}
const DIRECTIONS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
}

const TruthTableField = forwardRef(
  ({ submitFunc, x, y, value, isHead, onNavigate }, ref) => {
    const { reset: reset, ...textInput } = UseField("text")
    const [locked, setLocked] = useState(false)
    const bgClass = isHead ? "bg-amber-100" : "bg-gray-300"

    const handleKeyDown = (event) => {
      const delta = DIRECTIONS[event.key]
      if (!delta) return
      event.preventDefault()
      const [dx, dy] = delta
      onNavigate(x + dx, y + dy)
    }

    if (!locked) {
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (textInput.value) {
              setLocked(true)
              submitFunc(textInput.value, x, y)
            }
          }}
        >
          <input
            {...textInput}
            ref={ref}
            onKeyDown={handleKeyDown}
            className={`${bgClass} text-black text-xl border-black border-2 w-25 h-7`}
          />
        </form>
      )
    }
    return (
      <button
        ref={ref}
        onKeyDown={handleKeyDown}
        onClick={() => setLocked(false)}
        className={`${bgClass} text-black text-xl px-3 border-black border-x-2`}
      >
        {value}
      </button>
    )
  },
)

const TruthTable = () => {
  const [inputFields, setInputFields] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ])

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
    setInputFields([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ])
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
              ref={registerRef(colIndex, rowIndex)}
              onNavigate={focusField}
            />
          )),
        )}
      </div>
      <div className="text-black absolute -right-14 border-black border-2 rounded hover:bg-green-700">
        <button onClick={() => console.log(inputFields)}>Submit</button>
      </div>
      <button
        onClick={resetFields}
        className="absolute right-0  bg-red-500 text-black border-black border-2 rounded hover:bg-red-700"
      >
        Reset
      </button>
    </div>
  )
}

export default TruthTable
