import { useState } from "react"
import { UseField } from "../hooks"
import TruthTableField from "./TruthTableField"

const Line = ({ initValue, index, change }) => {
  const { reset: reset, ...lineInput } = UseField("text", initValue)

  return (
    <input
      {...lineInput}
      onBlur={() => {
        if (lineInput.value) {
          change(lineInput.value, index)
        }
      }}
    />
  )
}

const EliminationTask = (task) => {
  const start = "¬(P ∨ Q)"
  const [propositions, setPropositions] = useState([start, ""])

  const resetPropositions = () => {
    setPropositions([start, ""])
  }
  const submitAnswer = () => {
    const answer = propositions.filter((prop) => prop.trim() !== "")
    console.log(answer)
  }

  const changePropositions = (text, i) => {
    setPropositions(
      propositions.map((original, index) => (index === i ? text : original)),
    )
  }
  const addRemoveLine = (add) => {
    if (add) {
      setPropositions([...propositions, ""])
    } else {
      if (propositions.length > 1) setPropositions(propositions.slice(0, -1))
    }
  }
  return (
    <div className="relative w-fit">
      <div className="grid border border-black">
        {propositions.map((prop, index) => (
          <Line
            key={index}
            initValue={prop}
            index={index}
            change={changePropositions}
          />
        ))}
      </div>
      <div className="text-black absolute -right-14 border-black border-2 rounded hover:bg-green-700">
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
  )
}

export default EliminationTask
