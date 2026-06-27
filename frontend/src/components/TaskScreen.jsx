import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { partInstructions } from "../content/partInstructions"
import TaskItem from "./TaskItem"
import SubFormulaTask from "./SubFormulaTask"

const TaskScreen = () => {
  const { moduleName, id, section } = useParams()
  const nextSection = Number(section) + 1
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [continued, setContinued] = useState(false)
  if (partInstructions[id][section] && !continued) {
    setContinued(true)
  }
  const instructionLink = `http://localhost:5173/part/${id}/section/${nextSection}`
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost:5000/api/tasks/${moduleName}`,
        )
        if (!response.ok) {
          throw new Error("Couldn't fetch tasks")
        }
        const data = await response.json()
        setTasks(data)
      } catch (err) {
        console.log("Failed to fetch tasks:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [moduleName])
  if (loading) {
    return <h1>Module: {moduleName} </h1>
  }
  if (moduleName === "subformula") {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
        <h2 className="bg-white rounded text-black w-fit text-4xl">
          {moduleName}
        </h2>
        {tasks.map((task, index) => (
          <div
            key={task.id || index}
            className="bg-gray-500 p-3 border-black border-2"
          >
            <SubFormulaTask key={task.id} task={task} />
          </div>
        ))}{" "}
        {continued && (
          <Link
            to={instructionLink}
            className="bg-green-950 hover:bg-green-700 rounded shadow buttonStyle mt-6 inline-block text-2xl"
          >
            {" "}
            Next section{" "}
          </Link>
        )}
      </div>
    )
  }
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
      <h2 className="bg-white rounded text-black w-fit text-4xl">
        {moduleName}
      </h2>
      {tasks.map((task, index) => (
        <div
          key={task.id || index}
          className="bg-gray-500 p-3 border-black border-2"
        >
          <TaskItem key={task.id} task={task} />
        </div>
      ))}{" "}
      {continued && (
        <Link
          to={instructionLink}
          className="bg-green-950 hover:bg-green-700 rounded shadow buttonStyle mt-6 inline-block text-2xl"
        >
          {" "}
          Next section{" "}
        </Link>
      )}
    </div>
  )
}

export default TaskScreen
