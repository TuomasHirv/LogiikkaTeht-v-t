import { useState } from "react"
import Node from "./Node"

const SubFormulaTask = ({ task }) => {
  const [root, setRoot] = useState({
    text: task.question,
    locked: true,
    children: null,
  })
  return (
    <div className="text-black text-center w-fit mx-auto">
      <Node node={root} onChange={setRoot} />
    </div>
  )
}

export default SubFormulaTask
