import { useState } from "react"
import Node from "./Node"

const SubFormulaTask = (task) => {
  const [root, setRoot] = useState({
    text: "O ∧ L",
    locked: true,
    children: null,
  })
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Node node={root} onChange={setRoot} />
    </div>
  )
}

export default SubFormulaTask
