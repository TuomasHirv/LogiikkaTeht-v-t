import { useState } from "react"
import SemanticTreeNode from "./SemanticTreeNode"
const SemanticTreeTask = () => {
  const createInitialRoot = () => ({
    text: "p0 ∨ p1",
    locked: true,
    children: null,
  })
  const [root, setRoot] = useState({
    text: "p0 ∨ p1",
    locked: true,
    children: null,
  })

  const resetRoot = () => {
    setRoot(createInitialRoot())
    setFeedback(null)
  }

  return (
    <>
      <div className="text-black text-center w-fit mx-auto">
        <SemanticTreeNode node={root} onChange={setRoot} />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="border-black border-2 text-black rounded bg-red-200 hover:bg-red-700 ml-3.5"
          onClick={resetRoot}
        >
          Reset
        </button>
      </div>
    </>
  )
}

export default SemanticTreeTask
