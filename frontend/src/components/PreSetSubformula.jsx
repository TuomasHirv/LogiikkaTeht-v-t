import { useState } from "react"
import Node from "./Node"

const PreSetSubformula = ({ text }) => {
  const createInitialRoot = () => ({
    text,
    locked: true,
    children: null,
  })

  const [root, setRoot] = useState(createInitialRoot())

  const resetRoot = () => {
    setRoot(createInitialRoot())
  }

  return (
    <>
      <div className="text-black text-center w-fit mx-auto">
        <Node node={root} onChange={setRoot} />
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

export default PreSetSubformula
