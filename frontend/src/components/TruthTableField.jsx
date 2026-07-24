import { useState, useEffect, useRef, forwardRef } from "react"
import { useField } from "../hooks"
// This file is mostly AI generated
const DIRECTIONS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
}

const TruthTableField = forwardRef(
  ({ submitFunc, x, y, value, isHead, onNavigate }, ref) => {
    const textInput = useField("text", value)

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
            {...textInput.inputProps}
            ref={ref}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (textInput.value) {
                setLocked(true)
                submitFunc(textInput.value, x, y)
              }
            }}
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

export default TruthTableField
