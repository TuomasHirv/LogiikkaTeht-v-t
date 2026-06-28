import React from "react"
import { partInstructions } from "../content/partInstructions"
import { useParams, Link } from "react-router-dom"
const InstructionScreen = () => {
  const { id, section } = useParams()
  const content = partInstructions[id][section]
  if (!content) {
    return <p> NOT DONE YET</p>
  }
  const moduleName = content.moduleName
  const taskLink = `http://localhost:5173/part/${id}/section/${section}/tasks/${moduleName}`
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
      <div className="text-black text-xl py-2 text-center">
        <h1 style={{ backgroundColor: "#e2e8f0" }}>{content.title}</h1>
      </div>
      <div className="text-black">
        <h3 style={{ backgroundColor: "#e2e8f0", maxWidth: "600px" }}>
          {content.introduction}
        </h3>
      </div>
      <div className="w-fit bg-white border-2 border-black rounded px-3">
        <p className="text-black">
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
            className="flex flex-col sm:flex-row sm:items-start p-4 rounded-lg gap-2 text-black bg-white whitespace-pre-wrap"
            style={{ backgroundColor: "#e2e8f0" }}
          >
            <p className="text-black max-w-xl text-sm md:text-base leading-relaxed m-0">
              {par}
            </p>
            <pre className="bg-white border-2 border-black rounded px-2 py-1 ml-0 sm:ml-2 overflow-x-auto whitespace-pre-wrap font-mono">
              {content.examples[index]}
            </pre>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "1.5rem",
        }}
        className="text-white"
      >
        <Link
          to={taskLink}
          className="bg-green-950 hover:bg-green-700 rounded shadow buttonStyle mt-6 inline-block text-2xl"
        >
          {" "}
          Tasks{" "}
        </Link>
      </div>
    </div>
  )
}

export default InstructionScreen
