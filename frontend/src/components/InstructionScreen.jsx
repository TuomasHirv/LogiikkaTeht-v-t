import React from "react"
import { partInstructions } from "../content/partInstructions"
import { useParams, useNavigate, Link } from "react-router-dom"
const InstructionScreen = () => {
  const { id, moduleName } = useParams()
  const content = partInstructions[id]
  const taskLink = `/tasks/${moduleName}`
  if (!content) {
    return <p> NOT DONE YET</p>
  }

  return (
    <div className="task-screen">
      <h2 style={{ backgroundColor: "#e2e8f0", maxWidth: "600px" }}>
        {content.title}
      </h2>
      <h3 style={{ backgroundColor: "#e2e8f0", maxWidth: "600px" }}>
        {content.introduction}
      </h3>
      <div>
        <p style={{ backgroundColor: "#e2e8f0" }}>
          Definitions:
          {content.definitions.map((def, index) => (
            <li key={index}>{def}</li>
          ))}
        </p>
      </div>
      <div>
        {content.paragraphs.map((par, index) => (
          <div
            key={index}
            className="flex flex-row sm:items-center p-4 rounded-lg gap-0"
            style={{ backgroundColor: "#e2e8f0" }}
          >
            <p className="text-gray-700 max-w-xl text-sm md:text-base leading-relaxed m-0">
              {par}
            </p>
            <code
              className="font-mono font-bold text-lg md:text-2xl px-6 py-4 rounded-lg shadow-sm border border-blue-200 m-0"
              style={{ backgroundColor: "#cbd5e1", color: "#1e293b" }}
            >
              {content.examples[index]}
            </code>
          </div>
        ))}
      </div>
      <Link to={taskLink} className="buttonStyle mt-6 inline-block">
        {" "}
        Tasks{" "}
      </Link>
    </div>
  )
}

export default InstructionScreen
